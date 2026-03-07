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
        id: j+":"+i,
        title:"_",
        task_id: "none" });
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

function NewTaskButton({grid,setGrid}){
  const [title, setTitle]=useState("");
  const [priority, setPriority] = useState("High");

  function CreateNewTask(e){
    e.preventDefault();
    const newGrid = RenderTasks(grid,title);
    setGrid(newGrid);
  }

  return(
    <form onSubmit={CreateNewTask}>
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Task Title"
      />
      <div>
        <label>
          <input
            type="radio"
            name="Priority"
            value="High"
            checked={priority === "High"}
            onChange={e => setPriority(e.target.value)}
          />
          High Priority
        </label>
        <label>
          <input
            type="radio"
            name="Priority"
            value="Mid"
            checked={priority === "Mid"}
            onChange={e => setPriority(e.target.value)}
          />
          Mid Priority
        </label>
        <label>
          <input
            type="radio"
            name="Priority"
            value="Low"
            checked={priority === "Low"}
            onChange={e => setPriority(e.target.value)}
          />
          Low Priority
        </label>
      </div>
      <input type="submit" value="Create Task" />
    </form>
  );
}

function RenderTasks(grid,title){
  const task_time = Math.floor(Math.random()*25); 
  const newGrid = [...grid];
  newGrid[0][task_time] = {
    ...newGrid[0][task_time],
    title:title
  }
  return newGrid;
}

function App() {
  const [grid, setGrid] = useState(createGrid());
  const [tasks, setTasks] = useState([]);
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
          {column.map((item)=>(
            <TimeSlot key={item.id} title={item.title} day={item.day} hourstart={item.slot.start} hourend={item.slot.end}/>
          ))}
          </div>
        ))}
      </div>
      <NewTaskButton grid={grid} setGrid={setGrid}/>
    </div>
  );
}

export default App;
