const mongoose = require('mongoose');
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdOn: { type: Date, default: Date.now },
    passwordResetToken: { type: String },
    passwordResetTokenExpires: { type: Date },
});

userSchema.methods.createResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetTokenExpires = Date.now() + 10 * (60 * 1000);

    return resetToken;
}

module.exports = mongoose.model('User', userSchema);