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

interface PostSurveyProps {
    onContinueHandler: (moves: number[],
                        selectedAdvisorId: string,
                        writtenStrategy: string,
                        postSurveyAnswers: object) => void;
    requiredFields?: boolean[];
}

export const PostSurvey: React.FC<PostSurveyProps> = (props: PostSurveyProps) => {
    const {requiredFields = [true, true, true, true, true, false]} = props;
    const numberOfQuestions = requiredFields.length;
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
            if (requiredFields[index] && !q) {
                allAnswered = false;
            }
        }
        setAllQuestionsAnswered(allAnswered);
    }

    const onContinueHandler = () => {
        if (allQuestionsAnswered) {
            // const answersObject = answers.map((answer, ind) => { return {ind: answer} });
            props.onContinueHandler([], '', '', { ...answers});
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
                <OpenQuestion
                    question={"Which strategies did you use to solve the task, if any?"}
                    id={0}
                    isRequired={requiredFields[0]}
                    value={answers[0]}
                    showErrorMessage={showError}
                    onChangeHandler={onChangeHandler}
                />
            </Grid>
            <Grid item>
                <LikertQuestion
                    question={"How well was the task explained?"}
                    id={1}
                    isRequired={requiredFields[1]}
                    value={answers[1]}
                    showErrorMessage={showError}
                    minValueExplanation={"I felt lost at times"}
                    maxValueExplanation={"I always knew what to do"}
                    onChangeHandler={onChangeHandler}
                />
            </Grid>
            <Grid item>
                <LikertQuestion
                    question={"Please rate the difficulty of the task"}
                    id={2}
                    isRequired={requiredFields[2]}
                    value={answers[2]}
                    showErrorMessage={showError}
                    minValueExplanation={"very easy"}
                    maxValueExplanation={"very hard"}
                    onChangeHandler={onChangeHandler}
                />
            </Grid>
            <Grid item>
                <LikertQuestion
                    question={"Did you experience the time limit as sufficient to concentrate?"}
                    id={3}
                    isRequired={requiredFields[3]}
                    value={answers[3]}
                    showErrorMessage={showError}
                    minValueExplanation={"way too short"}
                    maxValueExplanation={"way too long"}
                    onChangeHandler={onChangeHandler}
                />
            </Grid>
            <Grid item>
                <LikertQuestion
                    question={"How hard was it to tell apart the colors for the different arrows?"}
                    id={4}
                    isRequired={requiredFields[4]}
                    value={answers[4]}
                    showErrorMessage={showError}
                    minValueExplanation={"very easy"}
                    maxValueExplanation={"very hard"}
                    onChangeHandler={onChangeHandler}
                />
            </Grid>
            <Grid item>
                <OpenQuestion
                    question={"Do you have any additional comments on the experiment you would like to share?"}
                    id={5}
                    isRequired={requiredFields[5]}
                    value={answers[5]}
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