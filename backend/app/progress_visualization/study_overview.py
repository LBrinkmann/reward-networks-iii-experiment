import datetime
import random
from pathlib import Path

from pyvis.network import Network

ROOT = Path(__file__).parent


def create_sessions_network():
    net = Network(height='800px', width='100%', directed=True, layout=True)

    for g in range(4):
        # two parallel sessions in neighboring generations
        for n_connections in range(20):
            g_0 = random.randint(0, 9)
            g_1 = random.randint(0, 9)
            inx0 = f'g_{g}_s_{g_0}'
            inx1 = f'g_{g + 1}_s_{g_1}'
            net.add_node(inx0, inx0, level=g, x=g_0 * 5)
            net.add_node(inx1, inx1, level=g + 1, x=g_1 * 5)
            net.add_edge(inx0, inx1)

    # net.show_buttons(filter_=['edges'])
    # net.show_buttons()

    net.set_options(open(ROOT / 'graph_settings.json').read())
    # net.show('study_net.html')
    path = ROOT / 'tmp'
    path.mkdir(exist_ok=True)
    file = path / f'study_net_{datetime.datetime.now()}.html'
    net.save_graph(str(file))
    # html_file = open(file, 'r', encoding='utf-8').read()
    # remove file from the disc
    # file.unlink()
    return file


create_sessions_network()
