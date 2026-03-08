import { useState,useEffect } from "react";
import './App.css';
import { ScheduleTaskHard, ScheduleTaskSoft } from './scheduling_functions.js'
import {useRef} from "react";
import {Toaster} from "sonner";

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
  if (flag === "hard"){
  return(
    <div className="timeslot" onClick={onClickFunction} style={{background:'#800F2F', color:'#ffff'}}>
      <p>{title}</p>
    </div>
  )
  }
  else if(flag==="soft"){
  return(
    <div className="timeslot" onClick={onClickFunction} style={{background:'#FF8FA3'}}>
      <p>{title}</p>
    </div>
  )
}
else{
    return(
    <div className="timeslot" onClick={onClickFunction}>
      <p>{title}</p>
    </div>
  )
}
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
  let rankedSlots=useCSV()
  console.log(rankedSlots[0])
  console.log(rankedSlots[1])

    function CreateNewTask(e){
    e.preventDefault();
    const newGrid = renderTasks(grid,rankedSlots,title,priority,Htime,Hday,SoftStart,SoftStartDay,SoftEnd,SoftEndDay);
    setGrid(newGrid);
  }

  return(
    <form  className="form-task"onSubmit={CreateNewTask}>
      <input className="form-title"
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
          Fixed timeslot
        </label>
        <label>
          <input
            type="radio"
            name="Priority"
            value="soft"
            onChange={e => setPriority(e.target.value)}
          />
          Flexible timeslot
        </label>
        {priority === "hard" &&(
        <>
        <br></br>
        <label>
        Start hour:
        <input type="number" onChange={e => setHTime(Number(e.target.value))}></input>
        </label>
        <br></br>
        <label>
        Start day:
        <input type="number" onChange={e => setHday(Number(e.target.value))}></input>
        </label>
        </>
        )}
        {priority === "soft" &&(
        <>
        <br></br>
        <label>
        First day:
        <input type="number" min={0} max = {6} onChange={e => setSoftStartDay(Number(e.target.value))}></input>
        </label>
        <br></br>
        <label>
        First hour:
        <input type="number" min={0} max = {23} onChange={e => setSoftStart(Number(e.target.value))}></input>
        </label>

        <br></br>
        <label>
        Deadline day:
        <input type="number" min={0} max = {6} onChange={e => setSoftEndDay(Number(e.target.value))}></input>
        </label>
        <br></br>
        <label>
        Deadline hour:
        <input type="number" min={0} max = {23} onChange={e => setSoftEnd(Number(e.target.value))}></input>
        </label>
        <br></br>
        </>
        )}
      </div>
      <input className="button-submit" type="submit" value="Create Task" />
    </form>
  );
}

function renderTasks(grid,rankedSlots,title,priority,Htime,Hday,SoftStart,SoftStartDay,SoftEnd,SoftEndDay){
  let newGrid=[...grid]
  let success = false
  if (priority === "hard"){
    [newGrid, success] = ScheduleTaskHard(grid,rankedSlots,Hday,Htime,title)
  }else{
    [newGrid, success] = ScheduleTaskSoft(grid,rankedSlots,SoftStart,SoftStartDay,SoftEnd,SoftEndDay,title) 
  }
  if(success){
    console.log("SUCCESS")
    return newGrid

  }else{
    console.log("FAILURE")
    return grid
  }
}

function useCSV(){
  const [ranked, setRanked] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("http://localhost:5000/csv")
      const text = await res.text()
      const lines = text
        .trim()
        .split("\n")
        .map(l => l.trim())
        .filter(l => l.length > 0 && l.includes(","))

      const parsed = lines.map(line => {
        const parts = line.split(",")

        if (parts.length < 3) return null

        const [day, time, frequencies] = parts

        if (!frequencies) return null

        const freq = frequencies.split("|").map(Number)
        const total = freq.reduce((a, b) => a + b, 0)

        const avg = total === 0 ? 0 :
          (freq[0]*1 + freq[1]*2 + freq[2]*3 + freq[3]*4 + freq[4]*5) / total

        return {
          day: Number(day),
          time: Number(time),
          avg,
          freq
        }
      }).filter(Boolean);

      const ranked = [...parsed].sort((a, b) => b.avg - a.avg);
      ranked.shift()
      setRanked(ranked);
    }

    load();
  }, []);
  console.log(ranked)
  return ranked
}

function ProductivityGraph(){
  const iframeRef = useRef(null);
  function resize(){
    const iframe = iframeRef.current;
    iframe.style.height = "2000px";
  }
  return(
    <iframe
    ref={iframeRef}
    src="/productivity.html"
    width="100%"
    onLoad={resize}
    style={{border:"none"}}
    title="Productivity Graph"
    ></iframe>
  )
}

function P5Timer(){
  const iframeRef = useRef(null);
  function resize(){
    const iframe = iframeRef.current;
    iframe.style.height = "225px";
  }
  return(
    <iframe
    ref={iframeRef}
    src="/timer/index.html"
    width="100%"
    onLoad={resize}
    style={{border:"none"}}
    title="Timer"
    ></iframe>
  )
}


function App() {
  const [grid, setGrid] = useState(createGrid());
  const [tasks, setTasks] = useState([]);
  const [popup, setPopup] = useState(null);
  const[rating,setRating]=useState(1);
  const time_labels = [];
  const day_labels = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
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
      <h1>Task Scheduler</h1>
      <Toaster richColors position="top-right"/>
      <div className="scheduler">
        <div className="Col times">
          <p>Times</p>
          {time_labels.map((item)=>(
            <TimeSlot key={item.id} title={item.title}/>
          ))}
          </div>
        {grid.map((column)=>(
        <div className="Col">
          <p>{day_labels[column[0].day]}</p>
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
        <h3>Rate your productivity for this session: {day_labels[popup.day]}, {popup.hour}:00</h3>
        <form onSubmit={submit_rating}>
          <input type="number" max={5} min={0} value={rating}
          onChange={e => setRating(Number(e.target.value))}>
          </input>
          <br></br>
          <input className="rate-button" type="submit"></input>
        </form>
        <br></br>
        </div>
        </div>
      )}
      <P5Timer />
      <ProductivityGraph />
    </div>
  );
}

export default App;
