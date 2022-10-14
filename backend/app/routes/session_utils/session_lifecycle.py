from datetime import datetime
from typing import Union

from beanie.odm.operators.find.comparison import In
from beanie.odm.operators.update.general import Set

from models.session import Session, SessionError
from models.subject import Subject


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


async def update_session(session):
    if (session.current_trial_num + 1) == len(session.trials):
        await end_session(session)
    else:
        # increase trial index by 1
        session.current_trial_num += 1

        # save session
        await session.save()


async def end_session(session):
    session.finished_at = datetime.now()
    session.finished = True
    # save session
    await session.save()
    # update child sessions
    await update_availability_status_child_sessions(session)


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

