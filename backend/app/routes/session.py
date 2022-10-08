from datetime import datetime
from typing import Union

from beanie.odm.operators.find.comparison import In
from beanie.odm.operators.update.general import Set
from fastapi import APIRouter

from models.session import Session, SessionError
from models.subject import Subject
from models.trial import Trial, Solution, TrialSaved, TrialError, \
    WrittenStrategy

session_router = APIRouter(tags=["Session"])


@session_router.get('/{prolific_id}', response_model_by_alias=False)
async def get_current_trial(prolific_id: str) -> Union[Trial, SessionError]:
    """
    Get current trial from the session.
    """
    # find session and trial for the subject
    session = await get_trial_session(prolific_id)

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
        body: Union[Solution, WrittenStrategy, None] = None) -> Union[
    TrialSaved, SessionError, TrialError]:
    # find session and trial for the subject
    session = await get_trial_session(prolific_id)

    if isinstance(session, SessionError):
        return session

    trial = session.trials[session.current_trial_num]

    # check if trial type is correct
    if trial.trial_type != trial_type:
        return TrialError(message='Trial type is not correct')

    save_trial_results(trial_type, trial, body)

    # update current trial with the subject solution
    trial.finished_at = datetime.now()
    trial.finished = True

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


async def get_trial_session(prolific_id) -> Union[Session, SessionError]:
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
        # session initialization
        await initialize_session(subject)
    elif len(subjects_with_id) > 1:
        return SessionError(
            message='Multiple subjects with the same prolific id')
    else:
        subject = subjects_with_id[0]

    # get session for the subject
    session = await Session.find_one(Session.subject_id == subject.id)
    if session is None:
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


def save_trial_results(trial_type: str, trial: Trial,
                       body: Union[Solution, WrittenStrategy, None]):
    if body is None:
        return

    if trial_type in ['individual', 'demonstration']:
        if not isinstance(body, Solution):
            return TrialError(message='Trial results are missing')

        trial.solution = Solution(
            moves=body.moves,
            trial_id=trial.id,
            finished_at=datetime.now()
        )

    if trial_type == 'written_strategy':
        if not isinstance(body, WrittenStrategy):
            return TrialError(message='Trial results are missing')

        trial.written_strategy = WrittenStrategy(
            strategy=body.strategy,
            trial_id=trial.id,
            finished_at=datetime.now()
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
