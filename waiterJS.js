module.exports = function Caffine(pool) {

    async function addShifts(waiterId, days) {
        for (let i = 0; i < days.length; i++) {
            const weekdayName = days[i];
            var working_id = await shiftId(weekdayName)

            console.log({ working_id, weekdayName, waiterId });

            // checkn

            await pool.query("insert into admin(waiters_id, shifts_id) values($1, $2)", [waiterId, working_id])
        }
    }

// async function loopName(name) {
// for (let i = 0; i < name.length; i++) {
//     const element = name[i];
//     var looping = await selectShift(element)

//    return looping
    
// }
// }

    async function addUser(name) {
        await pool.query('insert into waiters(waiters_names) values ($1)', [name]);

    }

    // async function nameUpdate(name) {
    //     var names = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
    //     var update = await pool.query('UPDATE admin set waiters_id = waiters_id+1 WHERE shfts_id = $1', [names]);
    //     return update;
    // }

    async function selectShift(days, name) {
        try {
            let waiterId = await getWaiterId(name)
console.log(waiterId);

        if (waiterId) {
             await resetPer(waiterId)
            await addShifts(waiterId, days)
        } else {
            await addUser(name)
            waiterId = await getWaiterId(name)
            await addShifts(waiterId, days)
        }

        return {}
        } catch (error) {
            console.log(error);
            
        }
        
    }

    async function sevenDays(){
        const seven = await pool.query('select days from shifts')
        return seven.rows
    }

    async function getAdminId(){
        
        const result = await pool.query('select days, waiters_names from admin join shifts on admin.shifts_id = shifts.id join waiters on admin.waiters_id = waiters.id ORDER BY shifts.id ASC')
        // console.log(result);
        
return result.rows
    }

    async function getWaiterId(name) {
        try {
            const results = await pool.query('select id from waiters where waiters_names = $1', [name])
            return results.rows[0].id;
        } catch (error) {
            return false
        }
    }
    async function shiftId(day) {
        try {
            var dayQuery = await pool.query("select id from shifts where days = $1", [day])
        let working_id = dayQuery.rows[0].id;
        return working_id;
        } catch (error) {
        console.log(error);
         
        }   
    }

    async function gettingShifts() {
        var list = await pool.query('SELECT days FROM shifts')
        return list.rows;
    }

    async function resetPer() {
         await pool.query('DELETE FROM admin where waiters_id = admin.id')
    }

    async function reset() {
        var reseting = await pool.query('DELETE FROM admin')
        return reseting
    }

    return {
        selectShift,
        gettingShifts,
        shiftId,
        addUser,
        resetPer,
         sevenDays,
        getAdminId,
        // loopName,
        reset
    }
}