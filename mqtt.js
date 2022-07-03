//const $ = document.querySelector.bind(document);
//const $$ = document.querySelectorAll.bind(document);

var client = null;
var tempData = new Array();
var connected = false;
var temperature = -1;
var cnt = 0;
var toast = document.querySelector(".toast");
var btn = document.querySelector(".toast-btn");
var close = document.querySelector(".toast-close");
var progress = document.querySelector(".progress-toast");
var text1 = document.querySelector('.text-1');
var text2 = document.querySelector('.text-2');

function toastActive() {
    toast.classList.add("active");
    progress.classList.add("active");

    setTimeout(() => {
        toast.classList.remove("active");
    }, 2000)

    setTimeout(() => {
        progress.classList.remove("active");
    }, 2300)
}

close.addEventListener("click", () => {
    toast.classList.remove("active");

    setTimeout(() => {
        progress.classList.remove("active");
    }, 300)
})

jQuery.noConflict();

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 15; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return "client_" + text;
}

document.querySelector('#clientId').value = makeid();

function logging(title, msg) {
    var date = new Date();
    jQuery("#log").prepend(date.toString() + " - " + title + ":\n"
        + msg + "\n"
        + "========\n");
}

function disconnect() {
    client.disconnect();
    text1.textContent = "Disconnected Successfully";
    toastActive();
    connected = false;
    document.querySelector(".connect-btn").classList.remove("hide");
    document.querySelector(".disconnect-btn").classList.add("hide");
    msg = " [Information] | clientId=" + client.clientId;
    title = "Disconnected Successfully";
    logging(title, msg);
}

//document.addEventListener('DOMContentLoaded', function () {
function subscribe(topic, qos) {
    const Id = jQuery("#topiclist");
    var id = Id.children("tr:last-child").attr("id");
    if (id == undefined) {
        id = 1;
    } else {
        id = Number(id) + 1;
    }
    client.subscribe(topic, {
        qos: qos,
        onSuccess: onSubSucc,
        onFailure: onSubFail,
        invocationContext: {
            topic: topic,
            qos: qos,
            clientId: client.clientId,
            id: id
        }
    });
    function onSubSucc(context) {
        topic = context.invocationContext.topic;
        text1.textContent = "Subscribe Successfully"
        toastActive();
        if (jQuery("td:contains(" + topic + ")").length == 0) {
            jQuery("#topiclist").append(
                " <tr id='" + context.invocationContext.id + "'>\n" +
                "    <td>" + context.invocationContext.id + "</td>\n" +
                "    <td>" + topic + "</td>\n" +
                "    <td>" + context.invocationContext.qos + "</td>\n" +
                "    <td>" + context.grantedQos + "</td>\n" +
                "    <td>\n" +
                "       <button class='unsubscribe-btn' " +
                "onclick='unsubscribe(" + id + ")' type='button'>Unsubscribe</button>\n" +
                "    </td>\n" +
                "</tr>"
            );
        } else {
            qosobj = jQuery("td:contains(" + topic + ")")[0].nextElementSibling;
            qosobj.innerText = context.invocationContext.qos;
            gqosobj = qosobj.nextElementSibling;
            gqosobj.innerText = context.grantedQos;
        }

        msg = " [Subscription information] | clientId= " + context.invocationContext.clientId + ", topicFilter=" + topic
            + ", QoS=" + context.invocationContext.qos + ", grantedQoS=" + context.grantedQos;
        title = "SUBSCRIBE succeeded";
        logging(title, msg);
    }

    function onSubFail(context) {
        msg = " [Subscription Infomation] | clientId= " + context.invocationContext.clientId + ", topicFilter=" + topic
            + ", QoS=" + context.invocationContext.qos + ", errorCode=" + context.errorCode
            + ", errorMessage=" + context.errorMessage;
        title = "SUBSCRIBE failed";
        logging(title, msg);
    }
}
//});

function unsubscribe(id) {
    if (connected == false) {
        //layer.msg('Need to connect before unsubscribing', { icon: 2, offset: 200 });
        return;
    }
    text1.textContent = "Unsubscribe Successfully"
    toastActive();
    topic = jQuery("#" + id).children("td:nth-child(2)").text();
    client.unsubscribe(topic, {
        onSuccess: onUnsubSucc,
        onFailure: onUnsubFail,
        invocationContext: {
            topic: topic,
            clientId: client.clientId,
            id: id
        }
    });
    function onUnsubSucc(context) {
        //layer.msg('Unsubscribe succeeded', { icon: 1, offset: 200 });
        jQuery("#" + context.invocationContext.id).remove();
        msg = " [Subscription information] | clientId= " + context.invocationContext.clientId + ", topicFilter=" + topic;
        title = "UNSUBSCRIBE succeeded";
        logging(title, msg);
    }

    function onUnsubFail(context, errorCode, errorMessage) {
        msg = " [Subscription information] | clientId= " + context.invocationContext.clientId + ", topicFilter=" + topic
            + ", errorCode=" + context.errorCode + ", errorMessage=" + context.errorMessage;
        title = "UNSUBSCRIBE Fail";
        logging(title, msg);
    }
}

