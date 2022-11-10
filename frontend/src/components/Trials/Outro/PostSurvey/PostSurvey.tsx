import React from "react"
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
import {forEach} from "lodash";

interface PostSurveyProps {
    onContinueHandler: () => void;
    requiredFields: boolean[];
}

interface OpenQuestionProps {
    id: number;
    question: string;
    isRequired: boolean;
    onChangeHandler: (event: React.ChangeEvent<HTMLInputElement>, id: number) => void;
    value: string;
}

const OpenQuestion: React.FC<OpenQuestionProps> = (props) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.onChangeHandler(event, props.id);
    }
    return (
        <Grid item xs={12}>
            <FormControl>
                <FormLabel id={`open-question-${props.id}`}>{props.question}</FormLabel>
                <TextField
                    id={props.id.toString()}
                    multiline
                    fullWidth
                    margin="normal"
                    rows={3}
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
    isRequired: boolean;
    onChangeHandler: (event: React.ChangeEvent<HTMLInputElement>, id: number) => void;
    value: string;
    maxValueExplanation: string;
    minValueExplanation: string;
}

const LikertQuestion: React.FC<LikertQuestionProps> = (props) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.onChangeHandler(event, props.id);
    }
    return (
        <FormControl fullWidth={true}>
            <FormLabel id={`likert-question-label-${props.id}`}>{props.question}</FormLabel>
            <Grid container direction="row" justifyContent={'center'} alignItems={'center'} spacing={2}>
                <Grid item>
                    <Typography fontWeight="lg" fontSize="sm" align={'center'}>
                        {props.minValueExplanation}
                    </Typography>
                </Grid>
                <Grid item>
                    <RadioGroup
                        row
                        id={`radio-group-${props.id}`}
                        value={props.value}
                        onChange={handleChange}
                    >
                        <FormControlLabel value="1" control={<Radio/>} label="1"/>
                        <FormControlLabel value="2" control={<Radio/>} label="2"/>
                        <FormControlLabel value="3" control={<Radio/>} label="3"/>
                        <FormControlLabel value="4" control={<Radio/>} label="4"/>
                        <FormControlLabel value="5" control={<Radio/>} label="5"/>
                        <FormControlLabel value="6" control={<Radio/>} label="6"/>
                    </RadioGroup>
                </Grid>
                <Grid item>
                    <Typography fontWeight="lg" fontSize="sm" align={'center'}>
                        {props.maxValueExplanation}
                    </Typography>
                </Grid>
            </Grid>
        </FormControl>

    )
}


export const PostSurvey: React.FC<PostSurveyProps> = (props: PostSurveyProps) => {
    const numberOfQuestions = 4;
    const [allQuestionsAnswered, setAllQuestionsAnswered] = React.useState<boolean>(false);
    const [questions, setQuestions] = React.useState<string[]>(forEach(new Array(numberOfQuestions), () => ""));

    const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
        const newQuestions = questions;
        newQuestions[id] = event.target.value;
        setQuestions(newQuestions);

        let allAnswered = true;
        forEach(newQuestions, (question, inx) => {
                if (!question && props.requiredFields[inx]) {
                    allAnswered = false;
                }
            }
        );
        setAllQuestionsAnswered(allAnswered);
    }

    return (
        <Grid sx={{flexGrow: 1, p: 5, margin: 'auto', width: '75%', maxWidth: 800,}}
              direction="column"
              container
              spacing={3}
        >
            <Grid item>
                <LikertQuestion
                    question={"How much did you enjoy the game?"}
                    id={0}
                    isRequired={props.requiredFields[0]}
                    value={questions[0]}
                    maxValueExplanation={"Very much"}
                    minValueExplanation={"Not at all"}
                    onChangeHandler={onChangeHandler}
                />
            </Grid>
            <Grid item>
                <LikertQuestion
                    question={"How much did you enjoy the game?"}
                    id={1}
                    isRequired={props.requiredFields[1]}
                    value={questions[1]}
                    maxValueExplanation={"Very much"}
                    minValueExplanation={"Not at all"}
                    onChangeHandler={onChangeHandler}
                />
            </Grid>
            <Grid item>
                <LikertQuestion
                    question={"How much did you enjoy the game?"}
                    id={2}
                    isRequired={props.requiredFields[2]}
                    value={questions[2]}
                    maxValueExplanation={"Very much"}
                    minValueExplanation={"Not at all"}
                    onChangeHandler={onChangeHandler}
                />
            </Grid>
            <Grid item>
                <OpenQuestion
                    question={"Hi"}
                    id={3}
                    isRequired={props.requiredFields[3]}
                    value={questions[3]}
                    onChangeHandler={onChangeHandler}
                />
            </Grid>
            <Grid item style={{textAlign: "center"}}>
                {allQuestionsAnswered ? (
                    <Button onClick={props.onContinueHandler} variant="contained"
                            color="primary">Continue</Button>

                ) : (
                    <Button variant="contained" color="primary" disabled>Continue</Button>
                )}
            </Grid>
        </Grid>
    )
}

export default PostSurvey;