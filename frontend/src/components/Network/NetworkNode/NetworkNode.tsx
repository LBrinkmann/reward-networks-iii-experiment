import React, {useEffect, useState} from "react";

import NetworkNodeStyled from "./NetworkNode.styled";

export type NetworkNodeStatus = "starting" | "active" | "disabled" | "invalid-click" | "";

export interface NetworkNodeInterface {
    /** Node index */
    nodeInx: number;
    /** Text inside the node */
    Text: string;
    /** Node size, fetched from backend */
    Size: number;
    /** Node x position */
    x: number;
    /** Node y position */
    y: number;
    /** Callback to handle node click */
    onNodeClick: (nodeIdx: number) => void;
    isValidMove: boolean;
    isActive: boolean;
}

const NetworkNode: React.FC<NetworkNodeInterface> = ({...props}: NetworkNodeInterface) => {
    const [status, setStatus] = useState<NetworkNodeStatus>(() => props.isActive ? 'active' : '');

    useEffect(() => {
        if (status === "invalid-click") {
            setTimeout(() => {
                setStatus("");
            }, 300);
        } else if (status === "active" && !props.isActive) { // override status with the props value
            setStatus("");
        } else if (props.isActive)
        {
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
        <NetworkNodeStyled status={status} fontSize={props.Size} onClick={onNodeClick}>
            <circle cx={props.x} cy={props.y} r={props.Size} key={"circle"}/>
            <text x={props.x} y={props.y + props.Size * 0.35} textAnchor="middle" key={"state-name"}>
                {props.Text}
            </text>
        </NetworkNodeStyled>
    );
};

export default NetworkNode;