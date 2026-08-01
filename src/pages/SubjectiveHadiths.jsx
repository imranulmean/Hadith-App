import { openDatabase } from "../database/db";
import { Device } from "@capacitor/device";
import { Capacitor } from '@capacitor/core';
import { useEffect, useState } from "react";
import { checkIfTrialEnd, createHadithAppActivation } from "../database/hadithRepository";
import HeaderLibrary from "../components/HeaderLibrary";
import Banner from "../components/Banner";
import { Link } from "react-router-dom";
import SubjectiveBanner from "../components/SubjectiveBanner";

export default function SubjectiveHadiths(){

    const [subjectiveHadiths, setSubjectiveHadiths] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activated, setActivated] = useState(false);    

    useEffect(()=>{
        window.scrollTo(0,0)
        getSubjectiveHadiths();
    },[])

    const getSubjectiveHadiths=async()=>{
        setLoading(true)
        try{

            await createHadithAppActivation();
            const data= await checkIfTrialEnd();
            if(!data) {
                setActivated(false);
                return;
            }
            else{
                setActivated(true);
            } 
    
            const db = await openDatabase();
            const queryString=`SELECT bookId, bookName,
                                COUNT(DISTINCT chapterId) AS totalChapters
                                FROM subjectives GROUP BY
                                bookId, bookName
                                ORDER BY bookId;`
            if (Capacitor.isNativePlatform()) {
        
                const result = await db.query(queryString);
        
                const books2= result.values.map(row => ({
                    bookId: row.bookId,
                    bookName: row.bookName,
                    totalChapters: row.totalChapters,
                    link: `/subjective/book/${row.bookId}/chapters`                    
                }));
    
                setSubjectiveHadiths(books2);
            }    
            
            else{
                const result = db.exec(queryString);
        
                const books = result[0].values.map(row=>({
                    bookId: row[0],
                    bookName: row[1],
                    totalChapters: row[2],
                    link: `/subjective/book/${row[0]}/chapters`
                }));
        
                setSubjectiveHadiths(books);
            }

        }catch(err){
            alert(err.message);
        }
        finally{    
            setLoading(false);    
        } 
    }

    if(!activated){
        return(
            <>
                <HeaderLibrary />
                <SubjectiveBanner />
                {loading && (
                    <div className="flex justify-center items-start p-10 bg-[#0C171A] text-gray-200 h-screen">
                        <p className="text-lg">Fetching Hadiths...</p>
                    </div>
                )}
                {
                    !loading &&
                    <div className="flex justify-center items-start p-10 bg-[#0C171A] text-gray-200 h-screen">
                        <Link to ='/activationCompo' class="inline-flex items-center w-auto text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">
                            Check Status
                            <svg class="w-4 h-4 ms-1.5 rtl:rotate-180 -me-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0-4 4m4-4-4-4"/></svg>
                        </Link>
                    </div>
                }                              
            </>
        )
    }

    return(
        <>
            <HeaderLibrary />
            <SubjectiveBanner title={"বিষয়ভিত্তিক"} bookName={"হাদীসের কিতাব সমূহ"}/>

            {loading && (
                <div className="flex justify-center items-start p-10 bg-[#0C171A] text-gray-200 h-screen">
                    <p className="text-lg">Fetching Hadiths...</p>
                </div>
            )}
            {
                !loading && 
                <div className="flex flex-col justify-center items-center bg-[#0C171A] text-gray-200">
                    <div className="flex gap-2 flex-wrap justify-center p-4">                    
                        {
                            ( subjectiveHadiths && subjectiveHadiths.length > 0 ) && 
                            subjectiveHadiths.map(item=>{
                                return(
                                    <Link to ={item.link} class="w-full flex flex-col items-start bg-neutral-primary-soft p-6 border-t border-default rounded-base shadow-xs md:flex-row md:max-w-sm md:flex-row md:max-w-sm">
                                        <div class="flex flex-col justify-between md:p-4 leading-normal">
                                            <h5 class="mb-2 text-2xl font-semibold tracking-tight text-heading">{item.bookName}</h5>                                            
                                            <div className="flex">
                                                <p class="mb-2 text-md font-semibold tracking-tight text-heading">মোট অধ্যায় - {item.totalChapters - 1} (পড়ুন)</p>
                                            </div>
                                        </div>
                                    </Link>                            
                                )
                            })
                        }
                    </div>                    
                </div>
                

            }

        </>
    )
}