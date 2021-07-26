import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import config from "./config";
import axios from "axios";

import Header from "./header";
import Steps from "./steps";
import Game from "./game/game";

import "./main.less";

import { createTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import purple from "@material-ui/core/colors/purple";
import teal from "@material-ui/core/colors/teal";

const theme = createTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: purple[500],
      shaded: purple[100],
    },
    secondary: {
      // This is green.A700 as hex.
      main: teal[500],
      shaded: teal[100],
    },
  },
});

function App() {
  const [game, setGame] = useState();
  const [solutions, setSolutions] = useState([]);
  const [environment, setEnvironment] = useState();
  const [stage, setStage] = useState("loading");

  useEffect(() => {
    async function fetchData() {
      const result = await axios(`${config.backend_url}/game/test`);

      console.log(result);

      if (result.userExist) {
        set_stage("userExists");
      } else {
        setGame(result.data.game);
        setEnvironment(result.data.environment);
        setSolutions(result.data.prevSolutions);
        setStage("intro");
      }
    }
    fetchData();
  }, []);

  const onRoundFinish = (solution) => {
    setSolutions([...solutions, solution]);
  };

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
    <ThemeProvider theme={theme}>
      <Header />
      <Steps />
      <Game
        solutions={solutions}
        environment={environment}
        onRoundFinish={onRoundFinish}
      />
    </ThemeProvider>

    // <div style={{ margin: "2em" }}>
    //   <p>{game}</p>
    //   <p>{solutions}</p>
    //   <p>{environment}</p>
    //   <p>{pervSolutions}</p>

    //   <p>
    //     Backend URL: <code>{config.backend_url}</code>
    //   </p>
    // </div>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
