import React from "react";

import { Environment, Explanation, Table } from "../../apiTypes";
import { EvaluatedActions } from "../experiment";
import { Typography, Box, Divider } from "@mui/material";

import PlayoutExplanation from "./explanations/playout";
import TableExplanation from "./explanations/table";
import ReplayInterface from "./explanations/replay";

import _ from "lodash";

interface ExpRewardExplanationInterface {
  evaluatedActions: EvaluatedActions;
  environment: Environment;
}

const ExpRewardExplanationComponent = ({
  evaluatedActions,
  environment,
}: ExpRewardExplanationInterface) => {
  const { actions, nodes } = environment;
  return (
    <>
      {_.map(evaluatedActions, (evaluatedAction, idx) => (
        <Box sx={{ m: 3 }} key={`evaluated-action-${idx}`}>
          <Divider />
          <Typography variant="h3" sx={{ m: 1, textAlign: "center" }}>
            from node{" "}
            {nodes[actions[evaluatedAction.actionIdx].sourceIdx].displayName} to{" "}
            {nodes[actions[evaluatedAction.actionIdx].targetIdx].displayName}
          </Typography>
          <Typography variant="h5" sx={{ m: 1, textAlign: "center" }}>
            {evaluatedAction.advise}
          </Typography>
          <Typography variant="h5" sx={{ m: 1, textAlign: "center" }}>
            {"Expected reward " + evaluatedAction.expectedReward}
          </Typography>
        </Box>
      ))}
    </>
  );
};

interface TextExplanationInterface {
  content: string;
}

const TitleExplanationComponent = ({ content }: TextExplanationInterface) => {
  return (
    <Typography sx={{ m: 3 }} variant="h3">
      {content}
    </Typography>
  );
};

const TextExplanationComponent = ({ content }: TextExplanationInterface) => {
  return <Typography sx={{ m: 3 }}>{content}</Typography>;
};

interface ExplanationInterface extends Explanation {
  environment: Environment;
  evaluatedActions?: EvaluatedActions;
}

const ExplanationComponent = ({
  type,
  environment,
  content,
  evaluatedActions,
}: ExplanationInterface) => {
  switch (type) {
    case "text":
      return <TextExplanationComponent content={content as string} />;
    case "playout":
      return (
        <PlayoutExplanation
          environment={environment}
          evaluatedActions={evaluatedActions}
        />
      );
    case "table":
      return (
        <TableExplanation
          environment={environment}
          evaluatedActions={evaluatedActions}
          table={content as Table}
        />
      );
    case "title":
      return <TitleExplanationComponent content={content as string} />;
    case "replay":
      return (
        <ReplayInterface
          content={content as number[]}
          environment={environment}
        />
      );
    case "expectedReward":
      return (
        <ExpRewardExplanationComponent
          evaluatedActions={evaluatedActions}
          environment={environment}
        />
      );
    default:
      return null;
      break;
  }
};

export default ExplanationComponent;
