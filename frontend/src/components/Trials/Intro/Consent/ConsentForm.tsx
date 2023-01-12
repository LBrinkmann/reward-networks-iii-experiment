import React, {useState} from "react";
import {Button, Grid, Paper, Typography} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import Instruction from "../../Instruction";
import {ExperimentTrialsProps} from "../../ExperimentTrial";

interface ConsentFormProps extends ExperimentTrialsProps {
    /* Redirect URL */
    onDisagreeRedirect: string;
}


const ConsentForm: React.FC<ConsentFormProps> = (props: ConsentFormProps) => {
    const [isDisagree, setIsDisagree] = useState<boolean>(false);

    const onDisagree = () => {
        // clean local storage
        localStorage.clear();

        setIsDisagree(true);
    }

    const redirectToProlific = () => {
        // redirect to prolific
        window.open(props.onDisagreeRedirect, "_self");  // , "_blank" to open in a new tab
    };

    const renderDisagreePage = () => <Instruction instructionId={"consent_decline"} onClick={redirectToProlific}/>

    const renderConsent = () => {
        return (
            <>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <Paper
                            sx={{p: 5, margin: 'auto', width: '75%', maxWidth: 800, flexGrow: 1}}
                            style={{maxHeight: '80vh', overflow: 'auto', paddingTop: '20px'}}
                        >
                            <Typography variant="h4" gutterBottom align={'center'}>
                                Study Information and Statement of Informed Consent
                            </Typography>
                            <Typography component={'span'} align={'justify'}>
                                Thank you for your interest in participating in our “Reward Network” study. Please take
                                your
                                time to read this text carefully. If you have any questions, we are happy to answer them
                                (simply
                                contact us on Prolific). By clicking “I consent”, you agree that you have read the
                                information
                                presented and that you are willing to participate in the study.
                            </Typography>
                            <Typography component={'span'} align={'justify'}>
                                <Typography variant="h6" gutterBottom>
                                    1. Aim of the study
                                </Typography>
                                In the “Reward Network” study, we want to investigate how different “generations” of
                                problem
                                solvers will approach a strategic task and potentially improve on their payoff. Most of
                                the
                                players in the study are humans, but in some rare cases, they can also be robots. In the
                                beginning of the task, you might get the option to learn from previous solutions, and
                                your
                                own
                                solutions can be passed on to subsequent generations of human participants later.
                            </Typography>
                            <Typography component={'span'} align={'justify'}>
                                <Typography variant="h6" gutterBottom>
                                    2. Procedure and content of the study
                                </Typography>
                                To do this, we will ask you to observe different networks and traverse through them by
                                clicking
                                on adjacent nodes, associated with positive or negative rewards.
                            </Typography>
                            <Typography component={'span'} align={'justify'}>
                                <Typography variant="h6" gutterBottom>
                                    3. Are there any risks involved?
                                </Typography>
                                There are no risks involved and no sensitive data will be collected.
                            </Typography>
                            <Typography component={'span'} align={'justify'}>
                                <Typography variant="h6" gutterBottom>
                                    4. What will happen to the information and data
                                    collected?
                                </Typography>
                                This study is a research project of the Max Planck Institute (MPI) for Human
                                Development.
                                The
                                data collected will be used for research purposes only.
                                Your Prolific ID will be stored separately from the study data. The study data will be
                                stored
                                under an individual code number so that it cannot be linked to you during the analysis.
                                The
                                code
                                number is stored on a separate code list in a secure location, and can only be accessed
                                by a
                                limited number of individuals working on the project. The code list is the only link
                                between
                                your Prolific ID and your study data. After completion of the study, the code list will
                                be
                                deleted, and it will no longer be possible to link the study data to you.
                                The study data (but not Prolific ID) may be shared with cooperation partners for
                                collaborative
                                analysis. The study data may also be made publicly accessible via research data bases or
                                scientific publications (typically via the Internet). This makes it possible for other
                                researchers to check or replicate the results of the study and enhances the quality of
                                scientific research. The study data may also be used for new research questions going
                                beyond
                                the
                                purposes of this particular study. Please note that once study data are publicly
                                accessible,
                                its
                                further distribution by others cannot be ruled out, and that this is beyond the area of
                                influence or responsibility of the MPI for Human Development. Therefore, as a matter of
                                principle, study data are only transferred or made publicly accessible without personal
                                contact
                                data. Data in which persons are identifiable can be made publicly accessible only if the
                                participant agrees to this use by signing a separate consent form.
                            </Typography>
                            <Typography component={'span'} align={'justify'}>
                                <Typography variant="h6" gutterBottom>
                                    5. Participation is voluntary
                                </Typography>
                                Participation in this study is voluntary. You may withdraw from the study at any time
                                without
                                giving any reason and without any negative consequences. You may also withdraw your
                                consent
                                to
                                data processing and usage at any time with effect for the future and without negative
                                consequences. To do this, you can contact us on Prolific or contact Levin Brinkmann at
                                brinkmann@mpib-berlin.mpg.de. Please note that once the code list has been deleted (see
                                Section
                                4), it is no longer possible to link your contact data to your study data.
                            </Typography>
                            <Typography component={'span'} align={'justify'}>
                                <Typography variant="h6" gutterBottom>
                                    6. Consent
                                </Typography>
                                This document has informed you about participation in the “Reward Network” study. The
                                study
                                will
                                take approximately 18 minutes. You will receive compensation of £2.70 for your
                                participation
                                in
                                the study, plus a bonus (£0.70 on average) that is dependent on your own performance and
                                the
                                performance of participants who learned from your solutions in the task. If you decide
                                to
                                terminate your participation before the end of the study, you will receive no
                                compensation.
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                I have read and understood the conditions outlined above, and had the opportunity to
                                clarify
                                open questions.
                            </Typography>
                            <Grid item xs={12} textAlign={"center"} p={2}>
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={() => props.onTrialFinished({moves: []})}
                                    startIcon={<CheckIcon/>}>️
                                    I consent to participate in the study and agree to the collection, storage, and use
                                    of
                                    my data
                                    as described above.
                                </Button>
                            </Grid>
                            <Grid item xs={12} textAlign={"center"} p={2}>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={onDisagree}
                                    startIcon={<CancelIcon/>}>️
                                    I do NOT consent to participate in the study.
                                </Button>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </>
        )
    }


    return (
        <>
            {
                isDisagree ?
                    (<> {renderDisagreePage()} </>) :
                    (<> {renderConsent()} </>)
            }
        </>
    );
};


export default ConsentForm;