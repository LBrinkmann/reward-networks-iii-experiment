import {Marker} from "../Marker/Marker";
import React from "react";
import {actionTypeClasses, Size} from "../Network";

interface LinkMarker {
    size: Size;
    networkId: string;
    nodeSize: number;
    linkWidth: number;
    linkCurvation: number;
}

const LinkMarker = ({
                               networkId,
                               size,
                               nodeSize,
                               linkWidth,
                               linkCurvation,
                           }: LinkMarker) => (
    <defs>
        {[
            ...actionTypeClasses.map((name, idx) => (
                <Marker
                    key={"marker-" + idx}
                    orient="auto"
                    prefix={"marker-arrow-end" + "-" + networkId}
                    name={name}
                    size={size}
                    nodeSize={nodeSize}
                    linkWidth={linkWidth}
                    linkCurvation={linkCurvation}
                />
            )),
            ...actionTypeClasses.map((name, idx) => (
                <Marker
                    key={"marker-reverse" + idx}
                    orient="auto-start-reverse"
                    prefix={"marker-arrow-start" + "-" + networkId}
                    name={name}
                    size={size}
                    nodeSize={nodeSize}
                    linkWidth={linkWidth}
                    linkCurvation={linkCurvation}
                />
            )),
        ]}
    </defs>
);

export default LinkMarker;