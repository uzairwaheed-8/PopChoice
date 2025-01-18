import Res from "./Components/Res";
import Qs from "./Components/Qs";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from "react";
export default function App() {
  const [res, setRes] = useState(" ");
  const [img, setImg] = useState('');
  const [title, setTitle] = useState('');
  const [list, setList] = useState([]);
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Layout />}> */}
          <Route path='/' element={<Qs setRes={setRes} setImg={setImg} setTitle={setTitle} setList={setList}/>} />
          <Route path="res" element={<Res res={res} img={img} title={title} list={list}/>} />
      </Routes>
    </BrowserRouter>
  )
}