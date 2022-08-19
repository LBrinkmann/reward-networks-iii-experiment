import Link from "../Link";
import React from "react";
import {ParsedActionInterface, Size} from "../Network";
import {scaleXY} from "../utils";


interface LinksInterface {
    actions: ParsedActionInterface[];
    nodeSize: number;
    size: Size;
    linkWidth: number;
    networkId: string;
    linkCurvation?: number;
}

export const Links = ({
                          actions,
                          nodeSize,
                          linkWidth,
                          size,
                          networkId,
                          linkCurvation,
                      }: LinksInterface) => (
    <>
        <g>
            {actions.map((action, idx) => {
                const {actionIdx, source, target} = action;

                return (
                    <Link
                        {...action}
                        source={scaleXY(source, size)}
                        target={scaleXY(target, size)}
                        nodeSize={nodeSize}
                        width={linkWidth}
                        linkCurvation={linkCurvation}
                        key={"link-" + actionIdx}
                        networkId={networkId}
                    />
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