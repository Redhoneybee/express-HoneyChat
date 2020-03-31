
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../schemas/user');

module.exports = (passport) => {
  passport.use(new LocalStrategy({
    usernameField : 'id',
    passwordField : 'password'
  }, async (id, password, done) =>{
    try{
      const exId = await User.findOne( { id } );
      console.log(exId);
      if(exId){
        // user is
        const result = await bcrypt.compare(password, exId.password);
        console.log(password);
        console.log(result);
        if(result) { done(null, exId); }
        else { done(null, false, { message : 'no matched password' }); }
      }else{
        done(null, false, { message : 'no matched id' });
      }
    }catch(err){
      console.error(err);
      done(err);
    }
  }));
}
