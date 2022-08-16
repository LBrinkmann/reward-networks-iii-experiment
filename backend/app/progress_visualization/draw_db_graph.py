import erdantic as erd

from models.session import Session


def draw_db_graph():
    diagram = erd.create(Session)
    diagram.draw("tmp/db_graph.png", args='-Gdpi=300')


if __name__ == '__main__':
    draw_db_graph()
