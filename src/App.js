import logo from './logo.svg';
import { useState } from "react";
import './App.css';

function createGrid(){
  const grid = [];
  for (let j=0; j<7; j++){
    grid.push([]);
    for (let i = 0; i < 24; i++) {
      grid[j].push({
        day:j,
        slot: {start:i,end:i+1}, 
        id: i,
        title:"_" });
    }
  }
  return grid;
}

function TimeSlot({title,hourstart,hourend}){
  return(
    <div class="timeslot">
      <p>{title}</p>
    </div>
  )
}

function App() {
  const [grid, setGrid] = useState(createGrid());
  const time_labels = [];
  for (let i = 0; i < 24; i++){
    time_labels.push({title:(i+":00-"+(i+1)+":00")});
  }
  return (
    <div className="App">
      <div className="scheduler">
        <div className="Col times">
          <p>Times</p>
          {time_labels.map((item)=>(
            <TimeSlot key={item.id} title={item.title}/>
          ))}
          </div>
        {grid.map((column)=>(
        <div className="Col">
          <p>{column[0].day}</p>
          {grid[0].map((item)=>(
            <TimeSlot key={item.id} title={item.title} day={item.day} hourstart={item.slot.start} hourend={item.slot.end}/>
          ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
