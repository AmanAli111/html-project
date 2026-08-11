const mongoose = require('mongoose');

const HomeSchema = mongoose.Schema(
{
    profilePic:String,
    fullName:
    {
        type:String,
        required: true
    },
    email:
    {
        type:String,
        required: true,
        unique:true,
        trim:true,
        lowercase:true,
        match:[/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password:
    {
        type:String,
        required:true,
    },
    role:
    {
        type:String,
        default:"user"
    },
});

module.exports = mongoose.model('User',HomeSchema);