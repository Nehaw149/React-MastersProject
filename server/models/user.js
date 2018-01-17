const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');


// Define our user's model
const userSchema =  new Schema({
	name:String,
	email:{type:String, unique:true, lowercase: true},
	password: String,
	image:String
});
//lowercase:true = before saving any email it will be transferred into lowecase
//ex: ASD@Dom.com => asd@dom.com

// On Save Hook, encrypt password, because we don't want to save a plaintext password
// therefore we hash it !!
userSchema.pre('save',function(next){
	const user = this;

	//Generate a salt,
	bcrypt.genSalt(10, function(err,salt){
		if(err)
			return next(err);

		// Hash(encrypt) the password using the salt
		// Salt + plain Password => salt + hashed Password this is the final stored password
		bcrypt.hash(user.password, salt, null, function(err, hash){
			if(err)
				return next(err);
			user.password= hash;
			next();
		});
	});
});

userSchema.methods.comparePassword = function (candidatePassword, callback){
	bcrypt.compare(candidatePassword, this.password, function (err, isMatch){
		if(err) {return callback(err);}

		callback(null, isMatch);
	});
}

// Create the model class
const ModelClass = mongoose.model('user', userSchema);

// Export the model
module.exports = ModelClass;
