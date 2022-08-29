import React from "react";

import NetworkNodeStyled from "./NetworkNode.styled";

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
    /** Node action status */
    status: "starting" | "active" | "disabled" | "invalid-click";
}

const NetworkNode = ({
                         node_num,
                         x,
                         y,
                         display_name,
                         node_size,
                         onNodeClick,
                         status,
                     }: NetworkNodeInterface) => {
    return (
        <NetworkNodeStyled status={status} fontSize={node_size} onClick={() => onNodeClick(node_num)}>
            <circle cx={x} cy={y} r={node_size} key={"circle"}/>
            <text x={x} y={y + node_size * 0.35} textAnchor="middle" key={"state-name"}>
                {display_name}
            </text>
        </NetworkNodeStyled>
    );
};

export default NetworkNode;