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

/**
 * Safe Mathematical Expression Parser and Evaluator
 * Employs the Shunting-yard algorithm to compile formulas to RPN,
 * and evaluates RPN stacks using a secure VM evaluator.
 * Safe from injection vulnerabilities and infinite loops.
 */
export class MathParser {
    static tokenize(str) {
        const regex = /\s*(?:(\d+(?:\.\d+)?)|([a-zA-Z_][a-zA-Z0-9_]*)|(\+|-|\*|\/|\^|\(|\)|,))\s*/g;
        const tokens = [];
        let match;
        while ((match = regex.exec(str)) !== null) {
            if (match[1]) tokens.push({ type: 'NUM', val: parseFloat(match[1]) });
            else if (match[2]) tokens.push({ type: 'VAR', val: match[2].toLowerCase() });
            else if (match[3]) tokens.push({ type: 'OP', val: match[3] });
        }
        return tokens;
    }

    static preprocessUnary(tokens) {
        const result = [];
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            if (token.type === 'OP' && (token.val === '-' || token.val === '+')) {
                const prev = i > 0 ? tokens[i - 1] : null;
                const isUnary = prev === null || (prev.type === 'OP' && prev.val !== ')');
                if (isUnary) {
                    if (token.val === '-') {
                        result.push({ type: 'NUM', val: 0 });
                    } else {
                        continue;
                    }
                }
            }
            result.push(token);
        }
        return result;
    }

    static parse(str) {
        const rawTokens = this.tokenize(str);
        const tokens = this.preprocessUnary(rawTokens);
        const output = [];
        const operators = [];
        
        const prec = {
            '+': 1, '-': 1,
            '*': 2, '/': 2,
            '^': 3
        };

        const assoc = {
            '+': 'L', '-': 'L',
            '*': 'L', '/': 'L',
            '^': 'R'
        };

        const funcs = new Set(['sin', 'cos', 'tan', 'abs', 'sqrt', 'min', 'max']);

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            if (token.type === 'NUM') {
                output.push(token);
            } else if (token.type === 'VAR') {
                if (funcs.has(token.val)) {
                    operators.push(token);
                } else {
                    output.push(token);
                }
            } else if (token.type === 'OP') {
                if (token.val === ',') {
                    while (operators.length > 0 && operators[operators.length - 1].val !== '(') {
                        output.push(operators.pop());
                    }
                    if (operators.length === 0) throw new Error("Argument separator error or missing parenthetical bounds");
                } else if (token.val === '(') {
                    operators.push(token);
                } else if (token.val === ')') {
                    while (operators.length > 0 && operators[operators.length - 1].val !== '(') {
                        output.push(operators.pop());
                    }
                    if (operators.length === 0) throw new Error("Mismatched parentheses: excess closing parenthesis");
                    operators.pop(); // Remove '('
                    if (operators.length > 0 && funcs.has(operators[operators.length - 1].val)) {
                        output.push(operators.pop());
                    }
                } else {
                    while (operators.length > 0) {
                        const top = operators[operators.length - 1];
                        if (top.type === 'OP' && top.val !== '(' && top.val !== ')') {
                            if ((assoc[token.val] === 'L' && prec[token.val] <= prec[top.val]) ||
                                (assoc[token.val] === 'R' && prec[token.val] < prec[top.val])) {
                                output.push(operators.pop());
                            } else {
                                break;
                            }
                        } else {
                            break;
                        }
                    }
                    operators.push(token);
                }
            }
        }

        while (operators.length > 0) {
            const op = operators.pop();
            if (op.val === '(' || op.val === ')') throw new Error("Mismatched parentheses: unclosed open parenthesis");
            output.push(op);
        }

        return output;
    }

    static evaluate(rpn, vars) {
        const stack = [];
        for (const token of rpn) {
            if (token.type === 'NUM') {
                stack.push(token.val);
            } else if (token.type === 'VAR') {
                const name = token.val;
                if (name === 'pi') {
                    stack.push(Math.PI);
                } else if (name in vars) {
                    stack.push(vars[name]);
                } else {
                    throw new Error(`Unknown variable reference: "${name}"`);
                }
            } else if (token.type === 'OP') {
                const op = token.val;
                if (op === '+') {
                    if (stack.length < 2) throw new Error("Malformed math expression");
                    const b = stack.pop();
                    const a = stack.pop();
                    stack.push(a + b);
                } else if (op === '-') {
                    if (stack.length < 2) throw new Error("Malformed math expression");
                    const b = stack.pop();
                    const a = stack.pop();
                    stack.push(a - b);
                } else if (op === '*') {
                    if (stack.length < 2) throw new Error("Malformed math expression");
                    const b = stack.pop();
                    const a = stack.pop();
                    stack.push(a * b);
                } else if (op === '/') {
                    if (stack.length < 2) throw new Error("Malformed math expression");
                    const b = stack.pop();
                    const a = stack.pop();
                    stack.push(a / b);
                } else if (op === '^') {
                    if (stack.length < 2) throw new Error("Malformed math expression");
                    const b = stack.pop();
                    const a = stack.pop();
                    stack.push(Math.pow(a, b));
                }
            } else {
                const funcName = token.val;
                if (funcName === 'min' || funcName === 'max') {
                    if (stack.length < 2) throw new Error(`Missing arguments for function "${funcName}(a,b)"`);
                    const b = stack.pop();
                    const a = stack.pop();
                    stack.push(funcName === 'min' ? Math.min(a, b) : Math.max(a, b));
                } else {
                    if (stack.length < 1) throw new Error(`Missing argument for function "${funcName}(a)"`);
                    const a = stack.pop();
                    if (funcName === 'sin') stack.push(Math.sin(a));
                    else if (funcName === 'cos') stack.push(Math.cos(a));
                    else if (funcName === 'tan') stack.push(Math.tan(a));
                    else if (funcName === 'abs') stack.push(Math.abs(a));
                    else if (funcName === 'sqrt') stack.push(Math.sqrt(a));
                }
            }
        }
        if (stack.length !== 1) throw new Error("Invalid mathematical expression structure");
        return stack[0];
    }
}

