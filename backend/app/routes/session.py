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
    subjects_with_id = await Subject.find_all(
        Subject.prolific_id == prolific_id).to_list()
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
        # increase trial index by 1
        session.current_trial_num += 1
        await session.save()
    trial = session.trials[session.current_trial_num]
    # TODO: return model compatible with frontend
    return trial


async def initialize_session(subject: Subject) -> Session:
    # get any available session
    session = await Session.find_one(Session.available)
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
