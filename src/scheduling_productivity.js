function validSlot(grid,day,time){
    return(day >= 0 && day < grid.length && time >= 0 && time < grid[0].length)
}

export function ScheduleTaskHard(grid,rankedSlots,currentDay,currentTime,currentTitle){
    console.log(rankedSlots)

    if (!validSlot(grid,currentDay,currentTime)){
        alert("Invalid time slot")
        return [grid, false]
    }
    let newGrid = grid.map(col => col.map(cell => ({ ...cell })))
    let interval = newGrid[currentDay][currentTime];
    if (interval.title === "_") {
        newGrid[currentDay][currentTime] = {
            ...interval,
            title: currentTitle,
            flag: "hard",
            Htime: currentTime,
            Hday: currentDay
        }
        return [newGrid, true]
    }
    if (interval.flag === "hard") {
        alert("There is already a hard task here");
        return [grid, false]
    }
    let conflicting = interval;
    newGrid[currentDay][currentTime] = {
        ...interval,
        title: currentTitle,
        flag: "hard",
        Htime: currentTime,
        Hday: currentDay
    }
    const [updatedGrid, success] = ScheduleTaskSoft(newGrid,rankedSlots,conflicting.SoftStart,conflicting.SoftStartDay,conflicting.SoftEnd,conflicting.SoftEndDay,conflicting.title)
    if (success){
        return [updatedGrid, true]
    }
    return [grid, false];
}

function inSlot(pInterval,startTime,startDay,endTime,endDay){
    let result = true
    if(pInterval.day==startDay && pInterval.time<startTime){
        result=false
    }
    if(pInterval.day==endDay && pInterval.time>=endTime){
        result=false
    }
    if(pInterval.day<startDay || pInterval.day>endDay){
        result=false
    }
    return result
}

export function ScheduleTaskSoft(grid,rankedSlots,startTime,startDay,endTime,endDay,currentTitle){
    let newGrid = grid.map(col => col.map(cell => ({ ...cell })))
    let pInterval={}
    let interval={}
    for(let i=0; i<rankedSlots.length; i++){
        pInterval=rankedSlots[i]
        if(pInterval.day!=null && pInterval.time!=null){
            if(inSlot(pInterval,startTime,startDay,endTime,endDay)){
                interval=newGrid[pInterval.day][pInterval.time]
                if (interval.title === "_") {
                    newGrid[pInterval.day][pInterval.time] = {
                        ...interval,
                        title: currentTitle,
                        flag: "soft",
                        SoftStart: startTime,
                        SoftStartDay: startDay,
                        SoftEnd: endTime,
                        SoftEndDay: endDay
                    }
                    return [newGrid, true]
                }
            }
        }
    }
    for(let i=0; i<rankedSlots.length; i++){
        pInterval=rankedSlots[i]
        if(pInterval.day!=null && pInterval.time!=null){
            if(inSlot(pInterval,startTime,startDay,endTime,endDay)){
                interval=newGrid[pInterval.day][pInterval.time]
                if (interval.title === "soft") {
                    let conflicting=interval
                    newGrid[pInterval.day][pInterval.time] = {
                        ...interval,
                        title: currentTitle,
                        flag: "hard",
                        Hday: pInterval.day,
                        Htime: pInterval.time
                    }
                    const [updatedGrid, success] = ScheduleTaskSoft(newGrid,rankedSlots,conflicting.SoftStart,conflicting.SoftStartDay,conflicting.SoftEnd,conflicting.SoftEndDay,conflicting.title)
                    if (success){
                        updatedGrid[pInterval.day][pInterval.time] = {
                        ...updatedGrid[pInterval.day][pInterval.time],
                            title: currentTitle,
                            flag: "soft",
                            SoftStart: startTime,
                            SoftStartDay: startDay,
                            SoftEnd: endTime,
                            SoftEndDay: endDay,
                            Htime: "",
                            Hday: ""
                        }
                    return [updatedGrid, true]
                    }
                }
            }
        }
    }
    return [grid, false]
}
