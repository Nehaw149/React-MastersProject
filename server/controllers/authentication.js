const jwt = require('jwt-simple');
const User = require('../models/user.js');
const config = require('../config');

function tokenForUser(user){
	// Json Web Token(JWT) = encrypt ( User.ID + Our secret String)

	// sub= Subject : from the subject we know whom is this token belong to.
	// iat =issued at time

	const timestamp = new Date().getTime();
	return jwt.encode({sub:user.id, iat:timestamp}, config.secret);

}

exports.signin =function(req,res,next){
	//Here the user has already authenticated his email and password
	// we just have to give them a Token
	res.send({token: tokenForUser(req.user),userName:req.user.name,image:req.user.image});

	// Note: The req.user is supplied here with help of the passport localLogin
	// because when we pass this auth we get the user back by 'done' function
	// and 'done' function put the user is 'req' under the name 'user'

}

exports.signup = function(req ,res , next){
	console.log("Request : ",req.body);
	const email = req.body.email;
	const password = req.body.password;
	const name = req.body.name;

	if (!email || !password){
		return res.status(422).send({error:'you must provide email and password'});
	}

	User.findOne({email: email}, function(err, foundUser){
		if(err)
			{
				return next(err);
			}
		if(foundUser){
			return res.status(422).send({error: 'Email is in use' });
		}

		const newUser = new User({
			email: email,
			password: password,
			name:name,
			image:''
		})

		newUser.save(function(err){
			if(err)
				return next(err);

		//Respond to the request indicationg the user was created
		return res.status(201).send({token:tokenForUser(newUser),userName:newUser.name,image:''});
		});
	});
}
