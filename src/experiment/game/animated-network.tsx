import React, { useEffect, useState } from "react";
import _ from "lodash";

import Network from "./network";
import { Environment, Action } from "../../apiTypes";

interface AnimatedNetworkInterface {
  environment: Environment;
  onStepFinish: (solution: Action[]) => void;
  disabled: boolean;
}

interface GameState {
  activeSourceIdx: number;
  activeTargetIdx: number;
  invalidIdx: number;
}

const resetGameState = (startingNodeIdx: number): GameState => ({
  activeSourceIdx: startingNodeIdx,
  activeTargetIdx: null,
  invalidIdx: null,
});

const AnimatedNetwork = ({
  environment,
  onStepFinish,
  disabled,
}: AnimatedNetworkInterface) => {
  const { startingNodeIdx, nMoves, nodes, actions, actionTypes } = environment;
  const [animationState, setanimationState] = useState(
    resetGameState(startingNodeIdx)
  );
  const [currentNodeIdx, setCurrentNodeIdx] = useState(startingNodeIdx);
  const [solution, setSolution] = useState([] as Action[]);
  const [move, setMove] = useState(0);
  const [totalReward, setTotalReward] = useState(0);

  useEffect(() => {
    setMove(solution.length);
  }, [solution]);

  useEffect(() => {
    if (nMoves == solution.length) {
      onStepFinish(solution);
    }
  }, [solution]);

  const animateMove = (action: Action) => {
    setanimationState({ ...animationState, activeSourceIdx: action.targetIdx });
  };

  const animateInvalid = (nodeIdx: number) => {
    setanimationState({ ...animationState, invalidIdx: nodeIdx });
    setTimeout(() => {
      setanimationState({ ...animationState, invalidIdx: null });
    }, 500);
  };

  const onNodeClick = (actionIdx: number) => {
    const action = actions[actionIdx];
    const isValid = actionIdx in nodes[currentNodeIdx].actionIdx;
    if (isValid) {
      if (solution.length < nMoves) {
        const reward = actionTypes[action.actionTypeIdx].reward;
        setCurrentNodeIdx(action.targetIdx);
        setSolution([...solution, action]);
        setTotalReward(totalReward + reward);
        animateMove(action);
      }
    } else {
      animateInvalid(action.targetIdx);
    }
  };

  return (
    <Network
      {...animationState}
      {...environment}
      onNodeClick={onNodeClick}
      move={move}
    />
  );
};

export default AnimatedNetwork;
