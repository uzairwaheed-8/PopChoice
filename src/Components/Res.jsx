/* eslint-disable react/prop-types */
import icon from '../assets/icon.svg';
import {useNavigate} from 'react-router-dom'

const Res = ({ res }) => {
  const navigator = useNavigate()
  const style = {
    fontFamily: "Carter One"
}
const handleClick =()=>{
  navigator('/');
}
  console.log(res)
  return (
    <div style={style} className='bg-[#000C36] text-white p-4 lg:p-8 flex flex-col justify-center items-center min-h-screen font-sans '>
       <img  className="pb-8" src={icon}></img>
      <h1 className="text-4xl pb-4">LLm Response:</h1>
      <p className="text-xl font-mono">{
        res
      }</p>
     <button onClick={handleClick} className='bg-[#51E08A] px-20 py-4 text-black text-xl font-bold rounded-lg mt-8'>Go Again</button>
    </div>
  );
}

export default Res;
