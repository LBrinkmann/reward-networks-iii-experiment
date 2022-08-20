import {animated, useSpring} from "react-spring";
import React from "react";
import {NetworkNodeInterface} from "../NetworkNode/NetworkNode";

import "./Link.less";

type colorClasses = "large-negative" | "negative" | "positive" | "large-positive";
type LinkStyle = "normal" | "highlighted" | "animated" | "dashed";

interface LinkInterface {
    annotation: string;
    source: NetworkNodeInterface;
    target: NetworkNodeInterface;
    actionIdx: number;
    colorClass: colorClasses;
    width: number;
    networkId: string;
    linkCurvation?: number;
    linkStyle: LinkStyle;
}

const Link = ({
                  actionIdx,
                  colorClass,
                  annotation,
                  source,
                  target,
                  width,
                  linkStyle,
                  networkId,
                  linkCurvation = 2.5,
              }: LinkInterface) => {
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
    // let dashOffset;

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
        default:
            break;
    }

    const {dashOffset} = useSpring(springConfig);

    return (
        <g className={colorClass}>
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
            ></animated.path>
            <text
                id={`link-text-bg-${networkId}-${actionIdx}`}
                className="link-text link-text-bg"
                x={textx}
                dy={5}
            >
                <textPath
                    alignmentBaseline="text-after-edge"
                    xlinkHref={`#link-${networkId}-${actionIdx}`}
                >
                    {annotation}
                </textPath>
            </text>
            <text
                id={`link-text-${networkId}-${actionIdx}`}
                className="link-text colored-fill"
                x={textx}
                dy={5}
            >
                <textPath
                    alignmentBaseline="text-after-edge"
                    xlinkHref={`#link-${networkId}-${actionIdx}`}
                >
                    {annotation}
                </textPath>
            </text>
        </g>
    );
};

export default Link;