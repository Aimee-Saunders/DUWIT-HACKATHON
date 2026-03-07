export function ScheduleTaskHard(grid,currentDay,currentTime,currentTitle){
    //let newGrid = [...grid];
    let newGrid = grid.map(col => col.map(cell => ({ ...cell })));
    let success=false

    if(grid[currentDay][currentTime].title=="_"){
        newGrid[currentDay][currentTime] = {
        ...newGrid[currentDay][currentTime],
        title:currentTitle,
        flag:"hard",
        Htime:currentTime,
        Hday:currentDay
        }
        return [newGrid, true]
    }
    else if(grid[currentDay][currentTime].flag=="hard"){
        return [grid, false]
    }
    else{
        let conflicting=grid[currentDay][currentTime]
        newGrid[currentDay][currentTime] = {
        ...newGrid[currentDay][currentTime],
        title:currentTitle,
        flag:"hard",
        Htime:currentTime,
        Hday:currentDay
        }
        const[updatedGrid, softSuccess] = ScheduleTaskSoft(newGrid,conflicting.SoftStart,conflicting.SoftStartDay,conflicting.SoftEnd,conflicting.SoftEndDay,conflicting.title)
        newGrid=updatedGrid
        success=softSuccess
        if(success){
            return [newGrid, true]
        }
        else{
            return [grid, false]
        }
    }
}

export function ScheduleTaskSoft(grid,startTime,startDay,endTime,endDay,currentTitle){
    //let newGrid = [...grid];
    let newGrid = grid.map(col => col.map(cell => ({ ...cell })));
    let success = false
    let currentDay=startDay
    let currentTime=startTime
    while(currentDay<=endDay){
        while(currentTime<endTime){
            if(grid[currentDay][currentTime].title=="_"){
                newGrid[currentDay][currentTime] = {
                ...newGrid[currentDay][currentTime],
                title:currentTitle,
                flag:"soft",
                SoftStart:startTime,
                SoftStartDay:startDay,
                SoftEnd:endTime,
                SoftEndDay:endDay
                }
            return [newGrid, true]
            }
            currentTime+=1
        }
        currentTime=startTime
        currentDay+=1
    }
    currentDay=startDay
    currentTime=startTime
    while(currentDay<=endDay){
        while(currentTime<endTime){
            if(grid[currentDay][currentTime].flag=="soft"){
                let conflicting=grid[currentDay][currentTime]
                newGrid[currentDay][currentTime] = {
                    ...newGrid[currentDay][currentTime],
                    title:currentTitle,
                    flag:"hard",
                    Htime:currentTime,
                    Hday:currentDay
                    }
                const [updatedGrid, softSuccess] = ScheduleTaskSoft(newGrid,conflicting.SoftStart,conflicting.SoftStartDay,conflicting.SoftEnd,conflicting.SoftEndDay,conflicting.title)
                newGrid=updatedGrid
                success=softSuccess
                if(success){
                    newGrid[currentDay][currentTime] = {
                        ...newGrid[currentDay][currentTime],
                        title:currentTitle,
                        flag:"soft",
                        SoftStart:startTime,
                        SoftStartDay:startDay,
                        SoftEnd:endTime,
                        SoftEndDay:endDay,
                        Htime:"",
                        Hday:""
                    }
                    return [newGrid, success]
                }   
            }
            currentTime+=1
        }
        currentTime=startTime
        currentDay+=1
    }
    return [grid, false]
}

// function RenderTasks(grid,title,priority,Htime,Hday,SoftStart,SoftStartDay,SoftEnd,SoftEndDay){
//   let newGrid=[...grid]
//   let success = false
//   if (priority === "hard"){
//     [newGrid, success] = ScheduleTaskHard(grid,Hday,Htime,title)
//   }else{
//     [newGrid, success] = ScheduleTaskSoft(grid,SoftStart,SoftStartDay,SoftEnd,SoftEndDay,title) 
//   }
//   if(success){
//     return newGrid
//   }else{
//     return grid
//   }
// }