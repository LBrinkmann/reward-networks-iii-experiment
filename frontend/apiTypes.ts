/* tslint:disable */
/* eslint-disable */
/**
/* This file was automatically generated from pydantic models by running pydantic2ts.
/* Do not modify it by hand - just update the pydantic models and then re-run the script
*/

export interface Advise {
  _id?: string;
  createdAt?: string;
  adviseId?: string;
  environmentId: string;
  move: number;
  nodeIdx: number;
  userId: string;
  gameId: string;
  actions: EvaluatedAction[];
}
export interface EvaluatedAction {
  actionIdx: number;
  advise: "not_recommended" | "indifferent" | "recommended";
  expectedReward?: number;
  playout?: number[];
  move: number;
}
export interface AdviseRequest {
  environmentId: string;
  move: number;
  nodeIdx: number;
  userId: string;
  gameId: string;
  advisor: string;
  playout: boolean;
  totalReward: number;
  phase: string;
}
export interface Environment {
  environmentId: string;
  startingNodeIdx: number;
  nodes: Node[];
  actions: Action[];
  actionTypes: ActionType[];
  nMoves: number;
  maxReward: number;
}
export interface Node {
  nodeIdx: number;
  displayName: string;
  x: number;
  y: number;
  actionIdx: number[];
}
export interface Action {
  actionIdx: number;
  sourceIdx: number;
  targetIdx: number;
  actionTypeIdx: number;
}
export interface ActionType {
  actionTypeIdx: number;
  reward: number;
}
export interface Experiment {
  _id?: string;
  createdAt?: string;
  experimentId?: string;
  experimentName?: string;
  treatments?: {
    [k: string]: Treatment;
  };
  nChainsPerTreatment?: number;
  nGamesPerChain?: number;
  nStepsPerPhase?: number;
  qTablePath?: string;
  environmentsPath?: string;
  active?: boolean;
}
export interface Treatment {
  name?: string;
  playout?: boolean;
  explanationType?: "table" | "rule" | "replay" | "playout" | "expectedReward";
  advisor: "human" | "qtable";
}
export interface Explanation {
  type: "table" | "text" | "playout" | "expectedReward" | "placeholder" | "replay" | "title";
  content?: Table | string | number[];
}
export interface Table {
  columns: string[];
  index: string[];
  columnName: string;
  indexName: string;
  data: number[][];
}
export interface Game {
  _id?: string;
  createdAt?: string;
  gameId?: string;
  experimentId: string;
  treatmentName: string;
  generation: number;
  locked: boolean;
  childId?: string;
  chainId: string;
  userId?: string;
  started?: string;
  finished?: string;
  environmentIds: string[];
  totalPoints?: number;
}
export interface State {
  environment?: Environment;
  explanations?: Explanation[];
  step: Step;
  game: Game;
  user: User;
  treatment: Treatment;
  steps: StepPreview[];
}
export interface Step {
  _id?: string;
  createdAt?: string;
  stepId?: string;
  phase: string;
  phaseStep: number;
  gameId: string;
  stepIdx: number;
  finishedAt?: string;
  current?: boolean;
  trailIdx?: number;
  environmentId?: string;
  stages?: Stage[];
}
export interface Stage {
  stageIdx: number;
  stageName: string;
  timeout?: number;
}
export interface User {
  _id?: string;
  createdAt?: string;
  userId?: string;
  experimentId: string;
  prolificId: string;
}
export interface StepPreview {
  stepId: string;
  phase: string;
  phaseStep: number;
}
export interface StateUpdate {
  environment?: Environment;
  explanations?: Explanation[];
  step: Step;
  game: Game;
}
export interface StepResult {
  _id?: string;
  createdAt?: string;
  stepResultId?: string;
  stepId: string;
  points?: number;
  solution?: Solution;
  explanation?: HumanExplanation;
}
export interface Solution {
  _id?: string;
  createdAt?: string;
  solutionId?: string;
  environmentId: string;
  stepId: string;
  actions: Action[];
}
export interface HumanExplanation {
  _id?: string;
  createdAt?: string;
  explanationId?: string;
  userId: string;
  gameId: string;
  type: "text";
  content: string;
}
