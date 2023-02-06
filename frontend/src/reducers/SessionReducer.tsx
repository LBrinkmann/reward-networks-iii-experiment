import {SessionState} from "../contexts/SessionContext";


export const SESSION_ACTIONS = {
    SET_CURRENT_TRIAL: 'setTrialType',
    SELECT_SOCIAL_LEARNING_TEACHER: 'selectSocialLearningTeacher',
}

const sessionReducer = (state: SessionState, action: any) => {
    switch (action.type) {
        case SESSION_ACTIONS.SET_CURRENT_TRIAL:
            return {
                ...state,
                currentTrialType: action.payload.trialType,
                currentTrialId: action.payload.trialId,
            }
        case SESSION_ACTIONS.SELECT_SOCIAL_LEARNING_TEACHER:
            return state;
        default:
            return state;
    }
}

export default sessionReducer;