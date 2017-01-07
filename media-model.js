/**
 * Created by thinksysuser on 26/9/16.
 */

// importing mongoose
const mongoose = require("mongoose");

//================================================== Schema =========================================================

    // user model
    userSchema = mongoose.Schema({
            mediaId: { type : String , index : { unique : true }   },      // media id
            url : { type : String , required : true },      // media url
            page : { type : String },      // media page name
            isDownloaded : { type : "boolean" , required : true  , default : false },      // media downloaded
            type : { type : String ,  required : true  ,default : "image" },      // media type
        },
        {
            timestamps: true
        });

let model = mongoose.model('Media', userSchema, 'media');

//==================================================Exports =========================================================

module.exports = model;