export class ASDController {
    constructor() {
        // Configuration parameters (can be adjusted at runtime)
        this.config = {
            maxToeIn: 45 * Math.PI / 180, // radians
            servoSpeedLimit: 360 * Math.PI / 180, // radians per second
            motorTimeConstant: 0.15, // seconds for ESC response lag
            deadzone: 0.02, // RC joystick deadzone

            // Mixing Configs
            invertSteering: false,
            algorithm: 'vectored',        // 'vectored', 'differential' or 'custom_*'
            rotationWeight: 0.8,          // Longitudinal differential steering weight
            translationWeight: 1.0,       // Forward/backward throttle weight
            lateralWeight: 0.7,            // Lateral thrust vectoring weight (for 'vectored' mode)
        };

        // Custom Algorithms Registry
        this.customAlgorithms = {};

        // Inputs from RC receiver
        this.rcIn = {
            ch1: 1500, // Steering PWM (1000 - 2000, 1500 neutral) - Right / Left
            ch2: 1500, // Throttle PWM (1000 - 2000, 1500 neutral) - Up / Down
        };

        // Outputs calculated by the microcontroller
        this.microOut = {
            servoLeftAngle: 0,   // Current physical angle (radians)
            servoRightAngle: 0,  // Current physical angle (radians)
            escLeftSpeed: 0,     // Current motor speed [-1 to 1]
            escRightSpeed: 0,    // Current motor speed [-1 to 1]

            // Targets for diagnostics
            servoLeftTargetAngle: 0,
            servoRightTargetAngle: 0,
            escLeftTargetSpeed: 0,
            escRightTargetSpeed: 0,

            // Outgoing PWM signals (1000 - 2000 us)
            pwmServoLeft: 1500,
            pwmServoRight: 1500,
            pwmEscLeft: 1500,
            pwmEscRight: 1500,
        };

        // Internal states for physical simulation of servos and ESCs
        this.state = {
            servoLeftAngle: 0,   // Current physical angle of Left Pod (rad)
            servoRightAngle: 0,  // Current physical angle of Right Pod (rad)
            escLeftSpeed: 0,     // Current actual speed of Left Motor [0 to 1]
            escRightSpeed: 0,    // Current actual speed of Right Motor [0 to 1]
        };
    }

    /**
     * Set the RC input PWM values (typically 1000us - 2000us)
     */
    setInputs(ch1_steering, ch2_throttle) {
        this.rcIn.ch1 = this.clamp(ch1_steering, 1000, 2000);
        this.rcIn.ch2 = this.clamp(ch2_throttle, 1000, 2000);
    }

    /**
     * Register a custom mathematical equation mixing algorithm
     */
    registerCustomAlgorithm(id, name, eqServoL, eqServoR, eqEscL, eqEscR) {
        try {
            if (eqServoR === undefined) {
                // Fallback for legacy algorithm files loaded from local storage
                eqServoL = "x * 30 * pi / 180 - toeangle";
                eqServoR = "x * 30 * pi / 180 + toeangle";
                eqEscL = "y + x * 0.3";
                eqEscR = "y - x * 0.3";
            }

            // Compile/parse each of the four equations into RPN
            const rpnServoL = MathParser.parse(eqServoL);
            const rpnServoR = MathParser.parse(eqServoR);
            const rpnEscL = MathParser.parse(eqEscL);
            const rpnEscR = MathParser.parse(eqEscR);

            this.customAlgorithms[id] = {
                id,
                name,
                eqServoL,
                eqServoR,
                eqEscL,
                eqEscR,
                rpnServoL,
                rpnServoR,
                rpnEscL,
                rpnEscR
            };
            return true;
        } catch (err) {
            console.error("Math equation parsing error in custom algorithm:", err);
            throw err;
        }
    }

