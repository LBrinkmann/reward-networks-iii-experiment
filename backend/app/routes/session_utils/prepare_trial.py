from datetime import datetime

from models.session import Session
from models.trial import AdvisorSelection, Trial


async def prepare_trial(session: Session):
    trial = session.trials[session.current_trial_num]
    # prepare social leaning selection trials
    if trial.trial_type == 'social_learning_selection':
        await prepare_social_leaning_selection_trial(trial, session)
    # save starting time
    trial.started_at = datetime.now()
    return trial


async def prepare_social_leaning_selection_trial(trial: Trial,
                                                 session: Session):
    """ Prepare social leaning selection trials """
    subject_id = session.subject_id

    # initialize advisor selection
    trial.advisor_selection = AdvisorSelection(
        advisor_ids=[], advisor_demo_trial_ids=[], scores=[])

    for ad_id in session.advise_ids:
        # get advise
        adv = await Session.get(ad_id)

        # select advisor's demonstration trials
        dem_trials = [t for t in adv.trials if t.trial_type == 'demonstration']

        # select demonstration trial that was not previously seen by the current
        # subject
        sl_trial = [t for t in dem_trials if
                    subject_id not in t.selected_by_children][0]

        trial.advisor_selection.advisor_ids.append(ad_id)
        trial.advisor_selection.advisor_demo_trial_ids.append(sl_trial.id)
        trial.advisor_selection.scores.append(sl_trial.solution.score)
