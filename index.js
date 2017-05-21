var stdin = process.stdin;
// stdin.setRawMode(true);
// stdin.resume();
// stdin.setEncoding('utf8');
var keys = [];
var ports = [];
var serialData = [];
var serialport = require('serialport');
var SerialPort = serialport.SerialPort;



// list serial ports:
serialport.list(function (err, serialports) {
    serialports.forEach(function (port) {

        var currPort = new SerialPort(port.comName, {
            baudRate: 9600,
            // look for return and newline at the end of each data packet:
            parser: serialport.parsers.readline("\n")
        });

        currPort.on('open', showPortOpen);
        currPort.on('data', sendSerialData);
        currPort.on('close', showPortClose);
        currPort.on('error', showError);

        console.log(port.comName);
        ports.push(currPort);
    });
});

function showPortOpen() {
    //console.log('port open. Data rate: ');
}

function sendSerialData(data) {
    serialData.push(data);
}

function showPortClose() {
    //console.log('port closed.');
}

function showError(error) {
    //console.log('Serial port error: ' + error);
}

//process.exit('0')

stdin.on('data', function (key) {
    //var fs = require('fs');

    // fs.appendFile('message.txt', key + '\n', function (err) {
    //     if (err) throw err;
    //     console.log('Saved!');
    // });
    keys.push({ 'key': key });
    console.log(keys);
    // if (key == '\u001B\u005B\u0041') {
    //     process.stdout.write('up');
    // }
    // if (key == '\u001B\u005B\u0043') {
    //     process.stdout.write('right');
    // }
    // if (key == '\u001B\u005B\u0042') {
    //     process.stdout.write('down');
    // }
    // if (key == '\u001B\u005B\u0044') {
    //     process.stdout.write('left');
    // }

    if (key == '\u0003') { process.exit(); }    // ctrl-c
});

// // Test
var http = require('http');
http.createServer(function (request, response) {
    response.writeHead(200, { "Content-Type": "application/json" });
    //request.pipe(response);
    response.end(JSON.stringify(Object.assign({ ports: ports }, { serialData: serialData })));
}).listen(8080, function () {
    console.log('Server running');
});