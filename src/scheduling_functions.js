function ScheduleTaskHard(grid,currentDay,currentTime){
    if(grid[currentDay][currentTime].title=="_"){
        return currentDay, currentTime, True
    }
    else if(grid[currentDay][currentTime].flag=="hard"){
        return currentDay, currentTime, False
    }
    else{
        ScheduleTaskSoft(grid,)
    }

}

function ScheduleTaskSoft(grid,startTime,startDay,endTime,endDay){
    currentDay=startDay
    currentTime=startTime
    while(currentDay<=endDay){
        while(currentTime<endTime){
            if(grid[currentDay][currentTime].title=="_"){
                return currentDay, currentTime, True
            }
            currentTime+=1
        }
        currentDay+=1
    }
    currentDay=startDay
    currentTime=startTime
    while(currentDay<=endDay){
        while(currentTime<endTime){
            if(grid[currentDay][currentTime].flag=="soft"){
                sDay, sTime, success = ScheduleTaskSoft(grid,s)
            }
            currentTime+=1
        }
        currentDay+=1
    }
}

function NewTaskHard(newGrid,Hday,Htime,){
    return {
        ...newGrid[Hday][Htime],
        title:title,
        flag:priority,
        Htime:Htime,
        Hday:Hday
    }
}


function RenderTasks(grid,title,priority,Htime,Hday,SoftStart,SoftStartDay,SoftEnd,SoftEndDay){
  const newGrid = [...grid];
  if (priority === "hard"){
    Hday, Htime, success = ScheduleTasksHard(grid,Hday,Htime)
    if(success){
      newGrid[Hday][Htime] = {
        ...newGrid[Hday][Htime],
        title:title,
        flag:priority,
        Htime:Htime,
        Hday:Hday
    }}
  }else{
    Sday, Stime, success = ScheduleTasksSoft(grid)
    if(sucess){
      newGrid[SoftStartDay][task_time] = {
        ...newGrid[Sday][Stime],
        title:title,
        flag:priority,
        SoftStart:SoftStart,
        SoftStartDay:SoftStartDay,
        SoftEnd:SoftEnd,
        SoftEndDay:SoftEndDay
    }} 
  }
  return newGrid;
}