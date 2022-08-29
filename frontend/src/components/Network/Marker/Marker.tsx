import React from "react";

interface MarkerInterface {
    orient: string;
    prefix: string;
    className: string;
    nodeSize: number;
    linkWidth: number;
    linkCurvation: number;
}

const Marker = ({
                    nodeSize,
                    orient,
                    prefix,
                    className,
                    linkWidth,
                    linkCurvation,
                }: MarkerInterface) => (
    <marker
        markerUnits="userSpaceOnUse"
        id={`${prefix}`}
        className={className}
        markerWidth={linkWidth * 10}
        markerHeight={linkWidth * 10}
        refX={linkCurvation != 0 ? nodeSize * 1.45 : nodeSize * 2.2}
        refY={linkCurvation != 0 ? (11 * nodeSize) / 40 : (32 * nodeSize) / 40}
        orient={orient}
    >
        <path className="colored-fill" d="M4,4 L4,22 L20,12 L4,4"/>
    </marker>
);

export default Marker;