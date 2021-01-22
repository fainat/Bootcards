const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    age:  {
        type: Number,
        required: true
    },
    username:  {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    existsParserId: String,
    createdData: { type: Date, default: Date.now},
    devices: [

    ],
    friendsGroup: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            username: String
        }
    ]
});
/*
    this is other idea for friends group
    create other .js file friendsGroup and connect from id === id

 */
UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema);