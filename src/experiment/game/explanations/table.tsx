import React from "react";

import {
  Environment,
  EvaluatedAction,
  Table as TableType,
} from "../../../apiTypes";
import {
  Typography,
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { EvaluatedActions } from "../../experiment";

import _ from "lodash";

interface TableExplanationInterface {
  table: TableType;
  evaluatedActions: EvaluatedActions;
  environment: Environment;
}

const TableExplanation = ({
  table,
  evaluatedActions,
  environment,
}: TableExplanationInterface) => {
  const { columns, index, data } = table;
  const { actionTypes, actions } = environment;

  const keyedEvaluatedActions = _.chain(_.values(evaluatedActions))
    .map((ea) => ({ ...ea, ...actions[ea.actionIdx] }))
    .groupBy(({ move }) => move)
    .mapValues((a) => _.keyBy(a, ({ actionTypeIdx }) => actionTypeIdx))
    .value();

  const getCellStyle = (move: number, actionTypeIdx: number) => {
    const moveStr = move.toString();
    const actionTypeIdxStr = actionTypeIdx.toString();

    const evaluatedAction =
      keyedEvaluatedActions[moveStr] &&
      keyedEvaluatedActions[moveStr][actionTypeIdxStr]
        ? keyedEvaluatedActions[moveStr][actionTypeIdxStr]
        : null;
    const advise = evaluatedAction ? evaluatedAction.advise : null;

    let cellStyle = null;
    switch (advise) {
      case "recommended":
        cellStyle = { backgroundColor: "#3ecf00" };
        break;
      case "not_recommended":
        cellStyle = { backgroundColor: "#cf2200" };
        break;
      case "indifferent":
        cellStyle = { backgroundColor: "#cfad00" };
        break;
      default:
        cellStyle = {};
        break;
    }
    return cellStyle;
  };

  return (
    <TableContainer component={Paper} sx={{ m: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: "bold" }}>Move \ Reward</TableCell>
            {columns.map((actionTypeIdx, idx) => (
              <TableCell
                style={{ fontWeight: "bold" }}
                align="center"
                key={`header-${idx}`}
              >
                {actionTypes[idx].reward}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIdx) => (
            <TableRow key={`row-${rowIdx}`} style={{ height: 30 }}>
              <TableCell
                scope="row"
                style={{ fontWeight: "bold", padding: "0px 16px" }}
              >
                {index[rowIdx]}
              </TableCell>
              {row.map((el, colIdx) => (
                <TableCell
                  key={`row-${rowIdx}-${colIdx}`}
                  align="center"
                  style={{
                    ...(Math.max(...row) == el
                      ? { backgroundColor: "rgba(62, 207, 0, 0.3)" }
                      : {}),
                    ...getCellStyle(rowIdx, colIdx),
                    padding: "0px 16px",
                  }}
                >
                  {el.toPrecision(4)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableExplanation;