var form = document.querySelector('#connect-form');
var formSub = document.querySelector('#form-subscripton');

formSub.addEventListener('submit', function (events) {
    events.preventDefault();
    if (connected == false) {
        text1.textContent = "Chưa connect bạn ơi !"
        toastActive();
        return;
    }

    var topic = formSub.elements["subtopic"].value;
    var qos = Number(formSub.elements["subqos"].value);
    subscribe(topic, qos);
});

form.addEventListener('submit', function (events) {
    events.preventDefault();
    //var data = document.form;
    var hostname = form.elements["hostname"].value;
    var port = Number(form.elements["port"].value);
    var suburl = form.elements["suburl"].value;

    var username = form.elements["username"].value;
    var password = form.elements["password"].value;
    var clientId = form.elements["clientId"].value;

    var timeout = form.elements["timeout"].value == "" ? 10 : Number(form.elements["timeout"].value);
    var keepalive = form.elements["keepalive"].value == "" ? 60 : Number(form.elements["keepalive"].value);
    var cleansession = form.elements["cleansession"].value == "true" ? true : false;
    var ssl = form.elements["ssl"].value == "true" ? true : false;
    var reconnect = form.elements["reconnect"].value == "true" ? true : false;
    var mqttversion = Number(form.elements["mqttversion"].value);

    client = new Paho.Client(hostname, port, suburl, clientId);
    //client = new Paho.MQTT.Client(hostname, port, 'bungdz');

    // set callback handlers
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    client.onMessageDelivered = onMessageDelivered;

    var options = {
        invocationContext: { host: hostname, port: port, path: suburl, clientId: clientId },
        timeout: timeout,
        keepAliveInterval: keepalive,
        cleanSession: cleansession,
        useSSL: ssl,
        reconnect: reconnect,
        mqttVersion: mqttversion,
        onSuccess: onSuccess,
        onFailure: onFailure,
        userName: username,
        password: password,
    };

    client.connect(options);

    var msg = " [Server] | " + hostname + ":" + port + suburl + "\n"
        + " [Account] | username=" + username + ", password=" + password + ", clientId" + clientId + "\n"
        + " [Parameters] | timeout=" + timeout + ", keepalive=" + keepalive + ", cleansession=" + cleansession
        + ", ssl=" + ssl + ", reconnect=" + reconnect + ", mqttversion=" + mqttversion;

    title = "CONNECT Initiate a connect operation";
    logging(title, msg);
    // called when the client connects
    function onSuccess(context) {
        document.querySelector(".connect-btn").classList.add("hide");
        document.querySelector(".disconnect-btn").classList.remove("hide");
        text1.textContent = "Connected Successfully"
        toastActive();
        connected = true;
        msg = " [Infomation] | clientId=" + context.invocationContext.clientId;
        title = "CONNECT SUCCEEDED";
        logging(title, msg);

    }


    function onFailure(context) {
        console.log(context)
        connected = false;
        msg = " [Infomation] | clientId=" + context.invocationContext.clientId
            + ", errorCode=" + context.errorCode + ", errorMessage=" + context.errorMessage;
        title = "CONNECT failed";
        logging(title, msg);
    }

    function onConnectionLost(context) {
        if (context.errorCode !== 0) {
            msg = " [error] | errorCode=" + context.errorCode + ", errorMessage=" + context.errorMessage;
            title = "CONNECT error";
            logging(title, msg);
        }
        connected = false;
    }

    function onMessageArrived(message) {
        var date = new Date();

        var payload = message.payloadString;
        jQuery("#rcv").prepend(date.toString() + " - " + "Received the news" + ":\n"
            + " [Received the news] | topic=" + message.destinationName + ", QoS=" + message.qos
            + ", retained=" + message.retained + ", duplicate=" + message.duplicate
            + ", payload=" + message.payloadString + "\n"
            + "========\n");
        cnt = Number(cnt) + Number(1);
        document.querySelector(".message-count").textContent = String(Number(cnt));
        console.log(" Message payload: " + payload);
        temperature = parseInt(message.payloadString);
        // tempData.push({
        //     "timestamp": Date().slice(16, 21),
        //     "temperature": parseInt(payload)
        // });
        // if (tempData.length >= 10) {
        //     tempData.shift()
        // }
        var element1 = document.getElementById('t1');
        element1.innerText = payload;

        //drawChart(tempData)
    }

    function onMessageDelivered(message) {
        msg = " [Message] | topic=" + message.destinationName + ", QoS=" + message.qos
            + ", retained=" + message.retained + ", duplicate=" + message.duplicate
            + ", payload=" + message.payloadString;
        title = "PUBLISH Successfully";
        logging(title, msg);
    }

});
// layui.use(['form', 'table', 'layer', 'element'], function () {
//     var form = layui.form;
//     var table = layui.table;
//     var element = layui.element;


