import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ActivationCompo from './pages/ActivationCompo';

import HadithContent from './pages/HadithContent';
import Hadiths from './pages/Hadiths';
import Suras from './pages/Suras';
import SurahContent from './pages/SurahContent';
import HadithBookmarks from './pages/HadithBookmarks';
import BackHandler from './components/BackHandler';

export default function App(){
   
  return(

      <BrowserRouter>      
        <BackHandler />
        <Routes>        
          <Route path='/' element={<Hadiths />} />
          <Route path='/hadiths' element={<Hadiths />} />
          <Route path='/activationCompo' element={<ActivationCompo />} />
          <Route path='/hadithContent/:bookName' element={<HadithContent />} />
          <Route path='/hadithBookmarks' element={<HadithBookmarks />} />
          <Route path='/suras' element={<Suras />} />
          <Route path='/surahContent/:surahId' element={<SurahContent />} />
        </Routes>
      </BrowserRouter>    

  )
}