import React from "react";

import "./NetworkNode.less";

type Status = "starting" | "active" | "disabled" | "invalid-click" | "";

interface NetworkNodeInterface {
    nodeIdx: number;
    displayName: string;
    x: number;
    y: number;
    actionIdx: number[];
    nodeSize: number;
    onNodeClick: (nodeIdx: number) => void;
    networkId: string;
    status: Status;
}

const NetworkNode = ({
                         nodeIdx,
                         x,
                         y,
                         displayName,
                         nodeSize,
                         onNodeClick,
                         status,
                     }: NetworkNodeInterface) => {
    return (
        <g
            className={"node"}
            style={{cursor: status != "disabled" && "pointer"}}
            onClick={() => onNodeClick(nodeIdx)}
        >
            <circle cx={x} cy={y} r={nodeSize} className={status}
                    key={"circle"}/>
            <text
                x={x}
                y={y + nodeSize * 0.35}
                textAnchor="middle"
                style={{fontSize: nodeSize}}
                key={"state-name"}
            >
                {displayName}
            </text>
        </g>
    );
};

export default NetworkNode;