//     //monitor commits
//     form.on('submit(subscribe)', function (rawdata) {
//         if (connected == false) {
//             layer.msg('Need to connect before subscribing', { icon: 2, offset: 200 });
//             return;
//         }
//         var data = rawdata.field;
//         var topic = data.subtopic;
//         var qos = Number(data.subqos);
//         subscribe(topic, qos);
//     });

//     //monitor commits
//     form.on('submit(publish)', function (rawdata) {
//         if (connected == false) {
//             layer.msg('Need to connect before publishing', { icon: 2, offset: 200 });
//             return;
//         }
//         var data = rawdata.field;
//         var topic = data.pubtopic;
//         var qos = Number(data.pubqos);
//         var payload = data.pubpayload;
//         var retain = data.pubretain == true ? true : false;
//         publish(topic, payload, qos, retain);
//     });


//     // monitor commits
//     form.on('submit(connect)', function (rawdata) {
//         var data = rawdata.field;

//         var hostname = data.hostname;
//         var port = Number(data.port);
//         var suburl = data.suburl;

//         var username = data.username;
//         var password = data.password;
//         var clientId = data.clientId;

//         var timeout = data.timeout == "" ? 10 : Number(data.timeout);
//         var keepalive = data.keepalive == "" ? 60 : Number(data.keepalive);
//         var cleansession = data.cleansession == "true" ? true : false;
//         var ssl = data.ssl == "true" ? true : false;
//         var reconnect = data.reconnect == "true" ? true : false;
//         var mqttversion = Number(data.mqttversion);

//         var willmessage = null;


//         if (data.wmopen == 1) {
//             var willmessage = new Paho.Message(data.wmpayload);
//             willmessage.retained = data.wmretain == "true" ? true : false;
//             willmessage.qos = Number(data.wmqos);
//             willmessage.destinationName = data.wmtopic;
//         }

//         client = new Paho.Client(hostname, port, suburl, clientId);

//         // set callback handlers
//         client.onConnectionLost = onConnectionLost;
//         client.onMessageArrived = onMessageArrived;
//         client.onMessageDelivered = onMessageDelivered;

//         var options = {
//             invocationContext: { host: hostname, port: port, path: suburl, clientId: clientId },
//             timeout: timeout,
//             keepAliveInterval: keepalive,
//             cleanSession: cleansession,
//             useSSL: ssl,
//             reconnect: reconnect,
//             mqttVersion: mqttversion,
//             onSuccess: onSuccess,
//             onFailure: onFailure,
//             userName: username,
//             password: password

//         };

//         client.connect(options);


//         var msg = " [Server] | " + hostname + ":" + port + suburl + "\n"
//             + " [Account] | username=" + username + ", password=" + password + ", clientId" + clientId + "\n"
//             + " [Parameters] | timeout=" + timeout + ", keepalive=" + keepalive + ", cleansession=" + cleansession
//             + ", ssl=" + ssl + ", reconnect=" + reconnect + ", mqttversion=" + mqttversion;

//         if (data.wmopen == 1) {
//             msg += "\n [Will Message] | topic=" + data.wmtopic + ", qos=" + data.wmqos + ", retained=" + data.wmretain
//                 + ", payload=" + data.wmpayload;
//         }

//         title = "CONNECT Initiate a connect operation";
//         logging(title, msg);


//         // called when the client connects
//         function onSuccess(context) {
//             var connectionString = context.invocationContext.host + ":" + context.invocationContext.port + context.invocationContext.path;
//             var navControlTitle = document.getElementById("nav-control-hide");
//             layer.msg('Connection succeeded', { icon: 1, offset: 200 });
//             navControlTitle.style.display = "inline";
//             $("#connect-btn").addClass("layui-hide");
//             $("#disconnect-btn").removeClass("layui-hide");
//             connected = true;
//             msg = " [Infomation] | clientId=" + context.invocationContext.clientId;
//             title = "CONNECT SUCCEEDED";
//             logging(title, msg);
//         }

