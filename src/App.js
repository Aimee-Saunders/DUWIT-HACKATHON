import { useState } from "react";
import './App.css';
import { ScheduleTaskHard, ScheduleTaskSoft } from './scheduling_functions.js'

function createGrid(){
  const grid = [];
  for (let j=0; j<7; j++){
    grid.push([]);
    for (let i = 0; i < 24; i++) {
      grid[j].push({
        day:j,
        slot: {start:i,end:i+1}, 
        id: {x:j,y:i},
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

function TimeSlot({title,flag,onClickFunction}){
  return(
    <div class="timeslot" onClick={onClickFunction}>
      <p>{title}</p>
      <p>{flag}</p>
    </div>
  )
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
  let newGrid=[...grid]
  let success = false
  if (priority === "hard"){
    [newGrid, success] = ScheduleTaskHard(grid,Hday,Htime,title)
  }else{
    [newGrid, success] = ScheduleTaskSoft(grid,SoftStart,SoftStartDay,SoftEnd,SoftEndDay,title) 
  }
  if(success){
    console.log("SUCCESS")
    return newGrid

  }else{
    console.log("FAILURE")
    return grid
  }
}

function App() {
  const [grid, setGrid] = useState(createGrid());
  const [tasks, setTasks] = useState([]);
  const [popup, setPopup] = useState(null);
  const[rating,setRating]=useState(1);
  const time_labels = [];
  for (let i = 0; i < 24; i++){
    time_labels.push({title:(i+":00-"+(i+1)+":00")});
  }
  function OpenTask(day,hour){
    setPopup({day,hour});
    setRating(1);
  };
  function submit_rating(e){
    const{day,hour}=popup;
    e.preventDefault();
    fetch("http://localhost:5000/productivity",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({day,hour,rating})
    })
    .then(res => res.json())
    setPopup(null);
  };
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
            <TimeSlot key={item.id} onClickFunction={() => OpenTask(item.id.x,item.id.y)} title={item.title} flag={item.flag}/>
          ))}
          </div>
        ))}
      </div>
      <NewTaskButton grid={grid} setGrid={setGrid}/>
      {popup && (
        <div className="popup-overlay">
        <div className="popup">
        <h3>Rate slot: day {popup.day}, hour {popup.hour}</h3>
        <form onSubmit={submit_rating}>
          <input type="number" max={5} min={0} value={rating}
          onChange={e => setRating(Number(e.target.value))}>
          </input>
          <input type="submit"></input>
        </form>
        <br></br>
        </div>
        </div>
      )}
    </div>
  );
}

export default App;
