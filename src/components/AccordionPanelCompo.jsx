import { Accordion, AccordionContent, AccordionPanel, AccordionTitle } from "flowbite-react";

export default function AccordionPanelCompo({title, arabicText, banglaText, meaning, description, itemsArray}){
    return(
            <>
            <AccordionTitle className="text-white bg-transparent hover:bg-transparent">{title}</AccordionTitle>
            <AccordionContent>
                <div className="flex gap-2 flex-wrap justify-center text-gray-200">
                    {
                        ( itemsArray && itemsArray.length > 0 ) ? 
                            itemsArray.map(item=>{
                                return(
                                    <div class="w-full flex flex-col border-t border-default">
                                        <h5 class="w-full mb-2 font-medium tracking-tight text-right font-QuranFont"
                                            style={{'fontSize':'30px', 'lineHeight':'3rem'}}>{item.arabicText}</h5>
                                        <h5 class="w-full mb-2 text-md font-medium tracking-tight text-right">{item.banglaText}</h5>
                                        <h5 class="w-full mb-2 text-md font-medium tracking-tight text-right">{item.meaning}</h5>
                                        {
                                            item.description &&
                                            <h5 class="w-full mb-2 text-md font-medium tracking-tight text-right border-t border-default p-2">
                                                {item.description}
                                            </h5>                                    
                                        }                                        
                                    </div>

                                )
                            })
                        :
                            <div class="w-full flex flex-col">
                                <h5 class="w-full mb-2 font-medium tracking-tight text-right font-QuranFont" style={{'fontSize':'30px', 'lineHeight':'3rem'}}>
                                    {arabicText ? arabicText : ''}
                                </h5>                                    
                                <h5 class="w-full mb-2 text-md font-medium tracking-tight text-right">
                                    {banglaText ? banglaText : '' }
                                </h5>
                                <h5 class="w-full mb-2 text-md font-medium tracking-tight text-right">
                                    {meaning ? meaning : ''}
                                </h5>
                                {
                                    description &&
                                    <h5 class="w-full mb-2 text-md font-medium tracking-tight text-right border-t border-default p-2">
                                        {description}
                                    </h5>                                    
                                }

                            </div>                        
                    }
                </div>                    
            </AccordionContent>
            </>

    )
 
}