    /**
     * Delete a custom mixing algorithm
     */
    deleteCustomAlgorithm(id) {
        delete this.customAlgorithms[id];
    }

    /**
     * Run the mixing algorithm simulating the microprocessor logic.
     * Calculates target angles and speeds.
     */
    updateMixing() {
        // 1. Normalize RC inputs to range [-1.0, 1.0]
        let x = (this.rcIn.ch1 - 1500) / 500.0;
        let y = (this.rcIn.ch2 - 1500) / 500.0;

        // Apply steering inversion
        if (this.config.invertSteering) {
            x = -x;
        }

        // Apply deadzone
        if (Math.abs(x) < this.config.deadzone) x = 0.0;
        if (Math.abs(y) < this.config.deadzone) y = 0.0;

        // 2. Run selected mixing mode
        this.mixASD(x, y);
    }

    /**
     * ASD Control mixing (incorporating differential and lateral vectored thrust)
     */
    mixASD(x, y) {
        // Handle custom algorithms
        if (this.config.algorithm.startsWith('custom_')) {
            const customAlgo = this.customAlgorithms[this.config.algorithm];
            if (customAlgo && customAlgo.rpnServoL) {
                try {
                    const vars = {
                        x: x,
                        y: y,
                        toeangle: this.config.maxToeIn,
                        transweight: this.config.translationWeight,
                        rotweight: this.config.rotationWeight,
                        latweight: this.config.lateralWeight
                    };
                    const angleL = MathParser.evaluate(customAlgo.rpnServoL, vars);
                    const angleR = MathParser.evaluate(customAlgo.rpnServoR, vars);
                    const speedL = MathParser.evaluate(customAlgo.rpnEscL, vars);
                    const speedR = MathParser.evaluate(customAlgo.rpnEscR, vars);

                    this.microOut.escLeftTargetSpeed = this.clamp(speedL, -1.0, 1.0);
                    this.microOut.escRightTargetSpeed = this.clamp(speedR, -1.0, 1.0);
                    this.microOut.servoLeftTargetAngle = angleL;
                    this.microOut.servoRightTargetAngle = angleR;
                } catch(err) {
                    console.error("Runtime error in custom algorithm evaluation:", err);
                }
            }
        }

        if (this.config.algorithm === 'crabwalk') {
            const wTrans = this.config.translationWeight;
            const wLat = this.config.lateralWeight;
            const k = 4.2667; // Lever arm ratio -thrusterDistY / thrusterDistX
            
            let Ax = (x * wLat) / 2.0;
            let AyL = (y * wTrans + k * x * wLat) / 2.0;
            let AyR = (y * wTrans - k * x * wLat) / 2.0;
            
            let sL = Math.sqrt(Ax * Ax + AyL * AyL);
            let sR = Math.sqrt(Ax * Ax + AyR * AyR);
            
            const maxS = Math.max(sL, sR);
            if (maxS > 1.0) {
                sL /= maxS;
                sR /= maxS;
                Ax /= maxS;
                AyL /= maxS;
                AyR /= maxS;
            }
            
            this.microOut.escLeftTargetSpeed = sL;
            this.microOut.escRightTargetSpeed = sR;
            
            if (sL > 0.005) {
                this.microOut.servoLeftTargetAngle = Math.atan2(Ax, AyL);
            } else {
                this.microOut.servoLeftTargetAngle = 0.0;
            }
            
            if (sR > 0.005) {
                this.microOut.servoRightTargetAngle = Math.atan2(Ax, AyR);
            } else {
                this.microOut.servoRightTargetAngle = 0.0;
            }
            return;
        }

        const maxToe = this.config.maxToeIn;
        const wTrans = this.config.translationWeight;
        const wRot = this.config.rotationWeight;
        const wLat = this.config.algorithm === 'vectored' ? this.config.lateralWeight : 0.0;

        // --- A. Compute Translation Force Components ---
        let s_trans = Math.abs(y) * wTrans;
        let theta_L_trans = 0;
        let theta_R_trans = 0;

        if (y >= 0) {
            // Forward: Toe-in angle reduces as throttle increases
            let alpha = maxToe * (1.0 - Math.min(1.0, Math.abs(y)));
            theta_L_trans = -alpha;
            theta_R_trans = alpha;
        } else {
            // Reverse: Sweep from toe-in to straight reverse (180 deg / PI)
            let alpha = maxToe + (Math.PI - maxToe) * Math.min(1.0, Math.abs(y));
            theta_L_trans = -alpha;
            theta_R_trans = alpha;
        }

        const fL_trans_x = s_trans * Math.sin(theta_L_trans);
        const fL_trans_y = s_trans * Math.cos(theta_L_trans);
        const fR_trans_x = s_trans * Math.sin(theta_R_trans);
        const fR_trans_y = s_trans * Math.cos(theta_R_trans);

        // --- B. Compute Steering Force Components ---
        // 1. Longitudinal differential forces (creates turning torque like a tank)
        const fL_rot_y = x * wRot;
        const fR_rot_y = -x * wRot;

        // 2. Lateral vectored forces (vectors pods sideways to swing the stern)
        const fL_rot_x = -x * wLat;
        const fR_rot_x = -x * wLat;

        // --- C. Vector Superposition ---
        const fL_x = fL_trans_x + fL_rot_x;
        const fL_y = fL_trans_y + fL_rot_y;
        const fR_x = fR_trans_x + fR_rot_x;
        const fR_y = fR_trans_y + fR_rot_y;

        // --- D. Target Speeds (Force Magnitudes) ---
        const sL_target = Math.sqrt(fL_x * fL_x + fL_y * fL_y);
        const sR_target = Math.sqrt(fR_x * fR_x + fR_y * fR_y);

        this.microOut.escLeftTargetSpeed = this.clamp(sL_target, 0.0, 1.0);
        this.microOut.escRightTargetSpeed = this.clamp(sR_target, 0.0, 1.0);

        // --- E. Target Angles ---
        if (sL_target > 0.005) {
            this.microOut.servoLeftTargetAngle = Math.atan2(fL_x, fL_y);
        } else {
            this.microOut.servoLeftTargetAngle = theta_L_trans;
        }

        if (sR_target > 0.005) {
            this.microOut.servoRightTargetAngle = Math.atan2(fR_x, fR_y);
        } else {
            this.microOut.servoRightTargetAngle = theta_R_trans;
        }
    }

