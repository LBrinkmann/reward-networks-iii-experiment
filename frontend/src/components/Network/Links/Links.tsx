import Link from "../Link";
import React from "react";
import {Size} from "../StaticNetwork/StaticNetwork";
import {NetworkNodeInterface} from "../NetworkNode/NetworkNode";

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


export const scaleXY = (
    node: NetworkNodeInterface,
    size: Size
): NetworkNodeInterface => ({
    ...node,
    x: node.x * size.width,
    y: node.y * size.height,
});

interface LinksInterface {
    actions: Action[];
    size: Size;
    linkWidth: number;
    networkId: string;
    linkCurvation?: number;
}

export const Links = ({
                          actions,
                          linkWidth,
                          size,
                          networkId,
                          linkCurvation,
                      }: LinksInterface) => (
    <>
        <g>
            {actions.map((action, idx) => {
                return (
                    <Link
                        annotation={action.annotation}
                        source={scaleXY(action.source, size)}
                        target={scaleXY(action.target, size)}
                        width={linkWidth}
                        linkCurvation={linkCurvation}
                        key={"link-" + action.actionIdx}
                        networkId={networkId}
                        actionIdx={action.actionIdx}
                        colorClass={action.colorClass}
                        linkStyle={action.linkStyle}/>
                );
            })}
        </g>
        {/* to bring the link describtion (rewards) to the front */}
        <g>
            {actions.map(({actionIdx, colorClass}, idx) => (
                <g className={colorClass}
                   key={`use-text-${networkId}-${actionIdx}`}>
                    <use
                        className="link-text link-text-bg"
                        xlinkHref={`#link-text-bg-${networkId}-${actionIdx}`}
                    />
                    <use
                        className="link-text colored-fill"
                        xlinkHref={`#link-text-${networkId}-${actionIdx}`}
                    />
                </g>
            ))}
        </g>
    </>
);

export default Links;