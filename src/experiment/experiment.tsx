import React, { useEffect, useState } from "react";
import axios from "axios";

import { State, Action } from "../apiTypes";

import Header from "../header";
import Steps from "./steps";
import Game from "./game/game";

interface WrapperInterface {
  backendUrl: string;
  externalUserId: string;
}

const ExperimentAPIWrapper = ({
  backendUrl,
  externalUserId,
}: WrapperInterface) => {
  const [experimentState, setExperimentState] = useState(null as State);
  const fetchData = async () => {
    axios
      .request({
        url: `${backendUrl}/game/${externalUserId}`,
      })
      .then((response) => {
        setExperimentState(response.data);
        console.log(response.data);
      });
  };
  const onStepFinish = (actions?: Action[]): void => null;

  useEffect(() => {
    fetchData();
  }, []);

  return <Experiment {...experimentState} onStepFinish={onStepFinish} />;
};

interface ExperimentInterface extends State {
  onStepFinish: (actions?: Action[]) => void;
}

const Experiment = ({
  environment,
  explanations,
  step,
  user,
  game,
  treatment,
  steps = [],
  onStepFinish,
}: ExperimentInterface) => {
  return (
    <>
      <Header />
      <Steps step={step} steps={steps} />
      <Game
        environment={environment}
        explanations={explanations}
        onStepFinish={onStepFinish}
      />
    </>
  );
};

export default ExperimentAPIWrapper;
