/**
 * Created by anil on 25/12/16.
 */

let fb = require("./facebook");
let Promise = require("bluebird");
let _ = require("lodash");
let fs = require("fs");
let FBMedia = require("./media-model");
let FBMediaList = require("./media-list-model");
let download = require("./media-downloader").download;

function createDir( pageName) {
    var dir = "./storage/" + pageName ;

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }else{
        console.log("Directory already created");
    }
}

function fetchPhotos( pageName) {
    return FBMediaList.findOne({ page : pageName})
        .then(function (item) {
            if(item && item.done){
                throw new Error("Already Completed");
            }
            return fb.fetchPhotosFromPage(pageName)
        })
    .then(function (items) {
        if(!_.isEmpty( items)){
            //create directory in meantime
            createDir( pageName);
        }
        return Promise.all([ FBMedia.collection.insert( items ) , FBMediaList.create({ page : pageName , done : true })]);
    })
    .catch(console.log)

}

function downloadImages( pageName ) {
    var query = { type : "image" , isDownloaded:  false};
    if(pageName){
        query.page = pageName;
    }
    FBMedia.find(query).limit(100).exec()
        .then(function (items ) {
            var tasks = [];
            items.forEach( function (item) {
               var itemJSON = item.toJSON();
               var markFile = markAsDownloaded( item );
               tasks.push(downloadWithPromise( itemJSON.url , itemJSON , markFile ))
            });
            return Promise.all( tasks);
        })
        .then( function ( items) {
            if( _.isEmpty(items)){
                console.log( "Finished Downloading All files... Exiting..");
                process.exit();
            }
            return Promise.all([ FBMedia.count(query) , FBMedia.count( { page : pageName })]);
        })
        .then(function (count) {
            let percentage = parseInt(((count[1] - count[0]) * 100)/count[1]);
            console.log( "Finished Downloading : " , (count[1] - count[0]) + "/" + count[1] , "("+ percentage + "%)",  "... Fetching now..");
            downloadImages( pageName);
        })
        .catch( console.log)
}

function markAsDownloaded( file) {
    return function (err, data) {
        if(!err){
            file.isDownloaded = true;
            return file.save();
        }
    }
}

function downloadWithPromise(url , itemJSON , markFile ) {
    return new Promise( function (resolve, reject) {
        download( url , itemJSON , function (err, data) {
            markFile.apply( arguments);
            if(!err){
                return resolve(true);
            }
            reject(false);
        })
    })
}

// downloadImages("TheIDEAlistRevolution");

function start(pageName) {
    fetchPhotos( pageName)
    .catch( console.log )
        .then(function () {
            console.log("Downloading files now...");
            return downloadImages(pageName)
        })
    .catch( console.log )
}

module.exports = { start }