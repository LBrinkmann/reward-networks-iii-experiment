import erdantic as erd

from models.session import Session
from models.subject import Subject


def draw_db_graph():
    diagram = erd.create(Session)
    diagram.draw("tmp/db_graph_session.png", args='-Gdpi=300')

    diagram = erd.create(Subject)
    diagram.draw("tmp/db_graph_subject.png", args='-Gdpi=300')


if __name__ == '__main__':
    draw_db_graph()
