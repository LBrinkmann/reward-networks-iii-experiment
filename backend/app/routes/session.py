from datetime import datetime

from fastapi import APIRouter

from models.session import Session
from models.subject import Subject
from models.trial import Trial

session_router = APIRouter(tags=["Session"])


@session_router.get('/{prolific_id}', response_model_by_alias=False)
async def get_current_trial(prolific_id: str) -> Trial:
    """
    Get current trial from the session.
    """
    # find session and trial for the subject
    session, trial = await get_trial_session(prolific_id)

    # save starting time
    trial.started_at = datetime.now()

    await session.save()
    # TODO: return model compatible with frontend
    return trial


@session_router.put('/{prolific_id}')
async def save_moves_in_trial(prolific_id: str, body: Trial) -> dict:
    # find session and trial for the subject
    session, trial = await get_trial_session(prolific_id)

    # update current trial with the subject solution
    trial.solution = body.solution
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

    return {
        "message": "Trial saved"
    }


async def update_available_status_child_sessions(session):
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


async def get_trial_session(prolific_id) -> (Session, Trial):
    # check if collection Subject exists
    if await Subject.find().count() > 0:
        subjects_with_id = await Subject.find(
            Subject.prolific_id == prolific_id).to_list()
    else:
        subjects_with_id = []
    if len(subjects_with_id) > 1:
        # TODO: raise exception and make proper error handling
        raise Exception("More than one subject with the same prolific id")
    elif len(subjects_with_id) == 0:
        # creat a new subject
        subject = Subject(prolific_id=prolific_id)
        # save subject to database
        await subject.save()
        # session initialization
        session = await initialize_session(subject)
    else:
        subject = subjects_with_id[0]
        # get session for the subject
        session = await Session.find_one(Session.subject_id == subject.id)

    trial = session.trials[session.current_trial_num]
    return session, trial


async def initialize_session(subject: Subject) -> Session:
    # get any available session
    session = await Session.find_one(Session.available == True)

    if session is None:
        # TODO: handle this situation
        raise Exception("No available session")

    # session is not available anymore
    session.available = False
    # assign subject to session
    session.subject_id = subject.id
    # update trial index
    session.current_trial_num = 0
    # save session
    await session.save()
    # assign session to subject
    subject.session_id = session.id
    # save subject
    await subject.save()
    return session
