import logo from './logo.svg';
import { useState } from "react";
import './App.css';

function createGrid(){
  const grid = [];
  for (let i = 0; i < 9; i++) {
    grid.push({ id: i, contents: "_" });
  }
  return grid;
}

function TimeSlot({hourstart,hourend}){
  return(
    <div class="timeslot">
      <p>This is a time slot</p>
      <p>Starts: {hourstart}</p>
      <p>Ends: {hourend}</p>
    </div>
  )
}

function App() {
  const [grid, setGrid] = useState(createGrid());
  return (
    <div className="App">
      <div class="Row">
        <TimeSlot hourstart={"0"} hourend={"1"}/>
        <TimeSlot hourstart={"0"} hourend={"1"}/>
        <TimeSlot hourstart={"0"} hourend={"1"}/>
        <TimeSlot hourstart={"0"} hourend={"1"}/>
      </div>
    </div>
  );
}

export default App;
