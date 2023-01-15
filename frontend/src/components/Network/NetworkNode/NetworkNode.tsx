import React, {useEffect, useReducer, useState} from "react";

import NetworkNodeStyled from "./NetworkNode.styled";
import TutorialTip from "../../Tutorial/TutorialTip";

export type NetworkNodeStatus = "normal" | "starting" | "active" | "disabled";

export interface NetworkNodeInterface {
    /** Node index */
    nodeInx: number;
    /** Text inside the node */
    Text: string;
    /** Node radius, fetched from backend */
    Radius: number;
    /** Node x position */
    x: number;
    /** Node y position */
    y: number;
    /** Callback to handle node click */
    onNodeClick: (nodeIdx: number) => void;
    isValidMove: boolean;
    status: NetworkNodeStatus;
    /** show tutorial tip */
    showTutorial?: boolean;
    /** Callback to handle tutorial tip close */
    onTutorialClose?: () => void;
}


const NetworkNode: React.FC<NetworkNodeInterface> = props => {
    const {showTutorial = false} = props;
    const [wrongClick, setWrongClick] = useState(false);

    // const [state, dispatch] = useReducer(
    //     nodeStateReducer,
    //     {status: ''},
    //     () => props.isActive ? {status: 'active' as NetworkNodeStatus} : {status: '' as NetworkNodeStatus});

    // useEffect(() => {
    //     if (state.status === 'invalid-click') {
    //         // set timeout to reset status
    //         setTimeout(() => {
    //             dispatch({
    //                 type: 'resetStatus',
    //                 payload: {isActive: props.isActive}
    //             });
    //         }, 300);
    //     } else if (status === "active" && !props.isActive) { // override status with the props value
    //         setStatus("");
    //     } else if (props.isActive) {
    //         setStatus("active");
    //     }
    //
    // }, [state, props.isActive]);

    useEffect(() => {
        if (wrongClick) {
            // set timeout to reset status
            setTimeout(() => {
                setWrongClick(false);
            }, 300);
        }
    }, [wrongClick]);

    const nodeClickHandler = () => {
        props.onNodeClick(props.nodeInx);
        // dispatch({
        //     type: 'nodeClick',
        //     payload: {isValidMove: props.isValidMove, newStatus: props.isActive}
        // });

        if (props.status === "normal" && !props.isValidMove) {
            setWrongClick(true);
        }
    }

    return (
        <TutorialTip
            tutorialId={"practice_node"}
            isTutorial={showTutorial}
            isShowTip={false}
            onTutorialClose={props.onTutorialClose}
            placement="left">
            <NetworkNodeStyled
                status={props.status}
                fontSize={props.Radius}
                onClick={nodeClickHandler}
                wrongClick={wrongClick}
            >
                <circle cx={props.x} cy={props.y} r={props.Radius} key={"circle"}/>
                <text x={props.x} y={props.y + props.Radius * 0.35} textAnchor="middle" key={"state-name"}>
                    {props.Text}
                </text>
            </NetworkNodeStyled>
        </TutorialTip>
    );
};

// type nodeState = {
//     status: NetworkNodeStatus;
//
// }
//
// const nodeStateReducer = (state: nodeState, action: any) => {
//     switch (action.type) {
//         case 'nodeClick':
//             if (action.payload.isValidMove) {
//                 return {status: 'active' as NetworkNodeStatus};
//             }
//             if (!action.payload.isValidMove) {
//                 // do not change status if the node is already active
//                 if (action.payload.isActive) {
//                     return {status: 'active' as NetworkNodeStatus};
//                 }
//                 return {status: 'invalid-click' as NetworkNodeStatus};
//             }
//             return state;
//         case 'resetStatus':
//             if (action.payload.isActive) {
//                 return {status: 'active' as NetworkNodeStatus};
//             }
//             return {status: '' as NetworkNodeStatus};
//         default:
//             return state;
//     }
// }


export default NetworkNode;