import React, { useState, useEffect } from "react";
import axios from "axios";

import { styled } from "@mui/material/styles";

import { Paper, Grid, Typography, Box, Divider } from "@mui/material";

import Network from "./animated-network";
import ExplanationComponent from "./explanation";
import Results from "./results";
import { Move, EvaluatedActions } from "../experiment";
import TutorialTip from "../../tutorial";

import { Environment, Action, Explanation, Stage } from "../../apiTypes";

const GameElement = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(0),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

// const StatsElement = styled(Paper)(({ theme }) => ({
//   ...theme.typography.body2,
//   padding: theme.spacing(2),
//   textAlign: "center",
//   color: theme.palette.text.secondary,
// }));

// const ExplanationElement = styled(Paper)(({ theme }) => ({
//   ...theme.typography.body2,
//   padding: theme.spacing(0),
//   // textAlign: "center",
//   color: theme.palette.text.secondary,
// }));

const StatsElement: React.FC = ({ children }) => {
  return (
    <Typography sx={{ p: 2 }} variant="h5">
      {children}
    </Typography>
  );
};

interface GameInterface {
  environment: Environment;
  explanations?: Explanation[];
  stage: Stage;
  showGame: boolean;
  showResults: boolean;
  gameActive: boolean;
  evaluatedActions: EvaluatedActions;
  onRequestAdvise: (move: Move) => void;
  onStageFinish: (
    stageIdx: number,
    actions?: Action[],
    points?: number
  ) => void;
  tutorialIdx?: number;
  onTutorialClose?: (tutorialIdx: number) => void;
}

const Game = ({
  environment,
  explanations,
  stage,
  showGame,
  showResults,
  gameActive,
  onStageFinish,
  evaluatedActions,
  onRequestAdvise,
  tutorialIdx,
  onTutorialClose,
}: GameInterface) => {
  const { startingNodeIdx, nMoves, nodes, actions, actionTypes } = environment;

  const [currentNodeIdx, setCurrentNodeIdx] = useState(startingNodeIdx);
  const [solution, setSolution] = useState([] as Action[]);
  const [move, setMove] = useState(0);
  const [totalReward, setTotalReward] = useState(0);

  const remainingMoves = nMoves - move;

  useEffect(() => {
    setCurrentNodeIdx(startingNodeIdx);
    setSolution([]);
    setMove(0);
    setTotalReward(0);
    onRequestAdvise({
      move: 0,
      nodeIdx: startingNodeIdx,
      totalReward: 0,
    });
  }, [environment]);

  useEffect(() => {}, [solution]);

  useEffect(() => {
    if (nMoves == solution.length) {
      onStageFinish(0, solution, totalReward);
    }
  }, [solution]);

  const onValidAction = (action: Action) => {
    if (solution.length < nMoves) {
      const reward = actionTypes[action.actionTypeIdx].reward;
      setTotalReward(totalReward + reward);
      setSolution([...solution, action]);
      setCurrentNodeIdx(action.targetIdx);
      if (move < nMoves - 1) {
        onRequestAdvise({
          move: move + 1,
          nodeIdx: action.targetIdx,
          totalReward: totalReward + reward,
        });
      }
      if (move < nMoves) {
        setMove(move + 1);
      }
    }
  };
  console.log(tutorialIdx);

  return (
    <div>
      <Grid container direction="row" spacing={2}>
        <Grid
          container
          item
          xs={2}
          direction="column"
          justifyContent="flex-start"
        >
          <GameElement sx={{ p: 1 }}>
            <StatsElement>Move {move}</StatsElement>
            <Divider />
            <StatsElement>Moves Remaining {remainingMoves}</StatsElement>
            <Divider />
            <StatsElement>Total Reward {totalReward}</StatsElement>
          </GameElement>
        </Grid>
        <Grid container item xs={5} direction="column">
          <Grid item>
            <GameElement>
              {showGame ? (
                <TutorialTip
                  idx={2}
                  tutorialIdx={tutorialIdx}
                  onTutorialClose={onTutorialClose}
                  placement={"right"}
                >
                  <Box>
                    <Network
                      move={move}
                      currentNodeIdx={currentNodeIdx}
                      environment={environment}
                      evaluatedActions={evaluatedActions}
                      onValidAction={onValidAction}
                      disabled={!gameActive}
                      size={{ width: 550, height: 550 }}
                    />
                  </Box>
                </TutorialTip>
              ) : showResults ? (
                <Results
                  totalReward={totalReward}
                  maxReward={environment.maxReward}
                  onAccept={() => onStageFinish(1)}
                />
              ) : null}
            </GameElement>
          </Grid>
        </Grid>
        <Grid container item xs={5} direction="column">
          <TutorialTip
            idx={3}
            tutorialIdx={tutorialIdx}
            onTutorialClose={onTutorialClose}
            placement={"left"}
          >
            <GameElement>
              {explanations
                ? explanations.map((explanation, idx) => (
                    <Grid key={"solution-grid-" + idx} item>
                      {/* <ExplanationElement> */}
                      <ExplanationComponent
                        {...explanation}
                        environment={environment}
                        evaluatedActions={evaluatedActions}
                      />
                      {/* </ExplanationElement> */}
                    </Grid>
                  ))
                : null}
            </GameElement>
          </TutorialTip>
        </Grid>
      </Grid>
    </div>
  );
};

export default Game;
