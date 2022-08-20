import React from "react";

import LinkMarker from "../LinkMarker";
import Links from "../Links";
import NetworkNode from "../NetworkNode";
import {NetworkNodeInterface} from "../NetworkNode/NetworkNode";

import "../../../main.less"
import {scaleXY} from "../Links/Links";

type colorClasses = "large-negative" | "negative" | "positive" | "large-positive";
type LinkStyle = "normal" | "highlighted" | "animated" | "dashed";

export interface Action {
    actionIdx: number;
    sourceIdx: number;
    targetIdx: number;
    actionTypeIdx: number;
    source: NetworkNodeInterface;
    target: NetworkNodeInterface;
    colorClass: colorClasses;
    annotation: string;
    linkStyle: LinkStyle;
}

export interface Size {
    width: number;
    height: number;
}

interface StaticNetworkInterface {
    actions: Action[];
    nodes: NetworkNodeInterface[];
    onNodeClick?: (nodeIdx: number) => void;
    version?: string;
    size?: Size;
    nodeSize?: number;
    networkId?: string;
    linkCurvation?: number;
    linkWidth?: number;
}

const StaticNetwork = ({
                     actions,
                     nodes,
                     onNodeClick = (nodeIdx) => null,
                     version = "",
                     size = {width: 550, height: 550},
                     nodeSize = 600 / 15,
                     networkId = "default",
                     linkCurvation,
                     linkWidth = 5,
                 }: StaticNetworkInterface) => {
    const effNodeSize = nodeSize ? nodeSize : ((size.height / 550) * 600) / 15;
    return (
        <svg
            className={`network-game ${version}`}
            width={size.width}
            height={size.height}
        >
            <LinkMarker
                networkId={networkId}
                nodeSize={effNodeSize}
                linkWidth={linkWidth}
                linkCurvation={linkCurvation}
            />
            <Links
                actions={actions}
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

export default StaticNetwork;