    /**
     * Update the physical state of the servos and motors based on time step.
     * Simulates physical servo speed limits and motor response latency.
     */
    updateHardware(dt) {
        // --- 1. Servo physical angle tracking (slew rate limit) ---
        this.state.servoLeftAngle = this.slewAngle(
            this.state.servoLeftAngle, 
            this.microOut.servoLeftTargetAngle, 
            this.config.servoSpeedLimit, 
            dt
        );
        this.state.servoRightAngle = this.slewAngle(
            this.state.servoRightAngle, 
            this.microOut.servoRightTargetAngle, 
            this.config.servoSpeedLimit, 
            dt
        );

        // --- 2. Motor physical speed tracking (low-pass filter / lag) ---
        const factor = this.config.motorTimeConstant > 0 
            ? (1 - Math.exp(-dt / this.config.motorTimeConstant))
            : 1.0;
        
        this.state.escLeftSpeed += (this.microOut.escLeftTargetSpeed - this.state.escLeftSpeed) * factor;
        this.state.escRightSpeed += (this.microOut.escRightTargetSpeed - this.state.escRightSpeed) * factor;

        // --- 3. Compute Outgoing PWM signals for diagnostics display ---
        this.microOut.pwmServoLeft = Math.round(1500 + (this.state.servoLeftAngle / Math.PI) * 500);
        this.microOut.pwmServoRight = Math.round(1500 + (this.state.servoRightAngle / Math.PI) * 500);

        this.microOut.pwmEscLeft = Math.round(1000 + this.state.escLeftSpeed * 1000);
        this.microOut.pwmEscRight = Math.round(1000 + this.state.escRightSpeed * 1000);

        // Sync visual output state
        this.microOut.servoLeftAngle = this.state.servoLeftAngle;
        this.microOut.servoRightAngle = this.state.servoRightAngle;
        this.microOut.escLeftSpeed = this.state.escLeftSpeed;
        this.microOut.escRightSpeed = this.state.escRightSpeed;
    }

    /**
     * Slew an angle towards a target considering circular wrap-around and rate limits
     */
    slewAngle(current, target, speedLimit, dt) {
        let diff = target - current;
        diff = Math.atan2(Math.sin(diff), Math.cos(diff));

        const maxStep = speedLimit * dt;
        if (Math.abs(diff) <= maxStep) {
            return target;
        } else {
            let next = current + Math.sign(diff) * maxStep;
            return Math.atan2(Math.sin(next), Math.cos(next));
        }
    }

    // Helper utilities
    clamp(val, min, max) {
        return Math.max(min, Math.min(max, val));
    }
}
