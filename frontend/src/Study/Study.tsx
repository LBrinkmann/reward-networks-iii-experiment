import React, {useEffect, useState} from "react";
import axios from "axios";

const Study = () => {
    const [trialType, setTrialType] = useState(null as string);

    // fetch data for the given trial
    // TODO: implement trial fetching

    // send results at the end of the trial

    // use trial info as props for a corresponding component

    switch (trialType) {
        case 'intro':
            return <> </>; // <Intro />
        case 'tutorial':
            return <> </>; // <Tutorial />
        case 'learning':
            return <> </>; // <Learning />
        case  'advise':
            return <> </>; // <Advise />
        default:
            return <> </>;
    }
};


export default Study;