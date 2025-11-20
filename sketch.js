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

class Vector {
    constructor(components) {
        this.components = components;
        this.dimension = components.length;
    }
}


function scaleVector(vector, scalar) {
    return new Vector(vector.components.map(c => c * scalar));
}

function addVectors(...vectors) {
    const dimension = vectors[0].dimension;
    const result = new Array(dimension).fill(0);
    for (const vec of vectors) {
        for (let i = 0; i < dimension; i++) {
            result[i] += vec.components[i];
        }
    }
    return new Vector(result);
}

class Pendulum {
    constructor() {
        this.state = new Vector([initialAmplitude, 0, 0, 0]);
        this.trace = [];
    }

    x() {
        return this.state.components[0];
    }

    y() {
        return this.state.components[1];
    }

    a_x(x, vy) {
        return 2 * vy * earthOmega * Math.sin(latitude) - (g / pendulumLength) * x;
    }

    a_y(y, vx) {
        return - (2 * vx * earthOmega * Math.sin(latitude)) - (g / pendulumLength) * y;
    }

    derivative(state) {
        const [x, y, vx, vy] = state.components;
        return new Vector([vx, vy, this.a_x(x, vy), this.a_y(y, vx)])
    }


    runge_kutt(h) {
        const s = this.state;

        const k1 = scaleVector(this.derivative(s), h);
        const k2 = scaleVector(this.derivative(addVectors(s, scaleVector(k1, 1 / 2))), h);
        const k3 = scaleVector(this.derivative(addVectors(s, scaleVector(k2, 1 / 2))), h);
        const k4 = scaleVector(this.derivative(addVectors(s, k3)), h)


        const increment = addVectors(k1, scaleVector(k2, 2), scaleVector(k3, 2), k4);
        this.state = addVectors(this.state, scaleVector(increment, 1 / 6));

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
    line(0, 0, pendulum.x() * scale, pendulum.y() * scale);

    fill(255, 0, 0);
    noStroke();
    circle(pendulum.x() * scale, pendulum.y() * scale, 20);

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
            pendulum.trace.push([pendulum.x(), pendulum.y()]);
        }
    }
}

function resetPendulum() {
    pendulum.state = new Vector([initialAmplitude, 0, 0, 0])
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


    select('#damping').input(function() {
        let dampVal = this.value();
        damping = dampVal / 1000;
        select('#damping-val').html(damping.toFixed(3));
    });

    select('#period').input(function() {
        earthPeriod = this.value();
        earthOmega = 2 * Math.PI / (earthPeriod * 60);
        select('#period-val').html(earthPeriod + ' min');
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
