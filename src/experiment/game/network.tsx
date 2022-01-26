import * as React from "react";
import _ from "lodash";
import shortid from "shortid";
import { Node, Action, ActionType, Environment } from "../../apiTypes";

type Status = "starting" | "active" | "disabled" | "invalid-click" | "";

interface NodeInterface extends Node {
  size: number;
  status: Status;
  onNodeClick: (nodeIdx: number) => void;
}

const NodeComponent = ({
  nodeIdx,
  x,
  y,
  displayName,
  size,
  onNodeClick,
  status,
}: NodeInterface) => {
  return (
    <g
      className={"node"}
      style={{ cursor: status != "disabled" && "pointer" }}
      onClick={() => onNodeClick(nodeIdx)}
    >
      <circle cx={x} cy={y} r={size} className={status} key={"circle"} />
      <text
        x={x}
        y={y + size * 0.3}
        textAnchor="middle"
        style={{ fontSize: "30px" }}
        key={"state-name"}
      >
        {displayName}
      </text>
    </g>
  );
};

interface StyledActionType extends ActionType {
  className: string;
}

interface LinkInterface extends Action {
  highlighted: boolean;
  actionType: StyledActionType;
  width: number;
  source: Node;
  target: Node;
  nodeSize: number;
}

const Link = ({
  actionIdx,
  actionType,
  source,
  target,
  width,
  highlighted,
  nodeSize,
}: LinkInterface) => {
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  let markerEnd, markerStart, textx, d;
  const dr = dist * 2.5;

  // drawing direction must be adjusted, to keep text upright
  if (dx >= 0) {
    markerEnd = `url(#marker-arrow-end-${actionType.className})`;
    d = `M ${source.x} ${source.y} A ${dr} ${dr} 0 0 1 ${target.x} ${target.y}`;
    textx = 80;
  } else {
    markerStart = `url(#marker-arrow-start-${actionType.className})`;
    d = `M ${target.x} ${target.y} A ${dr} ${dr} 0 0 0 ${source.x} ${source.y}`;
    textx = dist * 0.9 - 80;
  }

  if (highlighted) {
    width *= 2.5;
  }

  return (
    <g className={actionType.className}>
      <path
        id={"link-" + actionIdx}
        className="link colored-stroke"
        style={{ strokeWidth: `${width}px` }}
        markerEnd={markerEnd}
        markerStart={markerStart}
        markerUnits="userSpaceOnUse"
        d={d}
      ></path>
      <text
        id={"link-text-bg-" + actionIdx}
        className="link-text link-text-bg"
        x={textx}
        dy={5}
      >
        <textPath
          alignmentBaseline="text-after-edge"
          xlinkHref={`#${actionIdx}`}
        >
          {actionType.reward}
        </textPath>
      </text>
      <text
        id={"link-text-" + actionIdx}
        className="link-text colored-fill"
        x={textx}
        dy={5}
      >
        <textPath
          alignmentBaseline="text-after-edge"
          xlinkHref={`#${actionIdx}`}
        >
          {actionType.reward}
        </textPath>
      </text>
    </g>
  );
};

// // we need to define a link marker for each link color

const actionTypeClasses = [
  "large-negative",
  "negative",
  "positive",
  "large-positive",
];

interface Size {
  width: number;
  height: number;
}

interface MarkerInterface {
  size: Size;
  orient: string;
  prefix: string;
  name: string;
}

const Marker = ({ size, orient, prefix, name }: MarkerInterface) => (
  <marker
    markerUnits="userSpaceOnUse"
    id={`${prefix}-${name}`}
    className={name}
    markerWidth="26"
    markerHeight="26"
    refX={size.width / 10.5}
    refY="11"
    orient={orient}
  >
    <path className="colored-fill" d="M4,4 L4,22 L20,12 L4,4" />
  </marker>
);

interface LinkMarkerInterface {
  size: Size;
}

