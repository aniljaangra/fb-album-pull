/**
 * Created by anil on 26/9/16.
 */

const mongoose = require('mongoose');

mongoose.Promise = Promise;
// mongoose.set('debug', true);
mongoose.connect( "mongodb://localhost:27017/facebook" );


mongoose.connection.on( 'connected' , () => console.log("MongoDB Successfully Connected") );
mongoose.connection.on( 'error' , ( err ) => console.log("Error Connecting MongoDB" , err ) );




