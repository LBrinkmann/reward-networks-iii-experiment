import React, {useEffect, useState} from "react";

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

    useEffect(() => {
        if (wrongClick) {
            // set timeout to reset status
            setTimeout(() => {
                setWrongClick(false);
            }, 400);
        }
    }, [wrongClick]);

    const nodeClickHandler = () => {
        props.onNodeClick(props.nodeInx);
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


export default NetworkNode;