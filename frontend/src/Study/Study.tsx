import React, {useEffect, useState} from "react";
import axios from "axios";

const Study = () => {
     const [trial, setTrial] = useState(null as string);
     const [block, setBlock] = useState(null as string);

     switch (block)
     {
         case 'intro':
             return <> </>; // <Intro />
         case 'tutorial':
             return <> </>; // <Tutorial />
         case 'learning':
             return <> </>; // <Learning />
         case  'advise':
             return <> </>; // <Advise>
         default:
             return <> </>;
     }
};


export default Study;