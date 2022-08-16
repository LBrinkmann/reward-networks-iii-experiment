from pathlib import Path
from typing import List

from pyvis.network import Network

from models.session import Session

ROOT = Path(__file__).parent


async def create_sessions_network(experiment_type: str = 'reward_networks_iii',
                                  experiment_num: int = 0) -> Path:
    sessions = await Session.find(
        Session.experiment_num == experiment_num,
        # Session.experiment_type == experiment_type
    ).sort(+Session.generation).to_list()

    net = Network(height='800px', width='100%', directed=True, layout=True)
    for session in sessions:
        g = session.generation
        s_num = session.session_num_in_generation
        label = f'{g}_{s_num}'
        net.add_node(str(session.id), label, shape='circle', level=g, x=s_num)
        adv = session.advise_ids
        if adv is not None:
            for a in adv:
                advise_session = await Session.find_one(Session.id == a)
                net.add_edge(str(advise_session.id), str(session.id))

    # net.show_buttons(filter_=['edges'])
    # net.show_buttons()

    net.set_options(open(ROOT / 'graph_settings.json').read())
    # net.show('study_net.html')
    path = ROOT / 'tmp'
    path.mkdir(exist_ok=True)
    file = path / f'study_{experiment_type}_{experiment_num}_overview.html'
    net.save_graph(str(file))
    # html_file = open(file, 'r', encoding='utf-8').read()
    # remove file from the disc
    # file.unlink()
    return file
