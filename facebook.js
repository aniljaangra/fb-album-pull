/**
 * Created by anil on 25/12/16.
 */

let accessToken = "EAACEdEose0cBADGTZCYReZC37ZAV5W9EZADAl4BmrZBOJjjtZBygMVr7nDSmseYdVuCmc6e0D1Paan7PhhdyaYCF4LUENQ45ZCPP2ZB7t8lkMlYN4mm0kdLc9qY4M2PZBiZBgTwwLrZBQXsvulAmpGdw5IGD8xQuflR3H9p4ZBmEFjDWswZDZD";
let fbImageURL = "https://graph.facebook.com/[IMAGE_ID]/picture?type=normal";
let imageId = "[IMAGE_ID]";
// Using require() in ES2015
let {FB, FacebookApiException} = require('fb');
let Promise = require('bluebird');
let _ = require('lodash');
FB.options({version: 'v2.8'});
FB.setAccessToken(accessToken);
let fbAPI = Promise.promisify( FB.api , FB );




function fetchPhotosFromPage( pageName) {
    let ids = [];
    let  url = pageName+'/photos?type=uploaded&';
    return new Promise(function( resolve , reject ){
        function loadMoreData( toAppend ) {
            fbAPI( url + toAppend || "", { fields: ['id'] , limit : 500 })
            //data comes in error param
            .catch( function (response) {
                if( response.error){
                    console.log(response.error)
                    return reject( response.error);
                }
                if(_.isArray(response.data)){
                    var photoIds = _.map( response.data , "id" );
                    ids = _.uniq(ids.concat(photoIds));
                    console.log( _.size(ids));
                    if(response.paging && response.paging.next){
                        loadMoreData(response.paging.next.split("uploaded&")[1]);
                    }else{
                        resolve( _convertToFullImage(ids , pageName) );
                    }
                }else{
                    resolve( _convertToFullImage(ids , pageName) );
                }
            })
        }
        loadMoreData();
    })
}


function _convertToFullImage(ids , page ) {
    ids = [].concat(ids);
    return _.uniq(ids).map(function (id) {
        return {
            mediaId : id,
            page : page,
            isDownloaded : false,
            type : "image",
            url : fbImageURL.replace( imageId , id)
        }
    })

}
module.exports = { fetchPhotosFromPage };