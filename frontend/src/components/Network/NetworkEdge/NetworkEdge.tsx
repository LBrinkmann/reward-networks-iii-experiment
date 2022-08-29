import {animated, useSpring} from "react-spring";
import React from "react";

import NetworkEdgeStyled from "./NetworkEdge.styled";


export interface NetworkEdgeInterface {
    /** Annotation of the edge - reward to select this action */
    reward: number;
    /** Source Network Node coordinates */
    source: { x: number, y: number };
    /** Target Network Node coordinates */
    target: { x: number, y: number };
    /** Line style of the edge */
    edgeStyle?: "normal" | "highlighted" | "animated" | "dashed";
    /** Line width of the edge, default = 5 */
    edgeWidth: number;
    /** index of the edge */
    idx: number;
    /** Curvation of the edge
     * the larger, the smaller curvature */
    edgeCurvation?: number;
    nodeSize: number;
}

const NetworkEdge = ({
                         reward,
                         source,
                         target,
                         edgeWidth = 1,
                         edgeStyle = "normal",
                         idx,
                         edgeCurvation = 1,
                         nodeSize = 20
                     }: NetworkEdgeInterface) => {

    // Color class of the edge based on the reward
    let colorClass: 'large-negative' | 'negative' | 'positive' | 'large-positive';
    if (reward < -100) {
        colorClass = 'large-negative';
    } else if (reward < 0) {
        colorClass = 'negative';
    } else if (reward < 50) {
        colorClass = 'positive';
    } else {
        colorClass = 'large-positive';
    }

    // Component indices
    const edgeId = `edge-${idx}`;
    const markerId = `marker-arrow-${idx}`;
    const textId = `edge-text-${idx}`;
    const textIdBg = `edge-text-bg-${idx}`;

    // Calculate distance etc.
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const arcR = dist * edgeCurvation;

    // Draw path with arc
    // SEE more about the sweep flag: https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths
    const sweepFlag = dx >= 0 && dy >= 0 ? 1 : 0;
    const d = `M ${source.x} ${source.y} A ${arcR} ${arcR} 0 0 ${sweepFlag} ${target.x} ${target.y}`;

    // Marker
    const markerPositionShiftY = 6;
    const arrowLength = 12;
    const markerOffset = `${((arcR - (nodeSize + arrowLength)) / arcR) * 100}%`;

    // Text
    const textPositionShiftY = 3;
    const nodePer = (nodeSize / arcR) * 100;
    const textOffset = `${nodePer + 10}%`;

    // Text rotation
    const textRotation = dx < 0 ? 180 : 0;
    const rewardText = dx < 0 ? `${reward}`.split('').reverse().join('') : `${reward}`;

    let strokeDasharray, springConfig = {};
    switch (edgeStyle) {
        case "normal":
            strokeDasharray = null;
            springConfig = {};
            break;
        case "dashed":
            strokeDasharray = "4,4";
            springConfig = {};
            break;
        case "animated":
            strokeDasharray = "4,4";
            springConfig = {
                loop: true,
                from: {dashOffset: 0},
                dashOffset: dx >= 0 ? -100 : 100,
                delay: 0,
                config: {duration: 10000},
            };
            break;
        case "highlighted":
            edgeWidth *= 2.5;
            strokeDasharray = null;
            springConfig = {};
    }

    const {dashOffset} = useSpring(springConfig);

    return (
        <NetworkEdgeStyled colorClass={colorClass} strokeWidth={edgeWidth}>
            <animated.path
                strokeDashoffset={dashOffset ? dashOffset.to((x: number) => x) : 0}
                className="colored-stroke"
                id={edgeId}
                strokeDasharray={strokeDasharray ? strokeDasharray : null}
                markerUnits="userSpaceOnUse"
                d={d}
            />
            {/* Reward background */}
            <text id={textIdBg} className="edge-text-bg edge-text" dy={textPositionShiftY}>
                <textPath alignmentBaseline="text-after-edge" xlinkHref={`#${edgeId}`} startOffset={textOffset}>
                    <tspan rotate={textRotation}>{rewardText}</tspan>
                </textPath>
            </text>
            {/* Reward text */}
            <text id={textId} className="edge-text colored-fill" dy={textPositionShiftY}>
                <textPath alignmentBaseline="text-after-edge" xlinkHref={`#${edgeId}`} startOffset={textOffset}>
                    <tspan rotate={textRotation}>{rewardText}</tspan>
                </textPath>
            </text>
            {/* Marker ➤ */}
            <text id={markerId} className="edge-marker colored-fill" dy={markerPositionShiftY} >
                <textPath xlinkHref={`#${edgeId}`} startOffset={markerOffset}> {'➤'} </textPath>
            </text>

        </NetworkEdgeStyled>
    );
};

export default NetworkEdge;