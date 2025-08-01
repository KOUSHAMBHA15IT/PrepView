import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageUrl: {
        type: String,
        default: null,
    },
}, {timestamps: true});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.isPasswordMatch = async function(password){
    return await bcrypt.compare(password, this.password);
}

export const User = new mongoose.model('User', userSchema);