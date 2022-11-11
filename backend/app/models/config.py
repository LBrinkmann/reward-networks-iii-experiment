from datetime import datetime
from typing import Optional

from beanie import Document


class ExperimentSettings(Document):
    # whether the experiment is active
    active: bool = False
    created_at: Optional[datetime] = datetime.now()

    # Example: https://app.prolific.co/submissions/complete?cc=4FC4E0C0
    redirect_url: Optional[str] = "https://app.prolific.co/submissions/complete"

    # These variables are rewritten on deployment
    # number of generations with the first generation
    n_generations: int = 3
    simulate_first_generation: bool = False  # development only

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
