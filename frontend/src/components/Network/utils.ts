import {ParsedNodeInterface, Size} from "./Network";

export const scaleXY = (
    node: ParsedNodeInterface,
    size: Size
): ParsedNodeInterface => ({
    ...node,
    x: node.x * size.width,
    y: node.y * size.height,
});