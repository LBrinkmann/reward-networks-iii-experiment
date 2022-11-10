import React, {useState} from "react"
import {
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    Radio,
    RadioGroup,
    TextField,
    Typography
} from "@mui/material";

interface PostSurveyProps {
    onContinueHandler: () => void;
    requiredFields: boolean[];
}

interface OpenQuestionProps {
    id: number;
    question: string;
    isRequired: boolean;
    showErrorMessage?: boolean;
    onChangeHandler: (event: React.ChangeEvent<HTMLInputElement>, id: number) => void;
    value: string;
}

const OpenQuestion: React.FC<OpenQuestionProps> = (props) => {
    const {showErrorMessage = false} = props;
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.onChangeHandler(event, props.id);
    }
    return (

        <Grid item xs={12}>
            <FormControl fullWidth={true}>
                <FormLabel id={`open-question-${props.id}`}>
                    {props.question}
                    {props.isRequired && <span style={{color: "red"}}>{" * "}</span>}
                    {/* Only if the question is required and not answered */}
                    {(showErrorMessage && props.isRequired && !props.value) &&
                        <span style={{color: "red"}}>{"(Please answer this question)"}</span>}
                </FormLabel>
                <TextField
                    id={props.id.toString()}
                    multiline
                    fullWidth
                    margin="normal"
                    rows={2}
                    value={props.value}
                    onChange={handleChange}
                />
            </FormControl>
        </Grid>

    )
}

interface LikertQuestionProps {
    id: number;
    question: string;
    showErrorMessage?: boolean;
    isRequired: boolean;
    onChangeHandler: (event: React.ChangeEvent<HTMLInputElement>, id: number) => void;
    value: string;
    maxValueExplanation: string;
    minValueExplanation: string;
}

const LikertQuestion: React.FC<LikertQuestionProps> = (props) => {
    const {showErrorMessage = false} = props;
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.onChangeHandler(event, props.id);
    }
    return (

        <FormControl fullWidth={true}>
            <FormLabel
                id={`likert-question-label-${props.id}`}
                sx={{marginBottom: "30px"}}
            >
                {props.question}
                {props.isRequired && <span style={{color: "red"}}>{" * "}</span>}
                {/* Only if the question is required and not answered */}
                {(showErrorMessage && props.isRequired && !props.value) &&
                    <span style={{color: "red"}}>{"(Please answer this question)"}</span>}
            </FormLabel>
            <Grid container direction="row" justifyContent={'center'} alignItems={'center'} spacing={1}>
                <Grid item xs={2}>
                    <Typography fontWeight="lg" fontSize="sm" align={'center'}>
                        {props.minValueExplanation}
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <RadioGroup
                        row
                        id={`radio-group-${props.id}`}
                        value={props.value}
                        onChange={handleChange}
                    >
                        <FormControlLabel value="1" control={<Radio/>} label="1" labelPlacement={"bottom"}/>
                        <FormControlLabel value="2" control={<Radio/>} label="2" labelPlacement={"bottom"}/>
                        <FormControlLabel value="3" control={<Radio/>} label="3" labelPlacement={"bottom"}/>
                        <FormControlLabel value="4" control={<Radio/>} label="4" labelPlacement={"bottom"}/>
                        <FormControlLabel value="5" control={<Radio/>} label="5" labelPlacement={"bottom"}/>
                        <FormControlLabel value="6" control={<Radio/>} label="6" labelPlacement={"bottom"}/>
                    </RadioGroup>
                </Grid>
                <Grid item xs={2}>
                    <Typography fontWeight="lg" fontSize="sm" align={'center'}>
                        {props.maxValueExplanation}
                    </Typography>
                </Grid>
            </Grid>
        </FormControl>


    )
}


export const PostSurvey: React.FC<PostSurveyProps> = (props: PostSurveyProps) => {
    const numberOfQuestions = props.requiredFields.length;
    const initialAnswers = new Array(numberOfQuestions).fill("");
    const [allQuestionsAnswered, setAllQuestionsAnswered] = useState<boolean>(false);
    const [showError, setShowError] = useState<boolean>(false);
    const [answers, setAnswers] = useState<string[]>(initialAnswers);

    const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
        let newAnswers = [...answers];
        newAnswers[id] = event.target.value;
        setAnswers(newAnswers);
        checkAllRequiredQuestions(newAnswers);
    }

    const checkAllRequiredQuestions = (allQuestions: string[]) => {
        let allAnswered = true;
        for (let index = 0; index < allQuestions.length; ++index) {
            const q = allQuestions[index];
            if (props.requiredFields[index] && !q) {
                allAnswered = false;
            }
        }
        setAllQuestionsAnswered(allAnswered);
    }

    const onContinueHandler = () => {
        if (allQuestionsAnswered) {
            props.onContinueHandler();
        } else {
            setShowError(true);
        }
    }


    return (
        <Grid sx={{flexGrow: 1, p: 5, margin: 'auto', width: '75%', maxWidth: 1000,}}
              direction="column"
              container
              spacing={3}
        >
            <Grid item>
                <LikertQuestion
                    question={"Did you experience the time as sufficient to concentrate on each trial?"}
                    id={0}
                    isRequired={props.requiredFields[0]}
                    value={answers[0]}
                    showErrorMessage={showError}
                    maxValueExplanation={"Strongly disagree"}
                    minValueExplanation={"Strongly agree"}
                    onChangeHandler={onChangeHandler}
                />
            </Grid>
            <Grid item>
                <LikertQuestion
                    question={"Please rate the difficulty of the task?"}
                    id={1}
                    isRequired={props.requiredFields[1]}
                    value={answers[1]}
                    showErrorMessage={showError}
                    maxValueExplanation={"Very easy"}
                    minValueExplanation={"Very hard"}
                    onChangeHandler={onChangeHandler}
                />
            </Grid>
            <Grid item>
                <LikertQuestion
                    question={"How well was the task explained?"}
                    id={2}
                    isRequired={props.requiredFields[2]}
                    value={answers[2]}
                    showErrorMessage={showError}
                    maxValueExplanation={"I always knew what to do"}
                    minValueExplanation={"I felt lost by times"}
                    onChangeHandler={onChangeHandler}
                />
            </Grid>
            <Grid item>
                <OpenQuestion
                    question={"Did you follow a strategy while solving the task?"}
                    id={3}
                    isRequired={props.requiredFields[3]}
                    value={answers[3]}
                    showErrorMessage={showError}
                    onChangeHandler={onChangeHandler}
                />
            </Grid>
            <Grid item>
                <OpenQuestion
                    question={"Do you have any additional comments on the experiment?"}
                    id={4}
                    isRequired={props.requiredFields[4]}
                    value={answers[4]}
                    showErrorMessage={showError}
                    onChangeHandler={onChangeHandler}
                />
            </Grid>
            <Grid item style={{textAlign: "center"}}>
                <Button onClick={onContinueHandler} variant="contained" color="primary">Continue</Button>
            </Grid>
        </Grid>
    )
}

export default PostSurvey;