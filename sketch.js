const STEPS_PER_FRAME = 60;


let latitude = 60;
let pendulumLength = 50;
let initialAmplitude = 100;
let earthPeriod = 6;
let damping = 0.005;
let speed = 1;

let g = 9.81;
let earthOmega = 2 * Math.PI / (earthPeriod * 60);

let isPaused = false;

let dt = 0.001;
let maxTracePoints = 10_000;
let scale = 2;


class Pendulum {
    constructor() {
        this.x = initialAmplitude;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
    }

    a_x(x, vy) {
        return 2 * vy * earthOmega * Math.sin(latitude) - (g / pendulumLength) * x;
    }

    a_y(y, vx) {
        return - (2 * vx * earthOmega * Math.sin(latitude)) - (g / pendulumLength) * y;
    }


    runge_kutt(h) {
        const x = this.x;
        const y = this.y;
        const vx = this.vx;
        const vy = this.vy;

        const k1_x = h * vx;
        const k1_y = h * vy;
        const k1_vx = h * this.a_x(x, vy);
        const k1_vy = h * this.a_y(y, vx);

        const k2_x = h * (vx + k1_vx / 2);
        const k2_y = h * (vy + k1_vy / 2);
        const k2_vx = h * this.a_x(x + k1_x / 2, vy + k1_vy / 2);
        const k2_vy = h * this.a_y(y + k1_y / 2, vx + k1_vx / 2);

        const k3_x = h * (vx + k2_vx / 2);
        const k3_y = h * (vy + k2_vy / 2);
        const k3_vx = h * this.a_x(x + k2_x / 2, vy + k2_vy / 2);
        const k3_vy = h * this.a_y(y + k2_y / 2, vx + k2_vx / 2);

        const k4_x = h * (vx + k3_vx);
        const k4_y = h * (vy + k3_vy);
        const k4_vx = h * this.a_x(x + k3_x, vy + k3_vy);
        const k4_vy = h * this.a_y(y + k3_y, vx + k3_vx);

        this.x += (k1_x + 2 * k2_x + 2 * k3_x + k4_x) / 6;
        this.y += (k1_y + 2 * k2_y + 2 * k3_y + k4_y) / 6;
        this.vx += (k1_vx + 2 * k2_vx + 2 * k3_vx + k4_vx) / 6;
        this.vy += (k1_vy + 2 * k2_vy + 2 * k3_vy + k4_vy) / 6;
    }
}

let pendulum = new Pendulum();

function setup() {
    let canvas = createCanvas(800, 800);
    canvas.parent('canvas-container');

    setupControls();

    resetPendulum();
}

function draw() {
    background(250);

    drawCoordinateSystem();

    if (!isPaused) {
        updatePhysics();
    }

    drawTrace();

    drawPendulum(pendulum);
}

function drawCoordinateSystem() {
    push();
    translate(width / 2, height / 2);

    stroke(200);
    strokeWeight(1);
    noFill();
    circle(0, 0, 300);
    circle(0, 0, 200);
    circle(0, 0, 100);

    stroke(200);
    line(-width / 2, 0, width / 2, 0);
    line(0, -height / 2, 0, height / 2);

    fill(100);
    noStroke();
    textAlign(CENTER);
    text('N', 0, -height / 2 + 20);
    text('S', 0, height / 2 - 20);
    text('E', width / 2 - 20, 5);
    text('W', -width / 2 + 20, 5);

    pop();
}

function drawTrace() {
    push();
    translate(width / 2, height / 2);
    noStroke();
    fill(0, 127, 0);
    for (const point of pendulum.trace) {
        circle(point[0] * scale, point[1] * scale, 3);
    }
    pop();
}

function drawPendulum(pendulum) {
    push();
    translate(width / 2, height / 2);

    stroke(50);
    strokeWeight(2);
    line(0, 0, pendulum.x * scale, pendulum.y * scale);

    fill(255, 0, 0);
    noStroke();
    circle(pendulum.x * scale, pendulum.y * scale, 20);

    fill(50);
    circle(0, 0, 10);

    pop();
}

function updatePhysics() {
    for (let i = 0; i < STEPS_PER_FRAME * speed; ++i) {
        pendulum.runge_kutt(dt);
        if (i % STEPS_PER_FRAME == 0) {
            if (pendulum.trace.length === maxTracePoints) {
                pendulum.trace.shift();
            }
            pendulum.trace.push([pendulum.x, pendulum.y]);
        }
    }
}

function resetPendulum() {
    pendulum.x = initialAmplitude;
    pendulum.y = 0;
    pendulum.vx = 0;
    pendulum.vy = 0;
    pendulum.trace = [];
}

function setupControls() {
    select('#latitude').input(function() {
        latitude = this.value();
        select('#latitude-val').html(latitude + '°');
    });

    select('#length').input(function() {
        pendulumLength = this.value();
        select('#length-val').html(pendulumLength + ' m');
    });

    select('#amplitude').input(function() {
        initialAmplitude = this.value();
        select('#amplitude-val').html(initialAmplitude);
    });

    select('#period').input(function() {
        earthPeriod = this.value();
        earthOmega = 2 * Math.PI / (earthPeriod * 60);
        select('#period-val').html(earthPeriod + ' min');
    });

    select('#damping').input(function() {
        let dampVal = this.value();
        damping = dampVal / 1000;
        select('#damping-val').html(damping.toFixed(3));
    });

    select('#speed').input(function() {
        speed = this.value();
        select('#speed-val').html(speed + 'x');

    })
}

function clearTrace() {
    pendulum.trace = [];
}

function togglePause() {
    isPaused = !isPaused;
}
