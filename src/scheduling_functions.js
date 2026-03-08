function validSlot(grid,day,time){
    return(day >= 0 && day < grid.length && time >= 0 && time < grid[0].length)
}

export function ScheduleTaskHard(grid,currentDay,currentTime,currentTitle){
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
    const [updatedGrid, success] = ScheduleTaskSoft(newGrid,conflicting.SoftStart,conflicting.SoftStartDay,conflicting.SoftEnd,conflicting.SoftEndDay,conflicting.title)
    if (success){
        return [updatedGrid, true]
    }
    return [grid, false];
}



export function ScheduleTaskSoft(grid,startTime,startDay,endTime,endDay,currentTitle){
    let newGrid = grid.map(col => col.map(cell => ({ ...cell })))
    let day=startDay
    let time=startTime
    let end=24
    while(day<=endDay){
        if(day==endDay){
            end=endTime
        }
        while(time<end){
            let interval = newGrid[day][time]
            if (interval.title === "_") {
                newGrid[day][time] = {
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
        time++
        }
    time=0
    day++
    }

    day=startDay
    time=startTime
    end=24
    while(day<=endDay){
        if(day==endDay){
            end=endTime
        }
        while(time<end){
            let interval = newGrid[day][time]
            if (interval.flag === "soft" && interval.title !== currentTitle){
                let conflicting = interval
                newGrid[day][time] = {
                    ...interval,
                    title: currentTitle,
                    flag: "hard",
                    Htime: time,
                    Hday: day
                }
                const [updatedGrid, success] = ScheduleTaskSoft(newGrid,conflicting.SoftStart,conflicting.SoftStartDay,conflicting.SoftEnd,conflicting.SoftEndDay,conflicting.title)
                if (success){
                    updatedGrid[day][time] = {
                        ...updatedGrid[day][time],
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
        time++
        }
    time=0
    day++
    }

    return [grid, false]
}
