import React, {useEffect, useState} from "react";

import NetworkNodeStyled from "./NetworkNode.styled";
import TutorialTip from "../../Tutorial/TutorialTip";

export type NetworkNodeStatus = "starting" | "active" | "disabled" | "invalid-click" | "";

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
    isActive: boolean;
    /** show tutorial tip */
    showTutorial?: boolean;
    /** Callback to handle tutorial tip close */
    onTutorialClose?: () => void;
}

const NetworkNode: React.FC<NetworkNodeInterface> = props => {
    const {showTutorial = false} = props;
    const [status, setStatus] = useState<NetworkNodeStatus>(() => props.isActive ? 'active' : '');

    useEffect(() => {
        if (status === "invalid-click") {
            setTimeout(() => {
                setStatus("");
            }, 300);
        } else if (status === "active" && !props.isActive) { // override status with the props value
            setStatus("");
        } else if (props.isActive) {
            setStatus("active");
        }
    }, [status, props.isActive]);

    const onNodeClick = () => {
        props.onNodeClick(props.nodeInx);
        if (props.isValidMove) {
            setStatus("active");
        } else if (!props.isValidMove && !props.isActive) {
            setStatus("invalid-click");
        }
    }

    return (
        <TutorialTip
            tutorialId={"practice_node"}
            isTutorial={showTutorial}
            isShowTip={false}
            onTutorialClose={props.onTutorialClose}
            placement="left">
            <NetworkNodeStyled status={status} fontSize={props.Radius} onClick={onNodeClick}>
                <circle cx={props.x} cy={props.y} r={props.Radius} key={"circle"}/>
                <text x={props.x} y={props.y + props.Radius * 0.35} textAnchor="middle" key={"state-name"}>
                    {props.Text}
                </text>
            </NetworkNodeStyled>
        </TutorialTip>
    );
};

export default NetworkNode;