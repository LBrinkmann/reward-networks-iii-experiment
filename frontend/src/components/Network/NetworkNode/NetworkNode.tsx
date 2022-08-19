import React from "react";
import {ParsedNodeInterface} from "../Network";

interface NodeInterface extends ParsedNodeInterface {
    nodeSize: number;
    onNodeClick: (nodeIdx: number) => void;
    networkId: string;
}

const NetworkNode = ({
                         nodeIdx,
                         x,
                         y,
                         displayName,
                         nodeSize,
                         onNodeClick,
                         status,
                         networkId,
                     }: NodeInterface) => {
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