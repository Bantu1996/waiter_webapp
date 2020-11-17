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
    await pool.query("delete from admin");

  });

  // it("should be able to enter a name", async function () {
  //   await coffee.addShifts("Bantu")
  //   var num = await coffee.selectShift("Bantu");
  //   assert.equal(1, num);
  //   // console.log(num);
  // });

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





  it("should be able to get  waiter_id  and  shifts_id ", async function () {

    const num = await coffee.getAdminId();
    assert.deepEqual([], num);
    console.log(num);
  });



  after(function () {
    pool.end();
  })

})
