/**
 * Created by thinksysuser on 26/9/16.
 */

// importing mongoose
const mongoose = require("mongoose");

//================================================== Schema =========================================================

    // user model
    userSchema = mongoose.Schema({
            page : { type : String },      // media page name
            done : { type : "boolean" , required : true  , default : false },      // media downloaded done
        },
        {
            timestamps: true
        });

let model = mongoose.model('MediaList', userSchema, 'medialist');

//==================================================Exports =========================================================

module.exports = model;
