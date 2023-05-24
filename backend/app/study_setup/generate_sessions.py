import json
import random
from pathlib import Path
from typing import List

from beanie import PydanticObjectId
from beanie.odm.operators.update.general import Set

from models.config import ExperimentSettings
from models.network import Network
from models.session import Session
from models.subject import Subject
from models.trial import Trial, Solution, WrittenStrategy
from utils.utils import estimate_solution_score, estimate_average_player_score

# load all networks
network_data = json.load(open(Path('data') / 'networks.json'))

# randomize the order of the networks
random.shuffle(network_data)

# load all ai solutions
solutions = json.load(open(Path('data') / 'solutions_loss.json'))
solutions_myopic = json.load(open(Path('data') / 'solutions_myopic.json'))


async def generate_experiment_sessions():
    # find an active configuration
    config = await ExperimentSettings.find_one(
        ExperimentSettings.active == True)
    if config is None:
        # if there are no configs in the database
        # create a new config
        config = ExperimentSettings()
        config.active = True
        await config.save()

    if config.rewrite_previous_data:
        await Session.find(
            Session.experiment_type == config.experiment_type).delete()
        await Subject.find(
            Session.experiment_type == config.experiment_type).delete()

    # find all sessions for this experiment
    sessions = await Session.find(
        Session.experiment_type == config.experiment_type
    ).first_or_none()

    if sessions is None:
        # if the database is empty, generate sessions
        for replication in range(config.n_session_tree_replications):
            await generate_sessions(
                config_id=config.id,
                n_generations=config.n_generations,
                n_sessions_per_generation=config.n_sessions_per_generation,
                n_advise_per_session=config.n_advise_per_session,
                experiment_type=config.experiment_type,
                experiment_num=replication,
                n_ai_players=config.n_ai_players,
                n_sessions_first_generation=config.n_sessions_first_generation,
                n_social_learning_trials=config.n_social_learning_trials,
                n_individual_trials=config.n_individual_trials,
                n_demonstration_trials=config.n_demonstration_trials,
                redirect_url=config.redirect_url,
            )

    # update all child sessions to have the correct number of finished parents
    # especially relevant for the AI player parents
    await Session.find(
        Session.experiment_type == config.experiment_type,
        Session.unfinished_parents == 0,
        Session.finished == False,
        Session.replaced == False,
        Session.expired == False,
        Session.ai_player == False
    ).update(Set({Session.available: True}))


