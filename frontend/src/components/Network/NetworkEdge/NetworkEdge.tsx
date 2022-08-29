import {animated, useSpring} from "react-spring";
import React from "react";

// import "./NetworkEdge.less";
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
    width: number;
    /** index of the edge */
    idx: number;
    networkId: string;
    /** Curvation of the edge */
    linkCurvation?: number;
    nodeSize: number;
}

const NetworkEdge = ({
                         reward,
                         source,
                         target,
                         width = 5,
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


    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    let markerEnd, markerStart, textPositionX, textPositionShiftY, d;
    textPositionShiftY = 5;
    const dr = dist * linkCurvation;

    const markerStartPrefix = 'marker-arrow-start';
    const markerEndPrefix = 'marker-arrow-end';

    // drawing direction must be adjusted, to keep text upright
    if (dx >= 0) {
        markerEnd = `url(#${markerEndPrefix}-${colorClass})`;
        d = `M ${source.x} ${source.y} A ${dr} ${dr} 0 0 1 ${target.x} ${target.y}`;
        textPositionX = 80;
    } else {
        markerStart = `url(#${markerStartPrefix}-${colorClass})`;
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
            width *= 2.5;
            strokeDasharray = null;
            springConfig = {};
    }

    const {dashOffset} = useSpring(springConfig);

    return (
        <NetworkEdgeStyled colorClass={colorClass}>
            <Marker
                key={"marker-auto-" + idx}
                orient="auto"
                prefix={`${markerEndPrefix}-${colorClass}`}
                className={'colored-fill'}
                nodeSize={nodeSize}
                linkWidth={width}
                linkCurvation={linkCurvation}
            />
            <Marker
                key={"marker-auto-start-reverse-" + idx}
                orient="auto-start-reverse"
                prefix={`${markerStartPrefix}-${colorClass}`}
                className={'colored-fill'}
                nodeSize={nodeSize}
                linkWidth={width}
                linkCurvation={linkCurvation}
            />
            <animated.path
                strokeDashoffset={dashOffset ? dashOffset.to((x: number) => x) : 0}
                className="colored-stroke"
                style={{strokeWidth: width}}
                id={`link-${idx}`}
                strokeDasharray={strokeDasharray ? strokeDasharray : null}
                markerEnd={markerEnd}
                markerStart={markerStart}
                markerUnits="userSpaceOnUse"
                d={d}
            />
            <text
                id={`link-text-bg-${idx}`}
                className="network-edge-text-bg"
                x={textPositionX}
                dy={textPositionShiftY}
            >
                <textPath
                    alignmentBaseline="text-after-edge"
                    xlinkHref={`#link-${idx}`}
                >
                    {reward}
                </textPath>
            </text>
            <text
                id={`link-text-${idx}`}
                className="network-edge-text colored-fill"
                x={textPositionX}
                dy={textPositionShiftY}
            >
                <textPath
                    alignmentBaseline="text-after-edge"
                    xlinkHref={`#link-${idx}`}
                >
                    {reward}
                </textPath>
            </text>
        </NetworkEdgeStyled>
    );
};

export default NetworkEdge;