from datetime import datetime
from typing import Union, List

from beanie import PydanticObjectId
from beanie.odm.operators.find.comparison import In
from beanie.odm.operators.update.general import Set

from models.session import Session, SessionError
from models.subject import Subject
from models.trial import AdvisorSelection, Trial, Solution, TrialError, \
    WrittenStrategy, Advisor
from utils.utils import estimate_solution_score


async def get_session(prolific_id) -> Union[Session, SessionError]:
    """ Get session for the subject """
    # check if collection Subject exists
    if await Subject.find().count() > 0:
        subjects_with_id = await Subject.find(
            Subject.prolific_id == prolific_id).to_list()
    else:
        subjects_with_id = []

    if len(subjects_with_id) == 0:
        # subject does not exist
        # creat a new subject
        subject = Subject(prolific_id=prolific_id)
        # save subject to database
        await subject.save()
        # session initialization for the subject
        # session will not be assigned to the subject if there is no available
        await initialize_session(subject)
    elif len(subjects_with_id) > 1:
        # if more than one subject with the same prolific id return error
        return SessionError(
            message='Multiple subjects with the same prolific id')
    else:
        subject = subjects_with_id[0]

    # get session for the subject
    session = await Session.find_one(Session.subject_id == subject.id)
    if session is None:
        # this happens when all available sessions are taken
        return SessionError(message='No available session for the subject')

    # this will happen only for the new subject
    if subject.session_id is None:
        # update Subject.session_id field if it is empty
        await subject.update(Set({Subject.session_id: session.id}))

    return session


async def initialize_session(subject: Subject):
    # assign subject to any available session
    await Session.find_one(Session.available == True).update(
        Set({
            Session.available: False,
            Session.subject_id: subject.id,
            Session.current_trial_num: 0
        })
    )


async def update_availability_status_child_sessions(session: Session):
    """ Update child sessions availability status """

    # update `unfinished_parents` value for child sessions
    await Session.find(
        In(Session.id, session.child_ids)
    ).inc({Session.unfinished_parents: -1})

    # update child sessions status if all parent sessions are finished
    await Session.find(
        In(Session.id, session.child_ids),
        Session.unfinished_parents == 0
    ).update(Set({Session.available: True}))


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


def save_individual_demonstration_trial(trial: Trial, body: Solution):
    if not isinstance(body, Solution):
        return TrialError(message='Trial results are missing')

    trial.solution = Solution(
        moves=body.moves,
        score=estimate_solution_score(trial.network, body.moves),
        trial_id=trial.id,
        finished_at=datetime.now()
    )
    trial.finished_at = datetime.now()
    trial.finished = True


def save_written_strategy(trial: Trial, body: WrittenStrategy):
    if not isinstance(body, WrittenStrategy):
        return TrialError(message='Trial results are missing')

    trial.written_strategy = WrittenStrategy(
        strategy=body.strategy,
        trial_id=trial.id,
        finished_at=datetime.now()
    )
    trial.finished_at = datetime.now()
    trial.finished = True


async def save_social_leaning_selection(trials: List[Trial],
                                        subject_id: PydanticObjectId,
                                        body: Advisor):
    if not isinstance(body, Advisor):
        return TrialError(message='Trial results are missing')

    # get advisor session
    ad_s = await Session.get(body.advisor_id)

    if ad_s is None:
        return TrialError(message='Advisor session is not found')

    # select advisor's demonstration trial
    sl_trial = ad_s.trials[body.demonstration_trial_id]

    # select advisor's written strategy
    wr_s = [t.written_strategy for t in ad_s.trials if
            t.trial_type == 'written_strategy'][0]

    # update `selected_by_children` field for advisor's demonstration trial
    sl_trial.selected_by_children.append(subject_id)

    for trial in trials:
        trial.advisor = Advisor(
            advisor_id=body.advisor_id,
            demonstration_trial_id=sl_trial.id,
            solution=sl_trial.solution,
            written_strategy=wr_s.strategy
        )
        # assign advisor's network to the trial
        trial.network = sl_trial.network

    trials[0].finished_at = datetime.now()
    trials[0].finished = True
