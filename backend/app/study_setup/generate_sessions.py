import random

from typing import List, Union

from models.session import Session
from models.trial import Trial


async def generate_sessions(n_generations: int = 5,
                            n_sessions_per_generation: int = 10,
                            n_trials_per_session: int = 10,
                            trial_types: Union[List[str], str, None] = None,
                            n_advise_per_session: int = 3,
                            experiment_type: str = 'reward_network_iii',
                            experiment_num: int = 0
                            ):
    # Set random seed
    random.seed(42)

    # create sessions for the first generation
    sessions_n_0 = await create_generation(
        0, n_sessions_per_generation, n_trials_per_session, trial_types,
        experiment_type, experiment_num)

    # iterate over generations
    for generation in range(n_generations - 1):
        # create sessions for the next generation
        sessions_n_1 = await create_generation(
            generation + 1, n_sessions_per_generation, n_trials_per_session,
            trial_types, experiment_type, experiment_num)

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

            s_n_1.advise_ids = advise_ids
            await s_n_1.save()


async def create_generation(generation: int,
                            n_sessions_per_generation: int,
                            n_trials_per_session: int,
                            trial_types: Union[List[str], str, None],
                            experiment_type: str,
                            experiment_num: int
                            ) -> List[Session]:
    sessions = []
    for session_idx in range(n_sessions_per_generation):
        trials = []
        # TODO: add trial types
        # create trials for this session
        for trial_idx in range(n_trials_per_session):
            # TODO: read Networks
            # create trial
            trial = Trial(
                trial_num_in_session=trial_idx
            )
            trials.append(trial)
        # create session
        session = Session(
            experiment_num=experiment_num,
            experiment_type=experiment_type,
            generation=generation,
            session_num_in_generation=session_idx,
            trials=trials
        )
        # Add trials to session
        session.trials = trials
        # save session
        await session.save()
        sessions.append(session)
    return sessions
