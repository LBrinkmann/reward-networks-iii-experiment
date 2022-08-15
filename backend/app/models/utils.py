from .advise import Advise
from .game import Game
from .user import User
from .experiment import Experiment


def reset_all():
    for m in (User, Game, Experiment, Advise):
        m.reset()
