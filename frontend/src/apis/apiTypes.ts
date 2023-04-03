/* tslint:disable */
/* eslint-disable */
/**
/* This file was automatically generated from pydantic models by running pydantic2ts.
/* Do not modify it by hand - just update the pydantic models and then re-run the script
*/

export interface Advisor {
  advisor_id: string;
  solution?: Solution;
  written_strategy?: string;
}
export interface Solution {
  moves: number[];
  score?: number;
  trial_id?: number;
  finished_at?: string;
  solution_type?: "myopic" | "loss";
}
export interface AdvisorSelection {
  advisor_ids: string[];
  scores: number[];
}
export interface Network {
  network_id: string;
  nodes: Node[];
  edges: Edge[];
  starting_node: number;
  max_reward?: number;
}
export interface Node {
  node_num: number;
  display_name: string;
  node_size: number;
  starting_node?: boolean;
  level: number;
  x: number;
  y: number;
}
export interface Edge {
  source_num: number;
  target_num: number;
  reward: number;
  arc_type: string;
  source_x: number;
  source_y: number;
  arc_x: number;
  arc_y: number;
  target_x: number;
  target_y: number;
}
export interface PostSurvey {
  questions: {
    [k: string]: string;
  };
  trial_id?: number;
  finished_at?: string;
}
export interface SessionError {
  message: string;
}
export interface Trial {
  id: number;
  trial_type:
    | "consent"
    | "instruction"
    | "practice"
    | "social_learning_selection"
    | "observation"
    | "repeat"
    | "try_yourself"
    | "individual"
    | "demonstration"
    | "written_strategy"
    | "post_survey"
    | "debriefing";
  instruction_type?:
    | "welcome"
    | "learning_selection"
    | "learning"
    | "individual"
    | "individual_start"
    | "demonstration"
    | "written_strategy"
    | "written_strategy_start";
  finished?: boolean;
  started_at?: string;
  finished_at?: string;
  network?: Network;
  solution?: Solution;
  advisor?: Advisor;
  advisor_selection?: AdvisorSelection;
  selected_by_children?: string[];
  written_strategy?: WrittenStrategy;
  post_survey?: PostSurvey;
  redirect_url?: string;
}
export interface WrittenStrategy {
  strategy: string;
  trial_id?: number;
  finished_at?: string;
}
export interface TrialError {
  message: "Trial type is not correct" | "Trial results are missing" | "Advisor session is not found";
}
export interface TrialSaved {
  message?: "Trial saved";
}
