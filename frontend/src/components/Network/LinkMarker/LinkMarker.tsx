import Marker from "../Marker";
import React from "react";

import "./LinkMarker.less";

export const colorClasses = [
    "large-negative",
    "negative",
    "positive",
    "large-positive",
];

interface LinkMarkerInterface {
    networkId: string;
    nodeSize: number;
    linkWidth: number;
    linkCurvation: number;
}

const LinkMarker = ({
                        networkId,
                        nodeSize,
                        linkWidth,
                        linkCurvation,
                    }: LinkMarkerInterface) => (
    <defs>
        {[
            ...colorClasses.map((name, idx) => (
                <Marker
                    key={"marker-" + idx}
                    orient="auto"
                    prefix={"marker-arrow-end" + "-" + networkId}
                    name={name}
                    nodeSize={nodeSize}
                    linkWidth={linkWidth}
                    linkCurvation={linkCurvation}
                />
            )),
            ...colorClasses.map((name, idx) => (
                <Marker
                    key={"marker-reverse" + idx}
                    orient="auto-start-reverse"
                    prefix={"marker-arrow-start" + "-" + networkId}
                    name={name}
                    nodeSize={nodeSize}
                    linkWidth={linkWidth}
                    linkCurvation={linkCurvation}
                />
            )),
        ]}
    </defs>
);

export default LinkMarker;