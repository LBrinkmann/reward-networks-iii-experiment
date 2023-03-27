import {SessionState} from "../contexts/SessionContext";
import {TRIAL_TYPE} from "../components/Trials/ExperimentTrial";


export const SESSION_ACTIONS = {
    SET_CURRENT_TRIAL: 'setTrialType',
    SET_ADVISORS: 'setAdvisors',
    SET_SELECTED_ADVISOR: 'setSelectedAdvisor',
    UPDATE_TOTAL_POINTS: 'updateTotalPoints',
    CLEAN_TOTAL_POINTS: 'cleanTotalPoints',
}

const sessionReducer = (state: SessionState, action: any) => {
    switch (action.type) {
        case SESSION_ACTIONS.SET_CURRENT_TRIAL:
            let selectedAdvisorExampleId = action.payload.currentTrialType === TRIAL_TYPE.SOCIAL_LEARNING_SELECTION ?
                0 : state.selectedAdvisorExampleId;
            const previousTrialType = state.currentTrialType;
            // Very first example in the session
            if ((action.payload.currentTrialType === TRIAL_TYPE.TRY_YOURSELF) && (previousTrialType === TRIAL_TYPE.INSTRUCTION))
                selectedAdvisorExampleId = 1; // first example (right after the selection)

            if ((action.payload.currentTrialType === TRIAL_TYPE.TRY_YOURSELF) && (previousTrialType === TRIAL_TYPE.SOCIAL_LEARNING_SELECTION))
                selectedAdvisorExampleId = 1; // first example (right after the selection)

            if ((action.payload.currentTrialType === TRIAL_TYPE.TRY_YOURSELF) && (previousTrialType === TRIAL_TYPE.TRY_YOURSELF))
                selectedAdvisorExampleId = 2; // second example (right after the last try yourself of the previous example)

            return {
                ...state,
                currentTrialType: action.payload.currentTrialType,
                previousTrialType: previousTrialType,
                currentTrialId: action.payload.currentTrialId,
                // show tutorial for social learning selection and observation trials
                showTutorialInCurrentTrial: action.payload.currentTrialId < 8,
                selectedAdvisorExampleId: selectedAdvisorExampleId,
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
                totalPoints: state.totalPoints + action.payload.points + action.payload.missingSteps * -50,
            };
        case SESSION_ACTIONS.CLEAN_TOTAL_POINTS:
            return {
                ...state,
                totalPoints: 0,
            }
        default:
            return state;
    }
}

export default sessionReducer;