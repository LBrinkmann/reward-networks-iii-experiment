import {animated, useSpring} from "react-spring";
import React from "react";

import NetworkEdgeStyled from "./NetworkEdge.styled";
import TutorialTip from "../../Tutorial/TutorialTip";

export type NetworkEdgeStyle = "normal" | "highlighted" | "animated" | "dashed";

export interface NetworkEdgeInterface {
    /** Annotation of the edge - reward to select this action */
    reward: number;
    /** Line style of the edge */
    edgeStyle: NetworkEdgeStyle;
    /** Line width of the edge, default = 5 */
    edgeWidth: number;
    /** index of the edge */
    idx: number;
    /** Curvation of the edge
     * the larger, the smaller curvature */
    edgeCurvation?: number;
    /** Show reward text */
    showRewardText?: boolean;
    arc_type: string;
    source_x: number;
    source_y: number;
    arc_x: number;
    arc_y: number;
    target_x: number;
    target_y: number;
    /** show tutorial tip */
    showTutorial?: boolean;
    /** Callback to handle tutorial tip close */
    onTutorialClose?: () => void;
    /** colors */
    color: string;
}

const NetworkEdge: React.FC<NetworkEdgeInterface> = props => {
    const {
        reward,
        edgeWidth = 1,
        edgeStyle = "normal",
        showRewardText = true,
        arc_type,
        source_x,
        source_y,
        arc_x,
        arc_y,
        target_x,
        target_y,
        showTutorial = false,
        color
    } = props;

    // Component indices
    const edgeId = `edge-${props.idx}`;
    const edgeBackgroundId = `edge-background-${props.idx}`;
    const markerId = `marker-arrow-${props.idx}`;
    const markerBackgroundId = `marker-arrow-background-${props.idx}`;
    const textId = `edge-text-${props.idx}`;
    const textIdBg = `edge-text-bg-${props.idx}`;

    // Draw path
    // SEE: https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths
    let d: string;
    if (arc_type == 'straight') {
        d = `M ${source_x} ${source_y} ${target_x} ${target_y}`;
    } else {
        d = `M ${source_x} ${source_y} Q ${arc_x} ${arc_y} ${target_x} ${target_y}`;
    }

    let strokeDasharray, springConfig = {};
    let edgeWidthFinal = edgeWidth;
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
            edgeWidthFinal = edgeWidth * 1.5;
            springConfig = {
                loop: true,
                from: {dashOffset: 0},
                dashOffset: source_x - target_x < 0 || source_y - target_y < 0 ? -100 : 100,
                delay: 0,
                config: {duration: 10000},
            };
            break;
        case "highlighted":
            edgeWidthFinal = edgeWidth * 2.5;
            strokeDasharray = null;
            springConfig = {};
    }

    const {dashOffset} = useSpring(springConfig);

    return (
        <>
            {/* Background for white color */}
            {(color === '#f7f7f7') && (
                <NetworkEdgeStyled color={'black'} strokeWidth={edgeWidthFinal + 0.5}>
                    <animated.path
                        strokeDashoffset={dashOffset ? dashOffset.to((x: number) => x) : 0}
                        className="colored-stroke"
                        id={edgeBackgroundId}
                        strokeDasharray={strokeDasharray ? strokeDasharray : null}
                        markerEnd={`url(#${markerBackgroundId})`}
                        markerUnits="userSpaceOnUse"
                        d={d}
                    />
                    {/* Marker ➤ */}
                    <marker id={markerBackgroundId} markerWidth="5" markerHeight="4" className="colored-fill"
                            refX="4" refY="2" orient="auto">
                        <polygon points="0.4 0, 5.3 2, 0.4 4"/>
                    </marker>
                </NetworkEdgeStyled>
            )}

            <TutorialTip
                tutorialId={"practice_edge"}
                isTutorial={showTutorial}
                isShowTip={false}
                onTutorialClose={props.onTutorialClose}
                placement="top">

                {/* Edge */}
                <NetworkEdgeStyled color={color} strokeWidth={edgeWidthFinal}>
                    <animated.path
                        strokeDashoffset={dashOffset ? dashOffset.to((x: number) => x) : 0}
                        className="colored-stroke"
                        id={edgeId}
                        strokeDasharray={strokeDasharray ? strokeDasharray : null}
                        markerEnd={`url(#${markerId})`}
                        markerUnits="userSpaceOnUse"
                        d={d}
                    />
                    {showRewardText ? (
                        <>
                            {/* Text text background */}
                            <text id={textIdBg} className="edge-text-bg edge-text">
                                <textPath alignmentBaseline="text-after-edge" xlinkHref={`#${edgeId}`}
                                          startOffset={'35%'}>
                                    <tspan dy={3}>{reward}</ tspan>
                                </textPath>
                            </text>
                            {/* Reward text */}
                            <text id={textId} className="edge-text colored-fill">
                                <textPath alignmentBaseline="text-after-edge" xlinkHref={`#${edgeId}`}
                                          startOffset={'35%'}>
                                    <tspan dy={3}>{reward}</ tspan>
                                </textPath>
                            </text>

                        </>) : null}
                    {/* Marker ➤ */}
                    <marker id={markerId} markerWidth="5" markerHeight="4" className="colored-fill"
                            refX="4" refY="2" orient="auto">
                        <polygon points="0 0, 5 2, 0 4"/>
                    </marker>

                </NetworkEdgeStyled>
            </TutorialTip>
        </>
    );
};

export default NetworkEdge;