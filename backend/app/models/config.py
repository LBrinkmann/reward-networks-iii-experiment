from pydantic import BaseSettings


class ExperimentSettings(BaseSettings):
    experiment_name: str = 'reward-network-iii-pilot-1'
    rewrite_previous_data: bool = True
    # number of generations with the first generation
    n_generations: int = 3
    n_sessions_first_generation: int = 13  # 3 (humans) + 7 (humans) + 3 (AI)
    n_ai_players: int = 3
    n_sessions_per_generation: int = 20
    n_advise_per_session: int = 5
    n_session_tree_replications: int = 1

    # trials
    # the number of social learning iterations
    n_social_learning_trials: int = 2
    n_individual_trials: int = 3
    n_demonstration_trials: int = 2

    # development
    simulate_first_generation: bool = True
