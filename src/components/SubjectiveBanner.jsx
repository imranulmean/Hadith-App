import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import Jumbotron from "./Jumbotron";

export default function SubjectiveBanner({ title, subTitle, bookName, chapterTitle, chapterTitleIndexName}){
    return(
        <>
            <div className="w-full">
                {/* Container with relative positioning to hold the text overlay */}
                <div className="flex flex-col relative z-1 h-[50vh] md:h-[70vh] bg-[url('/islamic-logo.jpg')] bg-cover bg-center bg-no-repeat flex items-center justify-center">
                    
                    {/* Dark Overlay - ensures text is readable regardless of the image brightness */}
                    <div className="absolute inset-0 bg-[#00000080]"></div>
                    
                    {/* Text Content */}
                    <div className="relative z-10 text-center px-4">
                        {
                            title &&
                            <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-lg" 
                                style={{'lineHeight':'3rem'}}>
                                {title}
                            </h1>                            
                        }
                        {
                            subTitle &&
                            <p className="text-lg text-gray-100 font-medium max-w-2xl mx-auto"
                                style={{'lineHeight':'3rem'}}>
                                {subTitle}
                            </p>                            
                        }
                        {
                            bookName &&
                            <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-lg"
                                style={{'lineHeight':'3rem'}}>
                                {bookName}
                            </h1>                            
                        }
                        {
                            chapterTitle &&
                            <p className="text-lg text-gray-100 font-medium max-w-2xl mx-auto"
                                style={{'lineHeight':'3rem'}}>
                                {chapterTitle}
                            </p>                            
                        } 
                        {
                            chapterTitleIndexName &&
                            <p className="text-lg text-gray-100 font-medium max-w-2xl mx-auto"
                                style={{'lineHeight':'2rem'}}>
                                {chapterTitleIndexName}
                            </p>                            
                        }                                                
                        <Jumbotron setRemaining={""} trialEnd={"none"}/>
                    </div>

                </div>
            </div>      
        </>
    )
}