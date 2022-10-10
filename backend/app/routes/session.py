from datetime import datetime
from typing import Union, List

from beanie import PydanticObjectId
from beanie.odm.operators.find.comparison import In
from beanie.odm.operators.update.general import Set
from fastapi import APIRouter

from models.session import Session, SessionError
from models.subject import Subject
from models.trial import Trial, Solution, TrialSaved, TrialError, \
    WrittenStrategy, Advisor

session_router = APIRouter(tags=["Session"])


@session_router.get('/{prolific_id}', response_model_by_alias=False)
async def get_current_trial(prolific_id: str) -> Union[Trial, SessionError]:
    """
    Get current trial from the session.
    """
    # find session and trial for the subject
    session = await get_session(prolific_id)

    if isinstance(session, SessionError):
        return session

    trial = session.trials[session.current_trial_num]

    # save starting time
    trial.started_at = datetime.now()

    await session.save()

    return trial


@session_router.post('/{prolific_id}/{trial_type}')
async def save_current_trial_results(
        prolific_id: str,
        trial_type: str,
        body: Union[Solution, WrittenStrategy, Advisor, None] = None) -> Union[
    TrialSaved, SessionError, TrialError]:
    # find session assigned to the subject
    session = await get_session(prolific_id)

    # return error if session is not available
    if isinstance(session, SessionError):
        return session

    # get current trial
    trial = session.trials[session.current_trial_num]

    # check if trial type is correct
    if trial.trial_type != trial_type:
        return TrialError(message='Trial type is not correct')

    # save trial results
    if trial_type == 'consent':
        pass
    elif trial_type == 'individual':
        save_individual_demonstration_trial(trial, body)
    elif trial_type == 'social_learning_selection':
        trials = session.trials[
                 session.current_trial_num: session.current_trial_num + 3]
        await save_social_leaning_selection(trials, session.subject_id, body)
    elif trial_type == 'social_learning':
        pass
    elif trial_type == 'demonstration':
        save_individual_demonstration_trial(trial, body)
    elif trial_type == 'written_strategy':
        save_written_strategy(trial, body)
    elif trial_type == 'debriefing':
        pass
    else:
        return TrialError(message='Trial type is not correct')

    # update session with the trial
    session.trials[session.current_trial_num] = trial

    if (session.current_trial_num + 1) == len(session.trials):
        session.finished_at = datetime.now()
        session.finished = True
        # save session
        await session.save()

        # update child sessions
        await update_availability_status_child_sessions(session)
    else:
        # increase trial index by 1
        session.current_trial_num += 1

        # save session
        await session.save()

    return TrialSaved()


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


def save_individual_demonstration_trial(trial: Trial, body: Solution):
    if not isinstance(body, Solution):
        return TrialError(message='Trial results are missing')

    trial.solution = Solution(
        moves=body.moves,
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

    # select advisor's demonstration trials
    dem_trials = [t for t in ad_s.trials if t.trial_type == 'demonstration']

    # select advisor's written strategy
    wr_s = [t.written_strategy for t in ad_s.trials if
            t.trial_type == 'written_strategy'][0]

    # select demonstration trial that was not previously seen by the current
    # subject
    sl_trial = [t for t in dem_trials if
                subject_id not in t.selected_by_children][0]

    # update `selected_by_children` field for advisor's demonstration trial
    sl_trial.selected_by_children.append(subject_id)
    # save advisor's session
    await ad_s.save()

    for trial in trials:
        trial.advisor = Advisor(
            advisor_id=body.advisor_id,
            trial_id=sl_trial.id,
            network=sl_trial.network,
            solution=sl_trial.solution,
            written_strategy=wr_s.strategy
        )


def estimate_trial_score():
    pass
