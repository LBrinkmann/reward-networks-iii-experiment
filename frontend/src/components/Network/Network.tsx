import React from "react";

import {Action, Node} from "../../apiTypes";
import LinkMarker from "./LinkMarker";
import Links from "./Links";
import NetworkNode from "./NetworkNode";
import {scaleXY} from "./utils";

type Status = "starting" | "active" | "disabled" | "invalid-click" | "";

export interface ParsedNodeInterface extends Node {
    status: Status;
}

type LinkStyle = "normal" | "highlighted" | "animated" | "dashed";

export interface ParsedActionInterface extends Action {
    source: ParsedNodeInterface;
    target: ParsedNodeInterface;
    colorClass: string;
    annotation: string;
    linkStyle: LinkStyle;
}

export const actionTypeClasses = [
    "large-negative",
    "negative",
    "positive",
    "large-positive",
];

// // we need to define a link marker for each link color

export interface Size {
    width: number;
    height: number;
}

interface NetworkInterface {
    actions: ParsedActionInterface[];
    nodes: ParsedNodeInterface[];
    onNodeClick?: (nodeIdx: number) => void;
    version?: string;
    size?: Size;
    disabled?: boolean;
    nodeSize?: number;
    networkId?: string;
    linkCurvation?: number;
    linkWidth?: number;
}

const Network = ({
                     actions,
                     nodes,
                     onNodeClick = (nodeIdx) => null,
                     version = "",
                     size = {width: 550, height: 550},
                     nodeSize = 600 / 15,
                     disabled = false,
                     networkId = "default",
                     linkCurvation,
                     linkWidth = 5,
                 }: NetworkInterface) => {
    const effNodeSize = nodeSize ? nodeSize : ((size.height / 550) * 600) / 15;
    return (
        <svg
            className={`network-game ${version}`}
            width={size.width}
            height={size.height}
        >
            <LinkMarker
                size={size}
                networkId={networkId}
                nodeSize={effNodeSize}
                linkWidth={linkWidth}
                linkCurvation={linkCurvation}
            />
            <Links
                actions={actions}
                nodeSize={effNodeSize}
                size={size}
                networkId={networkId}
                linkWidth={linkWidth}
                linkCurvation={linkCurvation}
            />
            <g>
                {nodes.map((node, idx) => {
                    return (
                        <NetworkNode
                            {...scaleXY(node, size)}
                            nodeSize={effNodeSize}
                            onNodeClick={onNodeClick}
                            key={"point-" + idx}
                            networkId={networkId}
                        />
                    );
                })}
            </g>
        </svg>
    );
};

export default Network;