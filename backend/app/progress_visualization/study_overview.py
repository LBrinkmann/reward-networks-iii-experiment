from datetime import datetime
from pathlib import Path

from pyvis.network import Network

from models.config import ExperimentSettings
from models.session import Session

ROOT = Path(__file__).parent


async def create_sessions_network(experiment_num) -> Path:
    # find an active configuration
    config = await ExperimentSettings.find_one(
        ExperimentSettings.active == True)

    sessions = await Session.find(
        Session.experiment_num == experiment_num,
        Session.experiment_type == config.experiment_type
    ).sort(+Session.generation).to_list()

    net = Network(height='800px', width='100%', directed=True, layout=True)
    for session in sessions:
        g = session.generation
        s_num = session.session_num_in_generation
        trial_num = session.current_trial_num
        trial = session.trials[trial_num]
        subject_in_the_session = True if session.subject_id else False
        is_ai_player = session.ai_player
        if subject_in_the_session:
            percentage = round((trial_num + 1) / len(session.trials) * 100)
            label = f'{percentage}%'
        else:
            label = ' '
        title = f'Session {s_num} in generation {g}\n'
        title += f'Current trial: {trial_num + 1} ({trial.trial_type})\n'
        first_trial = session.trials[0]
        if trial_num > 0 and isinstance(first_trial.started_at, datetime):
            time_spent = trial.started_at - first_trial.started_at
            m = time_spent.total_seconds() / 60
            title += f'Time in the study: {round(m, 2)}  minutes\n'
        title += f'Created at: ' \
                 f'{session.created_at.strftime("%m.%d.%Y %H:%M:%S")}\n'

        if session.available:
            color = '#85D4E3'
        else:
            if session.finished:
                color = '#81A88D'
            elif subject_in_the_session:
                color = '#F5A45D'  # '#FAD77B'
            else:
                color = '#F4B5BD'

        if session.expired:
            color = '#D5D5D3'
            label = 'NA'

        if is_ai_player:
            color = '#FAD77B'
            label = 'AI'

        net.add_node(str(session.id), label, shape='circle', level=g, x=s_num,
                     color=color, title=title)
        adv = session.advise_ids
        if adv is not None:
            for a in adv:
                advise_session = await Session.find_one(Session.id == a)
                if session.available & advise_session.available:
                    opacity = 1
                else:
                    opacity = 0.5
                net.add_edge(str(advise_session.id), str(session.id),
                             opacity=opacity)
    net.set_options(open(ROOT / 'graph_settings.json').read())
    path = ROOT / 'tmp'
    path.mkdir(exist_ok=True)
    file = path / f'study_{config.experiment_type}_{experiment_num}_overview.html'

    html = net.generate_html(str(file))
    with open(file, "w+") as out:
        out.write(html)
    return file
