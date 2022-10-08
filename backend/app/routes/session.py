from datetime import datetime
from typing import Union

from beanie.odm.operators.update.general import Set
from fastapi import APIRouter

from models.session import Session, SessionError
from models.subject import Subject
from models.trial import Trial, Solution, TrialSaved, TrialError

session_router = APIRouter(tags=["Session"])


@session_router.get('/{prolific_id}', response_model_by_alias=False)
async def get_current_trial(prolific_id: str) -> Union[Trial, SessionError]:
    """
    Get current trial from the session.
    """
    # find session and trial for the subject
    session = await get_trial_session(prolific_id)

    if isinstance(session, str):
        return SessionError(message=session)

    trial = session.trials[session.current_trial_num]

    # save starting time
    trial.started_at = datetime.now()

    await session.save()

    return trial


@session_router.post('/{prolific_id}/{trial_type}')
async def save_moves_in_trial(
        prolific_id: str,
        trial_type: str,
        body: Union[Solution, None] = None) -> Union[TrialSaved, SessionError,
                                                     TrialError]:
    # find session and trial for the subject
    session = await get_trial_session(prolific_id)

    if isinstance(session, SessionError):
        return session

    trial = session.trials[session.current_trial_num]

    # check if trial type is correct
    if trial.trial_type != trial_type:
        return TrialError(message='Trial type is not correct')

    save_trial_solution(trial_type, trial, body)

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

        # check if child sessions are available
        await update_available_status_child_sessions(session)
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


def save_trial_solution(trial_type: str, trial: Trial,
                        body: Union[Solution, None]):
    if trial_type not in ['individual', 'demonstration'] or body is None:
        return
    trial.solution = Solution(
        moves=body.moves,
        trial_id=trial.id,
        finished_at=datetime.now()
    )


async def update_available_status_child_sessions(session: Session):
    """ Check if child sessions are available"""
    for c in session.child_ids:
        child_session = await Session.get(c)
        # TODO: check if child session exists
        if child_session is None:
            raise Exception("Child session does not exist")
        available = True
        for a in child_session.advise_ids:
            advise_session = await Session.find_one(Session.id == a)
            if advise_session.finished is False:
                available = False
                break
        if available:
            child_session.available = True
            await child_session.save()
