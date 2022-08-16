import random

from pyvis.network import Network


def create_sessions_network():
    # , bgcolor='#222222', font_color='white',
    net = Network(height='800px', width='100%', directed=True, layout=True)
    # net.barnes_hut()
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
    net.set_options(open('graph_settings.json').read())
    net.show('study_net.html')


create_sessions_network()
