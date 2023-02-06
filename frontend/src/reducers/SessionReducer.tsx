import {SessionState} from "../contexts/SessionContext";


export const SESSION_ACTIONS = {
    SET_CURRENT_TRIAL: 'setTrialType',
    SET_ADVISORS: 'setAdvisors',
    SET_SELECTED_ADVISOR: 'setSelectedAdvisor',
    UPDATE_TOTAL_POINTS: 'updateTotalPoints',
}

const sessionReducer = (state: SessionState, action: any) => {
    switch (action.type) {
        case SESSION_ACTIONS.SET_CURRENT_TRIAL:
            return {
                ...state,
                currentTrialType: action.payload.currentTrialType,
                currentTrialId: action.payload.currentTrialId,
                // show tutorial for social learning selection and observation trials
                showTutorialInCurrentTrial: action.payload.currentTrialId < 8,
                isTrialFinished: false,
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
        case SESSION_ACTIONS.UPDATE_TOTAL_POINTS:
            return {
                ...state,
                totalPoints: state.totalPoints + action.payload.points,
            }
        default:
            return state;
    }
}

export default sessionReducer;