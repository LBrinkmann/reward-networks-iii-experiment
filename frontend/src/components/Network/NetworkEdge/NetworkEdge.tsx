import {animated, useSpring} from "react-spring";
import React from "react";

import NetworkEdgeStyled from "./NetworkEdge.styled";

export type NetworkEdgeStyle = "normal" | "highlighted" | "animated" | "dashed";

export interface NetworkEdgeInterface {
    /** Annotation of the edge - reward to select this action */
    reward: number;
    /** Source Network Node coordinates */
    source: { x: number, y: number };
    /** Target Network Node coordinates */
    target: { x: number, y: number };
    /** Line style of the edge */
    edgeStyle: NetworkEdgeStyle;
    /** Line width of the edge, default = 5 */
    edgeWidth: number;
    /** index of the edge */
    idx: number;
    nodeSize: number;
    /** Curvation of the edge
     * the larger, the smaller curvature */
    edgeCurvation?: number;
    /** Show reward text */
    showRewardText?: boolean;

}

const NetworkEdge: React.FC<NetworkEdgeInterface> = (
    {
        reward,
        source,
        target,
        edgeWidth = 1,
        edgeStyle = "normal",
        idx,
        edgeCurvation = 1,
        nodeSize = 20,
        showRewardText = true,
    }: NetworkEdgeInterface) => {

    // Color class of the edge based on the reward
    let colorClass: 'large-negative' | 'negative' | 'neutral' | 'positive' | 'large-positive';
    if (reward <= -100) {
        colorClass = 'large-negative';
    } else if (reward < 0) {
        colorClass = 'negative';
    } else if (reward == 0) {
        colorClass = 'neutral';
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
    // law of cosines
    const circleAngle = Math.acos((2 * arcR * arcR - dist * dist) / (2 * arcR * arcR))
    // Arc Length
    const arcL = arcR * circleAngle;

    // Draw path with arc
    // Draw the line in opposite direction when dx < 0 to keep text correctly rotated
    const sx = dx < 0 ? target.x : source.x;
    const sy = dx < 0 ? target.y : source.y;
    const tx = dx < 0 ? source.x : target.x;
    const ty = dx < 0 ? source.y : target.y;
    // SEE more about the sweep flag: https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths
    const sweepFlag = (tx - sx) >= 0 && (ty - sy) >= 0 ? 1 : 0;
    const d = `M ${sx} ${sy} A ${arcR} ${arcR} 0 0 ${sweepFlag} ${tx} ${ty}`;

    // Calculate percent of the path behind the node
    const nodePer = (nodeSize / arcL) * 100;
    // Calculate percent of the path behind the marker
    const arrowLengthPX = nodeSize < 20 ? nodeSize / 1.7 : 10;
    const markerPer = (arrowLengthPX / arcL) * 100;

    // Marker
    const markerPositionShiftY = nodeSize < 20 ? nodeSize / 3 : 6;
    const markerSymbol = dx < 0 ? '◄' : '►';  // ︎◄ U+25C4 and U+25BA ►
    const markerOffset = `${dx < 0 ? nodePer - markerPer / 2 : 100 - nodePer - markerPer}%`;

    // Text
    const textPositionShiftY = '0.5%';
    const textOffset = `${dx < 0 ? 100 - nodePer - 25 : nodePer + 10}%`;

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
        <NetworkEdgeStyled colorClass={colorClass} strokeWidth={edgeWidth} nodeSize={nodeSize}>
            <animated.path
                strokeDashoffset={dashOffset ? dashOffset.to((x: number) => x) : 0}
                className="colored-stroke"
                id={edgeId}
                strokeDasharray={strokeDasharray ? strokeDasharray : null}
                markerUnits="userSpaceOnUse"
                d={d}
            />
            {showRewardText ? (
                <>
                    {/* Text text background */}
                    <text id={textIdBg} className="edge-text-bg edge-text">
                        <textPath alignmentBaseline="text-after-edge" xlinkHref={`#${edgeId}`} startOffset={textOffset}>
                            <tspan dy={textPositionShiftY}>{reward}</ tspan>
                        </textPath>
                    </text>
                    {/* Reward text */}
                    <text id={textId} className="edge-text colored-fill">
                        <textPath alignmentBaseline="text-after-edge" xlinkHref={`#${edgeId}`} startOffset={textOffset}>
                            <tspan dy={textPositionShiftY}>{reward}</ tspan>
                        </textPath>
                    </text>

                </>) : null}
            {/* Marker ➤ */}
            <text id={markerId} className="edge-marker colored-fill" dy={markerPositionShiftY}>
                <textPath xlinkHref={`#${edgeId}`} startOffset={markerOffset}> {markerSymbol} </textPath>
            </text>

        </NetworkEdgeStyled>
    );
};

export default NetworkEdge;