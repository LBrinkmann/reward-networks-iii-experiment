from pydantic import BaseSettings


class ExperimentSettings(BaseSettings):
    experiment_name: str = 'reward-network-iii-pilot'
    rewrite_previous_data: bool = False
    n_generations: int = 2
    n_players_first_generation: int = 13  # 3 (humans) + 7 (humans) + 3 (AI)
    n_ai_players: int = 3
    n_sessions_per_generation: int = 10
    n_advise_per_session: int = 5
    n_session_tree_replications: int = 1

    # trials
    # the number of social learning iterations
    n_social_learning_trials: int = 2
    n_individual_trials: int = 3
    n_demonstration_trials: int = 2