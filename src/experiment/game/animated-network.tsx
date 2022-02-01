import React, { useEffect, useState } from "react";
import _ from "lodash";

import Network from "./network";
import { Environment, Action, ActionType, Node } from "../../apiTypes";
import { EvaluatedActions } from "../experiment";

export const actionTypeClasses = [
  "large-negative",
  "negative",
  "positive",
  "large-positive",
];

const resetGameState = (startingNodeIdx: number): GameState => ({
  activeSourceIdx: startingNodeIdx,
  activeTargetIdx: null,
  invalidIdx: null,
});

export const findAction = (
  sourceIdx: number,
  targetIdx: number,
  actions: Action[]
) => {
  return actions.find(
    (action) => action.sourceIdx === sourceIdx && action.targetIdx === targetIdx
  );
};

type LinkStyle = "normal" | "highlighted" | "animated" | "dashed";

export interface ParsedActionInterface extends Action {
  source: ParsedNodeInterface;
  target: ParsedNodeInterface;
  colorClass: string;
  annotation: string;
  linkStyle: LinkStyle;
}

export const parseAction = ({
  action,
  actionTypes,
  nodes,
  evaluatedActions,
  activeSourceIdx,
  activeTargetIdx,
  move,
}: {
  action: Action;
  actionTypes: ActionType[];
  nodes: ParsedNodeInterface[];
  evaluatedActions?: EvaluatedActions;
  activeSourceIdx?: number;
  activeTargetIdx?: number;
  move?: number;
  [x: string | number | symbol]: unknown;
}): ParsedActionInterface => {
  const { actionIdx, sourceIdx, targetIdx, actionTypeIdx } = action;
  const evaluatedAction = evaluatedActions ? evaluatedActions[actionIdx] : null;

  const advise =
    evaluatedAction && move !== undefined && move == evaluatedAction.move
      ? evaluatedAction.advise
      : null;

  let linkStyle = null as LinkStyle;
  switch (advise) {
    case "recommended":
      linkStyle = "animated";
      break;
    case "not_recommended":
      linkStyle = "normal";
      break;
    case "indifferent":
      linkStyle = "dashed";
      break;
    default:
      linkStyle =
        sourceIdx == activeSourceIdx && targetIdx == activeTargetIdx
          ? "highlighted"
          : "normal";
      break;
  }

  return {
    ...action,
    source: nodes[sourceIdx],
    target: nodes[targetIdx],
    colorClass: actionTypeClasses[actionTypeIdx],
    annotation: actionTypes[actionTypeIdx].reward.toString(),
    linkStyle,
  };
};

type Status = "starting" | "active" | "disabled" | "invalid-click" | "";

export interface ParsedNodeInterface extends Node {
  status: Status;
}

export const parseNode = ({
  node,
  activeSourceIdx,
  activeTargetIdx,
  invalidIdx,
  disabled,
}: {
  node: Node;
  activeSourceIdx?: number;
  activeTargetIdx?: number;
  invalidIdx?: number;
  disabled: boolean;
}): ParsedNodeInterface => {
  const nodeIdx = node.nodeIdx;
  let status = "" as Status;
  status = activeSourceIdx == nodeIdx ? "active" : status;
  status = invalidIdx == nodeIdx ? "invalid-click" : status;
  status = disabled ? "disabled" : status;
  return {
    ...node,
    status,
  };
};

interface GameState {
  activeSourceIdx: number;
  activeTargetIdx: number;
  invalidIdx: number;
}

interface AnimatedNetworkInterface {
  environment: Environment;
  evaluatedActions?: EvaluatedActions;
  onValidAction?: (action: Action) => void;
  disabled: boolean;
  currentNodeIdx?: number;
  move?: number;
  networkId?: string;
}

const AnimatedNetwork = ({
  environment,
  currentNodeIdx,
  onValidAction,
  disabled,
  evaluatedActions,
  move,
  networkId = "default",
}: AnimatedNetworkInterface) => {
  const { actions, nodes } = environment;
  const [animationState, setanimationState] = useState(
    resetGameState(currentNodeIdx)
  );

  useEffect(() => {
    if (animationState.activeSourceIdx != currentNodeIdx) {
      animateMove(currentNodeIdx);
    }
  }, [currentNodeIdx]);

  const animateMove = (targetIdx: number) => {
    setanimationState({ ...animationState, activeSourceIdx: targetIdx });
  };

  const animateInvalid = (nodeIdx: number) => {
    setanimationState({ ...animationState, invalidIdx: nodeIdx });
    setTimeout(() => {
      setanimationState({ ...animationState, invalidIdx: null });
    }, 500);
  };

  const onNodeClick = (nodeIdx: number) => {
    if (!disabled) {
      const action = findAction(currentNodeIdx, nodeIdx, actions);
      if (action) {
        onValidAction(action);
      } else {
        if (nodeIdx != currentNodeIdx) {
          animateInvalid(nodeIdx);
        }
      }
    }
  };

  const parsedNodes = nodes.map((node) =>
    parseNode({
      node,
      disabled,
      ...environment,
      ...animationState,
    })
  );

  const parsedActions = actions.map((action) =>
    parseAction({
      move,
      action,
      disabled,
      evaluatedActions,
      ...environment,
      ...animationState,
      nodes: parsedNodes,
    })
  );

  return (
    <Network
      networkId={networkId}
      actions={parsedActions}
      nodes={parsedNodes}
      onNodeClick={onNodeClick}
    />
  );
};

export default AnimatedNetwork;
