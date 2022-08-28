import {animated, useSpring} from "react-spring";
import React from "react";

import "./NetworkEdge.less";


interface NetworkEdgeInterface {
    /** Annotation of the edge - reward to select this action */
    reward: number;
    /** Source Network Node coordinates */
    source: { x: number, y: number };
    /** Target Network Node coordinates */
    target: { x: number, y: number };
    /** Line style of the edge */
    linkStyle: "normal" | "highlighted" | "animated" | "dashed";
    /** Line width of the edge, default = 5 */
    width: number;
    actionIdx: number;
    networkId: string;
    /** Curvation of the edge */
    linkCurvation?: number;
}

const NetworkEdge = ({
                         reward,
                         source,
                         target,
                         width = 5,
                         linkStyle,
                         networkId,
                         actionIdx,
                         linkCurvation = 2.5,
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
    let markerEnd, markerStart, textx, d;
    const dr = dist * linkCurvation;

    // drawing direction must be adjusted, to keep text upright
    if (dx >= 0) {
        markerEnd = `url(#marker-arrow-end-${networkId}-${colorClass})`;
        d = `M ${source.x} ${source.y} A ${dr} ${dr} 0 0 1 ${target.x} ${target.y}`;
        textx = 80;
    } else {
        markerStart = `url(#marker-arrow-start-${networkId}-${colorClass})`;
        d = `M ${target.x} ${target.y} A ${dr} ${dr} 0 0 0 ${source.x} ${source.y}`;
        textx = dist * 0.9 - 80;
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
        <g className={`NetworkEdge ${colorClass}`}>
            <animated.path
                strokeDashoffset={dashOffset ? dashOffset.to((x: number) => x) : 0}
                style={{strokeWidth: width}}
                id={`link-${networkId}-${actionIdx}`}
                className="link colored-stroke"
                strokeDasharray={strokeDasharray ? strokeDasharray : null}
                markerEnd={markerEnd}
                markerStart={markerStart}
                markerUnits="userSpaceOnUse"
                d={d}
            />
            <text
                id={`link-text-bg-${networkId}-${actionIdx}`}
                className="NetworkEdge-text NetworkEdge-text-bg"
                x={textx}
                dy={5}
            >
                <textPath
                    alignmentBaseline="text-after-edge"
                    xlinkHref={`#link-${networkId}-${actionIdx}`}
                >
                    {reward}
                </textPath>
            </text>
            <text
                id={`link-text-${networkId}-${actionIdx}`}
                className="NetworkEdge-text colored-fill"
                x={textx}
                dy={5}
            >
                <textPath
                    alignmentBaseline="text-after-edge"
                    xlinkHref={`#link-${networkId}-${actionIdx}`}
                >
                    {reward}
                </textPath>
            </text>
        </g>
    );
};

export default NetworkEdge;