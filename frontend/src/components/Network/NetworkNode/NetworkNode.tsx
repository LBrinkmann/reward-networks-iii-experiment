import React, {useEffect, useState} from "react";

import NetworkNodeStyled from "./NetworkNode.styled";

export type NetworkNodeStatus = "starting" | "active" | "disabled" | "invalid-click" | "";

export interface NetworkNodeInterface {
    /** Node index, fetched from backend */
    node_num: number;
    /** Node displayed name, fetched from backend */
    display_name: string;
    /** Node size, fetched from backend */
    node_size: number;
    /** Node level (property of the task solution strategy),
     * fetched from backend */
    level?: number;
    /** Node x position, fetched from backend */
    x: number;
    /** Node y position, fetched from backend*/
    y: number;
    /** Callback to handle node click */
    onNodeClick: (nodeIdx: number) => void;
    isValidMove: boolean;
    isCurrentActiveNode: boolean;
}

const NetworkNode: React.FC<NetworkNodeInterface> = ({...props}: NetworkNodeInterface) => {
    const [status, setStatus] = useState<NetworkNodeStatus>(() => props.isCurrentActiveNode ? 'active' : '');

    useEffect(() => {
        if (status === "invalid-click") {
            setTimeout(() => {
                setStatus("");
            }, 300);
        } else if (status === "active" && !props.isCurrentActiveNode) {
            setStatus("");
        }
    }, [status, props.isCurrentActiveNode]);

    const onNodeClick = () => {
        props.onNodeClick(props.node_num);
        if (props.isValidMove) {
            setStatus("active");
        } else if (!props.isValidMove && !props.isCurrentActiveNode) {
            setStatus("invalid-click");
        }
    }

    return (
        <NetworkNodeStyled status={status} fontSize={props.node_size} onClick={onNodeClick}>
            <circle cx={props.x} cy={props.y} r={props.node_size} key={"circle"}/>
            <text x={props.x} y={props.y + props.node_size * 0.35} textAnchor="middle" key={"state-name"}>
                {props.display_name}
            </text>
        </NetworkNodeStyled>
    );
};

export default NetworkNode;