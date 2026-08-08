import { useEffect, useState } from "react";
import { checkIfTrialEnd, createHadithAppActivation } from "../database/hadithRepository";
import { Link } from "react-router-dom";

export default function CheckActivationCompo({ children }){
    const [activated, setActivated] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        checkActivation();
    },[])

    const checkActivation = async()=>{
        setLoading(true);
        try {
            await createHadithAppActivation();
            const isActivated= await checkIfTrialEnd();
            if(!isActivated) {
                setActivated(false);
                return;
            }
            else{
                setActivated(true);
            }                      
        } catch (error) {
            alert(error);   
        }finally{
            setLoading(false);
        }
    }

    if(loading){
        return(
            <>
                <div className="flex justify-center items-center p-10 text-gray-200">
                    <p className="text-lg">Checking Status ...</p>
                </div>            
            </>
        )
    }

    if(!activated){
        return(
            <>
                <div className="flex justify-center items-start p-10 text-gray-200">
                    <Link to ='/activationCompo' class="inline-flex items-center w-auto text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">
                        Check Status
                        <svg class="w-4 h-4 ms-1.5 rtl:rotate-180 -me-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0-4 4m4-4-4-4"/></svg>
                    </Link>
                </div>
            </>
        )
    }

    return children;
    
}