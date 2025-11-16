let initialAmplitude = 100;
let latitude = 50;
let pendulumLength = 50;
let g = 9.81;

let earthOmega = 2 * 3.14 / 86400;

let timeScale = 20;
let damping = 0.005;
let isPaused = false;

let x, y;
let vx, vy;

let trace = [];
let maxTracePoints = 5000;
let scale = 2;

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

    drawPendulum();
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
    line(-width/2, 0, width/2, 0);
    line(0, -height/2, 0, height/2);

    fill(100);
    noStroke();
    textAlign(CENTER);
    text('N', 0, -height/2 + 20);
    text('S', 0, height/2 - 20);
    text('E', width/2 - 20, 5);
    text('W', -width/2 + 20, 5);

    pop();
}

function drawTrace() {
}

function drawPendulum() {
    push();
    translate(width / 2, height / 2);

    stroke(50);
    strokeWeight(2);
    line(0, 0, x * scale, y * scale);

    fill(255, 0, 0);
    noStroke();
    circle(x * scale, y * scale, 20);

    fill(50);
    circle(0, 0, 10);

    pop();
}

function updatePhysics() {
}

function resetPendulum() {
    x = initialAmplitude;
    y = 0;
    vx = 0;
    vy = 0;
    trace = [];
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

    select('#speed').input(function() {
        timeScale = this.value();
        select('#speed-val').html(timeScale + 'x');
    });

    select('#damping').input(function() {
        let dampVal = this.value();
        damping = dampVal / 1000;
        select('#damping-val').html(damping.toFixed(3));
    });
}

function clearTrace() {
    trace = [];
}

function togglePause() {
    isPaused = !isPaused;
}
