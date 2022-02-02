import * as React from "react";
import { useSpring, animated } from "react-spring";

import _ from "lodash";

import {
  ParsedActionInterface,
  ParsedNodeInterface,
  actionTypeClasses,
} from "./animated-network";

interface NodeInterface extends ParsedNodeInterface {
  nodeSize: number;
  onNodeClick: (nodeIdx: number) => void;
  networkId: string;
}

const NodeComponent = ({
  nodeIdx,
  x,
  y,
  displayName,
  nodeSize,
  onNodeClick,
  status,
  networkId,
}: NodeInterface) => {
  return (
    <g
      className={"node"}
      style={{ cursor: status != "disabled" && "pointer" }}
      onClick={() => onNodeClick(nodeIdx)}
    >
      <circle cx={x} cy={y} r={nodeSize} className={status} key={"circle"} />
      <text
        x={x}
        y={y + nodeSize * 0.35}
        textAnchor="middle"
        style={{ fontSize: nodeSize }}
        key={"state-name"}
      >
        {displayName}
      </text>
    </g>
  );
};

interface LinkInterface extends ParsedActionInterface {
  width: number;
  nodeSize: number;
  networkId: string;
  linkCurvation?: number;
}

const Link = ({
  actionIdx,
  colorClass,
  annotation,
  source,
  target,
  width,
  linkStyle,
  nodeSize,
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
        from: { dashOffset: 0 },
        dashOffset: dx >= 0 ? -100 : 100,
        delay: 0,
        config: { duration: 10000 },
      };
      break;
    case "highlighted":
      width *= 2.5;
      strokeDasharray = null;
      springConfig = {};
    default:
      break;
  }

  const { dashOffset } = useSpring(springConfig);

  return (
    <g className={colorClass}>
      <animated.path
        strokeDashoffset={dashOffset ? dashOffset.to((x: number) => x) : 0}
        style={{ strokeWidth: width }}
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

// // we need to define a link marker for each link color

interface Size {
  width: number;
  height: number;
}

interface MarkerInterface {
  size: Size;
  orient: string;
  prefix: string;
  name: string;
  nodeSize: number;
  linkWidth: number;
  linkCurvation: number;
}

const Marker = ({
  nodeSize,
  size,
  orient,
  prefix,
  name,
  linkWidth,
  linkCurvation,
}: MarkerInterface) => (
  <marker
    markerUnits="userSpaceOnUse"
    id={`${prefix}-${name}`}
    className={name}
    markerWidth={linkWidth * 10}
    markerHeight={linkWidth * 10}
    refX={linkCurvation != 0 ? nodeSize * 1.45 : nodeSize * 2.2}
    refY={linkCurvation != 0 ? (11 * nodeSize) / 40 : (32 * nodeSize) / 40}
    orient={orient}
  >
    <path className="colored-fill" d="M4,4 L4,22 L20,12 L4,4" />
  </marker>
);

interface LinkMarkerInterface {
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
}: LinkMarkerInterface) => (
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

interface LinksInterface {
  actions: ParsedActionInterface[];
  nodeSize: number;
  size: Size;
  linkWidth: number;
  networkId: string;
  linkCurvation?: number;
}

const Links = ({
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
        const { actionIdx, source, target } = action;

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
      {actions.map(({ actionIdx, colorClass }, idx) => (
        <g className={colorClass} key={`use-text-${networkId}-${actionIdx}`}>
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

const scaleXY = (
  node: ParsedNodeInterface,
  size: Size
): ParsedNodeInterface => ({
  ...node,
  x: node.x * size.width,
  y: node.y * size.height,
});

interface NetworkInterface {
  actions: ParsedActionInterface[];
  nodes: ParsedNodeInterface[];
  onNodeClick?: (nodeIdx: number) => void;
  version?: string;
  size?: Size;
  disabled?: boolean;
  nodeSize?: number;
  networkId?: string;
  linkCurvation?: number;
  linkWidth?: number;
}

const NetworkComponent = ({
  actions,
  nodes,
  onNodeClick = (nodeIdx) => null,
  version = "",
  size = { width: 550, height: 550 },
  nodeSize = 600 / 15,
  disabled = false,
  networkId = "default",
  linkCurvation,
  linkWidth = 5,
}: NetworkInterface) => {
  return (
    <svg
      className={`network-game ${version}`}
      width={size.width}
      height={size.height}
    >
      <LinkMarker
        size={size}
        networkId={networkId}
        nodeSize={nodeSize}
        linkWidth={linkWidth}
        linkCurvation={linkCurvation}
      />
      <Links
        actions={actions}
        nodeSize={nodeSize}
        size={size}
        networkId={networkId}
        linkWidth={linkWidth}
        linkCurvation={linkCurvation}
      />
      <g>
        {nodes.map((node, idx) => {
          return (
            <NodeComponent
              {...scaleXY(node, size)}
              nodeSize={nodeSize}
              onNodeClick={onNodeClick}
              key={"point-" + idx}
              networkId={networkId}
            />
          );
        })}
      </g>
    </svg>
  );
};

export default NetworkComponent;
