import { useEffect, useState } from "react"
import { Card } from "flowbite-react";
import moment from "moment";


export default function Jumbotron({setRemaining, trialEnd}){

    let time  = new Date().toLocaleTimeString()
    const [ctime,setTime] = useState(time)
    const now = new Date();
    const date = (new Intl.DateTimeFormat('en-US', { dateStyle: 'full' })).format(now);
    
    
    useEffect(() => {

        if (!trialEnd) return;

        const update = () => {
            setTime(new Date().toLocaleTimeString());
            trialRemaining(trialEnd);
        };

        update(); // update immediately

        const interval = setInterval(update, 1000);

        return () => clearInterval(interval);

    }, [trialEnd]);

    function trialRemaining(trialEnd) {

        if (!trialEnd || !moment(trialEnd).isValid()) {
            setRemaining("");
            return;
        }

        const duration = moment.duration(moment(trialEnd).diff(moment()));

        if (duration.asMilliseconds() <= 0) {
            setRemaining("Expired");
            return;
        }

        const days = Math.floor(duration.asDays());
        const hours = duration.hours();
        const minutes = duration.minutes();
        const seconds = duration.seconds();

        setRemaining(`${days} days ${hours} hr ${minutes} min`);
    }
    return(
        <>
            <div className="w-full flex flex-col bg-gray-900 py-2">
                <div className="w-full flex justify-center items-center gap-2">
                    <p className="text-sm font-normal text-white">
                        {date}
                    </p>                    
                    <h5 className="text-sm font-normal tracking-tight text-gray-900 text-white">
                        {ctime}
                    </h5>
                </div>
            </div>            
        </>
    )
}