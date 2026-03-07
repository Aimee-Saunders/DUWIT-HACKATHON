import logo from './logo.svg';
import './App.css';

function TimeSlot(){
  return(
    <div class="timeslot">
      <p>This is a time slot</p>
    </div>
  )
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
      <div>
        <TimeSlot />
      </div>
    </div>
  );
}

export default App;
