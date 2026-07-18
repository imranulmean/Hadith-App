import { useEffect, useState } from "react"
import { openDatabase } from "../database/db";
import moment from 'moment';
import { useNavigate } from "react-router-dom";
import HeaderLibrary from "../components/HeaderLibrary";
import { checkIfTrialEnd, getDataLocalForge, setDataLocalForge } from "../database/hadithRepository";
import { Device } from "@capacitor/device";
import Jumbotron from "../components/Jumbotron";

export default function ActivationCompo(){

    const [deviceInfo, setDeviceInfo] = useState({
        "deviceId":"",
        "firstInstall":"",
        "trialStart": "",
        "trialEnd": "",
        "activated": 0
    });
    
    const BASE_API = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [activated, setActivated] = useState(false);
    const [devsPhone, setDevsPhone] = useState([]);
    const [remaining, setRemaining] = useState([]);

    useEffect(()=>{
        loadInfo();
    },[])

    const loadInfo= async() =>{
        const { identifier } = await Device.getId();
        let row= await getDataLocalForge();
        if(row){
            setDeviceInfo(row);
        }
        else{
            setDeviceInfo({
                deviceId:identifier,
                "firstInstall":"",
                "trialStart": "",
                "trialEnd": "",
                "activated": 0                
            });
        }
        setActivated(await checkIfTrialEnd());
        
    }
    
    const activateNow = async() =>{
        const { identifier } = await Device.getId();
        try{
            setLoading(true);
            const obj={
                deviceId: deviceInfo.deviceId || identifier
            }            
            const res = await fetch(`${BASE_API}/hadithApp/checkActivation`,{
                method:"POST",
                headers:{
                'content-type' : 'application/json'
                },
                body: JSON.stringify(obj)
            });
            const data = await res.json();
            if(!data.success){
                alert(data.message)
                return;
            }
            if(data.success){
                await setDataLocalForge(data.data);
                navigate('/')
            }
        }catch(err){
            alert(err.message)
        }finally{
            setLoading(false);
        }                   
    } 
    const getDevsPhone = async() =>{
        const { identifier } = await Device.getId();
        try{
            setLoading(true);
            const obj={
                deviceId: deviceInfo.deviceId || identifier
            }            
            const res = await fetch(`${BASE_API}/hadithApp/getDevsPhone`,{
                method:"POST",
                headers:{
                'content-type' : 'application/json'
                },
                body: JSON.stringify(obj)
            });
            const data = await res.json();
            if(!data.success){
                alert(data.message)
                return;
            }
            setDevsPhone(data.message)

        }catch(err){
            alert(err.message)
        }finally{
            setLoading(false);
        }                           
    }

    function trialDuration(trialStart, trialEnd){
        const start= moment(trialStart);
        const end= moment(trialEnd);
        const days = moment.duration(end.diff(start)).asDays();
        return `${days} days`;
    } 

   
    
    return(
        <>
            <HeaderLibrary/>
            <Jumbotron setRemaining={setRemaining} trialEnd={deviceInfo.trialEnd}/>
            <div className="h-screen flex flex-col flex-wrap gap-2 items-center px-4 py-2 bg-gray-900 text-gray-200">
                <p className="text-sm text-gray-300">Deveice ID: {deviceInfo.deviceId }</p>
                <p className="text-sm text-gray-300">First Install: {moment(deviceInfo.firstInstall).format('MMMM Do YYYY, h:mm a')}</p>
                <p className="text-sm text-gray-300">Trial Start: {moment(deviceInfo.trialStart).format('MMMM Do YYYY, h:mm a')}</p>
                <p className="text-sm text-gray-300">
                    Trial End: {moment(deviceInfo.trialEnd).format('MMMM Do YYYY, h:mm a')}{" "} 
                    ({trialDuration(deviceInfo.trialStart, deviceInfo.trialEnd)})
                </p>
                <p className="text-sm text-gray-300">
                    Trial Remaining: {remaining}
                </p>                
                
                <p className="text-sm text-gray-300">To Activate make sure connected to internet</p>
                {
                    devsPhone.map((ph) => (
                        <div key={ph.num} className="flex items-center gap-3">
                            <span className="text-sm text-gray-300">
                                {ph.name}
                            </span>

                            <a  href={`tel:${ph.num.replace("+", "")}`}
                                className="bg-green-600 text-white px-2 py-1 rounded text-sm"
                            >
                                📞 Call
                            </a>

                            <a
                                href={`https://wa.me/${ph.num.replace("+", "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-green-600 text-white px-2 py-1 rounded text-sm"
                            >
                                WhatsApp
                            </a>
                        </div>
                    ))
                }                

                <div className="flex gap-2">
                    {
                        !activated &&
                        <>                        
                            <button onClick={getDevsPhone} disabled={loading}
                                className="border border-gray-200 p-2 text-sm text-gray-300">Contact
                            </button>
                            <button onClick={activateNow} disabled={loading}
                                className="border border-gray-200 p-2 text-sm text-gray-300">Activate Now
                            </button>                         
                        </>
                       
                    }

                    <button onClick={()=> navigate('/')} disabled={loading}
                        className="border border-gray-200 p-2 text-sm text-gray-300">Home
                    </button> 
                </div>
               {
                loading &&
                <p>processing...</p>
               }
            </div>                    
        </>

    )
}