/* eslint-disable react/prop-types */
import {useNavigate} from 'react-router-dom'
import { useEffect, useState } from 'react';

const Res = ({ res,img,title, list }) => {
  const navigator = useNavigate()
  const [count,setCount] = useState(0);
  const [text,setText] = useState(res);
  const [image,setImage] = useState(img);
  const[title_,setTitle_] = useState(title);
  const [show,setShow] = useState(true);
  let check = title
  console.log('list' ,list)
  const style = {
    fontFamily: "Carter One"
}
const handleClick =()=>{
  navigator('/');
}
useEffect(()=>{
  if(count  == list.length){
    setShow(false)
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[count])

const handleClick_m =()=>{
  if(count < list.length){
    //let title = movie.split("Popularity");
    //title = title[0].split("Title: ");
    let t = list[count].split("Popularity");
    t = t[0].split("Title:")
    if(t[1].trim() != check.trim()){
      setTitle_(t[1].trim())
      let p = list[count].split("poster_path : ")
      setImage(p[1].trim())
      let tex = list[count].split("Description: ")
      tex = tex[1].split('poster_path : ')
      setText(tex[0].trim())
    }
    setCount(count+1);
  }
}
  console.log(res)
  return (
    <div style={style} className='bg-[#000C36] text-white p-4 lg:p-8 flex flex-col justify-center items-center min-h-screen font-sans '>
      <h1 className="text-xl pb-4  md:text-6xl lg:text-6xl">{title_} </h1>
      <div className='flex flex-col items-center justify-center lg:flex-row'>
        <img className="rounded-lg h-[300px] w-auto align-middle lg:h-[500px]" src={image} alt="movie poster" />
      <p className="text-xs font-mono m-auto  p-8 lg:p-16 lg:text-3xl">{
        text
      }</p>
        </div>
        <div className='container flex lg:flex-row justify-center items-center flex-col lg:justify-evenly' >
        <button onClick={handleClick} className='bg-[#51E08A] px-20 py-4 text-black text-xs lg:text-xl font-bold rounded-lg  mt-2 lg:mt-8'>Go Again</button>
        {
          show &&
          <button onClick={handleClick_m} className='bg-[#51E08A] px-20 py-4 text-black text-xs lg:text-xl font-bold rounded-lg mt-4 lg:mt-8'>Next Movie</button>
        }
        </div>
    
    </div>
  );
}

export default Res;
