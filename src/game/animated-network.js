import React, { useEffect, useState } from "react";
import _ from "lodash";

import Network from "./network";
import { calculateScore, findAction, isSolutionValid } from "./utils";

const AnimatedNetwork = ({ environment, mode, onRoundFinish }) => {
  const { startingNodeId, requiredSolutionLength, nodes, actions } =
    environment;
  const [activeNodeId, setActiveNodeId] = useState(startingNodeId);
  const [invalidClickNodeId, setInvalidClickNodeId] = useState();
  const [score, setScore] = useState(0);
  const [stepsLeft, setStepsLeft] = useState(requiredSolutionLength);
  const [solution, setSolution] = useState([]);

  useEffect(() => {
    setStepsLeft(requiredSolutionLength - solution.length);
  }, [solution]);

  useEffect(() => {
    if (stepsLeft == 0) {
      onRoundFinish(solution);
    }
  }, [stepsLeft]);

  const onNodeClick = (targetId) => {
    const action = findAction(activeNodeId, targetId, actions);
    if (!action) {
      setInvalidClickNodeId(targetId);
      setTimeout(() => {
        setInvalidClickNodeId(null);
      }, 500);
      return;
    } else {
      if (solution.length < requiredSolutionLength) {
        setActiveNodeId(targetId);
        setSolution([...solution, action]);
      }
    }
  };

  return (
    <Network
      nodes={nodes}
      //   planningAnimationTargetNodeId={this.state.planningAnimationTargetNodeId}
      //   animationLink={this.state.animationLink}
      //   animationTarget={this.state.animationTarget}
      //   animationSource={this.state.animationSource}
      activeNodeId={activeNodeId}
      //   isDisabled={this.isPlanStage()}
      startingNodeId={startingNodeId}
      invalidClickNodeId={invalidClickNodeId}
      //   numberOfActionsTaken={this.state.numberOfActionsTaken}
      onNodeClick={(targetId) => onNodeClick(targetId)}
      actions={actions}
    />
  );
};

export default AnimatedNetwork;
