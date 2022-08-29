import React from "react";

interface MarkerInterface {
    orient: string;
    markerId: string;
    className: string;
    nodeSize: number;
    edgeWidth: number;
    linkCurvation: number;
}

const Marker = ({
                    nodeSize,
                    orient,
                    markerId,
                    className = 'colored-fill',
                    edgeWidth,
                    linkCurvation,
                }: MarkerInterface) => {

    const markerWidth = edgeWidth * 5;
    const markerHeight = edgeWidth * 5;

    const markerPoints = `0 0, ${markerWidth} ${markerHeight / 2}, 0 ${markerHeight}`

    // linkCurvation != 0 ? nodeSize * 1.45 : nodeSize * 2.2
    const refX = nodeSize + markerWidth;
    const refY = markerHeight / 2;

    return (
        <marker
            markerUnits="userSpaceOnUse"
            id={markerId}
            className={className}
            markerWidth={markerWidth}
            markerHeight={markerHeight}
            refX={refX}
            refY={refY}
            orient={orient}
        >
            <polygon points={markerPoints}/>
        </marker>
    )
};

export default Marker;