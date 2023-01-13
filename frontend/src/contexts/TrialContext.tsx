import {useQuery} from "react-query";
import {useContext} from "react";
import {ProlificIdContext} from "./ProlificIdContext";
import {getTrial} from "../apis/TrialAPI";

export const useTrial = () => {
    const prolificId = useContext(ProlificIdContext);

    return useQuery("trial", () => getTrial(prolificId))
}
