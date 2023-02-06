import {SessionState} from "../contexts/SessionContext";


export const SESSION_ACTIONS = {
    SET_CURRENT_TRIAL: 'setTrialType',
    SET_ADVISORS: 'setAdvisors',
    SET_SELECTED_ADVISOR: 'setSelectedAdvisor',
}

const sessionReducer = (state: SessionState, action: any) => {
    switch (action.type) {
        case SESSION_ACTIONS.SET_CURRENT_TRIAL:
            return {
                ...state,
                currentTrialType: action.payload.currentTrialType,
                currentTrialId: action.payload.currentTrialId,
                // show tutorial for social learning selection and observation trials
                showTutorialInCurrentTrial: action.payload.currentTrialId < 4,
            }
        case SESSION_ACTIONS.SET_ADVISORS:
            return {
                ...state,
                advisors: action.payload.advisors,
            };
        case SESSION_ACTIONS.SET_SELECTED_ADVISOR:
            return {
                ...state,
                selectedAdvisor: action.payload.selectedAdvisor,
            };
        default:
            return state;
    }
}

export default sessionReducer;