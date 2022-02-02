import React, { useState, useEffect } from "react";

import { Environment, EvaluatedAction, Node, Action } from "../../../apiTypes";
import { Button, Box } from "@mui/material";
import AnimatedNetwork from "../animated-network";

import _ from "lodash";

interface ReplayInterface {
  content: number[];
  environment: Environment;
}

const mapDelay = (array: any[], callback: any, delay: number) => {
  array.forEach((el, idx) => {
    setTimeout(() => callback(el), delay * (idx + 1));
  });
};

const Replay = ({ content, environment }: ReplayInterface) => {
  const [currentNodeIdx, setCurrentNodeIdx] = useState(
    environment.startingNodeIdx
  );
  const [move, setMove] = useState(0);

  const onMove = (actionIdx: number) => {
    const { sourceIdx, targetIdx } = environment.actions[actionIdx];
    setMove(move + 1);
    setCurrentNodeIdx(targetIdx);
  };

  const startAnimation = () => {
    setCurrentNodeIdx(environment.startingNodeIdx);
    mapDelay(content, onMove, 1000);
  };

  useEffect(() => {
    startAnimation();
  }, [content]);

  return (
    <>
      <Box sx={{ textAlign: "center" }}>
        <Button onClick={startAnimation}>Restart</Button>
      </Box>
      <AnimatedNetwork
        environment={environment}
        currentNodeIdx={currentNodeIdx}
        disabled={false}
        move={move}
        networkId={"replay"}
      ></AnimatedNetwork>
    </>
  );
};

export default Replay;