const LinkMarker = ({ size }: LinkMarkerInterface) => (
  <defs>
    {[
      ...actionTypeClasses.map((name, idx) => (
        <Marker
          key={"marker-" + idx}
          orient="auto"
          prefix="marker-arrow-end"
          name={name}
          size={size}
        />
      )),
      ...actionTypeClasses.map((name, idx) => (
        <Marker
          key={"marker-reverse" + idx}
          orient="auto-start-reverse"
          prefix="marker-arrow-start"
          name={name}
          size={size}
        />
      )),
    ]}
  </defs>
);

interface LinksInterface {
  actions: Action[];
  nodes: Node[];
  actionTypes: StyledActionType[];
  activeSourceIdx: number;
  activeTargetIdx: number;
  nodeSize: number;
  linkWidth: number;
}

const Links = ({
  actions,
  nodes,
  actionTypes,
  activeSourceIdx,
  activeTargetIdx,
  nodeSize,
  linkWidth,
}: LinksInterface) => (
  <>
    <g>
      {actions.map((action, idx) => {
        const { actionIdx, sourceIdx, targetIdx, actionTypeIdx } = action;
        const highlighted =
          sourceIdx == activeSourceIdx && targetIdx == activeTargetIdx;
        return (
          <Link
            {...action}
            nodeSize={nodeSize}
            actionType={actionTypes[actionTypeIdx]}
            width={linkWidth}
            source={nodes[sourceIdx]}
            target={nodes[targetIdx]}
            highlighted={highlighted}
            key={"link-" + actionIdx}
          />
        );
      })}
    </g>
    {/* to bring the link describtion (rewards) to the front */}
    <g>
      {actions.map(({ actionIdx, actionTypeIdx }, idx) => (
        <g
          className={actionTypes[actionTypeIdx].className}
          key={"use-text-" + actionIdx}
        >
          <use
            className="link-text link-text-bg"
            xlinkHref={`#link-text-bg-${actionIdx}`}
          />
          <use
            className="link-text colored-fill"
            xlinkHref={`#link-text-${actionIdx}`}
          />
        </g>
      ))}
    </g>
  </>
);

const scaleXY = (nodes: Node[], size: Size) =>
  nodes.map((node) => ({
    ...node,
    x: node.x * size.width,
    y: node.y * size.height,
  }));

interface NetworkInterface extends Environment {
  activeSourceIdx: number;
  activeTargetIdx: number;
  invalidIdx: number;
  onNodeClick: (nodeIdx: number) => void;
  version?: string;
  size?: Size;
  disabled?: boolean;
  move: number;
}

const NetworkComponent = ({
  activeSourceIdx,
  activeTargetIdx,
  invalidIdx,
  actions,
  nodes,
  actionTypes,
  onNodeClick,
  version = "",
  size = { width: 600, height: 600 },
  disabled = false,
  move,
}: NetworkInterface) => {
  const nodeSize = size.width / 15;
  const scaledNodes = scaleXY(nodes, size);
  const styledActionTypes = actionTypes.map((at) => ({
    ...at,
    className: actionTypeClasses[at.actionTypeIdx],
  }));
  return (
    <svg
      className={`network-game ${version}`}
      width={size.height}
      height={size.height}
    >
      <LinkMarker size={size} />
      <Links
        activeSourceIdx={activeSourceIdx}
        activeTargetIdx={activeTargetIdx}
        actions={actions}
        nodes={scaledNodes}
        actionTypes={styledActionTypes}
        nodeSize={nodeSize}
        linkWidth={3}
      />
      <g>
        {scaledNodes.map((node, idx) => {
          // "starting" | "active" | "disabled" | "invalid-click";
          const nodeIdx = node.nodeIdx;
          let status = "" as Status;
          status =
            activeSourceIdx == nodeIdx
              ? move == 0
                ? "starting"
                : "active"
              : status;
          status = invalidIdx == nodeIdx ? "invalid-click" : status;
          status = disabled ? "disabled" : status;

          return (
            <NodeComponent
              {...node}
              status={status}
              size={nodeSize}
              onNodeClick={onNodeClick}
              key={"point-" + idx}
            />
          );
        })}
      </g>
    </svg>
  );
};

export default NetworkComponent;
