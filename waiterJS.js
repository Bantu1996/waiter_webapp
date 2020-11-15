module.exports = function Caffine(pool) {

    async function addShifts(waiterId, days) {
        for (let i = 0; i < days.length; i++) {
            const weekdayName = days[i];
            var working_id = await shiftId(weekdayName)

            // console.log({ working_id, weekdayName, waiterId });

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
        var namer = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
        await pool.query('insert into waiters(waiters_names) values ($1)', [namer]);

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

    async function sevenDays() {
        const seven = await pool.query('select days from shifts')
        const shift = await getAdminId()
        const rows = seven.rows

        await rows.forEach(async (day) => {
            day.waiters = []
            // console.log((shift))
            // console.log(rows.length)

            shift.forEach(async (waiter) => {
                if (day.days === waiter.days) {
                    day.waiters.push(waiter)
                }
                else if (day.waiters === 3) {
                    return "Awe Boss"
                }
            })
        })
        //  console.log(rows.length);

        return rows;

    }

    async function getAdminId() {

        const result = await pool.query('select days, waiters_names from admin join shifts on admin.shifts_id = shifts.id join waiters on admin.waiters_id = waiters.id ORDER BY shifts.id ASC')
        // console.log(result.rows);

        return result.rows
    }
    async function scheduling() {
        // await getAdminId();
        // console.log(waiterDay);
        elementLength
        var waiterDay = await getAdminId()
        for (let i = 0; i < waiterDay.length; i++) {

            const element = waiterDay[i];
            // console.log(elementLength);

            var elementLength = element.length
            // console.log(elementLength);
            if (elementLength === 3) {
                return { color: enough }
            }
            else if (element.length > 3) {
                return { color: overbooked }
            }
            else if (element.length < 3) {
                return { color: still_needed }
            }

        }
    }

    async function getWaiterId(name) {
        try {
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

                //  if (working_id.length < 2) {
                //     return "please select more than one days";
            }

        } catch (error) {
            console.log(error);

        }
    }
    // async function scheduleAdmin() {
    //     array.forEach(element => {

    //     });
    // }
    async function gettingShifts() {
        var list = await pool.query('SELECT days FROM shifts')
        return list.rows;
    }

    async function resetPer() {
        await pool.query('DELETE FROM admin where waiters_id = admin.id')
        // DELETE FROM admin USING waiters WHERE admin.id = waiters.id;
    }

    async function reset() {
        var reseting = await pool.query('DELETE FROM admin; DELETE FROM waiters')
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
        scheduling,
        // scheduleAdmin,
        reset
    }
}