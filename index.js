
const STATE = { HIGH: 1, LOW: 0 },
    MOTORS = {
        LEFT: [7, 8],
        RIGHT: [9, 10]
    };
let GPIOs = [...MOTORS.LEFT, ...MOTORS.RIGHT],
    stdin = process.stdin,
    move = {
        forwards: (motor) => {
            gpio.write(motor[0], STATE.LOW);
            gpio.write(motor[1], STATE.HIGH);
        },
        backwards: (motor) => {
            gpio.write(motor[0], STATE.HIGH);
            gpio.write(motor[1], STATE.LOW);
        },
        stop: (motor) => {
            gpio.write(motor[0], STATE.LOW);
            gpio.write(motor[1], STATE.LOW);
        }
    };

stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf8');

/// Main logic
openGPIOs(...GPIOs)
    .then(movementHandler)
    .catch(err => shutDown(...GPIOs));

/// Helper functions

// Handles movemnets
function movementHandler() {
    let currKey;
    stdin.on('data', function (key) {
        if (key === currKey) {
            return;
        }
        currKey = key;

        // Up
        if (key == '\u001B\u005B\u0041') {
            move.forwards(MOTORS.LEFT);
            move.forwards(MOTORS.RIGHT);
        }
        // Right
        if (key == '\u001B\u005B\u0043') {
            move.stop(MOTORS.LEFT);
            move.forwards(MOTORS.RIGHT);
        }
        // Down
        if (key == '\u001B\u005B\u0042') {
            move.stop(MOTORS.LEFT);
            move.stop(MOTORS.RIGHT);
        }
        // Left
        if (key == '\u001B\u005B\u0044') {
            move.forwards(MOTORS.LEFT);
            move.stop(MOTORS.RIGHT);
        }

        if (key == '\u0003') { shutDown(...GPIOs); }    // ctrl-c
    });
}

// Open GPIOs
function openGPIOs(...GPIOs) {
    var promises = GPIOs.map(pinNumber => {
        return new Promise((resolve, reject) => {
            gpio.open(pinNumber, "output", function (err) {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        })
    });

    return Promise.all(promises);
};

// Gracefull shutdown
function shutDown(...GPIOs) {
    // Close all pin numbers
    GPIOs.forEach(pinNumber => gpio.close(pinNumber));
    // Exit nodejs process
    process.exit();
}