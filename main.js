/**
 * Created by anil on 24/12/16.
 */

const express = require("express"),
    app = express();

//Configure DB
require("./dao-config");

//Start downloading
require("./fb-controller").start("awakeningpeople");