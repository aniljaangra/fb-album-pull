/**
 * Created by anil on 24/12/16.
 */

const express = require("express"),
    app = express();

//Configure DB
require("./dao-config");
var b = require("./a");
console.log(b.a)
b.change()
console.log(require("./a").a)

// require("./fb-controller").start("awakeningpeople");