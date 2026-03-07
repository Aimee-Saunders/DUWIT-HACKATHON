import logo from './logo.svg';
import './App.css';

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
  return (
    <div className="App">
      <div>
        <TimeSlot hourstart={"0"} hourend={"1"}/>
        <TimeSlot hourstart={"0"} hourend={"1"}/>
        <TimeSlot hourstart={"0"} hourend={"1"}/>
        <TimeSlot hourstart={"0"} hourend={"1"}/>
      </div>
    </div>
  );
}

export default App;
