function isValidSlot(grid, day, time) {
    return (
        day >= 0 &&
        day < grid.length &&
        time >= 0 &&
        time < grid[0].length
    );
}


export function ScheduleTaskHard(grid, currentDay, currentTime, currentTitle) {
    if (!isValidSlot(grid, currentDay, currentTime)) {
        alert("Invalid time slot");
        return [grid, false];
    }
    let newGrid = grid.map(col => col.map(cell => ({ ...cell })));
    let cell = newGrid[currentDay][currentTime];
    // empty slot
    if (cell.title === "_") {
        newGrid[currentDay][currentTime] = {
            ...cell,
            title: currentTitle,
            flag: "hard",
            Htime: currentTime,
            Hday: currentDay
        };
        return [newGrid, true];
    }
    if (cell.flag === "hard") {
        alert("there is already a hard task here");
        return [grid, false];
    }
    let conflicting = cell;
    newGrid[currentDay][currentTime] = {
        ...cell,
        title: currentTitle,
        flag: "hard",
        Htime: currentTime,
        Hday: currentDay
    };
    const [updatedGrid, success] = ScheduleTaskSoft(
        newGrid,
        conflicting.SoftStart,
        conflicting.SoftStartDay,
        conflicting.SoftEnd,
        conflicting.SoftEndDay,
        conflicting.title
    );
    if (success) return [updatedGrid, true];
    return [grid, false];
}



export function ScheduleTaskSoft(grid, startTime, startDay, endTime, endDay, currentTitle) {
    let newGrid = grid.map(col => col.map(cell => ({ ...cell })));
    for (let day = startDay; day <= endDay; day++) {
        for (let time = startTime; time < endTime; time++) {
            if (!isValidSlot(newGrid, day, time)) continue;
            let cell = newGrid[day][time];
            if (cell.title === "_") {
                newGrid[day][time] = {
                    ...cell,
                    title: currentTitle,
                    flag: "soft",
                    SoftStart: startTime,
                    SoftStartDay: startDay,
                    SoftEnd: endTime,
                    SoftEndDay: endDay
                };
                return [newGrid, true];
            }
        }
    }
    // PASS 2 — displace another soft task
    for (let day = startDay; day <= endDay; day++) {
        for (let time = startTime; time < endTime; time++) {
            if (!isValidSlot(newGrid, day, time)) continue;
            let cell = newGrid[day][time];
            if (cell.flag === "soft" && cell.title !== currentTitle) {
                let conflicting = cell;
                newGrid[day][time] = {
                    ...cell,
                    title: currentTitle,
                    flag: "hard",
                    Htime: time,
                    Hday: day
                };
                const [updatedGrid, success] = ScheduleTaskSoft(
                    newGrid,
                    conflicting.SoftStart,
                    conflicting.SoftStartDay,
                    conflicting.SoftEnd,
                    conflicting.SoftEndDay,
                    conflicting.title
                );
                if (success) {
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
                    };
                    return [updatedGrid, true];
                }
            }
        }
    }

    return [grid, false];
}
