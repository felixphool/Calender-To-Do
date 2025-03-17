import React from 'react'
import {useState} from 'react';
import './App.css';



function Times(props) {

 const [setEvent] = useState(null)
 const [setInfo] = useState(false)

 function displayInfo(e) {
   setInfo(true);
   setEvent(e.target.innerText);
}

return (
 
 <div className="times">
 </div>
  )
}

export default Times;