const assert = require('assert');
const Caffine = require('../waiterJS');
const pg = require("pg");
const Pool = pg.Pool;

// we are using a special test database for the tests
const connectionString = process.env.DATABASE_URL || 'postgresql://bantu:s0ty@t0b@n2@localhost:5432/waiters_db_test';

const pool = new Pool({
  connectionString
});

var coffee = Caffine(pool)

describe('Waiter Availability', function () {

  // const INSERT_QUERY = " INSERT INTO greeting(greeted_name, greet_counter) VALUES ($1, $2)";

  beforeEach(async function () {
    // clean the tables before each test run
    await pool.query("delete from admin; delete from waiters");

  });

  it("should be able to enter a name", async function () {

    await coffee.addUser("Bantu")
    await coffee.addUser("Siya")
    await coffee.addUser("Bibo")
    await coffee.addUser("Moonlight")
    await coffee.addUser("Makho")
    await coffee.addUser("Sandile")
    await coffee.addUser("Bhuda")
    await coffee.addUser("Ban")
    var num = await coffee.getNames();
    assert.deepEqual([
      {
        waiters_names: 'Bantu'
      },
      {
        waiters_names: 'Siya'
      },
      {
        waiters_names: 'Bibo'
      },
      {
        waiters_names: 'Moonlight'
      },
      {
        waiters_names: 'Makho'
      },
      {
        waiters_names: 'Sandile'
      },
      {
        waiters_names: 'Bhuda'
      },
      {
        waiters_names: 'Ban'
      }

    ], num);
    console.log(num);
  });

  it("should be able to select shifts as a waiter", async function () {

    await coffee.selectShift("Monday")
    await coffee.selectShift("Tuesday")
    await coffee.selectShift("Wednesday")
    await coffee.selectShift("Thursday")
    await coffee.selectShift("Friday")
    await coffee.selectShift("Saturday")
    await coffee.selectShift("Sunday")

    var num = await coffee.gettingShifts()

    assert.deepEqual([
      {
        days: 'Monday'
      },
      {
        days: 'Tuesday'
      },
      {
        days: 'Wednesday'
      },
      {
        days: 'Thursday'
      },
      {
        days: 'Friday'
      },
      {
        days: 'Saturday'
      },
      {
        days: 'Sunday'
      }
    ], num);
    // console.log(num);
  });





  it("should be able to get waiters_id ", async function () {

    await coffee.sevenDaysWaiter()
    await coffee.addUser("Miranda");
    const waiterid = await coffee.getWaiterId("Miranda");
    const testQuery = await pool.query('select id from waiters where waiters_names = $1', ["Miranda"])
    assert.equal(testQuery.rows[0].id, waiterid);
    // console.log(num);
  });

  it("should be able to get day_id ", async function () {

    await coffee.sevenDaysWaiter()
    const shiftId = await coffee.shiftId("Monday");
    const testQuery = await pool.query('select id from shifts where days = $1', ['Monday'])
    assert.equal(testQuery.rows[0].id, shiftId);
    // console.log(num);
  });

  it("should be able to add colors table", async function () {
    await coffee.selectShift(["Monday"], "Bantu")
    await coffee.selectShift(["Monday"], "Charl")
    await coffee.selectShift(["Monday"], "Chuma")
  

    
    const color = await coffee.sevenDays()
    // const colorWaiter = await coffee.sevenDaysWaiter()
    // const colorTable = await pool.query('select days, waiters_names from admin join shifts on admin.shifts_id = shifts.id join waiters on admin.waiters_id = waiters.id ORDER BY shifts.id ASC')

    assert.deepEqual( [
      {
      "color": "green",
        "days": "Monday",
       "waiters": [],
      "waiters": [
        {
          "days": "Monday",
          "waiters_names": "Bantu"
        },
        {
          "days": "Monday",
          "waiters_names": "Charl"
        },
        {
          "days": "Monday",
          "waiters_names": "Chuma"
        },
      ]
      },
      {
      "color": "orange",
        "days": "Tuesday",
        "waiters": []
      },
      {
      "color": "orange",
        "days": "Wednesday",
        "waiters": []
      },
      {
      "color": "orange",
        "days": "Thursday",
        "waiters": []
      },
      {
      "color": "orange",
        "days": "Friday",
        "waiters": []
      },
      {
      "color": "orange",
        "days": "Saturday",
        "waiters": []
      },
      {
      "color": "orange",
        "days": "Sunday",
        "waiters": []
      }
    ], color)
    // assert.deepEqual([], colorWaiter)
    
    // console.log(colorWaiter);

  })

   it("should be able to identify checked days", async function () {

      await coffee.selectShift(["Monday"], "Bantu")
      await coffee.selectShift(["Monday"], "Charl")
      await coffee.selectShift(["Monday"], "Chuma")
    
      const checkedWaiter = await coffee.sevenDaysWaiter()
  
      assert.deepEqual( [
        {
          checked: '',
          days: 'Monday',
          waiters: []
        },
        {
          checked: '',
          days: 'Tuesday',
          waiters: []
        },
        {
          checked: '',
          days: 'Wednesday',
          waiters: []
        },
        {
          checked: '',
          days: 'Thursday',
          waiters: []
        },
        {
          checked: '',
          days: 'Friday',
          waiters: []
        },
        {
          checked: '',
          days: 'Saturday',
          waiters: []
        },
        {
          checked: '',
          days: 'Sunday',
          waiters: []
        }
      ], checkedWaiter)
    
  
    })
 
  it("should be able to reset the waiter availabilty app", async function () {

    await coffee.addUser("Bantu")
    await coffee.addUser("Chuma")
    await coffee.addUser("Sibo")
    await coffee.reset();
    const num = await coffee.getNames();
    assert.equal(0, num)
  })

  after(function () {
    pool.end();
  })

})
