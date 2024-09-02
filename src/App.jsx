import Res from "./Components/Res";
import Qs from "./Components/Qs";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from "react";
export default function App() {
  const [res, setRes] = useState(" ");

  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Layout />}> */}
          <Route path='/' element={<Qs setRes={setRes} />} />
          <Route path="res" element={<Res res={res}/>} />
      </Routes>
    </BrowserRouter>
  )
}