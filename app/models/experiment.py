from app.models.base import ExtBaseModel, PyObjectId, SnakeModel
from typing import Optional, Literal, Dict

class Treatment(SnakeModel):
    name: str = 'control'
    playout: Optional[bool]
    explanation_type: Optional[Literal['table', 'rule', 'replay']]
    advisor: Literal['human', 'qtable']

class Experiment(ExtBaseModel):
    experiment_id: Optional[PyObjectId] = None
    experiment_name: str = None
    treatments: Dict[str, Treatment] = {
        'control': Treatment(name='control', advisor='human'), 
        'full': Treatment(name='full', advisor='qtable', explanationType='table', playout=True), 
    }
    n_chains_per_treatment: int = 4
    n_games_per_chain: int = 3
    n_steps_per_phase: int = 4
    q_table_path: str = 'app/data/algorithm_1.json'
    environments_path: str = 'app/data/test.json'
    active: bool = False

    def __init__(self, *, treatments, **data) -> None:
        treatments = {
            n: Treatment(**{**t, 'name': n})
            for n, t in treatments.items()
        }
        super().__init__(treatments=treatments, **data)

    def set_active(self):
        self.db().update_many({'active': True}, {"$set": {'active': False}})
        self.active = True
        self.flush()
        return self

Experiment.db().create_index("experimentName", unique=True)
