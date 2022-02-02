import React, { useEffect } from "react";
import { render } from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  useSearchParams,
} from "react-router-dom";
import { v4 as uuid4 } from "uuid";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { purple, teal } from "@mui/material/colors";

import Experiment from "./experiment/experiment";
import Admin from "./admin/admin";

import config from "./configLoader";

import "./main.less";

const theme = createTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: purple[500],
      // shaded: purple[100],
    },
    secondary: {
      // This is green.A700 as hex.
      main: teal[500],
      // shaded: teal[100],
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Outlet />
    </ThemeProvider>
  );
};

interface UserExperimentInterface {
  backendUrl: string;
}

const UserExperiment = (props: UserExperimentInterface) => {
  let [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    if (!searchParams.get("userId")) {
      setSearchParams({ ...searchParams, userId: uuid4() });
    }
  }, []);
  return <Experiment {...props} externalUserId={searchParams.get("userId")} />;
};

const rootElement = document.getElementById("root");

render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<UserExperiment {...config} />}>
        {/* <Route
          path="experiment"
          element={<UserExperiment {...config} />}
        ></Route>
        <Route path="admin" element={<Admin />} /> */}
      </Route>
    </Routes>
  </BrowserRouter>,
  rootElement
);
