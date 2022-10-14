from datetime import datetime
from typing import Union

from fastapi import APIRouter

from models.session import SessionError
from models.trial import Trial, Solution, TrialSaved, TrialError, \
    WrittenStrategy, Advisor
from routes.session_utils import get_session, \
    update_availability_status_child_sessions, \
    prepare_social_leaning_selection_trial, \
    save_individual_demonstration_trial, \
    save_written_strategy, save_social_leaning_selection

session_router = APIRouter(tags=["Session"])

n_social_learning_trials = 3


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

    # prepare social leaning selection trials
    if trial.trial_type == 'social_learning_selection':
        await prepare_social_leaning_selection_trial(trial, session)

    # save starting time
    trial.started_at = datetime.now()

    await session.save()

    return trial


@session_router.post('/{prolific_id}/{trial_type}')
async def post_current_trial_results(
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
        # select all social learning trials for one advisor
        sl_start = session.current_trial_num
        sl_end = sl_start + n_social_learning_trials + 1
        trials = session.trials[sl_start:sl_end]
        await save_social_leaning_selection(trials, session.subject_id, body)
        session.trials[sl_start:sl_end] = trials
    elif trial_type == 'social_learning':
        save_individual_demonstration_trial(trial, body)
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
