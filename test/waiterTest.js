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

  it("should be able to get shifts_id ", async function () {

    await coffee.sevenDaysWaiter()
    await coffee.addUser("Miranda");
    const waiterid = await coffee.getWaiterId("Miranda");
    const testQuery = await pool.query('select id from waiters where waiters_names = $1', ["Miranda"])
    assert.equal(testQuery.rows[0].id, waiterid);
    // console.log(num);
  });



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
