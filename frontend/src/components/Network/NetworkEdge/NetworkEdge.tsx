import {animated, useSpring} from "react-spring";
import React from "react";

import Marker from "../Marker";
import NetworkEdgeStyled from "./NetworkEdge.styled";


export interface NetworkEdgeInterface {
    /** Annotation of the edge - reward to select this action */
    reward: number;
    /** Source Network Node coordinates */
    source: { x: number, y: number };
    /** Target Network Node coordinates */
    target: { x: number, y: number };
    /** Line style of the edge */
    linkStyle?: "normal" | "highlighted" | "animated" | "dashed";
    /** Line width of the edge, default = 5 */
    edgeWidth: number;
    /** index of the edge */
    idx: number;
    /** Curvation of the edge */
    linkCurvation?: number;
    nodeSize: number;
}

const NetworkEdge = ({
                         reward,
                         source,
                         target,
                         edgeWidth = 5,
                         linkStyle = "normal",
                         idx,
                         linkCurvation = 2.5,
                         nodeSize
                     }: NetworkEdgeInterface) => {

    /** Color class of the edge based on the reward */
    let colorClass = '';
    if (reward < -100) {
        colorClass = 'large-negative';
    } else if (reward < 0) {
        colorClass = 'negative';
    } else if (reward < 50) {
        colorClass = 'positive';
    } else {
        colorClass = 'large-positive';
    }

    const edgeId = `edge-${idx}`;
    const markerIdStart = `marker-arrow-start-${idx}`;
    const markerIdEnd = `marker-arrow-end-${idx}`;
    const textId = `edge-text-${idx}`;
    const textIdBg = `edge-text-bg-${idx}`;

    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    let markerEnd, markerStart, textPositionX, textPositionShiftY, d;
    textPositionShiftY = 5;
    const dr = dist * linkCurvation;

    // drawing direction must be adjusted, to keep text upright
    if (dx >= 0) {
        markerEnd = `url(#${markerIdEnd})`;
        d = `M ${source.x} ${source.y} A ${dr} ${dr} 0 0 1 ${target.x} ${target.y}`;
        textPositionX = 80;
    } else {
        markerStart = `url(#${markerIdStart})`;
        d = `M ${target.x} ${target.y} A ${dr} ${dr} 0 0 0 ${source.x} ${source.y}`;
        textPositionX = dist * 0.9 - 80;
    }

    let strokeDasharray;
    let springConfig = {};

    switch (linkStyle) {
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
            <Marker
                key={markerIdEnd}
                orient="auto"
                markerId={markerIdEnd}
                className={'colored-fill'}
                nodeSize={nodeSize}
                edgeWidth={edgeWidth}
                linkCurvation={linkCurvation}
            />
            <Marker
                key={markerIdStart}
                orient="auto-start-reverse"
                markerId={`${markerIdStart}`}
                className={'colored-fill'}
                nodeSize={nodeSize}
                edgeWidth={edgeWidth}
                linkCurvation={linkCurvation}
            />
            <animated.path
                strokeDashoffset={dashOffset ? dashOffset.to((x: number) => x) : 0}
                className="colored-stroke"
                id={edgeId}
                strokeDasharray={strokeDasharray ? strokeDasharray : null}
                markerEnd={markerEnd}
                markerStart={markerStart}
                markerUnits="userSpaceOnUse"
                d={d}
            />
            <text
                id={textIdBg}
                className="network-edge-text-bg"
                x={textPositionX}
                dy={textPositionShiftY}
            >
                <textPath alignmentBaseline="text-after-edge" xlinkHref={`#${edgeId}`}>
                    {reward}
                </textPath>
            </text>
            <text
                id={textId}
                className="network-edge-text colored-fill"
                x={textPositionX}
                dy={textPositionShiftY}
            >
                <textPath alignmentBaseline="text-after-edge" xlinkHref={`#${edgeId}`}>
                    {reward}
                </textPath>
            </text>
        </NetworkEdgeStyled>
    );
};

export default NetworkEdge;