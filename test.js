var JoyStick = require('./JoyStick');

var devices = JoyStick.devices();
console.log(devices);

var stick = new JoyStick('DragonRise Inc.  ');

stick.on("changed", function(state){
    console.log(state);
});

stick.on("raw", function(state){
    console.log(state);
});
