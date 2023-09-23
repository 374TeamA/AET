
import {useState} from 'react';
function App() {
  const [count, setCount] = useState<number>(0);

  const x:number = 5;
  const str:string = "hello";
  type MyObject = {
    prop1:string;
    prop2:number
  }
  const obj:MyObject = {
    prop1:"hello",
    prop2:5
  }
  obj;
  const clicked = () =>{
    setCount(count+1);
  }
  

  return (
    <>
    <div>{str} {x}</div>
    <div style={{position:'absolute', 
    left:'25%', top:'25%', 
    border:'1px solid lightgrey', 
    borderRadius:'10px', 
    backgroundColor:'aliceblue', 
    padding:'2rem', 
    boxShadow:'0 0 10px rgb(0,0,0,0.2)'}}>
      <div>Hello, this is AET</div>
      <button onClick={() =>{clicked()}} 
      style={{padding:'10px', 
      border:'1px solid black', margin:'5px', 
      borderRadius:'5px', paddingLeft:'20px', 
      paddingRight:'20px'}}>Click</button>
      <p>{count}</p>
      </div>
    </>
  )
}

export default App
