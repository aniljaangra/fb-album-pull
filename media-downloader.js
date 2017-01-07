/**
 * Created by anil on 25/12/16.
 */

let request = require("request"),
    path = require("path"),
    fs = require("fs"),
    fileDir = path.join( __dirname , "./storage" );

function download(url , data , callback ) {
    let fileName = [ data.type || "image" , data.mediaId || 1 ].join("_");
    let fileNameWithExtension  ;
    request
        .head(url)
        .on('response', function(response) {
            if(response.statusCode === 200){
                let extension = response.headers['content-type'].split("/")[1] // 'image/png'
                extension = extension == "jpeg" ? "jpg" : extension;
                let fileNameWithExtension = path.join( fileDir , data.page , [ fileName , extension ].join("."));
                request(url).pipe(fs.createWriteStream(fileNameWithExtension)).on('error', callback).on('close', callback)
            } // 200
        })
}

module.exports = { download };