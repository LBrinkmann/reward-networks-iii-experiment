/* tslint:disable */
/* eslint-disable */
/**
/* This file was automatically generated from pydantic models by running pydantic2ts.
/* Do not modify it by hand - just update the pydantic models and then re-run the script
*/

export interface ExtBaseModel {
  _id?: string;
  createdAt?: string;
}
export interface SnakeModel {}
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
