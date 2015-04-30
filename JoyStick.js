var HID = require('node-hid');
var events = require('events');
var util = require('util');

function JoyStick(name) {
    var devices = HID.devices();
    var stick = this;
    for (var i=0; i<devices.length; i++) {
        if (devices[i].manufacturer === name) {
            this._device = new HID.HID(devices[i].path);
            this._device.on("data", function(data) {
                //console.log(data);
                var state = {};
                var changed = false;
                var i1 = data.readUInt8(0);
                var i2 = data.readUInt8(1);
                // var i3 = data.readUInt8(2);
                // var i4 = data.readUInt8(3);
                // var i5 = data.readUInt8(4);
                var i6 = data.readUInt8(5);
                var i7 = data.readUInt8(6);
                // var i8 = data.readUInt8(7);
                //console.log(i7);

                switch (i1) {
                    case 0:
                        state.left = 1;
                        state.right = 0;
                        break;
                    case 127:
                        state.left = 0;
                        state.right = 0;
                        break;
                    case 255:
                        state.left = 0;
                        state.right = 1;
                        break;
                }

                switch (i2) {
                    case 0:
                        state.up = 1;
                        state.down = 0;
                        break;
                    case 127:
                        state.up = 0;
                        state.down = 0;
                        break;
                    case 255:
                        state.up = 0;
                        state.down = 1;
                        break;
                }

                state.button1 = 0;
                state.button2 = 0;
                state.button3 = 0;
                state.button4 = 0;
                var test = i6 >> 4;

                if (test & 1) {
                    state.button1 = 1
                }

                if (test & 2) {
                    state.button2 = 1;
                }

                if (test & 4) {
                    state.button3 = 1;
                }

                if (test & 8) {
                    state.button4 = 1;
                }

                state.rightTrigger1 = 0;
                state.rightTrigger2 = 0;
                state.leftTrigger1 = 0;
                state.leftTrigger2 = 0;
                var tigger = i7 - 64;

                if (tigger & 1) {
                    state.leftTrigger1 = 1
                }

                if (tigger & 2) {
                    state.rightTrigger1 = 1;
                }

                if (tigger & 4) {
                    state.leftTrigger2 = 1;
                }

                if (tigger & 8) {
                    state.rightTrigger2 = 1;
                }

                if (stick.old_state) {
                    if (state.left != stick.old_state.left ||
                        state.right != stick.old_state.right ||
                        state.up != stick.old_state.up ||
                        state.down != stick.old_state.down) {
                        changed = true;
                    }
                    if (state.button1 != stick.old_state.button1 ||
                        state.button2 != stick.old_state.button2 ||
                        state.button3 != stick.old_state.button3 ||
                        state.button4 != stick.old_state.button4) {
                        changed = true;
                    }
                    if (state.leftTrigger1 != stick.old_state.leftTrigger1 ||
                        state.leftTrigger2 != stick.old_state.leftTrigger2 ||
                        state.rightTrigger1 != stick.old_state.rightTrigger1 ||
                        state.rightTrigger2 != stick.old_state.rightTrigger2) {
                        changed = true;
                    }
                } else {
                    changed = true;
                }

                if (changed) {
                    stick.old_state = state;
                    stick.emit('changed', state);
                }

                // re-arrange raw data so left and right are the same order
                // then add other buttons as MSBs.
                var i = ((i1 & 0x80) >> 6) | (!(i1 & 0x01) << 3);
                var j = ((i2 & 0x80) >> 5) | (!(i2 & 0x01) << 0);
                i = (i | j) << 4;
                var r = i6 >> 4;
                i = i | r;
                j = i7 & 0x7f;
                r = j * 256 + i;
                stick.emit('raw', r);

            });
            break;
        }
    }
}

util.inherits(JoyStick, events.EventEmitter);

JoyStick.prototype.close = function() {
    if (this._device) {
        this._device.close();
    }
}

JoyStick.devices = function(){
    return HID.devices();
}

module.exports = JoyStick;
