var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
});
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    var salt = await bcrypt.genSalt(10);
    var hashPassword = await bcrypt.hash(this.password, salt);
    this.password = hashPassword;
    next();
});

userSchema.methods.comparePassword = async function (password) {
    // compare the password passed in the parameter with the stored password  
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);