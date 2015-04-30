node-red-node-joystick
======================

A <a href="http://nodered.org" target="_new">Node-RED</a> node that reads a specific
Venom USB gamepad.

So far it's hardcoded to look for a gamepad made by DragonRise Inc. I'll look adding more if I get 
time to see if the output is similar from other pads (and can actually get hold of them).

Install
-------

Run the following command in the root directory of your Node-RED install

        npm install node-red-node-joystick

Usage
-----

By default it outputs a **msg.payload** *object* on change of any joystick switch.

Alternatively if you set a bit mask it will instead output raw values as an *int* continuously whenever a non-zero value is detected.
Right joystick are bits 0-3, left joystick are bits 4-7, and the trigger type buttons are 8-15.
