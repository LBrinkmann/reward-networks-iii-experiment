import React from "react";

import { Explanation } from "../../apiTypes";

interface ExplanationInterface extends Explanation {}

interface TextExplanationInterface {
  content: string;
}

const TextExplanationComponent = ({ content }: TextExplanationInterface) => {
  return <div>{content}</div>;
};

const ExplanationComponent = ({ type, content }: ExplanationInterface) => {
  switch (type) {
    case "text":
      return <TextExplanationComponent content={content} />;
    default:
      break;
  }
};

export default ExplanationComponent;
