module.exports = function routes(coffee){

const waiter = async function (req, res) {
    var sevenNights = await coffee.sevenDays();
   res.render('waiter', {
   sevenNights
  });
 }
 const waiterAgain = async function (req, res) {
    var sevenNights = await coffee.sevenDays();
    res.render('waiter', {
    sevenNights
  
    })
   }

const daysOfWeek = async function (req, res) {

    var waiters =   await coffee.getAdminId()
    var sevenNights = await coffee.sevenDays();
    // console.log(sevenNights.length);
  
    
    res.render('days',{
      waiters,sevenNights} )
  }

  const getUser =  async function (req, res) {
    var user = req.params.username
    var sevenNights = await coffee.sevenDays();
    res.render('waiter', {
     username: user,
     sevenNights
     })
  }

  const postUser = async function (req, res) {
    var boxes = req.body.checks
    var user = req.params.username
   
     var sub = await coffee.selectShift(boxes, user)
   if(sub) {
    req.flash('success', 'Successfully submitted your shifts')
   }
   else{
    req.flash('error', 'Please select atleast from 2 shifts and up')
   }
    
    
    res.render('waiter', {
      username: user,
      sub
    
    });
  
  }

  const resetting = async function (req, res) {
    await coffee.reset(),
      req.flash('success', 'Successfully cleared the Waiters list')
    res.redirect('/days')
  }
  
return{
    waiter,
    waiterAgain,
    daysOfWeek,
    getUser,
    postUser,
    resetting
}
}