async def generate_sessions(config_id: PydanticObjectId,
                            n_generations: int = 2,
                            n_sessions_per_generation: int = 10,
                            n_advise_per_session: int = 5,
                            experiment_type: str = 'reward-network-iii',
                            experiment_num: int = 0,
                            n_ai_players: int = 3,
                            n_sessions_first_generation: int = 13,
                            n_social_learning_trials: int = 2,
                            n_individual_trials: int = 3,
                            n_demonstration_trials: int = 2,
                            redirect_url: str = 'https://www.prolific.co/',
                            seed: int = 4242):
    """
    Generate one experiment.
    """
    # Set random seed
    random.seed(seed)

    # create sessions for the first generation
    # the last `num_ai_players` sessions are for AI players
    sessions_n_0 = await create_generation(
        config_id=config_id,
        generation=0,
        n_sessions_per_generation=n_sessions_first_generation,
        experiment_type=experiment_type,
        experiment_num=experiment_num,
        n_ai_players=n_ai_players,
        n_social_learning_trials=n_social_learning_trials,
        n_individual_trials=n_individual_trials,
        n_demonstration_trials=n_demonstration_trials,
        redirect_url=redirect_url
    )

    sessions_n_0_with_ai = sessions_n_0[n_ai_players:]
    sessions_n_0_without_ai = sessions_n_0[
                              :n_sessions_first_generation - n_ai_players]

    # check that n_sessions_per_generation is even
    # this is to ensure that there are an equal number of sessions with and
    # without AI player advisors
    assert n_sessions_per_generation % 2 == 0, \
        "n_sessions_per_generation must be even"

    # iterate over generations
    for generation in range(n_generations - 1):
        # create sessions for the next generation
        sessions_n_1 = await create_generation(
            config_id=config_id,
            generation=generation + 1,
            n_sessions_per_generation=n_sessions_per_generation,
            experiment_type=experiment_type,
            experiment_num=experiment_num,
            n_ai_players=0,  # no AI players in the next generations
            n_social_learning_trials=n_social_learning_trials,
            n_individual_trials=n_individual_trials,
            n_demonstration_trials=n_demonstration_trials,
            redirect_url=redirect_url
        )

        # split the sessions into two groups if the first generation is mixed
        if (n_ai_players > 0) and (n_ai_players < n_sessions_first_generation):
            # split sessions into two streams (with and without AI player
            # advisors or offsprings of AI player advisors)
            sessions_n_1_with_ai = sessions_n_1[n_sessions_per_generation // 2:]
            await create_connections(sessions_n_0_with_ai,
                                     sessions_n_1_with_ai,
                                     n_advise_per_session)

            sessions_n_1_without_ai = sessions_n_1[
                                      :n_sessions_per_generation // 2]
            await create_connections(sessions_n_0_without_ai,
                                     sessions_n_1_without_ai,
                                     n_advise_per_session)

            # now sessions_n_0 is the previous generation
            # NOTE: the very first generation is different from the rest
            sessions_n_0_with_ai = sessions_n_1_with_ai
            sessions_n_0_without_ai = sessions_n_1_without_ai
        else:
            # if the first generation is not mixed, no need to split
            await create_connections(sessions_n_0, sessions_n_1,
                                     n_advise_per_session)
            sessions_n_0 = sessions_n_1


async def create_connections(gen0, gen1, n_advise_per_session):
    # randomly link sessions of the previous generation to the sessions of
    # the next generation
    for s_n_1 in gen1:
        # get n numbers between 0 and len(gen0) - 1 without replacement
        advise_src = random.sample(range(len(gen0)), n_advise_per_session)
        advise_ids = []
        for i in advise_src:
            advise_ids.append(gen0[i].id)
            # record children of the session
            gen0[i].child_ids.append(s_n_1.id)
            await gen0[i].save()

        s_n_1.advise_ids = advise_ids

        # remove AI from the count of unfinished parents
        n_ai_advisors = sum([1 for i in advise_src if gen0[i].ai_player])
        s_n_1.unfinished_parents = len(advise_ids) - n_ai_advisors
        await s_n_1.save()


async def create_generation(config_id: PydanticObjectId,
                            generation: int,
                            n_sessions_per_generation: int,
                            experiment_type: str,
                            experiment_num: int,
                            n_ai_players: int,
                            n_social_learning_trials: int,
                            n_individual_trials: int,
                            n_demonstration_trials: int,
                            redirect_url: str = 'https://www.prolific.co/'
                            ) -> List[Session]:
    sessions = []
    for session_idx in range(n_sessions_per_generation - n_ai_players):
        session = create_trials(
            config_id=config_id,
            experiment_num=experiment_num,
            experiment_type=experiment_type,
            generation=generation,
            session_idx=session_idx,
            n_social_learning_trials=n_social_learning_trials,
            n_individual_trials=n_individual_trials,
            n_demonstration_trials=n_demonstration_trials,
            redirect_url=redirect_url
        )
        # save session
        await session.save()
        sessions.append(session)

    # if there are AI players, create sessions for them
    if n_ai_players > 0:
        solution_type = 'loss'
        for session_idx in range(n_sessions_per_generation - n_ai_players, n_sessions_per_generation):
            # TODO: remove after Pilot 3B
            # Select AI solution type
            if session_idx >= 3:
                solution_type = 'myopic'
            session = create_ai_trials(
                config_id=config_id,
                experiment_num=experiment_num,
                experiment_type=experiment_type,
                generation=generation,
                session_idx=session_idx,
                n_demonstration_trials=n_individual_trials,
                solution_type=solution_type
            )
            # save session
            await session.save()
            sessions.append(session)

    return sessions


def create_trials(config_id: PydanticObjectId, experiment_num: int,
                  experiment_type: str, generation: int, session_idx: int,
                  n_social_learning_trials: int = 2,
                  n_individual_trials: int = 3,
                  n_demonstration_trials: int = 2,
                  redirect_url: str = 'https://www.prolific.co/') -> Session:
    """
    Generate one session.
    :param redirect_url: URL to redirect to after the experiment is finished
    """
    trial_n = 0

    # Consent form
    trials = [Trial(id=trial_n, trial_type='consent',
                    redirect_url='https://www.prolific.co/')]
    trial_n += 1

    trials.append(Trial(id=trial_n, trial_type='instruction', instruction_type='welcome'))
    trial_n += 1

    trials.append(Trial(id=trial_n, trial_type='practice'))
    trial_n += 1

    # Social learning trials (not relevant for the very first generation)
    if generation > 0:
        # Individual trials
        trials.append(Trial(id=trial_n, trial_type='instruction', instruction_type='individual_start'))
        trial_n += 1

        for i in range(2):
            net, _ = get_net_solution()
            # individual trial practice
            trial = Trial(trial_type='individual', id=trial_n, network=net, is_practice=True, practice_count=f'{i+1}/2')
            # update the starting node
            trial.network.nodes[trial.network.starting_node].starting_node = True
            trials.append(trial)
            trial_n += 1

        # Written strategy
        trials.append(Trial(id=trial_n, trial_type='written_strategy'))
        trial_n += 1

        for i in range(n_social_learning_trials):
            # Social learning selection
            if i == 0:
                # instruction
                trials.append(Trial(id=trial_n, trial_type='instruction', instruction_type='learning_selection'))
                trial_n += 1

            trials.append(Trial(id=trial_n, trial_type='social_learning_selection'))
            trial_n += 1

            # instruction before learning
            if i == 0:
                trials.append(Trial(id=trial_n, trial_type='instruction', instruction_type='learning'))
                trial_n += 1

            # show all demonstration trials
            for ii in range(n_individual_trials):
                # Social learning
                trials.append(Trial(id=trial_n, trial_type='try_yourself', is_practice=True, practice_count=f'{ii+1}/4'))
                trial_n += 1
                trials.append(Trial(id=trial_n, trial_type='observation', is_practice=True, practice_count=f'{ii+1}/4'))
                trial_n += 1
                trials.append(Trial(id=trial_n, trial_type='try_yourself', is_practice=True, practice_count=f'{ii+1}/4'))
                trial_n += 1
    else:
        # Replace social learning trials with individual trials for the very
        # first generation
        n_individual_trials += n_social_learning_trials * n_demonstration_trials * 3

    # Individual trials
    trials.append(Trial(id=trial_n, trial_type='instruction', instruction_type='individual'))
    trial_n += 1

    for i in range(n_individual_trials if generation > 0 else n_individual_trials):
        net, _ = get_net_solution()
        # individual trial
        trial = Trial(
            trial_type='individual',
            id=trial_n,
            network=net,
        )
        # update the starting node
        trial.network.nodes[trial.network.starting_node].starting_node = True
        trials.append(trial)
        trial_n += 1

    # Demonstration trials
    if n_demonstration_trials > 0:
        trials.append(Trial(id=trial_n, trial_type='instruction', instruction_type='demonstration'))
        trial_n += 1
        for i in range(n_demonstration_trials):
            net, _ = get_net_solution()
            # demonstration trial
            dem_trial = Trial(
                id=trial_n,
                trial_type='demonstration',
                network=net,
            )
            # update the starting node
            dem_trial.network.nodes[
                dem_trial.network.starting_node].starting_node = True
            trials.append(dem_trial)
            trial_n += 1

    # Written strategy
    trials.append(Trial(id=trial_n, trial_type='written_strategy'))
    trial_n += 1
    trials.append(Trial(id=trial_n, trial_type='post_survey'))
    trial_n += 1

    # Debriefing
    trials.append(Trial(id=trial_n, trial_type='debriefing',
                        redirect_url=redirect_url))
    trial_n += 1

    # create session
    session = Session(
        config_id=config_id,
        experiment_num=experiment_num,
        experiment_type=experiment_type,
        generation=generation,
        session_num_in_generation=session_idx,
        trials=trials,
        available=True if generation == 0 else False
    )
    # Add trials to session
    session.trials = trials
    return session


def create_ai_trials(config_id: PydanticObjectId, experiment_num,
                     experiment_type, generation, session_idx,
                     n_demonstration_trials, n_individual_trials=4, solution_type='loss'):
    trials = []
    trial_n = 0
    # Individual trials
    for i in range(n_individual_trials):
        net, moves = get_net_solution(solution_type)

        # individual trial
        trial = Trial(
            trial_type='individual',
            id=trial_n,
            network=net,
            solution=Solution(
                moves=moves,
                score=estimate_solution_score(net, moves),
                solution_type=solution_type
            )
        )
        # update the starting node
        trial.network.nodes[trial.network.starting_node].starting_node = True
        trials.append(trial)
        trial_n += 1

    # Demonstration trial
    for i in range(n_demonstration_trials):
        net, moves = get_net_solution(solution_type)

        dem_trial = Trial(
            id=trial_n,
            trial_type='demonstration',
            network=net,
            solution=Solution(
                moves=moves,
                score=estimate_solution_score(net, moves),
                solution_type=solution_type
            )
        )
        # update the starting node
        dem_trial.network.nodes[
            dem_trial.network.starting_node].starting_node = True
        trials.append(dem_trial)
        trial_n += 1

    # Written strategy
    trials.append(Trial(
        id=trial_n,
        trial_type='written_strategy',
        written_strategy=WrittenStrategy(strategy=''))
    )

    session = Session(
        config_id=config_id,
        experiment_num=experiment_num,
        experiment_type=experiment_type,
        generation=generation,
        session_num_in_generation=session_idx,
        trials=trials,
        available=False,
        ai_player=True,
        finished=True
    )
    session.average_score = estimate_average_player_score(session)
    return session


def get_net_solution(solution_type='loss'):
    # get networks list from the global variable
    global network_data

    # load the network again if all the previous networks have been used
    # TODO: maybe change this behavior later
    if len(network_data) == 0:
        # load all networks
        network_data = json.load(open(Path('data') / 'networks.json'))

        # randomize the order of the networks
        random.shuffle(network_data)

    # pop a network from the list of networks
    network_raw = network_data.pop()

    # parse the network
    network = Network.parse_obj(network_raw)

    # get the solution for the network
    if solution_type == 'loss':
        moves = [s for s in solutions if s['network_id'] == network.network_id]
    else:
        # myopic solution
        moves = [s for s in solutions_myopic if s['network_id'] == network.network_id]

    # for some reason the first move is always 0, so we need to replace it
    moves[0]['moves'][0] = network.starting_node

    return network, moves[0]['moves']
