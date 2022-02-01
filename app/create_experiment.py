import random

from app.models.environment import Environment

from app.models.experiment import Experiment, Treatment
from .models.chain import Chain
from .models.game import Game
from .models.step import Step, Stage
from typing import List


def create_step_stages():
    return [
        Stage(stage_name='game', stage_idx=0), Stage(stage_name='results', stage_idx=1)
    ]


phases = [
     'none', 'expectedReward', 'playout', 'play', 'table', 'text',
]

# ['learning', 'demonstration']


def create_game_steps(experiment: Experiment, treatment: Treatment, chain: Chain, game: Game):
    Step(stepIdx=0, phase='tutorial', gameId=game.id, current=True, phaseStep=0).flush()
    step_idx = 1
    trial_idx = 0
    for phase in phases:
        for phase_step in range(experiment.n_steps_per_phase):
            environment_id = game.environment_ids[trial_idx]
            stages = create_step_stages()
            Step(
                stepIdx=step_idx, phase=phase, gameId=game.id, 
                phaseStep=phase_step, current=False, trailIdx=trial_idx,
                environmentId=environment_id, stages=stages
            ).flush()
            step_idx += 1
            trial_idx += 1
    Step(stepIdx=step_idx, phase='finished', gameId=game.id, current=False, phaseStep=0).flush()


def create_chain_games(experiment: Experiment, treatment: Treatment, chain: Chain):
    child_id = None
    for generation in range(experiment.n_games_per_chain, 0, -1):
        environment_ids = (chain.environment_ids + chain.environment_ids)[(5*generation)%10:(5*generation)%10+10]
        game = Game(
            experimentId=experiment.id,
            treatmentName=chain.treatment_name, generation=generation, 
            locked=generation != 1, childId=child_id, chainId=chain.id,
            environmentIds=environment_ids
        ).flush()
        child_id = game.id
        create_game_steps(experiment, treatment, chain, game)


def create_chains(experiment: Experiment, environments: List[Environment]):
    for treatment in experiment.treatments.values():
        for c_in_t in range(experiment.n_chains_per_treatment):
            environment_ids = random.sample(environments.keys(), experiment.n_steps_per_phase * 2)
            chain = Chain(
                experimentId=experiment.id, treatmentName=treatment.name, 
                environmentIds=environment_ids).flush()
            create_chain_games(experiment, treatment, chain)
