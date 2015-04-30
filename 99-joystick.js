/**
 * Copyright 2013,2015 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

 module.exports = function(RED) {
    "use strict";
    var JoyStick = require('./JoyStick');

    var joystick = function(n) {
        RED.nodes.createNode(this,n);
        this.name = n.name;
        this.topic = n.topic;
        this.filter = parseInt(n.filter || 0);
        var node = this;
        var old = 0;

        this.stick = new JoyStick("DragonRise Inc.  ");

        if (this.filter !== 0) {
            this.stick.on('raw', function(raw) {
                raw = raw & node.filter;
                if ((raw !== 0) || (old !== 0)) {
                    old = raw;
                    node.send({topic:node.topic, payload:raw});
                }
            });
        }
        else {
            this.stick.on('changed', function(state) {
                var msg = {};
                msg.topic = node.topic;
                msg.payload = state;
                node.send(msg);
            });
        }

        node.on('close', function() {
            node.stick.close();
        });
    }

    RED.nodes.registerType("JoyStick", joystick);
}
