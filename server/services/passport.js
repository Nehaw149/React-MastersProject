const passport = require('passport');
const User = require('../models/user');
const config = require('../config.js');
const JwtStrategy =require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const localStrategy = require('passport-local');



//**********************************************************************************
// This strategy is to be sure if the provided username and password are right	   *
// when sign in, and then return a token to the user															 *
//**********************************************************************************

// Create Local Strategy
const localOptions = {usernameField: 'email'}; // the field name of email in the form(front-end) must be 'email'
const localLogin = new localStrategy(localOptions, function(email,password, done){
// Verify if the email and password, call done with the user
//if it's the correct email and password
//otherwise, call done with false
User.findOne({email:email}, function(err,user){
	if(err)  {return done(err);}
	if(!user) {return done(null, false);}

	//otherwise check if the password is correct
	user.comparePassword(password, function(err,isMatch){
		if(err){return done(err);}
		if(!isMatch){return done(null,false);}

		return done(null, user);

	})


});

});

//**********************************************************************************
// This strategy is to be sure if the token which provide by a user is right token *
//**********************************************************************************

// 1- Setup options for  JWT Strategy
const jwtOptions={
	// the token will be sent in the header of request in field called 'authorizations';
	jwtFromRequest:ExtractJwt.fromHeader('authorization'),
	secretOrKey:config.secret
};

// 2- Create JWT Strategy
const jwtLogin =  new JwtStrategy(jwtOptions,function(payload,done){
// Payload = the decrypted, token in other words: payload= {sub: user.id, iat:somevalue}

// See if the User ID in the payload exist in DB
// if it does, then call 'done' with the user object
//otherwise, call 'done' without user object

User.findById(payload.sub, function(err,user){
	if(err){
		return done(err,false);
	}

	if(user)
	{
		return done(null, user);
		// null = there is no error
	}
	else{
		return done(null, false);
		// false = we do not find the user
	}
});

});

// 3-Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
