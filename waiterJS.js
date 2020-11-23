module.exports = function Caffine(pool) {

    async function addShifts(waiterId, days) {
     await pool.query('delete from admin where waiters_id = $1', [waiterId] )
        for (let i = 0; i < days.length; i++) {
            const weekdayName = days[i];
            var working_id = await shiftId(weekdayName)
            await pool.query("insert into admin(waiters_id, shifts_id) values($1, $2)", [waiterId, working_id])
        }
    }



    async function addUser(name) {
        // var regNames = /^[a-zA-Z]+$/;
        // newRegex = RegExp(regNames)
        // regTest = newRegex.test(name)
        var namer = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
        var nameChecker = await pool.query('select * from waiters where waiters_names = $1', [namer])
        if (nameChecker.rowCount === 0) {
            await pool.query('insert into waiters(waiters_names) values ($1)', [namer]);
        }
        var naming = await pool.query('select id from waiters where waiters_names = $1', [namer])
        return naming.rows[0].id
        // console.log(naming.rows[0].id);
        
    }


    async function selectShift(days, name) {
        try {
            let waiterId = await getWaiterId(name)
            // console.log(waiterId);

            if (waiterId) {
                // await resetPer(waiterId)
                await addShifts(waiterId, days)
            } else {
                await addUser(name)
                waiterId = await getWaiterId(name)
                await addShifts(waiterId, days)
            }

            return {}
        } catch (error) {
            // console.log(error);

        }
    }


    async function sevenDaysWaiter(name) {
        try {
            const seven = await pool.query('select days from shifts')
            const userId = await getWaiterId(name)
            const shift = await getWaiterShifts(userId) || []
         console.log(shift);

            const rows = seven.rows
            await rows.forEach(async (day) => {
             //   console.log(day);
                
                day.waiters = []
                day.checked = '';
                shift.forEach(async (waiter) => {
                    console.log(waiter);
                    
                    if (day.days === waiter.days) {
                        day.checked = 'checked'

                    }
                    if (day.days === waiter.days) {
                        day.waiters.push(waiter);
                    }      
                    
                })
            })
            return rows;
        } catch (error) {
            // console.log(shift)
        }
    }
    

    async function getWaiterShifts(id) {
        try {
            const result = await pool.query('select days from admin join shifts on admin.shifts_id = shifts.id join waiters on admin.waiters_id = waiters.id where waiters_id = $1 ORDER BY shifts.id ASC', [id])
            return result.rows
            
        } catch (error) {
            // console.log(result.rows);
            
        }
    }


    async function checkedNames(name) {
        try {
            const checker = await pool.query('select days from admin join  shifts on admin.shifts_id = shifts.id  join waiters on admin.waiters_id = waiters.id where waiters_names=$1', [name]);
            return checker.rows
            
        } catch (error) {
            // console.log(checker.rows);
            
        }

    }


    async function sevenDays() {
        try {
            const seven = await pool.query('select days from shifts')
            const shift = await getAdminId()
            //  console.log(shift);
            
            const rows = seven.rows

            await rows.forEach(async (day) => {
                day.waiters = []
                // console.log((shift))
                // console.log(rows.length)

                shift.forEach(async (waiter) => {
                    if (day.days === waiter.days) {
                        day.waiters.push(waiter);

                        // console.log(day.waiters);
                    }

                    if (day.waiters.length === 3) {
                        day.color = "green"
                    }
                    else if (day.waiters.length < 3) {
                        day.color = "orange"
                    }
                    else if (day.waiters.length > 3) {
                        day.color = "red"
                        day.message = "day overbooked"
                    }
                })
            })
             console.log(rows);

            return rows;

        } catch (error) {
            // console.log(error)
        }

    }


    async function getAdminId() {

        const result = await pool.query('select days, waiters_names from admin join shifts on admin.shifts_id = shifts.id join waiters on admin.waiters_id = waiters.id ORDER BY shifts.id ASC')
        // console.log(result.rows);

        return result.rows
    }


    async function getWaiterId(name) {
        try {
            // var regNames = /^[a-zA-Z]+$/;
            // newRegex = RegExp(regNames)
            // regTest = newRegex.test(name)
            var namer = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
            const results = await pool.query('select id from waiters where waiters_names = $1', [namer])
            // console.log(naam);
            var naam = results.rows[0].id;
            return naam
        } catch (error) {
            return false
        }
    }

    async function shiftId(day) {
        try {
            if (day) {
                var dayQuery = await pool.query("select id from shifts where days = $1", [day])
                let working_id = dayQuery.rows[0].id;
                return working_id;
            }

        } catch (error) {
            console.log(working_id);

        }
    }
   
    async function gettingShifts() {
        var list = await pool.query('SELECT days FROM shifts')
        return list.rows;
    }

    async function getNames() {
        var naaam = await pool.query('select waiters_names from waiters')
        return naaam.rows;
    }
    async function reset() {
        var reseting = await pool.query('DELETE FROM admin; DELETE FROM waiters')
        return reseting
    }

    return {
        selectShift,
        gettingShifts,
        shiftId,
        addShifts,
        addUser,
        sevenDays,
        getAdminId,
        checkedNames,
        getNames,
        sevenDaysWaiter,
        getWaiterShifts,
        reset,
        getWaiterId
    }
}