module.exports = function(RED) {

var JoyStick = require('./JoyStick');


function joystick(n) {

	RED.nodes.createNode(this,n);
    this.name = n.name;
    this.topic = n.topic;

    var node = this;

    this.stick = new JoyStick("DragonRise Inc.  ");
    this.stick.on('changed',function(state){
    	var msg = {};
    	msg.topic = node.topic;
    	msg.payload = state;
    	node.send(msg);
    })

    node.on('close', function(){
    	node.stick.close();
    });
}

RED.nodes.registerType("JoyStick",joystick);
}