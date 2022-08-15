from .create_experiment import create_chains
from ..models.environment import Environment
from ..models.experiment import Experiment
from ..utils import load_yaml


def load_experiments(file='experiments.yml'):
    experiments = load_yaml(file)
    experiments = [{**exp, 'experimentName': name} for name, exp in
                   experiments.items()]

    for exp in experiments:
        exp = Experiment(**exp).flush()
        environments = Environment.read_file(exp.environments_path)
        create_chains(exp, environments=environments)
