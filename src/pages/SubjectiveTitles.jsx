import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import HeaderLibrary from "../components/HeaderLibrary";
import SubjectiveBanner from "../components/SubjectiveBanner";
import { openDatabase } from "../database/db";
import { checkIfTrialEnd, createHadithAppActivation } from "../database/hadithRepository";
import { Capacitor } from '@capacitor/core';

export default function SubjectiveTitles(){

    const [subjectiveHadiths, setSubjectiveHadiths] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activated, setActivated] = useState(false);    
    const {bookId, chapterId} =  useParams();


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
    
            if (Capacitor.isNativePlatform()) {
        
                const result = await db.query(`SELECT titleId, chapterTitleIndexName, bookName, chapterTitle,
                                                COUNT(*) AS total FROM subjectives
                                                WHERE bookId = ? AND chapterId = ?
                                                GROUP BY titleId, chapterTitleIndexName, bookName, chapterTitle
                                                ORDER BY titleId`, [bookId, chapterId]);
        
                const books2= result.values.map(row => ({
                    titleId: row.titleId,
                    chapterTitleIndexName: row.chapterTitleIndexName,
                    bookName: row.bookName,
                    chapterTitle: row.chapterTitle,
                    total:row.total,
                    link: `/subjective/book/${bookId}/chapter/${chapterId}/title/${row.titleId}/contents`
                }));
    
                setSubjectiveHadiths(books2);
            }    
            else{
                const result = db.exec(`SELECT titleId, chapterTitleIndexName, bookName, chapterTitle,
                                        COUNT(*) AS total FROM subjectives
                                        WHERE bookId = ${bookId} AND chapterId = ${chapterId}
                                        GROUP BY titleId, chapterTitleIndexName, bookName, chapterTitle
                                        ORDER BY titleId`);
                
                if(result.length>0){
                    const books = result[0].values.map(row=>({
                        titleId: row[0],
                        chapterTitleIndexName: row[1],
                        bookName: row[2],
                        chapterTitle: row[3],
                        total:row[4],
                        link: `/subjective/book/${bookId}/chapter/${chapterId}/title/${row[0]}/contents`
                    }));
            
                    setSubjectiveHadiths(books);
                }

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

            {loading && (
                <div className="flex justify-center items-start p-10 bg-[#0C171A] text-gray-200 h-screen">
                    <p className="text-lg">Fetching Hadiths...</p>
                </div>
            )}
            {
                !loading && 
                <>
                    <SubjectiveBanner bookName={subjectiveHadiths[0].bookName} 
                    chapterTitle={`${subjectiveHadiths[0].chapterTitle} - এর পরিচ্ছেদসমূহ`}/>  
                                
                    <div className="flex flex-col justify-center items-center bg-[#0C171A] text-gray-200">
                        <div className="flex gap-2 flex-wrap justify-center p-4">                    
                            {
                                ( subjectiveHadiths && subjectiveHadiths.length > 0 ) && 
                                subjectiveHadiths.map(item=>{
                                    return(
                                        <Link to ={item.link} class="w-full flex flex-col items-start bg-neutral-primary-soft p-6 border-t border-default rounded-base shadow-xs md:flex-row md:max-w-sm md:flex-row md:max-w-sm">
                                            <div class="flex flex-col justify-between md:p-4 leading-normal">
                                                <h5 class="mb-2 text-2xl font-semibold tracking-tight text-heading">{item.chapterTitleIndexName}</h5>
                                                <p class="mb-2 text-sm text-gray-400 font-semibold tracking-tight text-heading">মোট হাদীস - {item.total}</p>
                                                <div>
                                                    <Link to ={item.link} class="inline-flex items-center w-auto text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">
                                                        Read more
                                                        <svg class="w-4 h-4 ms-1.5 rtl:rotate-180 -me-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0-4 4m4-4-4-4"/></svg>
                                                    </Link>
                                                </div>
                                            </div>
                                        </Link>                            
                                    )
                                })
                            }
                        </div>                    
                    </div>                
                </>
            
            }

        </>
    )
}