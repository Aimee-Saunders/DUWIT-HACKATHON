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
        task_id: "none",
        flag: "_",
        Htime: "",
        Hday: "",
        SoftStart: "",
        SoftStartDay: "",
        SoftEnd: "",
        SoftEndDay: "" });
    }
  }
  return grid;
}

function TimeSlot({title,flag,ClickFunction}){
  return(
    <div class="timeslot" onclick={ClickFunction}>
      <p>{title}</p>
      <p>{flag}</p>
    </div>
  )
}

function handleClick(){
  return(
  <p></p>)
}

function NewTaskButton({grid,setGrid}){
  const [title, setTitle]=useState("");
  const [priority, setPriority] = useState("High");
  const [Htime, setHTime] = useState("");
  const [Hday, setHday] = useState("");
  const [SoftStart, setSoftStart] = useState("");
  const [SoftStartDay, setSoftStartDay] = useState("");
  const [SoftEnd, setSoftEnd] = useState("");
  const [SoftEndDay, setSoftEndDay] = useState("");

  function CreateNewTask(e){
    e.preventDefault();
    const newGrid = RenderTasks(grid,title,priority,Htime,Hday,SoftStart,SoftStartDay,SoftEnd,SoftEndDay);
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
            value="hard"
            onChange={e => setPriority(e.target.value)}
          />
          High Priority
        </label>
        <label>
          <input
            type="radio"
            name="Priority"
            value="soft"
            onChange={e => setPriority(e.target.value)}
          />
          Low Priority
        </label>
        <br></br>
        If high priority
        <br></br>
        <label>
        Choose a starting hour
        <input type="number" onChange={e => setHTime(e.target.value)}></input>
        </label>
        <br></br>
        <label>
        Day:
        <input type="number" onChange={e => setHday(e.target.value)}></input>
        </label>
        <br></br>
        If low priority
        <br></br>
        <label>
        Interval start
        <input type="number" onChange={e => setSoftStart(e.target.value)}></input>
        </label>
        <br></br>
        <label>
        Day:
        <input type="number" onChange={e => setSoftStartDay(e.target.value)}></input>
        </label>
        <br></br>
        <label>
        Deadline
        <input type="number" onChange={e => setSoftEnd(e.target.value)}></input>
        </label>
        <br></br>
        <label>
        Day:
        <input type="number" onChange={e => setSoftEndDay(e.target.value)}></input>
        </label>
        <br></br>
        <br></br>
      </div>
      <input type="submit" value="Create Task" />
    </form>
  );
}

function RenderTasks(grid,title,priority,Htime,Hday,SoftStart,SoftStartDay,SoftEnd,SoftEndDay){
  const task_time = Math.floor(Math.random()*25); 
  const newGrid = [...grid];
  if (priority === "hard"){
    newGrid[Hday][Htime] = {
      ...newGrid[Hday][Htime],
      title:title,
      flag:priority,
      Htime:Htime,
      Hday:Hday
    }
  }else{
    newGrid[SoftStartDay][task_time] = {
      ...newGrid[SoftStartDay][task_time],
      title:title,
      flag:priority,
      SoftStart:SoftStart,
      SoftStartDay:SoftStartDay,
      SoftEnd:SoftEnd,
      SoftEndDay:SoftEndDay
    }    
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
            <TimeSlot key={item.id} clickFunction={handleClick()} title={item.title} flag={item.flag}/>
          ))}
          </div>
        ))}
      </div>
      <NewTaskButton grid={grid} setGrid={setGrid}/>
    </div>
  );
}

export default App;
