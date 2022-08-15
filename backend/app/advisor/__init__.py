from ..models.experiment import Experiment
from .human import HumanAdvisor
from .qtable import QTableAdvisor


ADVISOR = {
    'human': HumanAdvisor,
    'qtable': QTableAdvisor
}

def init_advisor(experiment: Experiment):
    advisors = list(set(t.advisor for t in experiment.treatments.values()))
    return {
        a: ADVISOR[a](experiment)
        for a in advisors
    }