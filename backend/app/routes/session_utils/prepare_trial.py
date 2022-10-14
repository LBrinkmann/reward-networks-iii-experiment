from models.session import Session
from models.trial import AdvisorSelection


async def prepare_social_leaning_selection_trial(trial, session):
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
