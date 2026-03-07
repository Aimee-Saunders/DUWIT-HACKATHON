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
  return (
    <div className="App">
      <div>
        <TimeSlot />
      </div>
    </div>
  );
}

export default App;