//         function onFailure(context) {
//             console.log(context)
//             layer.msg('Connection failed', { icon: 2, offset: 200 });
//             connected = false;
//             msg = " [Infomation] | clientId=" + context.invocationContext.clientId
//                 + ", errorCode=" + context.errorCode + ", errorMessage=" + context.errorMessage;
//             title = "CONNECT failed";
//             logging(title, msg);
//         }

//         // called when the client loses its connection
//         function onConnectionLost(context) {
//             if (context.errorCode !== 0) {
//                 layer.msg('The connection is abnormally disconnected', { icon: 2, offset: 200 });
//                 msg = " [error] | errorCode=" + context.errorCode + ", errorMessage=" + context.errorMessage;
//                 title = "CONNECT error";
//                 logging(title, msg);
//             }
//             connected = false;
//         }

//         // called when a message arrives
//         function onMessageArrived(message) {

//             var date = new Date();
//             var payload = message.payloadString;
//             $("#rcv").prepend(date.toString() + " - " + "Received the news" + ":\n"
//                 + " [Received the news] | topic=" + message.destinationName + ", QoS=" + message.qos
//                 + ", retained=" + message.retained + ", duplicate=" + message.duplicate
//                 + ", payload=" + message.payloadString + "\n"
//                 + "========\n");
//             $("#newdot").removeClass("layui-hide");
//             console.log(" Message payload: " + payload);
//             temperature = parseInt(message.payloadString);
//             // tempData.push({
//             //     "timestamp": Date().slice(16, 21),
//             //     "temperature": parseInt(payload)
//             // });
//             // if (tempData.length >= 10) {
//             //     tempData.shift()
//             // }
//             var element1 = document.getElementById('t1');
//             element1.innerText = payload;

//             //drawChart(tempData)
//         }

//         function onMessageDelivered(message) {
//             layer.msg('Message sent successfully', { icon: 1, offset: 200 });
//             msg = " [Message] | topic=" + message.destinationName + ", QoS=" + message.qos
//                 + ", retained=" + message.retained + ", duplicate=" + message.duplicate
//                 + ", payload=" + message.payloadString;
//             title = "PUBLISH Successfully";
//             logging(title, msg);
//         }

//     });

//     form.on('switch(wmfilter)', function (data) {
//         if (data.elem.checked) {
//             $("#wmdiv").removeClass("layui-hide");
//         } else {
//             $("#wmdiv").addClass("layui-hide");
//         }
//     });
// });

// var client = new Paho.MQTT.Client('broker.mqttdashboard.com', 8000, "Bungdz123");

// // set callback handlers
// client.onConnectionLost = onConnectionLost;
// client.onMessageArrived = onMessageArrived;

// // connect the client
// client.connect({ onSuccess: onConnect });


// // called when the client connects
// function onConnect() {
//     // Once a connection has been made, make a subscription and send a message.
//     console.log("onConnect");
//     client.subscribe("World");
//     message = new Paho.MQTT.Message("Hello");
//     message.destinationName = "World";
//     client.send(message);
// }

// // called when the client loses its connection
// function onConnectionLost(responseObject) {
//     if (responseObject.errorCode !== 0) {
//         console.log("onConnectionLost:" + responseObject.errorMessage);
//     }
// }

// // called when a message arrives
// function onMessageArrived(message) {
//     console.log("onMessageArrived:" + message.payloadString);
// }

Highcharts.stockChart('container', {
    chart: {
        // backgroundColor: 'rgba(255, 255, 255, 0.8)',
        type: 'line',
        events: {
            load: function () {

                // set up the updating of the chart each second
                var series = this.series[0];
                setInterval(function () {
                    var x = (new Date()).getTime(), // current time
                        y = temperature;
                    series.addPoint([x, y]);
                }, 1000);
            }
        }
    },

    accessibility: {
        enabled: false
    },

    time: {
        useUTC: false
    },

    rangeSelector: {
        buttons: [{
            count: 1,
            type: 'minute',
            text: '1M'
        }, {
            count: 5,
            type: 'minute',
            text: '5M'
        }, {
            type: 'all',
            text: 'All'
        }],
        inputEnabled: false,
        selected: 0
    },

    title: {
        text: 'Live Temperature'
    },

    yAxis: {
        title: {
            text: 'Temperature (°C)'
        },
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }]
    },
    tooltip: {
        valueSuffix: '°C'
    },
    exporting: {
        enabled: false
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        borderWidth: 0
    },
    series: [{
        name: 'Temperature',
        data: (function () {
            // generate an array of random data
            var data = [],
                time = (new Date()).getTime(),
                i;

            for (i = -300; i <= 0; i += 1) {
                data.push([
                    time + i * 1000,
                    -1
                ]);
            }
            return data;
        }())
    }]
});