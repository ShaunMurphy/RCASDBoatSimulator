/*
 * Copyright 2026 Shaun Murphy and Charles Murphy
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ASDController } from './controller.js';
import { BoatPhysics } from './physics.js';

// Instantiate Core Engines
const controller = new ASDController();
const boat = new BoatPhysics();

// DOM Elements
const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');

// Header Controls
const btnReset = document.getElementById('btnReset');
const btnObstacles = document.getElementById('btnObstacles');
const btnThemeToggle = document.getElementById('btnThemeToggle');
const themeMoonIcon = document.getElementById('themeMoonIcon');
const themeSunIcon = document.getElementById('themeSunIcon');
const txtTheme = document.getElementById('txtTheme');

// Config Sliders & Displays
const slideServoSpeed = document.getElementById('slideServoSpeed');
const valServoSpeed = document.getElementById('valServoSpeed');
const slideToeIn = document.getElementById('slideToeIn');
const valToeIn = document.getElementById('valToeIn');
const slideMotorLag = document.getElementById('slideMotorLag');
const valMotorLag = document.getElementById('valMotorLag');

// Control Mixing algorithm elements
const selectAlgorithm = document.getElementById('selectAlgorithm');
const checkInvertSteer = document.getElementById('checkInvertSteer');
const checkBoatOverlay = document.getElementById('checkBoatOverlay');
const groupBoatOverlayConfig = document.getElementById('groupBoatOverlayConfig');
const slideOverlayOpacity = document.getElementById('slideOverlayOpacity');
const valOverlayOpacity = document.getElementById('valOverlayOpacity');
const slideOverlayScale = document.getElementById('slideOverlayScale');
const valOverlayScale = document.getElementById('valOverlayScale');
const slideMapZoom = document.getElementById('slideMapZoom');
const valMapZoom = document.getElementById('valMapZoom');

const slideTransWeight = document.getElementById('slideTransWeight');
const valTransWeight = document.getElementById('valTransWeight');
const groupTransWeight = document.getElementById('groupTransWeight');

const slideRotWeight = document.getElementById('slideRotWeight');
const valRotWeight = document.getElementById('valRotWeight');
const groupRotWeight = document.getElementById('groupRotWeight');

const slideLatWeight = document.getElementById('slideLatWeight');
const valLatWeight = document.getElementById('valLatWeight');
const groupLatWeight = document.getElementById('groupLatWeight');

const slideMass = document.getElementById('slideMass');
const valMass = document.getElementById('valMass');
const slideThrust = document.getElementById('slideThrust');
const valThrust = document.getElementById('valThrust');
const slideLateralDrag = document.getElementById('slideLateralDrag');
const valLateralDrag = document.getElementById('valLateralDrag');

const slideCurrentSpeed = document.getElementById('slideCurrentSpeed');
const valCurrentSpeed = document.getElementById('valCurrentSpeed');
const slideCurrentDir = document.getElementById('slideCurrentDir');
const valCurrentDir = document.getElementById('valCurrentDir');
const compassCurrent = document.getElementById('compassCurrent');

const slideWindSpeed = document.getElementById('slideWindSpeed');
const valWindSpeed = document.getElementById('valWindSpeed');
const slideWindDir = document.getElementById('slideWindDir');
const valWindDir = document.getElementById('valWindDir');
const compassWind = document.getElementById('compassWind');

// Overlays & Transmitter
const badgeFPS = document.getElementById('badgeFPS');
const gimbalWell = document.getElementById('gimbalWell');
const gimbalStick = document.getElementById('gimbalStick');
const txtCh1 = document.getElementById('txtCh1');
const txtCh2 = document.getElementById('txtCh2');
const cardCh1 = document.getElementById('cardCh1');
const cardCh2 = document.getElementById('cardCh2');

// 4-Channel DOM Elements
const selectChannelMode = document.getElementById('selectChannelMode');
const selectAuxMode = document.getElementById('selectAuxMode');
const groupAuxMode = document.getElementById('groupAuxMode');
const gimbalWellLeft = document.getElementById('gimbalWellLeft');
const gimbalStickLeft = document.getElementById('gimbalStickLeft');
const gimbalContainerLeft = document.getElementById('gimbalContainerLeft');
const gimbalContainerRight = document.getElementById('gimbalContainerRight');
const labelRightStick = document.getElementById('labelRightStick');
const txtCh3 = document.getElementById('txtCh3');
const txtCh4 = document.getElementById('txtCh4');
const cardCh3 = document.getElementById('cardCh3');
const cardCh4 = document.getElementById('cardCh4');

// Dynamic stats
const statSpeed = document.getElementById('statSpeed');
const statHeading = document.getElementById('statHeading');
const statTurn = document.getElementById('statTurn');

// Tabs & Right Panels
const tabDiagnostics = document.getElementById('tabDiagnostics');
const tabCode = document.getElementById('tabCode');
const panelDiagnostics = document.getElementById('panelDiagnostics');
const panelCode = document.getElementById('panelCode');
const selectPlatform = document.getElementById('selectPlatform');
const codeText = document.getElementById('codeText');

// Custom Mixing Mode Editor Elements
const btnNewAlgo = document.getElementById('btnNewAlgo');
const btnEditAlgo = document.getElementById('btnEditAlgo');
const btnDeleteAlgo = document.getElementById('btnDeleteAlgo');
const modalEditor = document.getElementById('modalEditor');
const closeEditor = document.getElementById('closeEditor');
const editorTitle = document.getElementById('editorTitle');
const editorName = document.getElementById('editorName');
const editorEqServoL = document.getElementById('editorEqServoL');
const editorEqServoR = document.getElementById('editorEqServoR');
const editorEqEscL = document.getElementById('editorEqEscL');
const editorEqEscR = document.getElementById('editorEqEscR');
const editorError = document.getElementById('editorError');
const btnCancelEditor = document.getElementById('btnCancelEditor');
const btnSaveEditor = document.getElementById('btnSaveEditor');

// Diagnostics Elements
const diagServoLAngle = document.getElementById('diagServoLAngle');
const diagServoLPWM = document.getElementById('diagServoLPWM');
const barServoL = document.getElementById('barServoL');
const diagEscLSpeed = document.getElementById('diagEscLSpeed');
const diagEscLPWM = document.getElementById('diagEscLPWM');
const barEscL = document.getElementById('barEscL');

const diagServoRAngle = document.getElementById('diagServoRAngle');
const diagServoRPWM = document.getElementById('diagServoRPWM');
const barServoR = document.getElementById('barServoR');
const diagEscRSpeed = document.getElementById('diagEscRSpeed');
const diagEscRPWM = document.getElementById('diagEscRPWM');
const barEscR = document.getElementById('barEscR');

const diagTargetAngleL = document.getElementById('diagTargetAngleL');
const diagTargetAngleR = document.getElementById('diagTargetAngleR');
const diagTargetSpeedL = document.getElementById('diagTargetSpeedL');
const diagTargetSpeedR = document.getElementById('diagTargetSpeedR');

// Close-up visualizer canvases for thruster positions
const canvasThrusterL = document.getElementById('canvasThrusterL');
const canvasThrusterR = document.getElementById('canvasThrusterR');
const ctxTL = canvasThrusterL.getContext('2d');
const ctxTR = canvasThrusterR.getContext('2d');

// UI Simulation Variables
let lastFrameTime = performance.now();
let fps = 60;
let showObstacles = true;
let isDraggingJoystick = false;
let isDraggingJoystickLeft = false;
let joystickVal = { x: 0.0, y: 0.0 }; // Normalized (-1.0 to 1.0)
let joystickValLeft = { x: 0.0, y: 0.0 }; // Normalized (-1.0 to 1.0)
let keyboardTarget = { x: 0.0, y: 0.0 }; // Joystick destination target from keys
let activeKeys = {};

// Boat Trail & Particle System
const boatTrail = [];
const maxTrailPoints = 120;
const particles = [];

// Setup & Dimensions
function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Initial configuration mapping from UI to Controller/Physics
function applyConfig() {
    controller.config.servoSpeedLimit = (parseFloat(slideServoSpeed.value) * Math.PI) / 180.0;
    controller.config.maxToeIn = (parseFloat(slideToeIn.value) * Math.PI) / 180.0;
    controller.config.motorTimeConstant = parseFloat(slideMotorLag.value);

    // Mixing mode settings
    controller.config.algorithm = selectAlgorithm.value;
    controller.config.invertSteering = checkInvertSteer.checked;
    controller.config.translationWeight = parseFloat(slideTransWeight.value);
    controller.config.rotationWeight = parseFloat(slideRotWeight.value);
    controller.config.lateralWeight = parseFloat(slideLatWeight.value);

    // 4-Channel settings
    const channels = parseInt(selectChannelMode.value);
    controller.config.channels = channels;
    controller.config.auxMode = selectAuxMode.value;

    const is4ch = (channels === 4);
    groupAuxMode.style.display = is4ch ? 'flex' : 'none';

    // Show/hide left stick container and stick labels
    gimbalContainerLeft.style.display = is4ch ? 'flex' : 'none';
    labelRightStick.style.display = is4ch ? 'inline-block' : 'none';

    // Toggle controller-dock style for dual-gimbal spacing
    const dock = document.querySelector('.controller-dock');
    if (dock) {
        dock.classList.toggle('dual-stick', is4ch);
    }

    // Show/hide Ch3/Ch4 readout cards
    cardCh3.style.display = is4ch ? 'flex' : 'none';
    cardCh4.style.display = is4ch ? 'flex' : 'none';

    // If switching back to 2ch, reset left stick inputs to center (1500us)
    if (!is4ch) {
        joystickValLeft.x = 0.0;
        joystickValLeft.y = 0.0;
        updateVisualJoystickLeft(0.0, 0.0);
    }

    // Show/hide Edit/Delete buttons for custom modes
    const isCustom = controller.config.algorithm.startsWith('custom_');
    btnEditAlgo.style.display = isCustom ? 'inline-flex' : 'none';
    btnDeleteAlgo.style.display = isCustom ? 'inline-flex' : 'none';

    // Show/hide relevant settings dynamically based on mixing mode
    if (controller.config.algorithm === 'vectored') {
        groupLatWeight.style.display = 'flex';
        groupTransWeight.style.display = 'flex';
        groupRotWeight.style.display = 'flex';
    } else if (controller.config.algorithm === 'differential') {
        groupLatWeight.style.display = 'none';
        groupTransWeight.style.display = 'flex';
        groupRotWeight.style.display = 'flex';
    } else {
        // For custom algorithms, show all config weight sliders so they can be read by custom code
        groupLatWeight.style.display = 'flex';
        groupTransWeight.style.display = 'flex';
        groupRotWeight.style.display = 'flex';
    }

    boat.config.mass = parseFloat(slideMass.value);
    // Rough inertia approximation for rectangular hull
    boat.config.inertia = (1/12) * boat.config.mass * (Math.pow(boat.config.length, 2) + Math.pow(boat.config.width, 2));
    boat.config.thrustMax = parseFloat(slideThrust.value);
    boat.config.dragLinearX = parseFloat(slideLateralDrag.value);

    boat.env.currentSpeed = parseFloat(slideCurrentSpeed.value);
    boat.env.currentDir = (parseFloat(slideCurrentDir.value) * Math.PI) / 180.0;
    boat.env.windSpeed = parseFloat(slideWindSpeed.value);
    boat.env.windDir = (parseFloat(slideWindDir.value) * Math.PI) / 180.0;

    // Visual indicators
    compassCurrent.style.transform = `rotate(${slideCurrentDir.value}deg)`;
    compassWind.style.transform = `rotate(${slideWindDir.value}deg)`;

    // Show/hide overlay sliders
    if (checkBoatOverlay && checkBoatOverlay.checked) {
        groupBoatOverlayConfig.style.display = 'flex';
    } else if (groupBoatOverlayConfig) {
        groupBoatOverlayConfig.style.display = 'none';
    }

    // Auto-refresh the dynamic C++ code panel if the tab is active
    if (tabCode && tabCode.classList.contains('active')) {
        renderArduinoCode();
    }
}

// Config Event Listeners
const sliders = [
    { el: slideServoSpeed, val: valServoSpeed, suffix: '°/s' },
    { el: slideToeIn, val: valToeIn, suffix: '°' },
    { el: slideMotorLag, val: valMotorLag, suffix: 's' },
    { el: slideTransWeight, val: valTransWeight, suffix: '' },
    { el: slideRotWeight, val: valRotWeight, suffix: '' },
    { el: slideLatWeight, val: valLatWeight, suffix: '' },
    { el: slideMapZoom, val: valMapZoom, suffix: ' px/m' },
    { el: slideOverlayOpacity, val: valOverlayOpacity, suffix: '%' },
    { el: slideOverlayScale, val: valOverlayScale, suffix: 'x' },
    { el: slideMass, val: valMass, suffix: ' kg' },
    { el: slideThrust, val: valThrust, suffix: ' N' },
    { el: slideLateralDrag, val: valLateralDrag, suffix: '' },
    { el: slideCurrentSpeed, val: valCurrentSpeed, suffix: ' m/s' },
    { el: slideCurrentDir, val: valCurrentDir, suffix: '°' },
    { el: slideWindSpeed, val: valWindSpeed, suffix: ' m/s' },
    { el: slideWindDir, val: valWindDir, suffix: '°' }
];

sliders.forEach(slider => {
    slider.el.addEventListener('input', () => {
        if (typeof slider.suffix === 'function') {
            slider.val.innerText = slider.suffix(parseFloat(slider.el.value));
        } else {
            slider.val.innerText = slider.el.value + slider.suffix;
        }
        applyConfig();
    });
});

function updateAlgorithmTooltip() {
    const algo = selectAlgorithm.value;
    let text = '';
    if (algo === 'vectored') {
        text = 'Vectored Mode Equations:\n' +
               '• Left Servo = atan2(fL_x, fL_y)\n' +
               '• Right Servo = atan2(fR_x, fR_y)\n' +
               '• Left ESC = sqrt(fL_x² + fL_y²)\n' +
               '• Right ESC = sqrt(fR_x² + fR_y²)\n' +
               'where forces are a vector combination of translation, rotation & lateral vector components.';
    } else if (algo === 'differential') {
        text = 'Differential Mode Equations:\n' +
               '• Left Servo = -toeangle\n' +
               '• Right Servo = toeangle\n' +
               '• Left ESC = y * transweight + x * rotweight\n' +
               '• Right ESC = y * transweight - x * rotweight';
    } else if (algo === 'crabwalk') {
        text = 'Crab Walk Equations (k = 4.2667):\n' +
               '• Ax = (x * latweight) / 2\n' +
               '• AyL = (y * transweight + k * x * latweight) / 2\n' +
               '• AyR = (y * transweight - k * x * latweight) / 2\n' +
               '• L/R Servo = atan2(Ax, AyL/R)\n' +
               '• L/R ESC = sqrt(Ax² + AyL/R²)\n' +
               '(speeds scaled down if either exceeds 1.0)';
    } else if (algo.startsWith('custom_')) {
        const customAlgo = controller.customAlgorithms[algo];
        if (customAlgo) {
            text = 'Custom Mode Equations:\n' +
                   `• Left Servo = ${customAlgo.eqServoL}\n` +
                   `• Right Servo = ${customAlgo.eqServoR}\n` +
                   `• Left ESC = ${customAlgo.eqEscL}\n` +
                   `• Right ESC = ${customAlgo.eqEscR}`;
        } else {
            text = 'Custom equations loaded from localStorage.';
        }
    }
    
    const tooltip = document.getElementById('tooltipAlgorithm');
    if (tooltip) {
        tooltip.setAttribute('data-tooltip', text);
    }
}

selectAlgorithm.addEventListener('change', () => {
    applyConfig();
    updateAlgorithmTooltip();
});

checkInvertSteer.addEventListener('change', () => {
    applyConfig();
});

checkBoatOverlay.addEventListener('change', () => {
    applyConfig();
});

// Main map floating zoom controls (+ / - buttons)
const btnZoomIn = document.getElementById('btnZoomIn');
const btnZoomOut = document.getElementById('btnZoomOut');

if (btnZoomIn && btnZoomOut) {
    btnZoomIn.addEventListener('click', () => {
        let val = parseInt(slideMapZoom.value);
        val = Math.min(100, val + 5);
        slideMapZoom.value = val;
        valMapZoom.innerText = val + ' px/m';
        applyConfig();
    });

    btnZoomOut.addEventListener('click', () => {
        let val = parseInt(slideMapZoom.value);
        val = Math.max(10, val - 5);
        slideMapZoom.value = val;
        valMapZoom.innerText = val + ' px/m';
        applyConfig();
    });
}

selectPlatform.addEventListener('change', () => {
    if (tabCode.classList.contains('active')) {
        renderArduinoCode();
    }
});

selectChannelMode.addEventListener('change', () => {
    applyConfig();
    if (tabCode.classList.contains('active')) {
        renderArduinoCode();
    }
});

selectAuxMode.addEventListener('change', () => {
    applyConfig();
    if (tabCode.classList.contains('active')) {
        renderArduinoCode();
    }
});

// Theme System (Light / Dark Mode switcher)
function setTheme(theme) {
    if (theme === 'light') {
        document.body.classList.add('light-theme');
        themeMoonIcon.style.display = 'none';
        themeSunIcon.style.display = 'inline';
        txtTheme.innerText = 'Light Mode';
    } else {
        document.body.classList.remove('light-theme');
        themeMoonIcon.style.display = 'inline';
        themeSunIcon.style.display = 'none';
        txtTheme.innerText = 'Dark Mode';
    }
    localStorage.setItem('theme', theme);
}

btnThemeToggle.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light-theme');
    setTheme(isLight ? 'dark' : 'light');
});

// Set theme initially on script run
const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);

// Tab Toggles
tabDiagnostics.addEventListener('click', () => {
    tabDiagnostics.classList.add('active');
    tabCode.classList.remove('active');
    panelDiagnostics.style.display = 'flex';
    panelCode.style.display = 'none';
});

tabCode.addEventListener('click', () => {
    tabCode.classList.add('active');
    tabDiagnostics.classList.remove('active');
    panelDiagnostics.style.display = 'none';
    panelCode.style.display = 'flex';
    renderArduinoCode();
});

// General buttons
btnReset.addEventListener('click', () => {
    boat.reset();
    boatTrail.length = 0;
    particles.length = 0;
});

btnObstacles.addEventListener('click', () => {
    showObstacles = !showObstacles;
    btnObstacles.classList.toggle('primary');
    btnObstacles.classList.toggle('danger');
});

// Joystick Drag Logic
function updateVisualJoystick(normX, normY) {
    const maxOffset = 40; // max displacement in pixels inside 105px well
    const visualX = normX * maxOffset;
    const visualY = -normY * maxOffset; // flip y for visual layout (up is negative in css top)

    gimbalStick.style.left = `calc(50% + ${visualX}px)`;
    gimbalStick.style.top = `calc(50% + ${visualY}px)`;

    // Calculate pulse values to display
    const ch1_pwm = Math.round(1500 + normX * 500);
    const ch2_pwm = Math.round(1500 + normY * 500);

    txtCh1.innerHTML = `${ch1_pwm} <span>&mu;s</span>`;
    txtCh2.innerHTML = `${ch2_pwm} <span>&mu;s</span>`;

    // Highlight card if active
    if (Math.abs(normX) > 0.02) cardCh1.classList.add('active');
    else cardCh1.classList.remove('active');
    
    if (Math.abs(normY) > 0.02) cardCh2.classList.add('active');
    else cardCh2.classList.remove('active');
}

function handleJoystickMove(clientX, clientY) {
    const rect = gimbalWell.getBoundingClientRect();
    const radius = rect.width / 2.0;
    const centerX = rect.left + radius;
    const centerY = rect.top + radius;

    let dx = clientX - centerX;
    let dy = clientY - centerY;

    let normX = dx / radius;
    let normY = -dy / radius; // inverted so pointing up is positive throttle

    // Clamp vector to unit circle
    const dist = Math.sqrt(normX * normX + normY * normY);
    if (dist > 1.0) {
        normX /= dist;
        normY /= dist;
    }

    joystickVal.x = normX;
    joystickVal.y = normY;
    keyboardTarget.x = normX;
    keyboardTarget.y = normY;

    updateVisualJoystick(normX, normY);
}

// Pointer Events (Mouse + Touch support)
gimbalWell.addEventListener('pointerdown', (e) => {
    isDraggingJoystick = true;
    gimbalWell.setPointerCapture(e.pointerId);
    handleJoystickMove(e.clientX, e.clientY);
});

gimbalWell.addEventListener('pointermove', (e) => {
    if (isDraggingJoystick) {
        handleJoystickMove(e.clientX, e.clientY);
    }
});

gimbalWell.addEventListener('pointerup', (e) => {
    isDraggingJoystick = false;
    gimbalWell.releasePointerCapture(e.pointerId);
});

gimbalWell.addEventListener('pointercancel', () => {
    isDraggingJoystick = false;
});

function handleJoystickMoveLeft(clientX, clientY) {
    const rect = gimbalWellLeft.getBoundingClientRect();
    const radius = rect.width / 2.0;
    const centerX = rect.left + radius;
    const centerY = rect.top + radius;

    let dx = clientX - centerX;
    let dy = clientY - centerY;

    let normX = dx / radius;
    let normY = -dy / radius;

    const dist = Math.sqrt(normX * normX + normY * normY);
    if (dist > 1.0) {
        normX /= dist;
        normY /= dist;
    }

    joystickValLeft.x = normX;
    joystickValLeft.y = normY;

    updateVisualJoystickLeft(normX, normY);
}

function updateVisualJoystickLeft(normX, normY) {
    const maxOffset = 40;
    const visualX = normX * maxOffset;
    const visualY = -normY * maxOffset;

    gimbalStickLeft.style.left = `calc(50% + ${visualX}px)`;
    gimbalStickLeft.style.top = `calc(50% + ${visualY}px)`;

    const ch3_pwm = Math.round(1500 + normX * 500);
    const ch4_pwm = Math.round(1500 + normY * 500);

    txtCh3.innerHTML = `${ch3_pwm} <span>&mu;s</span>`;
    txtCh4.innerHTML = `${ch4_pwm} <span>&mu;s</span>`;

    if (Math.abs(normX) > 0.02) cardCh3.classList.add('active');
    else cardCh3.classList.remove('active');
    
    if (Math.abs(normY) > 0.02) cardCh4.classList.add('active');
    else cardCh4.classList.remove('active');
}

gimbalWellLeft.addEventListener('pointerdown', (e) => {
    isDraggingJoystickLeft = true;
    gimbalWellLeft.setPointerCapture(e.pointerId);
    handleJoystickMoveLeft(e.clientX, e.clientY);
});

gimbalWellLeft.addEventListener('pointermove', (e) => {
    if (isDraggingJoystickLeft) {
        handleJoystickMoveLeft(e.clientX, e.clientY);
    }
});

gimbalWellLeft.addEventListener('pointerup', (e) => {
    isDraggingJoystickLeft = false;
    gimbalWellLeft.releasePointerCapture(e.pointerId);
    joystickValLeft.x = 0.0;
    joystickValLeft.y = 0.0;
    updateVisualJoystickLeft(0.0, 0.0);
});

gimbalWellLeft.addEventListener('pointercancel', () => {
    isDraggingJoystickLeft = false;
    joystickValLeft.x = 0.0;
    joystickValLeft.y = 0.0;
    updateVisualJoystickLeft(0.0, 0.0);
});

// Keyboard Mapping
window.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyS', 'KeyA', 'KeyD'].includes(e.code)) {
        e.preventDefault(); // prevent scrolling page
    }
    activeKeys[e.code] = true;
    updateKeyboardTargets();
});

window.addEventListener('keyup', (e) => {
    activeKeys[e.code] = false;
    updateKeyboardTargets();
});

function updateKeyboardTargets() {
    let tx = 0.0;
    let ty = 0.0;

    if (activeKeys['ArrowUp'] || activeKeys['KeyW']) ty += 1.0;
    if (activeKeys['ArrowDown'] || activeKeys['KeyS']) ty -= 1.0;
    if (activeKeys['ArrowLeft'] || activeKeys['KeyA']) tx -= 1.0;
    if (activeKeys['ArrowRight'] || activeKeys['KeyD']) tx += 1.0;

    keyboardTarget.x = tx;
    keyboardTarget.y = ty;
}

// Spring Joystick Centering (WASD Return or mouse release return)
function animateJoystick(dt) {
    if (isDraggingJoystick) return;

    // Slew joystickVal towards keyboardTarget
    const speed = 12.0; // Slew speed factor
    joystickVal.x += (keyboardTarget.x - joystickVal.x) * speed * dt;
    joystickVal.y += (keyboardTarget.y - joystickVal.y) * speed * dt;

    // Clamp small numbers to zero
    if (Math.abs(joystickVal.x) < 0.005 && keyboardTarget.x === 0) joystickVal.x = 0;
    if (Math.abs(joystickVal.y) < 0.005 && keyboardTarget.y === 0) joystickVal.y = 0;

    updateVisualJoystick(joystickVal.x, joystickVal.y);
}

// Particle System emitter
function spawnParticles(worldX, worldY, speed, dir, dt) {
    if (speed < 0.05) return;
    
    // Spawn rate relative to speed
    const numToSpawn = Math.floor(speed * 30 * dt) + (Math.random() < speed * 30 * dt ? 1 : 0);
    const flowDir = dir + Math.PI; // jet flows opposite to thrust force direction

    for (let i = 0; i < numToSpawn; i++) {
        // Add random dispersion angle
        const dispersion = 0.25; // radians (~14 degrees)
        const angle = flowDir + (Math.random() - 0.5) * dispersion;
        const pSpeed = (0.5 + Math.random() * 0.5) * speed * 3.5;

        particles.push({
            x: worldX,
            y: worldY,
            vx: Math.sin(angle) * pSpeed,
            vy: Math.cos(angle) * pSpeed,
            life: 0.4 + Math.random() * 0.4, // seconds
            maxLife: 0.8,
            size: 2.0 + Math.random() * 3.0 // base size
        });
    }
}

function updateParticles(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        // Friction against water
        p.vx *= 0.95;
        p.vy *= 0.95;
        p.life -= dt;
        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    }
}

// MAIN LOOP
function loop(timeNow) {
    const dt = Math.min((timeNow - lastFrameTime) / 1000.0, 0.1); // cap dt at 0.1s to avoid physics explosions
    lastFrameTime = timeNow;

    // Calculate FPS
    fps = Math.round(1.0 / dt);
    badgeFPS.innerText = `${fps} FPS`;

    // 1. Process joystick spring return/slew
    animateJoystick(dt);

    // 2. Feed joystick values as PWM to Microcontroller controller
    const ch1_pwm = 1500 + joystickVal.x * 500;
    const ch2_pwm = 1500 + joystickVal.y * 500;
    const ch3_pwm = 1500 + joystickValLeft.x * 500;
    const ch4_pwm = 1500 + joystickValLeft.y * 500;
    controller.setInputs(ch1_pwm, ch2_pwm, ch3_pwm, ch4_pwm);

    // 3. Run Microcontroller logic calculations
    controller.updateMixing();
    controller.updateHardware(dt);

    // 4. Run Physics engine calculations
    boat.step(
        dt, 
        controller.microOut.escLeftSpeed, 
        controller.microOut.servoLeftAngle, 
        controller.microOut.escRightSpeed, 
        controller.microOut.servoRightAngle
    );

    // 5. Append boat trail
    if (Math.abs(boat.state.vx) > 0.05 || Math.abs(boat.state.vy) > 0.05) {
        boatTrail.push({ x: boat.state.x, y: boat.state.y });
        if (boatTrail.length > maxTrailPoints) {
            boatTrail.shift();
        }
    } else if (boatTrail.length > 0 && Math.random() < 0.05) {
        // Slow decay of trail when stopped
        boatTrail.shift();
    }

    // 6. Particle Emitters
    // Determine world coordinates of left/right thrusters at stern
    const d = boat.config.thrusterDistX;
    const h = boat.config.thrusterDistY;
    const [pL_wx, pL_wy] = boat.localToWorld(-d, h);
    const [pR_wx, pR_wy] = boat.localToWorld(d, h);

    spawnParticles(
        boat.state.x + pL_wx, 
        boat.state.y + pL_wy, 
        controller.microOut.escLeftSpeed, 
        boat.state.phi + controller.microOut.servoLeftAngle, 
        dt
    );
    spawnParticles(
        boat.state.x + pR_wx, 
        boat.state.y + pR_wy, 
        controller.microOut.escRightSpeed, 
        boat.state.phi + controller.microOut.servoRightAngle, 
        dt
    );

    updateParticles(dt);

    // 7. Render Viewport
    draw();

    // 8. Update Panels
    updateDiagnosticsDisplay();

    requestAnimationFrame(loop);
}

// DRAW VIEWPORT
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scale = parseFloat(slideMapZoom.value); // Dynamic map zoom scale
    const cx = canvas.width / 2.0;
    const cy = canvas.height / 2.0;

    // A. Draw Scrolling Infinite Grid Background
    const gridStep = 2.0; // meters per grid line
    const halfW = canvas.width / 2.0;
    const halfH = canvas.height / 2.0;
    const startX = Math.floor((boat.state.x - halfW / scale) / gridStep) * gridStep;
    const endX = Math.ceil((boat.state.x + halfW / scale) / gridStep) * gridStep;
    const startY = Math.floor((boat.state.y - halfH / scale) / gridStep) * gridStep;
    const endY = Math.ceil((boat.state.y + halfH / scale) / gridStep) * gridStep;

    const isLightTheme = document.body.classList.contains('light-theme');
    ctx.strokeStyle = isLightTheme ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.07)';
    ctx.lineWidth = 1;
    for (let gx = startX; gx <= endX; gx += gridStep) {
        const x_canvas = cx + (gx - boat.state.x) * scale;
        ctx.beginPath();
        ctx.moveTo(x_canvas, 0);
        ctx.lineTo(x_canvas, canvas.height);
        ctx.stroke();
    }
    for (let gy = startY; gy <= endY; gy += gridStep) {
        const y_canvas = cy - (gy - boat.state.y) * scale;
        ctx.beginPath();
        ctx.moveTo(0, y_canvas);
        ctx.lineTo(canvas.width, y_canvas);
        ctx.stroke();
    }

    // B. Draw Lake Boundaries (+-25m boundaries)
    const pSize = boat.config.pondSize;
    ctx.strokeStyle = 'rgba(255, 69, 58, 0.35)';
    ctx.lineWidth = 3;
    ctx.strokeRect(
        cx + (-pSize/2 - boat.state.x) * scale,
        cy - (pSize/2 - boat.state.y) * scale,
        pSize * scale,
        pSize * scale
    );

    // C. Draw Obstacles (Docks and Buoys)
    if (showObstacles) {
        boat.obstacles.forEach(obs => {
            if (obs.type === 'dock') {
                const ox1 = cx + (obs.x1 - boat.state.x) * scale;
                const oy1 = cy - (obs.y2 - boat.state.y) * scale; // invert Y order since layout draws down
                const ow = (obs.x2 - obs.x1) * scale;
                const oh = (obs.y2 - obs.y1) * scale;

                // Draw solid Dock
                ctx.fillStyle = 'rgba(45, 54, 84, 0.65)';
                ctx.strokeStyle = 'rgba(154, 174, 196, 0.3)';
                ctx.lineWidth = 2;
                ctx.fillRect(ox1, oy1, ow, oh);
                ctx.strokeRect(ox1, oy1, ow, oh);

                // Dock lines / details
                ctx.fillStyle = isLightTheme ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';
                for (let i = 10; i < ow; i += 20) {
                    ctx.fillRect(ox1 + i, oy1 + 2, 2, oh - 4);
                }

                // Label
                ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
                ctx.font = '10px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(obs.label, ox1 + ow / 2, oy1 + oh / 2 + 3);

            } else if (obs.type === 'buoy') {
                const bx = cx + (obs.x - boat.state.x) * scale;
                const by = cy - (obs.y - boat.state.y) * scale;
                const br = obs.r * scale;

                // Glowing drop-shadow look
                ctx.beginPath();
                ctx.arc(bx, by, br, 0, Math.PI * 2);
                ctx.fillStyle = obs.color;
                ctx.shadowColor = obs.color;
                ctx.shadowBlur = 10;
                ctx.fill();
                ctx.shadowBlur = 0; // reset shadow
                
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 1.5;
                ctx.stroke();

                // Draw buoy cap/ring
                ctx.beginPath();
                ctx.arc(bx, by, br * 0.4, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                ctx.fill();
            }
        });
    }

    // D. Draw Boat Trail
    if (boatTrail.length > 1) {
        ctx.lineWidth = 3.5;
        for (let i = 1; i < boatTrail.length; i++) {
            const rx1 = boatTrail[i-1].x - boat.state.x;
            const ry1 = boatTrail[i-1].y - boat.state.y;
            const rx2 = boatTrail[i].x - boat.state.x;
            const ry2 = boatTrail[i].y - boat.state.y;

            ctx.strokeStyle = `rgba(0, 221, 255, ${(i / boatTrail.length) * 0.3})`;
            ctx.beginPath();
            ctx.moveTo(cx + rx1 * scale, cy - ry1 * scale);
            ctx.lineTo(cx + rx2 * scale, cy - ry2 * scale);
            ctx.stroke();
        }
    }

    // E. Draw Water Jet Particles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    particles.forEach(p => {
        const px = cx + (p.x - boat.state.x) * scale;
        const py = cy - (p.y - boat.state.y) * scale;
        const pr = p.size * (p.life / p.maxLife) * (scale / 20.0);

        ctx.fillStyle = `rgba(255, 255, 255, ${(p.life / p.maxLife) * 0.4})`;
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.fill();
    });

    // F. Draw the Boat Hull in local frame
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(boat.state.phi); // rotate canvas by boat heading

    const bLen = boat.config.length * scale;
    const bWid = boat.config.width * scale;

    // Draw Hull shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetY = 5;

    // Boat Hull Path (Stern aligned to Y = 0, Bow extending forward to Y = -bLen)
    ctx.beginPath();
    ctx.moveTo(0, -bLen); // Bow
    ctx.quadraticCurveTo(bWid / 2, -bLen * 0.8, bWid / 2, -bLen * 0.6); // Bow curve right
    ctx.lineTo(bWid / 2, 0); // Stern right corner
    ctx.lineTo(-bWid / 2, 0); // Stern left corner
    ctx.lineTo(-bWid / 2, -bLen * 0.6); // Bow straight left
    ctx.quadraticCurveTo(-bWid / 2, -bLen * 0.8, 0, -bLen); // Bow curve left
    ctx.closePath();

    ctx.fillStyle = '#1c2237';
    ctx.fill();
    ctx.shadowBlur = 0; // reset shadow

    ctx.strokeStyle = '#4a577d';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Safety clearance envelope overlay on main simulation display
    if (checkBoatOverlay && checkBoatOverlay.checked) {
        const transparency = parseFloat(slideOverlayOpacity.value);
        const opacity = (100.0 - transparency) / 100.0;
        const overlayScale = parseFloat(slideOverlayScale.value);

        ctx.save();
        const finalScale = overlayScale * 1.7;
        ctx.scale(finalScale, finalScale);
        ctx.strokeStyle = isLightTheme ? `rgba(0, 113, 227, ${opacity})` : `rgba(0, 221, 255, ${opacity})`;
        ctx.lineWidth = 2.5 / finalScale;
        ctx.beginPath();
        ctx.moveTo(0, -bLen); // Bow
        ctx.quadraticCurveTo(bWid / 2, -bLen * 0.8, bWid / 2, -bLen * 0.6); // Bow curve right
        ctx.lineTo(bWid / 2, 0); // Stern right corner
        ctx.lineTo(-bWid / 2, 0); // Stern left corner
        ctx.lineTo(-bWid / 2, -bLen * 0.6); // Bow straight left
        ctx.quadraticCurveTo(-bWid / 2, -bLen * 0.8, 0, -bLen); // Bow curve left
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }

    // Wood Deck details
    ctx.fillStyle = 'rgba(211, 140, 71, 0.15)';
    ctx.fillRect(-bWid * 0.35, -bLen * 0.8, bWid * 0.7, bLen * 0.75);
    
    // Draw wood lines
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.lineWidth = 1;
    for (let xOff = -bWid*0.3; xOff <= bWid*0.3; xOff += bWid*0.1) {
        ctx.beginPath();
        ctx.moveTo(xOff, -bLen * 0.8);
        ctx.lineTo(xOff, -bLen * 0.05);
        ctx.stroke();
    }

    // Cab / Superstructure
    ctx.fillStyle = '#2f3b5c';
    ctx.strokeStyle = '#6c7d9c';
    ctx.lineWidth = 2;
    ctx.fillRect(-bWid * 0.3, -bLen * 0.55, bWid * 0.6, bLen * 0.25);
    ctx.strokeRect(-bWid * 0.3, -bLen * 0.55, bWid * 0.6, bLen * 0.25);

    // Windshield (cyan tinted glass)
    ctx.fillStyle = 'rgba(0, 221, 255, 0.4)';
    ctx.beginPath();
    ctx.moveTo(-bWid * 0.25, -bLen * 0.55);
    ctx.lineTo(bWid * 0.25, -bLen * 0.55);
    ctx.lineTo(bWid * 0.2, -bLen * 0.5);
    ctx.lineTo(-bWid * 0.2, -bLen * 0.5);
    ctx.closePath();
    ctx.fill();

    // Bow Fender rubber bumper
    ctx.beginPath();
    ctx.moveTo(0, -bLen - 2);
    ctx.quadraticCurveTo(bWid / 2 + 2, -bLen * 0.8, bWid / 2 + 2, -bLen * 0.6);
    ctx.strokeStyle = '#090a0f';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, -bLen - 2);
    ctx.quadraticCurveTo(-bWid / 2 - 2, -bLen * 0.8, -bWid / 2 - 2, -bLen * 0.6);
    ctx.stroke();

    // G. Draw Azimuth Thrusters
    const d_px = boat.config.thrusterDistX * scale;
    const h_px = boat.config.thrusterDistY * scale; // negative in world, so positive stern in local screen

    drawThruster(-d_px, -h_px, controller.microOut.servoLeftAngle, controller.microOut.escLeftSpeed, '#0a84ff');
    drawThruster(d_px, -h_px, controller.microOut.servoRightAngle, controller.microOut.escRightSpeed, '#30d158');

    ctx.restore();
}

function drawThruster(lx, ly, angle, speed, color) {
    ctx.save();
    ctx.translate(lx, -ly); // stern is at positive canvas local y inside the translated frame
    ctx.rotate(angle); // rotate pod relative to boat heading

    // Thruster Mount / Gearbox housing
    ctx.fillStyle = '#222';
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Nozzle pod leg
    ctx.fillRect(-2, 0, 4, 10);

    // Propeller Nozzle (Kort Nozzle ring)
    ctx.fillStyle = '#333';
    ctx.fillRect(-6, 8, 12, 6);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.strokeRect(-6, 8, 12, 6);

    // Propeller spinner inside nozzle
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, 11, 2, 0, Math.PI * 2);
    ctx.fill();

    // H. Draw Thruster Force Vectors (arrows emerging from nozzle pointing in force direction)
    // Force is in -Y (forward relative to pod rotation) inside this local frame
    if (speed > 0.02) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        
        const forceLength = speed * 35.0; // scale force length
        
        ctx.beginPath();
        ctx.moveTo(0, 0); // start at gimbal mount for visualization clarity
        ctx.lineTo(0, -forceLength); // point forward in pod direction
        ctx.stroke();

        // Arrow head
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, -forceLength - 4);
        ctx.lineTo(-4, -forceLength + 2);
        ctx.lineTo(4, -forceLength + 2);
        ctx.closePath();
        ctx.fill();
    }

    ctx.restore();
}

function drawThrusterDetail(canvas, ctx, angle, speed, color, isLeft) {
    const isLightTheme = document.body.classList.contains('light-theme');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = 45; // dial radius

    // 0. Optional transparent Boat Outline Overlay (centered around the pod pivot)
    if (checkBoatOverlay && checkBoatOverlay.checked) {
        const transparency = parseFloat(slideOverlayOpacity.value);
        const opacity = (100.0 - transparency) / 100.0;
        const overlayScale = parseFloat(slideOverlayScale.value);

        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(overlayScale, overlayScale);
        ctx.strokeStyle = isLightTheme ? `rgba(0, 0, 0, ${opacity})` : `rgba(255, 255, 255, ${opacity})`;
        ctx.lineWidth = 2.5 / overlayScale; // Keep stroke thickness consistent on screen
        ctx.beginPath();
        // Since we are looking down at the stern, draw the hull side and transom corners around the pod gimbals
        // Back of boat (transom) is at positive Y (REV side, down on screen)
        // Side of hull (left or right) extends forward to negative Y (FWD side, up on screen)
        if (isLeft) {
            ctx.moveTo(-20, -120);     // left side of hull extending forward off-screen
            ctx.lineTo(-20, 10);       // corner entry going back
            ctx.quadraticCurveTo(-20, 25, -5, 25); // bottom-left corner curve
            ctx.lineTo(35, 25);        // transom going right toward centerline
        } else {
            ctx.moveTo(20, -120);      // right side of hull extending forward off-screen
            ctx.lineTo(20, 10);        // corner entry going back
            ctx.quadraticCurveTo(20, 25, 5, 25);   // bottom-right corner curve
            ctx.lineTo(-35, 25);       // transom going left toward centerline
        }
        ctx.stroke();
        ctx.restore();
    }

    // 1. Draw protractor/compass backing ring
    ctx.strokeStyle = isLightTheme ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Draw degree lines every 30 degrees
    ctx.strokeStyle = isLightTheme ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';
    for (let deg = 0; deg < 360; deg += 30) {
        const rad = deg * Math.PI / 180;
        const x1 = cx + Math.sin(rad) * (radius - 5);
        const y1 = cy - Math.cos(rad) * (radius - 5);
        const x2 = cx + Math.sin(rad) * (radius + 2);
        const y2 = cy - Math.cos(rad) * (radius + 2);
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    // Draw cardinal direction ticks
    ctx.strokeStyle = isLightTheme ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.15)';
    const cardinals = [0, Math.PI/2, Math.PI, -Math.PI/2];
    cardinals.forEach(rad => {
        const x1 = cx + Math.sin(rad) * (radius - 8);
        const y1 = cy - Math.cos(rad) * (radius - 8);
        const x2 = cx + Math.sin(rad) * (radius + 4);
        const y2 = cy - Math.cos(rad) * (radius + 4);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    });

    // Draw Text Labels
    ctx.fillStyle = isLightTheme ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.3)';
    ctx.font = '8px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('FWD', cx, cy - radius - 10);
    ctx.fillText('REV', cx, cy + radius + 10);
    ctx.fillText(isLeft ? 'OUT' : 'IN', cx - radius - 14, cy);
    ctx.fillText(isLeft ? 'IN' : 'OUT', cx + radius + 14, cy);

    // 2. Draw rotating thruster pod
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle); // Rotate detail view relative to fwd

    // Thruster mount base
    ctx.fillStyle = '#1c2237';
    ctx.strokeStyle = '#4a577d';
    ctx.lineWidth = 2;
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0; // reset

    // Directional pointer / nozzle pod leg
    ctx.fillStyle = '#333';
    ctx.strokeStyle = '#6c7d9c';
    ctx.lineWidth = 1;
    ctx.fillRect(-4, 8, 8, 12);
    ctx.strokeRect(-4, 8, 8, 12);

    // Propeller Spinner
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, 12, 3, 0, Math.PI * 2);
    ctx.fill();

    // 3. Draw active thrust force arrow emerging from center
    // Force points in negative Y inside rotated coordinate system (opposite to nozzle output direction)
    if (speed > 0.01) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 3.5;
        
        // Scale arrow length
        const arrowLength = 10 + speed * 25; // base + magnitude scaling
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -arrowLength);
        ctx.stroke();

        // Arrow head
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, -arrowLength - 5);
        ctx.lineTo(-5, -arrowLength + 1);
        ctx.lineTo(5, -arrowLength + 1);
        ctx.closePath();
        ctx.fill();
    }

    ctx.restore();
    
    // Draw speed text in center
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.round(speed * 100)}%`, cx, cy);
}

// Diagnostics panel numerical updates
function updateDiagnosticsDisplay() {
    // Current RC channel readings
    // Handled in joystick update...

    // Diagnostic widgets
    const sLAngleDeg = (controller.microOut.servoLeftAngle * 180.0 / Math.PI).toFixed(1);
    const sRAngleDeg = (controller.microOut.servoRightAngle * 180.0 / Math.PI).toFixed(1);
    const sLTargetAngleDeg = (controller.microOut.servoLeftTargetAngle * 180.0 / Math.PI).toFixed(1);
    const sRTargetAngleDeg = (controller.microOut.servoRightTargetAngle * 180.0 / Math.PI).toFixed(1);

    diagServoLAngle.innerText = `${sLAngleDeg}°`;
    diagServoRAngle.innerText = `${sRAngleDeg}°`;
    
    diagServoLPWM.innerText = `${controller.microOut.pwmServoLeft} µs`;
    diagServoRPWM.innerText = `${controller.microOut.pwmServoRight} µs`;

    // Map -PI to PI -> 0% to 100%
    const servoLPercent = ((controller.microOut.servoLeftAngle + Math.PI) / (2 * Math.PI)) * 100;
    const servoRPercent = ((controller.microOut.servoRightAngle + Math.PI) / (2 * Math.PI)) * 100;
    barServoL.style.width = `${servoLPercent}%`;
    barServoR.style.width = `${servoRPercent}%`;

    const escLPercent = Math.round(controller.microOut.escLeftSpeed * 100);
    const escRPercent = Math.round(controller.microOut.escRightSpeed * 100);
    const escLTargetPercent = Math.round(controller.microOut.escLeftTargetSpeed * 100);
    const escRTargetPercent = Math.round(controller.microOut.escRightTargetSpeed * 100);

    diagEscLSpeed.innerText = `${escLPercent}%`;
    diagEscRSpeed.innerText = `${escRPercent}%`;

    diagEscLPWM.innerText = `${controller.microOut.pwmEscLeft} µs`;
    diagEscRPWM.innerText = `${controller.microOut.pwmEscRight} µs`;

    barEscL.style.width = `${escLPercent}%`;
    barEscR.style.width = `${escRPercent}%`;

    diagTargetAngleL.innerText = `${sLTargetAngleDeg}°`;
    diagTargetAngleR.innerText = `${sRTargetAngleDeg}°`;
    diagTargetSpeedL.innerText = `${escLTargetPercent}%`;
    diagTargetSpeedR.innerText = `${escRTargetPercent}%`;

    // Boat stats
    const velMPS = Math.sqrt(boat.state.vx * boat.state.vx + boat.state.vy * boat.state.vy);
    const headingDeg = Math.round((boat.state.phi * 180.0 / Math.PI + 360) % 360);
    const turnRateDegS = (boat.state.omega * 180.0 / Math.PI).toFixed(1);

    statSpeed.innerText = velMPS.toFixed(2);
    statHeading.innerText = `${headingDeg}°`;
    statTurn.innerText = turnRateDegS;

    // Draw close-up detailed visualizations
    drawThrusterDetail(canvasThrusterL, ctxTL, controller.microOut.servoLeftAngle, controller.microOut.escLeftSpeed, '#0a84ff', true);
    drawThrusterDetail(canvasThrusterR, ctxTR, controller.microOut.servoRightAngle, controller.microOut.escRightSpeed, '#30d158', false);
}

// Code panel text rendering with syntax highlighting based on active platform and mixing mode
function renderArduinoCode() {
    const isESP32 = selectPlatform.value === 'esp32';
    const is4ch = selectChannelMode.value === '4';
    const auxMode = selectAuxMode.value;
    
    let modeName = 'ASD Vectored (Vectored + Diff)';
    if (selectAlgorithm.value === 'differential') {
        modeName = 'ASD Differential (Longitudinal Only)';
    } else if (selectAlgorithm.value === 'crabwalk') {
        modeName = 'ASD Crab Walk (Lateral Translation)';
    } else if (selectAlgorithm.value.startsWith('custom_')) {
        const algo = controller.customAlgorithms[selectAlgorithm.value];
        modeName = algo ? `Custom: ${algo.name}` : 'Custom Algorithm';
    }
    
    if (is4ch) {
        modeName += ` with 4-Channel Control (Aux: ${auxMode.toUpperCase().replace('_', ' & ')})`;
    }
    
    let loopCode = '';
    
    let swaySpinCode = '';
    if (is4ch) {
        swaySpinCode = `  // 2. Compute Auxiliary Sway and Spin Components
  float sway = 0.0;
  float spin = 0.0;
  if (${auxMode === 'sway_spin' || auxMode === 'sway'}) {
    sway = x_aux;
  }
  if (${auxMode === 'sway_spin' || auxMode === 'spin'}) {
    spin = y_aux;
  }`;
    }
    
    if (selectAlgorithm.value.startsWith('custom_')) {
        const algo = controller.customAlgorithms[selectAlgorithm.value];
        if (algo) {
            let eqL = algo.eqServoL.toLowerCase().replace(/pi/g, 'PI').replace(/toeangle/g, 'MAX_TOE_IN').replace(/transweight/g, 'W_TRANS').replace(/rotweight/g, 'W_ROT').replace(/latweight/g, 'W_LAT');
            let eqR = algo.eqServoR.toLowerCase().replace(/pi/g, 'PI').replace(/toeangle/g, 'MAX_TOE_IN').replace(/transweight/g, 'W_TRANS').replace(/rotweight/g, 'W_ROT').replace(/latweight/g, 'W_LAT');
            let eqSpeedL = algo.eqEscL.toLowerCase().replace(/pi/g, 'PI').replace(/toeangle/g, 'MAX_TOE_IN').replace(/transweight/g, 'W_TRANS').replace(/rotweight/g, 'W_ROT').replace(/latweight/g, 'W_LAT');
            let eqSpeedR = algo.eqEscR.toLowerCase().replace(/pi/g, 'PI').replace(/toeangle/g, 'MAX_TOE_IN').replace(/transweight/g, 'W_TRANS').replace(/rotweight/g, 'W_ROT').replace(/latweight/g, 'W_LAT');

            loopCode = `  ${is4ch ? swaySpinCode + '\n\n' : ''}// 3. Custom User Logic Equations (Translated to C++)
  targetAngleL = ${eqL};
  targetAngleR = ${eqR};
  targetSpeedL = ${eqSpeedL};
  targetSpeedR = ${eqSpeedR};`;
        }
    } else if (selectAlgorithm.value === 'vectored') {
        loopCode = `  ${is4ch ? swaySpinCode + '\n\n' : ''}// 3. Compute Translation Force Components
  float s_trans = abs(y) * ${slideTransWeight.value};
  float alpha = 0.0;
  if (y >= 0) {
    alpha = MAX_TOE_IN * (1.0 - constrain(abs(y), 0.0, 1.0));
  } else {
    alpha = MAX_TOE_IN + (PI - MAX_TOE_IN) * constrain(abs(y), 0.0, 1.0);
  }
  float thetaL_trans = -alpha;
  float thetaR_trans = alpha;

  float fL_trans_x = s_trans * sin(thetaL_trans);
  float fL_trans_y = s_trans * cos(thetaL_trans);
  float fR_trans_x = s_trans * sin(thetaR_trans);
  float fR_trans_y = s_trans * cos(thetaR_trans);

  // 4. Compute Rotation Force Components (Primary Steering + Aux Spin)
  float fL_rot_y = (x + ${is4ch ? 'spin' : '0.0'}) * ${slideRotWeight.value};
  float fR_rot_y = -(x + ${is4ch ? 'spin' : '0.0'}) * ${slideRotWeight.value};
  float fL_rot_x = -(x + ${is4ch ? 'spin' : '0.0'}) * ${slideLatWeight.value};
  float fR_rot_x = -(x + ${is4ch ? 'spin' : '0.0'}) * ${slideLatWeight.value};

  // 5. Compute Sway Force Components (Pure Lateral Slide)
  float fL_sway_x = 0.0;
  float fL_sway_y = 0.0;
  float fR_sway_x = 0.0;
  float fR_sway_y = 0.0;
  if (${is4ch}) {
    float k = 4.2667;
    fL_sway_x = (sway * ${slideLatWeight.value}) / 2.0;
    fL_sway_y = (k * sway * ${slideLatWeight.value}) / 2.0;
    fR_sway_x = (sway * ${slideLatWeight.value}) / 2.0;
    fR_sway_y = (-k * sway * ${slideLatWeight.value}) / 2.0;
  }

  // 6. Vector Superposition
  float fL_x = fL_trans_x + fL_rot_x + fL_sway_x;
  float fL_y = fL_trans_y + fL_rot_y + fL_sway_y;
  float fR_x = fR_trans_x + fR_rot_x + fR_sway_x;
  float fR_y = fR_trans_y + fR_rot_y + fR_sway_y;

  // 7. Calculate Target Angles and Speed magnitudes (Symmetric Scaling)
  float targetSpeedL = sqrt(fL_x*fL_x + fL_y*fL_y);
  float targetSpeedR = sqrt(fR_x*fR_x + fR_y*fR_y);
  float maxS = max(targetSpeedL, targetSpeedR);
  if (maxS > 1.0) {
    targetSpeedL /= maxS;
    targetSpeedR /= maxS;
    fL_x /= maxS;
    fL_y /= maxS;
    fR_x /= maxS;
    fR_y /= maxS;
  }

  float targetAngleL = (targetSpeedL > 0.005) ? atan2(fL_x, fL_y) : thetaL_trans;
  float targetAngleR = (targetSpeedR > 0.005) ? atan2(fR_x, fR_y) : thetaR_trans;`;
    } else if (selectAlgorithm.value === 'crabwalk') {
        loopCode = `  ${is4ch ? swaySpinCode + '\n\n' : ''}// 3. Compute Translation Components (Crabwalk Mode)
  float wTrans = ${slideTransWeight.value};
  float wLat = ${slideLatWeight.value};
  float k = 4.2667; // Lever arm ratio -thrusterDistY / thrusterDistX

  float totalSway = x + ${is4ch ? 'sway' : '0.0'};
  float totalSpin = ${is4ch ? 'spin' : '0.0'};

  float Ax = (totalSway * wLat) / 2.0;
  float AyL = (y * wTrans + k * totalSway * wLat) / 2.0;
  float AyR = (y * wTrans - k * totalSway * wLat) / 2.0;

  float fL_rot_y = totalSpin * ${slideRotWeight.value};
  float fR_rot_y = -totalSpin * ${slideRotWeight.value};

  float fL_x = Ax;
  float fL_y = AyL + fL_rot_y;
  float fR_x = Ax;
  float fR_y = AyR + fR_rot_y;

  float targetSpeedL = sqrt(fL_x * fL_x + fL_y * fL_y);
  float targetSpeedR = sqrt(fR_x * fR_x + fR_y * fR_y);

  // Scale speeds proportionally if either exceeds 1.0 to preserve zero yaw torque ratio
  float maxS = max(targetSpeedL, targetSpeedR);
  if (maxS > 1.0) {
    targetSpeedL /= maxS;
    targetSpeedR /= maxS;
    fL_x /= maxS;
    fL_y /= maxS;
    fR_x /= maxS;
    fR_y /= maxS;
  }

  float targetAngleL = (targetSpeedL > 0.005) ? atan2(fL_x, fL_y) : 0.0;
  float targetAngleR = (targetSpeedR > 0.005) ? atan2(fR_x, fR_y) : 0.0;`;
    } else {
        loopCode = `  ${is4ch ? swaySpinCode + '\n\n' : ''}// 3. Compute Translation Force Components
  float s_trans = abs(y) * ${slideTransWeight.value};
  float alpha = 0.0;
  if (y >= 0) {
    alpha = MAX_TOE_IN * (1.0 - constrain(abs(y), 0.0, 1.0));
  } else {
    alpha = MAX_TOE_IN + (PI - MAX_TOE_IN) * constrain(abs(y), 0.0, 1.0);
  }
  float thetaL_trans = -alpha;
  float thetaR_trans = alpha;

  float fL_trans_x = s_trans * sin(thetaL_trans);
  float fL_trans_y = s_trans * cos(thetaL_trans);
  float fR_trans_x = s_trans * sin(thetaR_trans);
  float fR_trans_y = s_trans * cos(thetaR_trans);

  // 4. Compute Rotation Force Components (Longitudinal differential + Aux Spin)
  float fL_rot_y = (x + ${is4ch ? 'spin' : '0.0'}) * ${slideRotWeight.value};
  float fR_rot_y = -(x + ${is4ch ? 'spin' : '0.0'}) * ${slideRotWeight.value};

  // 5. Vector Addition / Superposition
  float fL_x = fL_trans_x;
  float fL_y = fL_trans_y + fL_rot_y;
  float fR_x = fR_trans_x;
  float fR_y = fR_trans_y + fR_rot_y;

  // 6. Calculate Target Angles and Speed magnitudes
  float targetSpeedL = constrain(sqrt(fL_x*fL_x + fL_y*fL_y), 0.0, 1.0);
  float targetSpeedR = constrain(sqrt(fR_x*fR_x + fR_y*fR_y), 0.0, 1.0);

  float targetAngleL = (targetSpeedL > 0.005) ? atan2(fL_x, fL_y) : thetaL_trans;
  float targetAngleR = (targetSpeedR > 0.005) ? atan2(fR_x, fR_y) : thetaR_trans;`;
    }

    let code = '';

    if (!isESP32) {
        // Arduino code definitions
        let pinDecls = `const int CH1_STEER_PIN = 2;
const int CH2_THROT_PIN = 3;`;
        let readCode = `  long ch1 = pulseIn(CH1_STEER_PIN, HIGH, 25000);
  long ch2 = pulseIn(CH2_THROT_PIN, HIGH, 25000);`;
        let fallbackCode = `  if (ch1 == 0) ch1 = 1500;
  if (ch2 == 0) ch2 = 1500;`;
        let normCode = `  float x = (ch1 - 1500) / 500.0;
  float y = (ch2 - 1500) / 500.0;`;
        let constrainCode = `  x = constrain(x, -1.0, 1.0);
  y = constrain(y, -1.0, 1.0);`;
        let deadzoneCode = `  if (abs(x) < 0.02) x = 0.0;
  if (abs(y) < 0.02) y = 0.0;`;

        if (is4ch) {
            pinDecls += `\nconst int CH3_SWAY_PIN = 4;
const int CH4_SPIN_PIN = 7;`;
            readCode += `\n  long ch3 = pulseIn(CH3_SWAY_PIN, HIGH, 25000);
  long ch4 = pulseIn(CH4_SPIN_PIN, HIGH, 25000);`;
            fallbackCode += `\n  if (ch3 == 0) ch3 = 1500;
  if (ch4 == 0) ch4 = 1500;`;
            normCode += `\n  float x_aux = (ch3 - 1500) / 500.0;
  float y_aux = (ch4 - 1500) / 500.0;`;
            constrainCode += `\n  x_aux = constrain(x_aux, -1.0, 1.0);
  y_aux = constrain(y_aux, -1.0, 1.0);`;
            deadzoneCode += `\n  if (abs(x_aux) < 0.02) x_aux = 0.0;
  if (abs(y_aux) < 0.02) y_aux = 0.0;`;
        }

        code = `
<span class="code-comment">// ASD Thruster Mixing System for Arduino Uno (AVR)</span>
<span class="code-comment">// Converts RC channels to 2 Azimuth Pods</span>
<span class="code-comment">// Selected Mode: ${modeName}</span>

#include &lt;Servo.h&gt;

<span class="code-type">const int</span> CH2_THROT_PIN = <span class="code-number">3</span>;

<span class="code-type">const int</span> SERVO_L_PIN = <span class="code-number">9</span>;
<span class="code-type">const int</span> SERVO_R_PIN = <span class="code-number">10</span>;
<span class="code-type">const int</span> ESC_L_PIN = <span class="code-number">5</span>;
<span class="code-type">const int</span> ESC_R_PIN = <span class="code-number">6</span>;

<span class="code-comment">// Config parameters</span>
<span class="code-type">const float</span> MAX_TOE_IN = <span class="code-number">${slideToeIn.value}</span> * PI / <span class="code-number">180.0</span>;
<span class="code-type">const float</span> SERVO_SPEED = <span class="code-number">${slideServoSpeed.value}</span> * PI / <span class="code-number">180.0</span>; <span class="code-comment">// rad/s</span>

<span class="code-comment">// Servo and ESC controllers</span>
Servo servoL;
Servo servoR;

<span class="code-comment">// Actual physical states tracking</span>
<span class="code-type">float</span> curAngleL = <span class="code-number">0.0</span>;
<span class="code-type">float</span> curAngleR = <span class="code-number">0.0</span>;
<span class="code-type">float</span> curSpeedL = <span class="code-number">0.0</span>;
<span class="code-type">float</span> curSpeedR = <span class="code-number">0.0</span>;
<span class="code-type">unsigned long</span> lastTime = <span class="code-number">0</span>;

<span class="code-type">void</span> <span class="code-function">setup</span>() {
  servoL.<span class="code-function">attach</span>(SERVO_L_PIN);
  servoR.<span class="code-function">attach</span>(SERVO_R_PIN);
  <span class="code-function">pinMode</span>(ESC_L_PIN, OUTPUT);
  <span class="code-function">pinMode</span>(ESC_R_PIN, OUTPUT);
  lastTime = <span class="code-function">millis</span>();
}

<span class="code-type">void</span> <span class="code-function">loop</span>() {
  <span class="code-type">unsigned long</span> now = <span class="code-function">millis</span>();
  <span class="code-type">float</span> dt = (now - lastTime) / <span class="code-number">1000.0</span>;
  lastTime = now;

  <span class="code-comment">// Read input RC PWM pulse durations (1000 - 2000 us, blocking)</span>
  <span class="code-type">long</span> ch1 = <span class="code-function">pulseIn</span>(CH1_STEER_PIN, HIGH, <span class="code-number">25000</span>);
  <span class="code-type">long</span> ch2 = <span class="code-function">pulseIn</span>(CH2_THROT_PIN, HIGH, <span class="code-number">25000</span>);

  <span class="code-comment">// Handle missing signal (default to neutral)</span>
  <span class="code-keyword">if</span> (ch1 == <span class="code-number">0</span>) ch1 = <span class="code-number">1500</span>;
  <span class="code-keyword">if</span> (ch2 == <span class="code-number">0</span>) ch2 = <span class="code-number">1500</span>;

  <span class="code-comment">// 1. Normalize Inputs to [-1.0, 1.0]</span>
  <span class="code-type">float</span> x = (ch1 - <span class="code-number">1500</span>) / <span class="code-number">500.0</span>;
  <span class="code-type">float</span> y = (ch2 - <span class="code-number">1500</span>) / <span class="code-number">500.0</span>;
  
  <span class="code-keyword">if</span> (${checkInvertSteer.checked}) {
    x = -x;
  }
  
  x = <span class="code-function">constrain</span>(x, -<span class="code-number">1.0</span>, <span class="code-number">1.0</span>);
  y = <span class="code-function">constrain</span>(y, -<span class="code-number">1.0</span>, <span class="code-number">1.0</span>);

  <span class="code-comment">// Deadzone filter</span>
  <span class="code-keyword">if</span> (<span class="code-function">abs</span>(x) &lt; <span class="code-number">0.02</span>) x = <span class="code-number">0.0</span>;
  <span class="code-keyword">if</span> (<span class="code-function">abs</span>(y) &lt; <span class="code-number">0.02</span>) y = <span class="code-number">0.0</span>;

${loopCode}

  <span class="code-comment">// 6. Simulating physical servo rotation speed limit</span>
  curAngleL = <span class="code-function">slewAngle</span>(curAngleL, targetAngleL, SERVO_SPEED, dt);
  curAngleR = <span class="code-function">slewAngle</span>(curAngleR, targetAngleR, SERVO_SPEED, dt);

  <span class="code-comment">// 7. Map variables to hardware PWM outputs</span>
  <span class="code-type">int</span> pwmServoL = <span class="code-number">1500</span> + (curAngleL / PI) * <span class="code-number">500</span>;
  <span class="code-type">int</span> pwmServoR = <span class="code-number">1500</span> + (curAngleR / PI) * <span class="code-number">500</span>;
  servoL.<span class="code-function">writeMicroseconds</span>(pwmServoL);
  servoR.<span class="code-function">writeMicroseconds</span>(pwmServoR);

  <span class="code-comment">// ESCs: 0.0 to 1.0 speed -> 1000 to 2000 microseconds</span>
  <span class="code-type">int</span> pwmEscL = <span class="code-number">1000</span> + targetSpeedL * <span class="code-number">1000</span>;
  <span class="code-type">int</span> pwmEscR = <span class="code-number">1000</span> + targetSpeedR * <span class="code-number">1000</span>;
  <span class="code-function">analogWrite</span>(ESC_L_PIN, map(pwmEscL, <span class="code-number">1000</span>, <span class="code-number">2000</span>, <span class="code-number">0</span>, <span class="code-number">255</span>));
  <span class="code-function">analogWrite</span>(ESC_R_PIN, map(pwmEscR, <span class="code-number">1000</span>, <span class="code-number">2000</span>, <span class="code-number">0</span>, <span class="code-number">255</span>));
}

<span class="code-type">float</span> <span class="code-function">slewAngle</span>(<span class="code-type">float</span> cur, <span class="code-type">float</span> target, <span class="code-type">float</span> limit, <span class="code-type">float</span> dt) {
  <span class="code-type">float</span> diff = target - cur;
  diff = <span class="code-function">atan2</span>(<span class="code-function">sin</span>(diff), <span class="code-function">cos</span>(diff));
  <span class="code-type">float</span> step = limit * dt;
  <span class="code-keyword">if</span> (<span class="code-function">abs</span>(diff) &lt;= step) <span class="code-keyword">return</span> target;
  <span class="code-type">float</span> stepSign = (diff &gt; <span class="code-number">0</span>) ? step : -step;
  <span class="code-keyword">return</span> <span class="code-function">atan2</span>(<span class="code-function">sin</span>(cur + stepSign), <span class="code-function">cos</span>(cur + stepSign));
}
        `;
    } else {
        // ESP32 code using non-blocking interrupts and ESP32Servo library
        code = `
<span class="code-comment">// ASD Thruster Mixing System for ESP32 (WROOM-32)</span>
<span class="code-comment">// Converts 2 RC channels (Steering, Throttle) to 2 Azimuth Pods</span>
<span class="code-comment">// Uses high-precision hardware interrupts for non-blocking RC pulse reading</span>
<span class="code-comment">// Selected Mode: ${modeName}</span>

#include &lt;ESP32Servo.h&gt;

<span class="code-comment">// Pin Assignments (ESP32 GPIOs)</span>
<span class="code-type">const int</span> CH1_STEER_PIN = <span class="code-number">12</span>; <span class="code-comment">// Steering input pin</span>
<span class="code-type">const int</span> CH2_THROT_PIN = <span class="code-number">13</span>; <span class="code-comment">// Throttle input pin</span>

<span class="code-type">const int</span> SERVO_L_PIN = <span class="code-number">25</span>;
<span class="code-type">const int</span> SERVO_R_PIN = <span class="code-number">26</span>;
<span class="code-type">const int</span> ESC_L_PIN = <span class="code-number">14</span>;
<span class="code-type">const int</span> ESC_R_PIN = <span class="code-number">27</span>;

<span class="code-comment">// Config parameters</span>
<span class="code-type">const float</span> MAX_TOE_IN = <span class="code-number">${slideToeIn.value}</span> * PI / <span class="code-number">180.0</span>;
<span class="code-type">const float</span> SERVO_SPEED = <span class="code-number">${slideServoSpeed.value}</span> * PI / <span class="code-number">180.0</span>; <span class="code-comment">// rad/s</span>

<span class="code-comment">// Servo structures</span>
Servo servoL;
Servo servoR;

<span class="code-comment">// Volatile interrupt states for non-blocking PWM reading</span>
<span class="code-type">volatile unsigned long</span> ch1_start = <span class="code-number">0</span>;
<span class="code-type">volatile unsigned long</span> ch2_start = <span class="code-number">0</span>;
<span class="code-type">volatile int</span> rxSteer = <span class="code-number">1500</span>;
<span class="code-type">volatile int</span> rxThrot = <span class="code-number">1500</span>;

<span class="code-type">void</span> IRAM_ATTR <span class="code-function">ch1_isr</span>() {
  <span class="code-keyword">if</span> (<span class="code-function">digitalRead</span>(CH1_STEER_PIN) == HIGH) {
    ch1_start = <span class="code-function">micros</span>();
  } <span class="code-keyword">else</span> {
    <span class="code-keyword">if</span> (ch1_start &gt; <span class="code-number">0</span>) {
      rxSteer = <span class="code-function">micros</span>() - ch1_start;
    }
  }
}

<span class="code-type">void</span> IRAM_ATTR <span class="code-function">ch2_isr</span>() {
  <span class="code-keyword">if</span> (<span class="code-function">digitalRead</span>(CH2_THROT_PIN) == HIGH) {
    ch2_start = <span class="code-function">micros</span>();
  } <span class="code-keyword">else</span> {
    <span class="code-keyword">if</span> (ch2_start &gt; <span class="code-number">0</span>) {
      rxThrot = <span class="code-function">micros</span>() - ch2_start;
    }
  }
}

<span class="code-comment">// Physical states</span>
<span class="code-type">float</span> curAngleL = <span class="code-number">0.0</span>;
<span class="code-type">float</span> curAngleR = <span class="code-number">0.0</span>;
<span class="code-type">unsigned long</span> lastTime = <span class="code-number">0</span>;

<span class="code-type">void</span> <span class="code-function">setup</span>() {
  <span class="code-comment">// ESP32 requires timers allocation</span>
  ESP32PWM::allocateTimer(<span class="code-number">0</span>);
  ESP32PWM::allocateTimer(<span class="code-number">1</span>);
  
  servoL.setPeriodHertz(<span class="code-number">50</span>);
  servoR.setPeriodHertz(<span class="code-number">50</span>);

  servoL.<span class="code-function">attach</span>(SERVO_L_PIN, <span class="code-number">500</span>, <span class="code-number">2500</span>);
  servoR.<span class="code-function">attach</span>(SERVO_R_PIN, <span class="code-number">500</span>, <span class="code-number">2500</span>);
  
  <span class="code-function">pinMode</span>(ESC_L_PIN, OUTPUT);
  <span class="code-function">pinMode</span>(ESC_R_PIN, OUTPUT);

  <span class="code-comment">// Attach ISR interrupts for RC inputs</span>
  <span class="code-function">pinMode</span>(CH1_STEER_PIN, INPUT_PULLUP);
  <span class="code-function">pinMode</span>(CH2_THROT_PIN, INPUT_PULLUP);
  <span class="code-function">attachInterrupt</span>(CH1_STEER_PIN, ch1_isr, CHANGE);
  <span class="code-function">attachInterrupt</span>(CH2_THROT_PIN, ch2_isr, CHANGE);
  
  lastTime = <span class="code-function">micros</span>();
}

<span class="code-type">void</span> <span class="code-function">loop</span>() {
  <span class="code-type">unsigned long</span> now = <span class="code-function">micros</span>();
  <span class="code-type">float</span> dt = (now - lastTime) / <span class="code-number">1000000.0</span>;
  lastTime = now;

  <span class="code-comment">// Safely copy volatile pulse readings (atomic read on ESP32)</span>
  <span class="code-keyword">noInterrupts</span>();
  <span class="code-type">int</span> steerPWM = rxSteer;
  <span class="code-type">int</span> throtPWM = rxThrot;
  <span class="code-keyword">interrupts</span>();

  <span class="code-comment">// 1. Normalize Inputs to [-1.0, 1.0]</span>
  <span class="code-type">float</span> x = (steerPWM - <span class="code-number">1500</span>) / <span class="code-number">500.0</span>;
  <span class="code-type">float</span> y = (throtPWM - <span class="code-number">1500</span>) / <span class="code-number">500.0</span>;
  
  <span class="code-keyword">if</span> (${checkInvertSteer.checked}) {
    x = -x;
  }
  
  x = <span class="code-function">constrain</span>(x, -<span class="code-number">1.0</span>, <span class="code-number">1.0</span>);
  y = <span class="code-function">constrain</span>(y, -<span class="code-number">1.0</span>, <span class="code-number">1.0</span>);

  <span class="code-comment">// Deadzone filter</span>
  <span class="code-keyword">if</span> (<span class="code-function">abs</span>(x) &lt; <span class="code-number">0.02</span>) x = <span class="code-number">0.0</span>;
  <span class="code-keyword">if</span> (<span class="code-function">abs</span>(y) &lt; <span class="code-number">0.02</span>) y = <span class="code-number">0.0</span>;

${loopCode}

  <span class="code-comment">// 6. Simulating physical servo rotation speed limit</span>
  curAngleL = <span class="code-function">slewAngle</span>(curAngleL, targetAngleL, SERVO_SPEED, dt);
  curAngleR = <span class="code-function">slewAngle</span>(curAngleR, targetAngleR, SERVO_SPEED, dt);

  <span class="code-comment">// 7. Map variables to hardware PWM outputs</span>
  <span class="code-type">int</span> pwmServoL = <span class="code-number">1500</span> + (curAngleL / PI) * <span class="code-number">500</span>;
  <span class="code-type">int</span> pwmServoR = <span class="code-number">1500</span> + (curAngleR / PI) * <span class="code-number">500</span>;
  servoL.<span class="code-function">writeMicroseconds</span>(pwmServoL);
  servoR.<span class="code-function">writeMicroseconds</span>(pwmServoR);

  <span class="code-comment">// ESC write mapping (analogWrite uses LEDC hardware PWM natively on ESP32 in Arduino core)</span>
  <span class="code-type">int</span> pwmEscL = <span class="code-number">1000</span> + targetSpeedL * <span class="code-number">1000</span>;
  <span class="code-type">int</span> pwmEscR = <span class="code-number">1000</span> + targetSpeedR * <span class="code-number">1000</span>;
  <span class="code-function">analogWrite</span>(ESC_L_PIN, map(pwmEscL, <span class="code-number">1000</span>, <span class="code-number">2000</span>, <span class="code-number">0</span>, <span class="code-number">255</span>));
  <span class="code-function">analogWrite</span>(ESC_R_PIN, map(pwmEscR, <span class="code-number">1000</span>, <span class="code-number">2000</span>, <span class="code-number">0</span>, <span class="code-number">255</span>));
}

<span class="code-type">float</span> <span class="code-function">slewAngle</span>(<span class="code-type">float</span> cur, <span class="code-type">float</span> target, <span class="code-type">float</span> limit, <span class="code-type">float</span> dt) {
  <span class="code-type">float</span> diff = target - cur;
  diff = <span class="code-function">atan2</span>(<span class="code-function">sin</span>(diff), <span class="code-function">cos</span>(diff));
  <span class="code-type">float</span> step = limit * dt;
  <span class="code-keyword">if</span> (<span class="code-function">abs</span>(diff) &lt;= step) <span class="code-keyword">return</span> target;
  <span class="code-type">float</span> stepSign = (diff &gt; <span class="code-number">0</span>) ? step : -step;
  <span class="code-keyword">return</span> <span class="code-function">atan2</span>(<span class="code-function">sin</span>(cur + stepSign), <span class="code-function">cos</span>(cur + stepSign));
}
        `;
    }
    codeText.innerHTML = code;
}

// --- Custom Mixing Mode Editor System ---

let editingAlgoId = null;

const DEFAULT_EQ_SERVO_L = "x * 30 * pi / 180 - toeangle";
const DEFAULT_EQ_SERVO_R = "x * 30 * pi / 180 + toeangle";
const DEFAULT_EQ_ESC_L = "y + x * 0.3";
const DEFAULT_EQ_ESC_R = "y - x * 0.3";

// Load custom algorithms from local storage on startup
function initCustomAlgorithms() {
    const savedAlgos = JSON.parse(localStorage.getItem('asd_custom_algorithms') || '{}');
    for (const id in savedAlgos) {
        try {
            const algo = savedAlgos[id];
            controller.registerCustomAlgorithm(
                id,
                algo.name,
                algo.eqServoL !== undefined ? algo.eqServoL : algo.code,
                algo.eqServoR,
                algo.eqEscL,
                algo.eqEscR
            );
            // Append to selection list
            const opt = document.createElement('option');
            opt.value = id;
            opt.innerText = algo.name;
            selectAlgorithm.appendChild(opt);
        } catch(err) {
            console.error("Failed to compile custom algorithm from localStorage on startup:", id, err);
        }
    }
}

// Open Editor Modal to create a new mixing mode
btnNewAlgo.addEventListener('click', () => {
    editingAlgoId = null;
    editorTitle.innerText = "Create Custom Mixing Algorithm";
    editorName.value = "";
    editorEqServoL.value = DEFAULT_EQ_SERVO_L;
    editorEqServoR.value = DEFAULT_EQ_SERVO_R;
    editorEqEscL.value = DEFAULT_EQ_ESC_L;
    editorEqEscR.value = DEFAULT_EQ_ESC_R;
    editorError.style.display = 'none';
    modalEditor.style.display = 'flex';
});

// Open Editor Modal to edit currently selected custom mode
btnEditAlgo.addEventListener('click', () => {
    const id = selectAlgorithm.value;
    if (!id.startsWith('custom_')) return;
    
    const algo = controller.customAlgorithms[id];
    if (!algo) return;

    editingAlgoId = id;
    editorTitle.innerText = "Edit Custom Mixing Algorithm";
    editorName.value = algo.name;
    editorEqServoL.value = algo.eqServoL || '';
    editorEqServoR.value = algo.eqServoR || '';
    editorEqEscL.value = algo.eqEscL || '';
    editorEqEscR.value = algo.eqEscR || '';
    editorError.style.display = 'none';
    modalEditor.style.display = 'flex';
});

// Delete currently selected custom mode
btnDeleteAlgo.addEventListener('click', () => {
    const id = selectAlgorithm.value;
    if (!id.startsWith('custom_')) return;
    
    const algo = controller.customAlgorithms[id];
    if (!algo) return;

    if (confirm(`Are you sure you want to delete the custom algorithm "${algo.name}"?`)) {
        // Delete from controller
        controller.deleteCustomAlgorithm(id);

        // Remove option from dropdown
        const opt = selectAlgorithm.querySelector(`option[value="${id}"]`);
        if (opt) opt.remove();

        // Delete from local storage
        const savedAlgos = JSON.parse(localStorage.getItem('asd_custom_algorithms') || '{}');
        delete savedAlgos[id];
        localStorage.setItem('asd_custom_algorithms', JSON.stringify(savedAlgos));

        // Fall back to default vectored mode
        selectAlgorithm.value = 'vectored';
        applyConfig();
        codeText.innerHTML = ''; // Clear code panel view cache
    }
});

// Close editor triggers
closeEditor.addEventListener('click', () => {
    modalEditor.style.display = 'none';
});

btnCancelEditor.addEventListener('click', () => {
    modalEditor.style.display = 'none';
});

// Save / Compile Code Handler
btnSaveEditor.addEventListener('click', () => {
    const name = editorName.value.trim();
    const eqServoL = editorEqServoL.value.trim();
    const eqServoR = editorEqServoR.value.trim();
    const eqEscL = editorEqEscL.value.trim();
    const eqEscR = editorEqEscR.value.trim();
    editorError.style.display = 'none';

    if (name === '') {
        editorError.innerText = "Error: Algorithm Name cannot be empty.";
        editorError.style.display = 'block';
        return;
    }
    if (eqServoL === '' || eqServoR === '' || eqEscL === '' || eqEscR === '') {
        editorError.innerText = "Error: All equation fields must be filled.";
        editorError.style.display = 'block';
        return;
    }

    try {
        const id = editingAlgoId || ('custom_' + Date.now());
        // Compile check (will throw error if equations have syntax errors)
        controller.registerCustomAlgorithm(id, name, eqServoL, eqServoR, eqEscL, eqEscR);

        // Save to localStorage
        const savedAlgos = JSON.parse(localStorage.getItem('asd_custom_algorithms') || '{}');
        savedAlgos[id] = { id, name, eqServoL, eqServoR, eqEscL, eqEscR };
        localStorage.setItem('asd_custom_algorithms', JSON.stringify(savedAlgos));

        if (!editingAlgoId) {
            // New option
            const opt = document.createElement('option');
            opt.value = id;
            opt.innerText = name;
            selectAlgorithm.appendChild(opt);
            selectAlgorithm.value = id;
        } else {
            // Update option name in select list
            const opt = selectAlgorithm.querySelector(`option[value="${id}"]`);
            if (opt) opt.innerText = name;
        }

        applyConfig();
        updateAlgorithmTooltip();
        codeText.innerHTML = ''; // reset cached panel code
        modalEditor.style.display = 'none';
    } catch (err) {
        editorError.innerText = "Validation Failed: " + err.message;
        editorError.style.display = 'block';
    }
});

// Collapsible widget titles listener
document.querySelectorAll('.widget-title').forEach(title => {
    title.addEventListener('click', () => {
        title.parentElement.classList.toggle('collapsed');
    });
});

// Initialize Custom Algorithms
initCustomAlgorithms();
updateAlgorithmTooltip();

// Start Engine
applyConfig();
requestAnimationFrame(loop);
