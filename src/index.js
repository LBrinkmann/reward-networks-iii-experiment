import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import config from "./config";
import axios from "axios";

function App() {
  const [game, set_game] = useState();
  const [solutions, set_solutions] = useState([]);
  const [environment, set_environment] = useState();
  const [pervSolutions, set_prev_solutions] = useState();
  const [stage, set_stage] = useState("loading");

  useEffect(() => {
    async function fetchData() {
      const result = await axios(`${config.backend_url}/game/test`);

      console.log(result);

      if (result.userExist) {
        set_stage("userExists");
      } else {
        set_game(result.game);
        set_solutions(result.solutions);
        set_environment(result.environment);
        set_prev_solutions(result.pervSolutions);
        set_stage("intro");
      }
    }
    fetchData();
  }, []);

  //   useEffect(async () => {
  //     if (solutions.length == 5) {
  //       const requestOptions = {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ solutions, game }),
  //       };
  //       const response = await fetch(
  //         `${config.backend_url}/solutions`,
  //         requestOptions
  //       );
  //       const data = await response.json();
  //       set_stage("outro");
  //     }
  //   }, [solutions]);

  return (
    <div style={{ margin: "2em" }}>
      <p>{game}</p>
      <p>{solutions}</p>
      <p>{environment}</p>
      <p>{pervSolutions}</p>

      <p>
        Backend URL: <code>{config.backend_url}</code>
      </p>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
