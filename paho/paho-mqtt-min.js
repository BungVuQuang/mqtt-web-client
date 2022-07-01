/*******************************************************************************
 * Copyright (c) 2013, 2016 IBM Corp.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * and Eclipse Distribution License v1.0 which accompany this distribution.
 *
 * The Eclipse Public License is available at
 *    http://www.eclipse.org/legal/epl-v10.html
 * and the Eclipse Distribution License is available at
 *   http://www.eclipse.org/org/documents/edl-v10.php.
 *
 *******************************************************************************/
(function (t, q) {
    "object" === typeof exports && "object" === typeof module ? module.exports = q() : "function" === typeof define && define.amd ? define(q) : "object" === typeof exports ? exports = q() : t.Paho = q()
})(this, function () {
    return function (t) {
        function q(a, b, c) {
            b[c++] = a >> 8;
            b[c++] = a % 256;
            return c
        }

        function r(a, b, c, k) {
            k = q(b, c, k);
            E(a, c, k);
            return k + b
        }

        function n(a) {
            for (var b = 0, c = 0; c < a.length; c++) {
                var k = a.charCodeAt(c);
                2047 < k ? (55296 <= k && 56319 >= k && (c++, b++), b += 3) : 127 < k ? b += 2 : b++
            }
            return b
        }

        function E(a, b, c) {
            for (var k = 0; k < a.length; k++) {
                var e =
                    a.charCodeAt(k);
                if (55296 <= e && 56319 >= e) {
                    var g = a.charCodeAt(++k);
                    if (isNaN(g)) throw Error(f(h.MALFORMED_UNICODE, [e, g]));
                    e = (e - 55296 << 10) + (g - 56320) + 65536
                }
                127 >= e ? b[c++] = e : (2047 >= e ? b[c++] = e >> 6 & 31 | 192 : (65535 >= e ? b[c++] = e >> 12 & 15 | 224 : (b[c++] = e >> 18 & 7 | 240, b[c++] = e >> 12 & 63 | 128), b[c++] = e >> 6 & 63 | 128), b[c++] = e & 63 | 128)
            }
            return b
        }

        function F(a, b, c) {
            for (var k = "", e, g = b; g < b + c;) {
                e = a[g++];
                if (!(128 > e)) {
                    var m = a[g++] - 128;
                    if (0 > m) throw Error(f(h.MALFORMED_UTF, [e.toString(16), m.toString(16), ""]));
                    if (224 > e) e = 64 * (e - 192) + m;
                    else {
                        var d =
                            a[g++] - 128;
                        if (0 > d) throw Error(f(h.MALFORMED_UTF, [e.toString(16), m.toString(16), d.toString(16)]));
                        if (240 > e) e = 4096 * (e - 224) + 64 * m + d;
                        else {
                            var l = a[g++] - 128;
                            if (0 > l) throw Error(f(h.MALFORMED_UTF, [e.toString(16), m.toString(16), d.toString(16), l.toString(16)]));
                            if (248 > e) e = 262144 * (e - 240) + 4096 * m + 64 * d + l;
                            else throw Error(f(h.MALFORMED_UTF, [e.toString(16), m.toString(16), d.toString(16), l.toString(16)]));
                        }
                    }
                }
                65535 < e && (e -= 65536, k += String.fromCharCode(55296 + (e >> 10)), e = 56320 + (e & 1023));
                k += String.fromCharCode(e)
            }
            return k
        }
        var s = t.localStorage || function () {
            var a = {};
            return {
                setItem: function (b, c) {
                    a[b] = c
                },
                getItem: function (b) {
                    return a[b]
                },
                removeItem: function (b) {
                    delete a[b]
                }
            }
        }(),
            A = function (a, b) {
                for (var c in a)
                    if (a.hasOwnProperty(c))
                        if (b.hasOwnProperty(c)) {
                            if (typeof a[c] !== b[c]) throw Error(f(h.INVALID_TYPE, [typeof a[c], c]));
                        } else {
                            c = "Unknown property, " + c + ". Valid properties are:";
                            for (var k in b) b.hasOwnProperty(k) && (c = c + " " + k);
                            throw Error(c);
                        }
            },
            u = function (a, b) {
                return function () {
                    return a.apply(b, arguments)
                }
            },
            h = {
                OK: {
                    code: 0,
                    text: "AMQJSC0000I OK."
                },
                CONNECT_TIMEOUT: {
                    code: 1,
                    text: "AMQJSC0001E Connect timed out."
                },
                SUBSCRIBE_TIMEOUT: {
                    code: 2,
                    text: "AMQJS0002E Subscribe timed out."
                },
                UNSUBSCRIBE_TIMEOUT: {
                    code: 3,
                    text: "AMQJS0003E Unsubscribe timed out."
                },
                PING_TIMEOUT: {
                    code: 4,
                    text: "AMQJS0004E Ping timed out."
                },
                INTERNAL_ERROR: {
                    code: 5,
                    text: "AMQJS0005E Internal error. Error Message: {0}, Stack trace: {1}"
                },
                CONNACK_RETURNCODE: {
                    code: 6,
                    text: "AMQJS0006E Bad Connack return code:{0} {1}."
                },
                SOCKET_ERROR: {
                    code: 7,
                    text: "AMQJS0007E Socket error:{0}."
                },
                SOCKET_CLOSE: {
                    code: 8,
                    text: "AMQJS0008I Socket closed."
                },
                MALFORMED_UTF: {
                    code: 9,
                    text: "AMQJS0009E Malformed UTF data:{0} {1} {2}."
                },
                UNSUPPORTED: {
                    code: 10,
                    text: "AMQJS0010E {0} is not supported by this browser."
                },
                INVALID_STATE: {
                    code: 11,
                    text: "AMQJS0011E Invalid state {0}."
                },
                INVALID_TYPE: {
                    code: 12,
                    text: "AMQJS0012E Invalid type {0} for {1}."
                },
                INVALID_ARGUMENT: {
                    code: 13,
                    text: "AMQJS0013E Invalid argument {0} for {1}."
                },
                UNSUPPORTED_OPERATION: {
                    code: 14,
                    text: "AMQJS0014E Unsupported operation."
                },
                INVALID_STORED_DATA: {
                    code: 15,
                    text: "AMQJS0015E Invalid data in local storage key\x3d{0} value\x3d{1}."
                },
                INVALID_MQTT_MESSAGE_TYPE: {
                    code: 16,
                    text: "AMQJS0016E Invalid MQTT message type {0}."
                },
                MALFORMED_UNICODE: {
                    code: 17,
                    text: "AMQJS0017E Malformed Unicode string:{0} {1}."
                },
                BUFFER_FULL: {
                    code: 18,
                    text: "AMQJS0018E Message buffer is full, maximum buffer size: {0}."
                }
            },
            H = {
                0: "Connection Accepted",
                1: "Connection Refused: unacceptable protocol version",
                2: "Connection Refused: identifier rejected",
                3: "Connection Refused: server unavailable",
                4: "Connection Refused: bad user name or password",
                5: "Connection Refused: not authorized"
            },
            f = function (a, b) {
                var c = a.text;
                if (b)
                    for (var k, e, g = 0; g < b.length; g++)
                        if (k = "{" + g + "}", e = c.indexOf(k), 0 < e) var h = c.substring(0, e),
                            c = c.substring(e + k.length),
                            c = h + b[g] + c;
                return c
            },
            B = [0, 6, 77, 81, 73, 115, 100, 112, 3],
            C = [0, 4, 77, 81, 84, 84, 4],
            p = function (a, b) {
                this.type = a;
                for (var c in b) b.hasOwnProperty(c) && (this[c] = b[c])
            };
        p.prototype.encode = function () {
            var a = (this.type & 15) << 4,
                b = 0,
                c = [],
                k = 0,
                e;
            void 0 !== this.messageIdentifier && (b += 2);
            switch (this.type) {
                case 1:
                    switch (this.mqttVersion) {
                        case 3:
                            b += B.length + 3;
                            break;
                        case 4:
                            b += C.length +
                                3
                    }
                    b += n(this.clientId) + 2;
                    void 0 !== this.willMessage && (b += n(this.willMessage.destinationName) + 2, e = this.willMessage.payloadBytes, e instanceof Uint8Array || (e = new Uint8Array(h)), b += e.byteLength + 2);
                    void 0 !== this.userName && (b += n(this.userName) + 2);
                    void 0 !== this.password && (b += n(this.password) + 2);
                    break;
                case 8:
                    for (var a = a | 2, g = 0; g < this.topics.length; g++) c[g] = n(this.topics[g]), b += c[g] + 2;
                    b += this.requestedQos.length;
                    break;
                case 10:
                    a |= 2;
                    for (g = 0; g < this.topics.length; g++) c[g] = n(this.topics[g]), b += c[g] + 2;
                    break;
                case 6:
                    a |=
                        2;
                    break;
                case 3:
                    this.payloadMessage.duplicate && (a |= 8);
                    a = a |= this.payloadMessage.qos << 1;
                    this.payloadMessage.retained && (a |= 1);
                    var k = n(this.payloadMessage.destinationName),
                        h = this.payloadMessage.payloadBytes,
                        b = b + (k + 2) + h.byteLength;
                    h instanceof ArrayBuffer ? h = new Uint8Array(h) : h instanceof Uint8Array || (h = new Uint8Array(h.buffer))
            }
            var f = b,
                g = Array(1),
                d = 0;
            do {
                var z = f % 128,
                    f = f >> 7;
                0 < f && (z |= 128);
                g[d++] = z
            } while (0 < f && 4 > d);
            f = g.length + 1;
            b = new ArrayBuffer(b + f);
            d = new Uint8Array(b);
            d[0] = a;
            d.set(g, 1);
            if (3 == this.type) f = r(this.payloadMessage.destinationName,
                k, d, f);
            else if (1 == this.type) {
                switch (this.mqttVersion) {
                    case 3:
                        d.set(B, f);
                        f += B.length;
                        break;
                    case 4:
                        d.set(C, f), f += C.length
                }
                a = 0;
                this.cleanSession && (a = 2);
                void 0 !== this.willMessage && (a = a | 4 | this.willMessage.qos << 3, this.willMessage.retained && (a |= 32));
                void 0 !== this.userName && (a |= 128);
                void 0 !== this.password && (a |= 64);
                d[f++] = a;
                f = q(this.keepAliveInterval, d, f)
            }
            void 0 !== this.messageIdentifier && (f = q(this.messageIdentifier, d, f));
            switch (this.type) {
                case 1:
                    f = r(this.clientId, n(this.clientId), d, f);
                    void 0 !== this.willMessage &&
                        (f = r(this.willMessage.destinationName, n(this.willMessage.destinationName), d, f), f = q(e.byteLength, d, f), d.set(e, f), f += e.byteLength);
                    void 0 !== this.userName && (f = r(this.userName, n(this.userName), d, f));
                    void 0 !== this.password && r(this.password, n(this.password), d, f);
                    break;
                case 3:
                    d.set(h, f);
                    break;
                case 8:
                    for (g = 0; g < this.topics.length; g++) f = r(this.topics[g], c[g], d, f), d[f++] = this.requestedQos[g];
                    break;
                case 10:
                    for (g = 0; g < this.topics.length; g++) f = r(this.topics[g], c[g], d, f)
            }
            return b
        };
        var G = function (a, b) {
            this._client =
                a;
            this._keepAliveInterval = 1E3 * b;
            this.isReset = !1;
            var c = (new p(12)).encode(),
                k = function (a) {
                    return function () {
                        return e.apply(a)
                    }
                },
                e = function () {
                    this.isReset ? (this.isReset = !1, this._client._trace("Pinger.doPing", "send PINGREQ"), this._client.socket.send(c), this.timeout = setTimeout(k(this), this._keepAliveInterval)) : (this._client._trace("Pinger.doPing", "Timed out"), this._client._disconnected(h.PING_TIMEOUT.code, f(h.PING_TIMEOUT)))
                };
            this.reset = function () {
                this.isReset = !0;
                clearTimeout(this.timeout);
                0 < this._keepAliveInterval &&
                    (this.timeout = setTimeout(k(this), this._keepAliveInterval))
            };
            this.cancel = function () {
                clearTimeout(this.timeout)
            }
        },
            v = function (a, b, c, f) {
                b || (b = 30);
                this.timeout = setTimeout(function (a, b, c) {
                    return function () {
                        return a.apply(b, c)
                    }
                }(c, a, f), 1E3 * b);
                this.cancel = function () {
                    clearTimeout(this.timeout)
                }
            },
            d = function (a, b, c, d, e) {
                if (!("WebSocket" in t && null !== t.WebSocket)) throw Error(f(h.UNSUPPORTED, ["WebSocket"]));
                if (!("ArrayBuffer" in t && null !== t.ArrayBuffer)) throw Error(f(h.UNSUPPORTED, ["ArrayBuffer"]));
                this._trace("Paho.Client",
                    a, b, c, d, e);
                this.host = b;
                this.port = c;
                this.path = d;
                this.uri = a;
                this.clientId = e;
                this._wsuri = null;
                this._localKey = b + ":" + c + ("/mqtt" != d ? ":" + d : "") + ":" + e + ":";
                this._msg_queue = [];
                this._buffered_msg_queue = [];
                this._sentMessages = {};
                this._receivedMessages = {};
                this._notify_msg_sent = {};
                this._message_identifier = 1;
                this._sequence = 0;
                for (var g in s) 0 !== g.indexOf("Sent:" + this._localKey) && 0 !== g.indexOf("Received:" + this._localKey) || this.restore(g)
            };
        d.prototype.host = null;
        d.prototype.port = null;
        d.prototype.path = null;
        d.prototype.uri =
            null;
        d.prototype.clientId = null;
        d.prototype.socket = null;
        d.prototype.connected = !1;
        d.prototype.maxMessageIdentifier = 65536;
        d.prototype.connectOptions = null;
        d.prototype.hostIndex = null;
        d.prototype.onConnected = null;
        d.prototype.onConnectionLost = null;
        d.prototype.onMessageDelivered = null;
        d.prototype.onMessageArrived = null;
        d.prototype.traceFunction = null;
        d.prototype._msg_queue = null;
        d.prototype._buffered_msg_queue = null;
        d.prototype._connectTimeout = null;
        d.prototype.sendPinger = null;
        d.prototype.receivePinger = null;
        d.prototype._reconnectInterval =
            1;
        d.prototype._reconnecting = !1;
        d.prototype._reconnectTimeout = null;
        d.prototype.disconnectedPublishing = !1;
        d.prototype.disconnectedBufferSize = 5E3;
        d.prototype.receiveBuffer = null;
        d.prototype._traceBuffer = null;
        d.prototype._MAX_TRACE_ENTRIES = 100;
        d.prototype.connect = function (a) {
            var b = this._traceMask(a, "password");
            this._trace("Client.connect", b, this.socket, this.connected);
            if (this.connected) throw Error(f(h.INVALID_STATE, ["already connected"]));
            if (this.socket) throw Error(f(h.INVALID_STATE, ["already connected"]));
            this._reconnecting && (this._reconnectTimeout.cancel(), this._reconnectTimeout = null, this._reconnecting = !1);
            this.connectOptions = a;
            this._reconnectInterval = 1;
            this._reconnecting = !1;
            a.uris ? (this.hostIndex = 0, this._doConnect(a.uris[0])) : this._doConnect(this.uri)
        };
        d.prototype.subscribe = function (a, b) {
            this._trace("Client.subscribe", a, b);
            if (!this.connected) throw Error(f(h.INVALID_STATE, ["not connected"]));
            var c = new p(8);
            c.topics = a.constructor === Array ? a : [a];
            void 0 === b.qos && (b.qos = 0);
            c.requestedQos = [];
            for (var d =
                0; d < c.topics.length; d++) c.requestedQos[d] = b.qos;
            b.onSuccess && (c.onSuccess = function (a) {
                b.onSuccess({
                    invocationContext: b.invocationContext,
                    grantedQos: a
                })
            });
            b.onFailure && (c.onFailure = function (a) {
                b.onFailure({
                    invocationContext: b.invocationContext,
                    errorCode: a,
                    errorMessage: f(a)
                })
            });
            b.timeout && (c.timeOut = new v(this, b.timeout, b.onFailure, [{
                invocationContext: b.invocationContext,
                errorCode: h.SUBSCRIBE_TIMEOUT.code,
                errorMessage: f(h.SUBSCRIBE_TIMEOUT)
            }]));
            this._requires_ack(c);
            this._schedule_message(c)
        };
        d.prototype.unsubscribe =
            function (a, b) {
                this._trace("Client.unsubscribe", a, b);
                if (!this.connected) throw Error(f(h.INVALID_STATE, ["not connected"]));
                var c = new p(10);
                c.topics = a.constructor === Array ? a : [a];
                b.onSuccess && (c.callback = function () {
                    b.onSuccess({
                        invocationContext: b.invocationContext
                    })
                });
                b.timeout && (c.timeOut = new v(this, b.timeout, b.onFailure, [{
                    invocationContext: b.invocationContext,
                    errorCode: h.UNSUBSCRIBE_TIMEOUT.code,
                    errorMessage: f(h.UNSUBSCRIBE_TIMEOUT)
                }]));
                this._requires_ack(c);
                this._schedule_message(c)
            };
        d.prototype.send =
            function (a) {
                this._trace("Client.send", a);
                var b = new p(3);
                b.payloadMessage = a;
                if (this.connected) 0 < a.qos ? this._requires_ack(b) : this.onMessageDelivered && (this._notify_msg_sent[b] = this.onMessageDelivered(b.payloadMessage)), this._schedule_message(b);
                else if (this._reconnecting && this.disconnectedPublishing) {
                    if (Object.keys(this._sentMessages).length + this._buffered_msg_queue.length > this.disconnectedBufferSize) throw Error(f(h.BUFFER_FULL, [this.disconnectedBufferSize]));
                    0 < a.qos ? this._requires_ack(b) : (b.sequence =
                        ++this._sequence, this._buffered_msg_queue.unshift(b))
                } else throw Error(f(h.INVALID_STATE, ["not connected"]));
            };
        d.prototype.disconnect = function () {
            this._trace("Client.disconnect");
            this._reconnecting && (this._reconnectTimeout.cancel(), this._reconnectTimeout = null, this._reconnecting = !1);
            if (!this.socket) throw Error(f(h.INVALID_STATE, ["not connecting or connected"]));
            var a = new p(14);
            this._notify_msg_sent[a] = u(this._disconnected, this);
            this._schedule_message(a)
        };
        d.prototype.getTraceLog = function () {
            if (null !==
                this._traceBuffer) {
                this._trace("Client.getTraceLog", new Date);
                this._trace("Client.getTraceLog in flight messages", this._sentMessages.length);
                for (var a in this._sentMessages) this._trace("_sentMessages ", a, this._sentMessages[a]);
                for (a in this._receivedMessages) this._trace("_receivedMessages ", a, this._receivedMessages[a]);
                return this._traceBuffer
            }
        };
        d.prototype.startTrace = function () {
            null === this._traceBuffer && (this._traceBuffer = []);
            this._trace("Client.startTrace", new Date, "1.1.0-2018-07-24T10:15:15Z")
        };
        d.prototype.stopTrace =
            function () {
                delete this._traceBuffer
            };
        d.prototype._doConnect = function (a) {
            this.connectOptions.useSSL && (a = a.split(":"), a[0] = "wss", a = a.join(":"));
            this._wsuri = a;
            this.connected = !1;
            this.socket = 4 > this.connectOptions.mqttVersion ? new WebSocket(a, ["mqttv3.1"]) : new WebSocket(a, ["mqtt"]);
            this.socket.binaryType = "arraybuffer";
            this.socket.onopen = u(this._on_socket_open, this);
            this.socket.onmessage = u(this._on_socket_message, this);
            this.socket.onerror = u(this._on_socket_error, this);
            this.socket.onclose = u(this._on_socket_close,
                this);
            this.sendPinger = new G(this, this.connectOptions.keepAliveInterval);
            this.receivePinger = new G(this, this.connectOptions.keepAliveInterval);
            this._connectTimeout && (this._connectTimeout.cancel(), this._connectTimeout = null);
            this._connectTimeout = new v(this, this.connectOptions.timeout, this._disconnected, [h.CONNECT_TIMEOUT.code, f(h.CONNECT_TIMEOUT)])
        };
        d.prototype._schedule_message = function (a) {
            this._msg_queue.unshift(a);
            this.connected && this._process_queue()
        };
        d.prototype.store = function (a, b) {
            var c = {
                type: b.type,
                messageIdentifier: b.messageIdentifier,
                version: 1
            };
            switch (b.type) {
                case 3:
                    b.pubRecReceived && (c.pubRecReceived = !0);
                    c.payloadMessage = {};
                    for (var d = "", e = b.payloadMessage.payloadBytes, g = 0; g < e.length; g++) d = 15 >= e[g] ? d + "0" + e[g].toString(16) : d + e[g].toString(16);
                    c.payloadMessage.payloadHex = d;
                    c.payloadMessage.qos = b.payloadMessage.qos;
                    c.payloadMessage.destinationName = b.payloadMessage.destinationName;
                    b.payloadMessage.duplicate && (c.payloadMessage.duplicate = !0);
                    b.payloadMessage.retained && (c.payloadMessage.retained = !0);
                    0 === a.indexOf("Sent:") && (void 0 === b.sequence && (b.sequence = ++this._sequence), c.sequence = b.sequence);
                    break;
                default:
                    throw Error(f(h.INVALID_STORED_DATA, [a + this._localKey + b.messageIdentifier, c]));
            }
            s.setItem(a + this._localKey + b.messageIdentifier, JSON.stringify(c))
        };
        d.prototype.restore = function (a) {
            var b = s.getItem(a),
                c = JSON.parse(b),
                d = new p(c.type, c);
            switch (c.type) {
                case 3:
                    for (var b = c.payloadMessage.payloadHex, e = new ArrayBuffer(b.length / 2), e = new Uint8Array(e), g = 0; 2 <= b.length;) {
                        var m = parseInt(b.substring(0,
                            2), 16),
                            b = b.substring(2, b.length);
                        e[g++] = m
                    }
                    b = new w(e);
                    b.qos = c.payloadMessage.qos;
                    b.destinationName = c.payloadMessage.destinationName;
                    c.payloadMessage.duplicate && (b.duplicate = !0);
                    c.payloadMessage.retained && (b.retained = !0);
                    d.payloadMessage = b;
                    break;
                default:
                    throw Error(f(h.INVALID_STORED_DATA, [a, b]));
            }
            0 === a.indexOf("Sent:" + this._localKey) ? (d.payloadMessage.duplicate = !0, this._sentMessages[d.messageIdentifier] = d) : 0 === a.indexOf("Received:" + this._localKey) && (this._receivedMessages[d.messageIdentifier] = d)
        };
        d.prototype._process_queue = function () {
            for (var a = null; a = this._msg_queue.pop();) this._socket_send(a), this._notify_msg_sent[a] && (this._notify_msg_sent[a](), delete this._notify_msg_sent[a])
        };
        d.prototype._requires_ack = function (a) {
            var b = Object.keys(this._sentMessages).length;
            if (b > this.maxMessageIdentifier) throw Error("Too many messages:" + b);
            for (; void 0 !== this._sentMessages[this._message_identifier];) this._message_identifier++;
            a.messageIdentifier = this._message_identifier;
            this._sentMessages[a.messageIdentifier] =
                a;
            3 === a.type && this.store("Sent:", a);
            this._message_identifier === this.maxMessageIdentifier && (this._message_identifier = 1)
        };
        d.prototype._on_socket_open = function () {
            var a = new p(1, this.connectOptions);
            a.clientId = this.clientId;
            this._socket_send(a)
        };
        d.prototype._on_socket_message = function (a) {
            this._trace("Client._on_socket_message", a.data);
            a = this._deframeMessages(a.data);
            for (var b = 0; b < a.length; b += 1) this._handleMessage(a[b])
        };
        d.prototype._deframeMessages = function (a) {
            a = new Uint8Array(a);
            var b = [];
            if (this.receiveBuffer) {
                var c =
                    new Uint8Array(this.receiveBuffer.length + a.length);
                c.set(this.receiveBuffer);
                c.set(a, this.receiveBuffer.length);
                a = c;
                delete this.receiveBuffer
            }
            try {
                for (c = 0; c < a.length;) {
                    var d;
                    a: {
                        var e = a,
                            g = c,
                            m = g,
                            n = e[g],
                            l = n >> 4,
                            z = n & 15,
                            g = g + 1,
                            x = void 0,
                            D = 0,
                            q = 1; do {
                                if (g == e.length) {
                                    d = [null, m];
                                    break a
                                }
                                x = e[g++];
                                D += (x & 127) * q;
                                q *= 128
                            } while (0 !== (x & 128)); x = g + D;
                        if (x > e.length) d = [null, m];
                        else {
                            var y = new p(l);
                            switch (l) {
                                case 2:
                                    e[g++] & 1 && (y.sessionPresent = !0);
                                    y.returnCode = e[g++];
                                    break;
                                case 3:
                                    var m = z >> 1 & 3,
                                        s = 256 * e[g] + e[g + 1],
                                        g = g + 2,
                                        t = F(e, g, s),
                                        g = g + s;
                                    0 < m && (y.messageIdentifier = 256 * e[g] + e[g + 1], g += 2);
                                    var r = new w(e.subarray(g, x));
                                    1 == (z & 1) && (r.retained = !0);
                                    8 == (z & 8) && (r.duplicate = !0);
                                    r.qos = m;
                                    r.destinationName = t;
                                    y.payloadMessage = r;
                                    break;
                                case 4:
                                case 5:
                                case 6:
                                case 7:
                                case 11:
                                    y.messageIdentifier = 256 * e[g] + e[g + 1];
                                    break;
                                case 9:
                                    y.messageIdentifier = 256 * e[g] + e[g + 1], g += 2, y.returnCode = e.subarray(g, x)
                            }
                            d = [y, x]
                        }
                    }
                    var u = d[0],
                        c = d[1];
                    if (null !== u) b.push(u);
                    else break
                }
                c < a.length && (this.receiveBuffer = a.subarray(c))
            } catch (v) {
                d = "undefined" == v.hasOwnProperty("stack") ?
                    v.stack.toString() : "No Error Stack Available";
                this._disconnected(h.INTERNAL_ERROR.code, f(h.INTERNAL_ERROR, [v.message, d]));
                return
            }
            return b
        };
        d.prototype._handleMessage = function (a) {
            this._trace("Client._handleMessage", a);
            try {
                switch (a.type) {
                    case 2:
                        this._connectTimeout.cancel();
                        this._reconnectTimeout && this._reconnectTimeout.cancel();
                        if (this.connectOptions.cleanSession) {
                            for (var b in this._sentMessages) {
                                var c = this._sentMessages[b];
                                s.removeItem("Sent:" + this._localKey + c.messageIdentifier)
                            }
                            this._sentMessages = {};
                            for (b in this._receivedMessages) {
                                var d = this._receivedMessages[b];
                                s.removeItem("Received:" + this._localKey + d.messageIdentifier)
                            }
                            this._receivedMessages = {}
                        }
                        if (0 === a.returnCode) this.connected = !0, this.connectOptions.uris && (this.hostIndex = this.connectOptions.uris.length);
                        else {
                            this._disconnected(h.CONNACK_RETURNCODE.code, f(h.CONNACK_RETURNCODE, [a.returnCode, H[a.returnCode]]));
                            break
                        }
                        a = [];
                        for (var e in this._sentMessages) this._sentMessages.hasOwnProperty(e) && a.push(this._sentMessages[e]);
                        if (0 < this._buffered_msg_queue.length)
                            for (e =
                                null; e = this._buffered_msg_queue.pop();) a.push(e), this.onMessageDelivered && (this._notify_msg_sent[e] = this.onMessageDelivered(e.payloadMessage));
                        a = a.sort(function (a, b) {
                            return a.sequence - b.sequence
                        });
                        e = 0;
                        for (var g = a.length; e < g; e++)
                            if (c = a[e], 3 == c.type && c.pubRecReceived) {
                                var m = new p(6, {
                                    messageIdentifier: c.messageIdentifier
                                });
                                this._schedule_message(m)
                            } else this._schedule_message(c);
                        if (this.connectOptions.onSuccess) this.connectOptions.onSuccess({
                            invocationContext: this.connectOptions.invocationContext
                        });
                        c = !1;
                        this._reconnecting && (c = !0, this._reconnectInterval = 1, this._reconnecting = !1);
                        this._connected(c, this._wsuri);
                        this._process_queue();
                        break;
                    case 3:
                        this._receivePublish(a);
                        break;
                    case 4:
                        if (c = this._sentMessages[a.messageIdentifier])
                            if (delete this._sentMessages[a.messageIdentifier], s.removeItem("Sent:" + this._localKey + a.messageIdentifier), this.onMessageDelivered) this.onMessageDelivered(c.payloadMessage);
                        break;
                    case 5:
                        if (c = this._sentMessages[a.messageIdentifier]) c.pubRecReceived = !0, m = new p(6, {
                            messageIdentifier: a.messageIdentifier
                        }),
                            this.store("Sent:", c), this._schedule_message(m);
                        break;
                    case 6:
                        d = this._receivedMessages[a.messageIdentifier];
                        s.removeItem("Received:" + this._localKey + a.messageIdentifier);
                        d && (this._receiveMessage(d), delete this._receivedMessages[a.messageIdentifier]);
                        var n = new p(7, {
                            messageIdentifier: a.messageIdentifier
                        });
                        this._schedule_message(n);
                        break;
                    case 7:
                        c = this._sentMessages[a.messageIdentifier];
                        delete this._sentMessages[a.messageIdentifier];
                        s.removeItem("Sent:" + this._localKey + a.messageIdentifier);
                        if (this.onMessageDelivered) this.onMessageDelivered(c.payloadMessage);
                        break;
                    case 9:
                        if (c = this._sentMessages[a.messageIdentifier]) {
                            c.timeOut && c.timeOut.cancel();
                            if (128 === a.returnCode[0]) {
                                if (c.onFailure) c.onFailure(a.returnCode)
                            } else if (c.onSuccess) c.onSuccess(a.returnCode);
                            delete this._sentMessages[a.messageIdentifier]
                        }
                        break;
                    case 11:
                        if (c = this._sentMessages[a.messageIdentifier]) c.timeOut && c.timeOut.cancel(), c.callback && c.callback(), delete this._sentMessages[a.messageIdentifier];
                        break;
                    case 13:
                        this.sendPinger.reset();
                        break;
                    case 14:
                        this._disconnected(h.INVALID_MQTT_MESSAGE_TYPE.code,
                            f(h.INVALID_MQTT_MESSAGE_TYPE, [a.type]));
                        break;
                    default:
                        this._disconnected(h.INVALID_MQTT_MESSAGE_TYPE.code, f(h.INVALID_MQTT_MESSAGE_TYPE, [a.type]))
                }
            } catch (l) {
                c = "undefined" == l.hasOwnProperty("stack") ? l.stack.toString() : "No Error Stack Available", this._disconnected(h.INTERNAL_ERROR.code, f(h.INTERNAL_ERROR, [l.message, c]))
            }
        };
        d.prototype._on_socket_error = function (a) {
            this._reconnecting || this._disconnected(h.SOCKET_ERROR.code, f(h.SOCKET_ERROR, [a.data]))
        };
        d.prototype._on_socket_close = function () {
            this._reconnecting ||
                this._disconnected(h.SOCKET_CLOSE.code, f(h.SOCKET_CLOSE))
        };
        d.prototype._socket_send = function (a) {
            if (1 == a.type) {
                var b = this._traceMask(a, "password");
                this._trace("Client._socket_send", b)
            } else this._trace("Client._socket_send", a);
            this.socket.send(a.encode());
            this.sendPinger.reset()
        };
        d.prototype._receivePublish = function (a) {
            switch (a.payloadMessage.qos) {
                case "undefined":
                case 0:
                    this._receiveMessage(a);
                    break;
                case 1:
                    var b = new p(4, {
                        messageIdentifier: a.messageIdentifier
                    });
                    this._schedule_message(b);
                    this._receiveMessage(a);
                    break;
                case 2:
                    this._receivedMessages[a.messageIdentifier] = a;
                    this.store("Received:", a);
                    a = new p(5, {
                        messageIdentifier: a.messageIdentifier
                    });
                    this._schedule_message(a);
                    break;
                default:
                    throw Error("Invaild qos\x3d" + a.payloadMessage.qos);
            }
        };
        d.prototype._receiveMessage = function (a) {
            if (this.onMessageArrived) this.onMessageArrived(a.payloadMessage)
        };
        d.prototype._connected = function (a, b) {
            if (this.onConnected) this.onConnected(a, b)
        };
        d.prototype._reconnect = function () {
            this._trace("Client._reconnect");
            this.connected || (this._reconnecting = !0, this.sendPinger.cancel(), this.receivePinger.cancel(), 128 > this._reconnectInterval && (this._reconnectInterval *= 2), this.connectOptions.uris ? (this.hostIndex = 0, this._doConnect(this.connectOptions.uris[0])) : this._doConnect(this.uri))
        };
        d.prototype._disconnected = function (a, b) {
            this._trace("Client._disconnected", a, b);
            if (void 0 !== a && this._reconnecting) this._reconnectTimeout = new v(this, this._reconnectInterval, this._reconnect);
            else if (this.sendPinger.cancel(), this.receivePinger.cancel(), this._connectTimeout &&
                (this._connectTimeout.cancel(), this._connectTimeout = null), this._msg_queue = [], this._buffered_msg_queue = [], this._notify_msg_sent = {}, this.socket && (this.socket.onopen = null, this.socket.onmessage = null, this.socket.onerror = null, this.socket.onclose = null, 1 === this.socket.readyState && this.socket.close(), delete this.socket), this.connectOptions.uris && this.hostIndex < this.connectOptions.uris.length - 1) this.hostIndex++, this._doConnect(this.connectOptions.uris[this.hostIndex]);
            else if (void 0 === a && (a = h.OK.code, b = f(h.OK)),
                this.connected) {
                this.connected = !1;
                if (this.onConnectionLost) this.onConnectionLost({
                    errorCode: a,
                    errorMessage: b,
                    reconnect: this.connectOptions.reconnect,
                    uri: this._wsuri
                });
                a !== h.OK.code && this.connectOptions.reconnect && (this._reconnectInterval = 1, this._reconnect())
            } else if (4 === this.connectOptions.mqttVersion && !1 === this.connectOptions.mqttVersionExplicit) this._trace("Failed to connect V4, dropping back to V3"), this.connectOptions.mqttVersion = 3, this.connectOptions.uris ? (this.hostIndex = 0, this._doConnect(this.connectOptions.uris[0])) :
                this._doConnect(this.uri);
            else if (this.connectOptions.onFailure) this.connectOptions.onFailure({
                invocationContext: this.connectOptions.invocationContext,
                errorCode: a,
                errorMessage: b
            })
        };
        d.prototype._trace = function () {
            if (this.traceFunction) {
                var a = Array.prototype.slice.call(arguments),
                    b;
                for (b in a) "undefined" !== typeof a[b] && a.splice(b, 1, JSON.stringify(a[b]));
                b = a.join("");
                this.traceFunction({
                    severity: "Debug",
                    message: b
                })
            }
            if (null !== this._traceBuffer)
                for (b = 0, a = arguments.length; b < a; b++) this._traceBuffer.length ==
                    this._MAX_TRACE_ENTRIES && this._traceBuffer.shift(), 0 === b ? this._traceBuffer.push(arguments[b]) : "undefined" === typeof arguments[b] ? this._traceBuffer.push(arguments[b]) : this._traceBuffer.push("  " + JSON.stringify(arguments[b]))
        };
        d.prototype._traceMask = function (a, b) {
            var c = {},
                d;
            for (d in a) a.hasOwnProperty(d) && (c[d] = d == b ? "******" : a[d]);
            return c
        };
        var w = function (a) {
            var b;
            if ("string" === typeof a || a instanceof ArrayBuffer || ArrayBuffer.isView(a) && !(a instanceof DataView)) b = a;
            else throw f(h.INVALID_ARGUMENT, [a,
                "newPayload"
            ]);
            var c, d = 0,
                e = !1,
                g = !1;
            Object.defineProperties(this, {
                payloadString: {
                    enumerable: !0,
                    get: function () {
                        return "string" === typeof b ? b : F(b, 0, b.length)
                    }
                },
                payloadBytes: {
                    enumerable: !0,
                    get: function () {
                        if ("string" === typeof b) {
                            var a = new ArrayBuffer(n(b)),
                                a = new Uint8Array(a);
                            E(b, a, 0);
                            return a
                        }
                        return b
                    }
                },
                destinationName: {
                    enumerable: !0,
                    get: function () {
                        return c
                    },
                    set: function (a) {
                        if ("string" === typeof a) c = a;
                        else throw Error(f(h.INVALID_ARGUMENT, [a, "newDestinationName"]));
                    }
                },
                qos: {
                    enumerable: !0,
                    get: function () {
                        return d
                    },
                    set: function (a) {
                        if (0 === a || 1 === a || 2 === a) d = a;
                        else throw Error("Invalid argument:" + a);
                    }
                },
                retained: {
                    enumerable: !0,
                    get: function () {
                        return e
                    },
                    set: function (a) {
                        if ("boolean" === typeof a) e = a;
                        else throw Error(f(h.INVALID_ARGUMENT, [a, "newRetained"]));
                    }
                },
                topic: {
                    enumerable: !0,
                    get: function () {
                        return c
                    },
                    set: function (a) {
                        c = a
                    }
                },
                duplicate: {
                    enumerable: !0,
                    get: function () {
                        return g
                    },
                    set: function (a) {
                        g = a
                    }
                }
            })
        };
        return {
            Client: function (a, b, c, k) {
                var e;
                if ("string" !== typeof a) throw Error(f(h.INVALID_TYPE, [typeof a, "host"]));
                if (2 == arguments.length) {
                    k =
                        b;
                    e = a;
                    var g = e.match(/^(wss?):\/\/((\[(.+)\])|([^\/]+?))(:(\d+))?(\/.*)$/);
                    if (g) a = g[4] || g[2], b = parseInt(g[7]), c = g[8];
                    else throw Error(f(h.INVALID_ARGUMENT, [a, "host"]));
                } else {
                    3 == arguments.length && (k = c, c = "/mqtt");
                    if ("number" !== typeof b || 0 > b) throw Error(f(h.INVALID_TYPE, [typeof b, "port"]));
                    if ("string" !== typeof c) throw Error(f(h.INVALID_TYPE, [typeof c, "path"]));
                    e = "ws://" + (-1 !== a.indexOf(":") && "[" !== a.slice(0, 1) && "]" !== a.slice(-1) ? "[" + a + "]" : a) + ":" + b + c
                }
                for (var m = g = 0; m < k.length; m++) {
                    var n = k.charCodeAt(m);
                    55296 <= n && 56319 >= n && m++;
                    g++
                }
                if ("string" !== typeof k || 65535 < g) throw Error(f(h.INVALID_ARGUMENT, [k, "clientId"]));
                var l = new d(e, a, b, c, k);
                Object.defineProperties(this, {
                    host: {
                        get: function () {
                            return a
                        },
                        set: function () {
                            throw Error(f(h.UNSUPPORTED_OPERATION));
                        }
                    },
                    port: {
                        get: function () {
                            return b
                        },
                        set: function () {
                            throw Error(f(h.UNSUPPORTED_OPERATION));
                        }
                    },
                    path: {
                        get: function () {
                            return c
                        },
                        set: function () {
                            throw Error(f(h.UNSUPPORTED_OPERATION));
                        }
                    },
                    uri: {
                        get: function () {
                            return e
                        },
                        set: function () {
                            throw Error(f(h.UNSUPPORTED_OPERATION));
                        }
                    },
                    clientId: {
                        get: function () {
                            return l.clientId
                        },
                        set: function () {
                            throw Error(f(h.UNSUPPORTED_OPERATION));
                        }
                    },
                    onConnected: {
                        get: function () {
                            return l.onConnected
                        },
                        set: function (a) {
                            if ("function" === typeof a) l.onConnected = a;
                            else throw Error(f(h.INVALID_TYPE, [typeof a, "onConnected"]));
                        }
                    },
                    disconnectedPublishing: {
                        get: function () {
                            return l.disconnectedPublishing
                        },
                        set: function (a) {
                            l.disconnectedPublishing = a
                        }
                    },
                    disconnectedBufferSize: {
                        get: function () {
                            return l.disconnectedBufferSize
                        },
                        set: function (a) {
                            l.disconnectedBufferSize =
                                a
                        }
                    },
                    onConnectionLost: {
                        get: function () {
                            return l.onConnectionLost
                        },
                        set: function (a) {
                            if ("function" === typeof a) l.onConnectionLost = a;
                            else throw Error(f(h.INVALID_TYPE, [typeof a, "onConnectionLost"]));
                        }
                    },
                    onMessageDelivered: {
                        get: function () {
                            return l.onMessageDelivered
                        },
                        set: function (a) {
                            if ("function" === typeof a) l.onMessageDelivered = a;
                            else throw Error(f(h.INVALID_TYPE, [typeof a, "onMessageDelivered"]));
                        }
                    },
                    onMessageArrived: {
                        get: function () {
                            return l.onMessageArrived
                        },
                        set: function (a) {
                            if ("function" === typeof a) l.onMessageArrived =
                                a;
                            else throw Error(f(h.INVALID_TYPE, [typeof a, "onMessageArrived"]));
                        }
                    },
                    trace: {
                        get: function () {
                            return l.traceFunction
                        },
                        set: function (a) {
                            if ("function" === typeof a) l.traceFunction = a;
                            else throw Error(f(h.INVALID_TYPE, [typeof a, "onTrace"]));
                        }
                    }
                });
                this.connect = function (a) {
                    a = a || {};
                    A(a, {
                        timeout: "number",
                        userName: "string",
                        password: "string",
                        willMessage: "object",
                        keepAliveInterval: "number",
                        cleanSession: "boolean",
                        useSSL: "boolean",
                        invocationContext: "object",
                        onSuccess: "function",
                        onFailure: "function",
                        hosts: "object",
                        ports: "object",
                        reconnect: "boolean",
                        mqttVersion: "number",
                        mqttVersionExplicit: "boolean",
                        uris: "object"
                    });
                    void 0 === a.keepAliveInterval && (a.keepAliveInterval = 60);
                    if (4 < a.mqttVersion || 3 > a.mqttVersion) throw Error(f(h.INVALID_ARGUMENT, [a.mqttVersion, "connectOptions.mqttVersion"]));
                    void 0 === a.mqttVersion ? (a.mqttVersionExplicit = !1, a.mqttVersion = 4) : a.mqttVersionExplicit = !0;
                    if (void 0 !== a.password && void 0 === a.userName) throw Error(f(h.INVALID_ARGUMENT, [a.password, "connectOptions.password"]));
                    if (a.willMessage) {
                        if (!(a.willMessage instanceof w)) throw Error(f(h.INVALID_TYPE, [a.willMessage, "connectOptions.willMessage"]));
                        a.willMessage.stringPayload = null;
                        if ("undefined" === typeof a.willMessage.destinationName) throw Error(f(h.INVALID_TYPE, [typeof a.willMessage.destinationName, "connectOptions.willMessage.destinationName"]));
                    }
                    "undefined" === typeof a.cleanSession && (a.cleanSession = !0);
                    if (a.hosts) {
                        if (!(a.hosts instanceof Array)) throw Error(f(h.INVALID_ARGUMENT, [a.hosts, "connectOptions.hosts"]));
                        if (1 > a.hosts.length) throw Error(f(h.INVALID_ARGUMENT,
                            [a.hosts, "connectOptions.hosts"]));
                        for (var b = !1, d = 0; d < a.hosts.length; d++) {
                            if ("string" !== typeof a.hosts[d]) throw Error(f(h.INVALID_TYPE, [typeof a.hosts[d], "connectOptions.hosts[" + d + "]"]));
                            if (/^(wss?):\/\/((\[(.+)\])|([^\/]+?))(:(\d+))?(\/.*)$/.test(a.hosts[d]))
                                if (0 === d) b = !0;
                                else {
                                    if (!b) throw Error(f(h.INVALID_ARGUMENT, [a.hosts[d], "connectOptions.hosts[" + d + "]"]));
                                }
                            else if (b) throw Error(f(h.INVALID_ARGUMENT, [a.hosts[d], "connectOptions.hosts[" + d + "]"]));
                        }
                        if (b) a.uris = a.hosts;
                        else {
                            if (!a.ports) throw Error(f(h.INVALID_ARGUMENT,
                                [a.ports, "connectOptions.ports"]));
                            if (!(a.ports instanceof Array)) throw Error(f(h.INVALID_ARGUMENT, [a.ports, "connectOptions.ports"]));
                            if (a.hosts.length !== a.ports.length) throw Error(f(h.INVALID_ARGUMENT, [a.ports, "connectOptions.ports"]));
                            a.uris = [];
                            for (d = 0; d < a.hosts.length; d++) {
                                if ("number" !== typeof a.ports[d] || 0 > a.ports[d]) throw Error(f(h.INVALID_TYPE, [typeof a.ports[d], "connectOptions.ports[" + d + "]"]));
                                var b = a.hosts[d],
                                    g = a.ports[d];
                                e = "ws://" + (-1 !== b.indexOf(":") ? "[" + b + "]" : b) + ":" + g + c;
                                a.uris.push(e)
                            }
                        }
                    }
                    l.connect(a)
                };
                this.subscribe = function (a, b) {
                    if ("string" !== typeof a && a.constructor !== Array) throw Error("Invalid argument:" + a);
                    b = b || {};
                    A(b, {
                        qos: "number",
                        invocationContext: "object",
                        onSuccess: "function",
                        onFailure: "function",
                        timeout: "number"
                    });
                    if (b.timeout && !b.onFailure) throw Error("subscribeOptions.timeout specified with no onFailure callback.");
                    if ("undefined" !== typeof b.qos && 0 !== b.qos && 1 !== b.qos && 2 !== b.qos) throw Error(f(h.INVALID_ARGUMENT, [b.qos, "subscribeOptions.qos"]));
                    l.subscribe(a, b)
                };
                this.unsubscribe = function (a,
                    b) {
                    if ("string" !== typeof a && a.constructor !== Array) throw Error("Invalid argument:" + a);
                    b = b || {};
                    A(b, {
                        invocationContext: "object",
                        onSuccess: "function",
                        onFailure: "function",
                        timeout: "number"
                    });
                    if (b.timeout && !b.onFailure) throw Error("unsubscribeOptions.timeout specified with no onFailure callback.");
                    l.unsubscribe(a, b)
                };
                this.send = function (a, b, c, d) {
                    var e;
                    if (0 === arguments.length) throw Error("Invalid argument.length");
                    if (1 == arguments.length) {
                        if (!(a instanceof w) && "string" !== typeof a) throw Error("Invalid argument:" +
                            typeof a);
                        e = a;
                        if ("undefined" === typeof e.destinationName) throw Error(f(h.INVALID_ARGUMENT, [e.destinationName, "Message.destinationName"]));
                    } else e = new w(b), e.destinationName = a, 3 <= arguments.length && (e.qos = c), 4 <= arguments.length && (e.retained = d);
                    l.send(e)
                };
                this.publish = function (a, b, c, d) {
                    var e;
                    if (0 === arguments.length) throw Error("Invalid argument.length");
                    if (1 == arguments.length) {
                        if (!(a instanceof w) && "string" !== typeof a) throw Error("Invalid argument:" + typeof a);
                        e = a;
                        if ("undefined" === typeof e.destinationName) throw Error(f(h.INVALID_ARGUMENT,
                            [e.destinationName, "Message.destinationName"]));
                    } else e = new w(b), e.destinationName = a, 3 <= arguments.length && (e.qos = c), 4 <= arguments.length && (e.retained = d);
                    l.send(e)
                };
                this.disconnect = function () {
                    l.disconnect()
                };
                this.getTraceLog = function () {
                    return l.getTraceLog()
                };
                this.startTrace = function () {
                    l.startTrace()
                };
                this.stopTrace = function () {
                    l.stopTrace()
                };
                this.isConnected = function () {
                    return l.connected
                }
            },
            Message: w
        }
    }("undefined" !== typeof global ? global : "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : {})
});