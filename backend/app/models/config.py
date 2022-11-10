from datetime import datetime
from typing import Optional

from beanie import Document


class ExperimentSettings(Document):
    # whether the experiment is active
    active: bool = False
    created_at: Optional[datetime] = datetime.now()

    # username and password for basic auth on routes to view progress and
    # results
    BACKEND_USER: Optional[str] = "admin"
    BACKEND_PASSWORD: Optional[str] = "admin"

    # These variables are rewritten on deployment
    # number of generations with the first generation
    N_GENERATIONS: int = 3
    SIMULATE_FIRST_GENERATION: bool = True  # development only

    # other experiment settings
    experiment_type: str = 'reward-network-iii'  # name of the experiment
    rewrite_previous_data: bool = False
    n_sessions_first_generation: int = 13  # 3 (humans) + 7 (humans) + 3 (AI)
    n_ai_players: int = 3
    n_sessions_per_generation: int = 20
    n_advise_per_session: int = 5
    n_session_tree_replications: int = 1

    # trials
    # the number of social learning iterations
    n_social_learning_trials: int = 2
    n_individual_trials: int = 6
    n_demonstration_trials: int = 2
