import json
import random
from pathlib import Path

from typing import List

from models.network import Network
from models.session import Session
from models.trial import Trial


async def generate_sessions(n_generations: int = 5,
                            n_sessions_per_generation: int = 10,
                            n_advise_per_session: int = 5,
                            experiment_type: str = 'reward_network_iii',
                            experiment_num: int = 0
                            ):
    """
    Generate one experiment.
    """
    # Set random seed
    random.seed(42)

    # create sessions for the first generation
    sessions_n_0 = await create_generation(
        0, n_sessions_per_generation, experiment_type, experiment_num)

    # iterate over generations
    for generation in range(n_generations - 1):
        # create sessions for the next generation
        sessions_n_1 = await create_generation(
            generation + 1, n_sessions_per_generation, experiment_type,
            experiment_num)

        # randomly link sessions of the previous generation to the sessions of
        # the next generation
        for s_n_1 in sessions_n_1:
            # get n numbers between 0 and n_sessions_per_generation - 1
            # without replacement
            advise_src = random.sample(range(n_sessions_per_generation),
                                       n_advise_per_session)
            advise_ids = []
            for i in advise_src:
                advise_ids.append(sessions_n_0[i].id)
                # record children of the session
                sessions_n_0[i].child_ids.append(s_n_1.id)
                await sessions_n_0[i].save()

            s_n_1.advise_ids = advise_ids
            await s_n_1.save()
        # now sessions_n_0 is the previous generation
        sessions_n_0 = sessions_n_1


async def create_generation(generation: int,
                            n_sessions_per_generation: int,
                            experiment_type: str,
                            experiment_num: int
                            ) -> List[Session]:
    sessions = []
    for session_idx in range(n_sessions_per_generation):
        session = await generate_session(experiment_num, experiment_type,
                                         generation, session_idx)
        # save session
        await session.save()
        sessions.append(session)
    return sessions


async def generate_session(experiment_num, experiment_type, generation,
                           session_idx):
    """
    Generate one session.
    """
    network_data = json.load(open(Path.cwd() / 'data' / 'train_viz.json'))
    trial_n = 0

    # Consent form
    trials = [Trial(trial_num_in_session=trial_n, trial_type='consent')]
    trial_n += 1

    # Social learning
    # trials.append(Trial(
    #     trial_num_in_session=trial_n,
    #     trial_type='social_learning_selection'))
    # trial_n += 1

    # Individual trials
    n_individual_trials = 3
    for _ in range(n_individual_trials):
        # TODO: read Networks
        # create trial
        trial = Trial(
            trial_type='individual',
            trial_num_in_session=trial_n,
            network=Network.parse_obj(
                network_data[random.randint(0, network_data.__len__() - 1)]),
        )
        # update the starting node
        trial.network.nodes[
            trial.network.starting_node].starting_node = True
        trials.append(trial)
        trial_n += 1

    # Demonstration trial
    trials.append(Trial(
        trial_num_in_session=trial_n,
        trial_type='demonstration'))
    trial_n += 1

    # Written strategy
    trials.append(Trial(
        trial_num_in_session=trial_n,
        trial_type='written_strategy'))
    trial_n += 1

    # Debriefing

    # create session
    # TODO: check if session already exists
    session = Session(
        experiment_num=experiment_num,
        experiment_type=experiment_type,
        generation=generation,
        session_num_in_generation=session_idx,
        trials=trials,
        available=True if generation == 0 else False,
    )
    # Add trials to session
    session.trials = trials
    return session
