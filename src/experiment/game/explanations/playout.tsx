import React from "react";

import { Environment, EvaluatedAction, Node, Action } from "../../../apiTypes";
import { Typography, Box, Divider } from "@mui/material";
import { EvaluatedActions } from "../../experiment";
import { parseNode, parseAction } from "../animated-network";
import Network from "../network";

import _ from "lodash";

interface SinglePlayoutInterface {
  environment: Environment;
  evaluatedAction: EvaluatedAction;
}

const createNodes = (
  playout: number[],
  nodes: Node[],
  actions: Action[]
): Node[] => {
  const nodeNames = playout
    .map((actionIdx) => nodes[actions[actionIdx].sourceIdx].displayName)
    .concat(nodes[actions[playout[playout.length - 1]].targetIdx].displayName);

  return nodeNames.map((displayName, idx) => ({
    nodeIdx: idx,
    displayName,
    actionIdx: [],
    x: 0.1 + 0.1 * idx,
    y: 0.5,
    status: "",
  }));
};

const createActions = (
  playout: number[],
  nodes: Node[],
  actions: Action[]
): Action[] => {
  return _.chain(playout)
    .map((actionIdx, idx) => {
      const { actionTypeIdx } = actions[actionIdx];
      return {
        actionIdx: idx,
        actionTypeIdx,
        sourceIdx: idx,
        targetIdx: idx + 1,
      };
    })
    .value();
};

const SinglePlayout = ({
  environment,
  evaluatedAction,
}: SinglePlayoutInterface) => {
  const { playout } = evaluatedAction;

  const { nodes, actions } = environment;

  const vnodes = createNodes(playout, nodes, actions);
  const vactions = createActions(playout, nodes, actions);

  const parsedNodes = vnodes.map((node) =>
    parseNode({
      node,
      disabled: true,
    })
  );

  const parsedActions = vactions.map((action) =>
    parseAction({
      ...environment,
      action,
      disabled: true,
      nodes: parsedNodes,
    })
  );

  return (
    <Network
      actions={parsedActions}
      nodes={parsedNodes}
      size={{ height: 50, width: 500 }}
      nodeSize={15}
      networkId={`explanation-${evaluatedAction.actionIdx}`}
      linkCurvation={0}
      linkWidth={4}
    />
  );
};

interface PlayoutExplanationInterface {
  environment: Environment;
  evaluatedActions: EvaluatedActions;
}

const PlayoutExplanation = ({
  environment,
  evaluatedActions,
}: PlayoutExplanationInterface) => {
  return (
    <>
      {_.map(evaluatedActions, (evaluatedAction, idx) => (
        <Box sx={{ m: 3 }} key={`evaluated-action-${idx}`}>
          <Divider />
          <Typography sx={{ m: 1, textAlign: "center" }}>
            {evaluatedAction.advise}
          </Typography>
          <SinglePlayout
            key={"single-playout-" + idx}
            evaluatedAction={evaluatedAction}
            environment={environment}
          />
        </Box>
      ))}
    </>
  );
};

export default PlayoutExplanation;
