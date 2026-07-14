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
 * Boat Physics Module
 * Simulates a 2D rigid-body boat in water, incorporating linear, lateral, and angular drag,
 * thrust forces and torques from azimuth thrusters, and boundary collisions.
 */

export class BoatPhysics {
    constructor() {
        // Boat dimensions and physical constants
        this.config = {
            mass: 4.5,            // kg
            inertia: 0.35,        // kg*m^2 (rotational inertia)
            length: 0.75,         // meters (for rendering and collision scale)
            width: 0.28,          // meters
            thrusterDistX: 0.075, // meters from centerline (left: -0.075, right: 0.075)
            thrusterDistY: -0.32, // meters from CG (located at the stern)
            
            // Drag coefficients (tuned for realistic water dynamics)
            dragLinearX: 18.0,    // High lateral drag (keel resistance against drift)
            dragLinearY: 1.8,     // Low forward drag (streamlined hull)
            dragAngular: 2.2,     // Rotational drag resisting spinning
            
            // Propulsion
            thrustMax: 8.0,       // Newtons (thrust force at speed = 1.0)
            
            // Environment size
            pondSize: 50.0,       // meters (world coordinate boundaries: -25 to 25)
            collisionRadius: 0.35, // meters (for boundary and dock collisions)
            fenderFriction: 1.5,
            towRopeLength: 1.6
        };

        this.targetShip = new TargetVessel();
        this.targetShipActive = true;
        this.towLineAttached = false;

        // Current boat state (World Coordinates: +x = East, +y = North)
        this.state = {
            x: 0.0,          // Position x (meters)
            y: 0.0,          // Position y (meters)
            phi: 0.0,        // Heading angle (radians, 0 is North/up, positive clockwise)
            vx: 0.0,         // Velocity x (m/s)
            vy: 0.0,         // Velocity y (m/s)
            omega: 0.0,      // Angular velocity (rad/s)
            ax: 0.0,         // Acceleration x (m/s^2)
            ay: 0.0,         // Acceleration y (m/s^2)
            alpha: 0.0,      // Angular acceleration (rad/s^2)
        };

        // Static obstacles (Docks / Buoys)
        this.obstacles = [
            // Center Dock (represented as AABB: {x1, y1, x2, y2})
            { id: 'dock1', type: 'dock', x1: -15, y1: 5, x2: -5, y2: 7, label: "Main Dock" },
            { id: 'dock2', type: 'dock', x1: 5, y1: -12, x2: 7, y2: -2, label: "T-Dock" },
            // Buoys (represented as circles: {x, y, r})
            { id: 'buoy1', type: 'buoy', x: 0, y: 12, r: 0.4, color: '#ff3b30' },
            { id: 'buoy2', type: 'buoy', x: -10, y: -8, r: 0.4, color: '#34c759' },
            { id: 'buoy3', type: 'buoy', x: 12, y: 10, r: 0.4, color: '#ffcc00' }
        ];

        // Environment forces
        this.env = {
            currentSpeed: 0.0, // m/s
            currentDir: 0.0,   // radians
            windSpeed: 0.0,    // m/s
            windDir: 0.0,      // radians
        };
    }

    /**
     * Resets the boat to the center of the lake
     */
    reset() {
        this.state.x = 0.0;
        this.state.y = 0.0;
        this.state.phi = 0.0;
        this.state.vx = 0.0;
        this.state.vy = 0.0;
        this.state.omega = 0.0;
        this.state.ax = 0.0;
        this.state.ay = 0.0;
        this.state.alpha = 0.0;
        if (this.targetShip) {
            this.targetShip.reset();
        }
        this.towLineAttached = false;
    }

    /**
     * Convert World Velocity Vector to Local Frame Vector (Lateral, Forward)
     */
    worldToLocal(wx, wy) {
        // phi is clockwise from North (+y)
        const cos = Math.cos(this.state.phi);
        const sin = Math.sin(this.state.phi);
        const u = wx * cos - wy * sin; // local lateral (right)
        const v = wx * sin + wy * cos; // local forward (up)
        return [u, v];
    }

    /**
     * Convert Local Frame Vector (Lateral, Forward) to World Vector
     */
    localToWorld(u, v) {
        const cos = Math.cos(this.state.phi);
        const sin = Math.sin(this.state.phi);
        const wx = u * cos + v * sin;
        const wy = -u * sin + v * cos;
        return [wx, wy];
    }

    /**
     * Main physics integration step
     * @param {number} dt Time step in seconds
     * @param {number} sL Left thruster speed (0.0 to 1.0)
     * @param {number} thetaL Left thruster angle (radians, relative to boat local axis)
     * @param {number} sR Right thruster speed (0.0 to 1.0)
     * @param {number} thetaR Right thruster angle (radians, relative to boat local axis)
     */
    step(dt, sL, thetaL, sR, thetaR) {
        if (dt <= 0) return;
        
        // --- 1. Get local velocities ---
        const [u, v] = this.worldToLocal(this.state.vx, this.state.vy);

        // --- 2. Calculate local drag forces ---
        // Drag = -C_drag * velocity * |velocity|
        const dragForceLocalX = -this.config.dragLinearX * u * Math.abs(u);
        const dragForceLocalY = -this.config.dragLinearY * v * Math.abs(v);
        const dragTorque = -this.config.dragAngular * this.state.omega * Math.abs(this.state.omega);

        // --- 3. Calculate local thruster forces & torques ---
        // Left thruster force vector in boat frame
        const fL_local_x = sL * Math.sin(thetaL) * this.config.thrustMax;
        const fL_local_y = sL * Math.cos(thetaL) * this.config.thrustMax;
        
        // Right thruster force vector in boat frame
        const fR_local_x = sR * Math.sin(thetaR) * this.config.thrustMax;
        const fR_local_y = sR * Math.cos(thetaR) * this.config.thrustMax;

        const thrustForceLocalX = fL_local_x + fR_local_x;
        const thrustForceLocalY = fL_local_y + fR_local_y;

        // Torque: -r_x * f_y + r_y * f_x (Corrected for positive-clockwise orientation)
        // Left Thruster position relative to CG
        const rLx = -this.config.thrusterDistX;
        const rLy = this.config.thrusterDistY;
        const torqueL = -rLx * fL_local_y + rLy * fL_local_x;

        // Right Thruster position relative to CG
        const rRx = this.config.thrusterDistX;
        const rRy = this.config.thrusterDistY;
        const torqueR = -rRx * fR_local_y + rRy * fR_local_x;

        const thrustTorque = torqueL + torqueR;

        // --- 4. Net forces in local frame ---
        const netForceLocalX = dragForceLocalX + thrustForceLocalX;
        const netForceLocalY = dragForceLocalY + thrustForceLocalY;
        const netTorque = dragTorque + thrustTorque;

        // --- 5. Convert local force to world frame ---
        let [netForceWorldX, netForceWorldY] = this.localToWorld(netForceLocalX, netForceLocalY);

        // --- 6. Environmental forces (current & wind) ---
        // Current: directly adds force/velocity to the hull
        if (this.env.currentSpeed > 0) {
            const curWx = this.env.currentSpeed * Math.sin(this.env.currentDir);
            const curWy = this.env.currentSpeed * Math.cos(this.env.currentDir);
            // Calculate relative speed of current to boat
            const relCx = curWx - this.state.vx;
            const relCy = curWy - this.state.vy;
            // Simple force approximation: F = C_hull * rel_velocity
            netForceWorldX += relCx * 2.0;
            netForceWorldY += relCy * 2.0;
        }

        // Wind: applies force + some yaw torque if asymmetric (simple model)
        if (this.env.windSpeed > 0) {
            const windWx = this.env.windSpeed * Math.sin(this.env.windDir);
            const windWy = this.env.windSpeed * Math.cos(this.env.windDir);
            const relWx = windWx - this.state.vx;
            const relWy = windWy - this.state.vy;
            netForceWorldX += relWx * 0.8;
            netForceWorldY += relWy * 0.8;
        }

        // --- 6.5. Tow Line Force computation ---
        let towForceTugX = 0;
        let towForceTugY = 0;
        let towTorqueTug = 0;
        let towForceShipX = 0;
        let towForceShipY = 0;
        let towTorqueShip = 0;

        if (this.targetShipActive && this.towLineAttached && this.targetShip) {
            const L_tug = this.config.length;
            const L_ship = this.targetShip.config.length;

            // Tug attachment at stern (local offset: 0, -L_tug/2)
            const [attTugWx, attTugWy] = this.localToWorld(0, -L_tug/2);
            const xTugAtt = this.state.x + attTugWx;
            const yTugAtt = this.state.y + attTugWy;

            // Ship attachment at bow (local offset: 0, +L_ship/2)
            const cosS = Math.cos(this.targetShip.state.phi);
            const sinS = Math.sin(this.targetShip.state.phi);
            const attShipWx = (L_ship/2) * sinS;
            const attShipWy = (L_ship/2) * cosS;
            const xShipAtt = this.targetShip.state.x + attShipWx;
            const yShipAtt = this.targetShip.state.y + attShipWy;

            const dx = xTugAtt - xShipAtt;
            const dy = yTugAtt - yShipAtt;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const ropeLength = this.config.towRopeLength || 1.6; // meters

            if (dist > ropeLength) {
                const ux = dx / dist;
                const uy = dy / dist;

                // Attachment point velocities (v = v_cg + omega x r)
                // Corrected signs for positive-clockwise yaw orientation
                const vxTugAtt = this.state.vx + this.state.omega * attTugWy;
                const vyTugAtt = this.state.vy - this.state.omega * attTugWx;

                const vxShipAtt = this.targetShip.state.vx + this.targetShip.state.omega * attShipWy;
                const vyShipAtt = this.targetShip.state.vy - this.targetShip.state.omega * attShipWx;

                const vdx = vxTugAtt - vxShipAtt;
                const vdy = vyTugAtt - vyShipAtt;
                const vRelRope = vdx * ux + vdy * uy;

                const kSpring = 90.0;
                const kDamping = 8.0;
                let tension = kSpring * (dist - ropeLength) + kDamping * vRelRope;
                if (tension < 0.0) tension = 0.0;

                // Tug pull is towards ship
                towForceTugX = -ux * tension;
                towForceTugY = -uy * tension;

                // Ship pull is towards tug
                towForceShipX = ux * tension;
                towForceShipY = uy * tension;

                // Torques (tau = r_y * F_x - r_x * F_y, positive clockwise)
                towTorqueTug = attTugWy * towForceTugX - attTugWx * towForceTugY;
                towTorqueShip = attShipWy * towForceShipX - attShipWx * towForceShipY;
            }
        }

        // Apply towing forces to tugboat world forces
        netForceWorldX += towForceTugX;
        netForceWorldY += towForceTugY;

        // --- 7. State updates (Euler Integration) ---
        this.state.ax = netForceWorldX / this.config.mass;
        this.state.ay = netForceWorldY / this.config.mass;
        this.state.alpha = (netTorque + towTorqueTug) / this.config.inertia;

        this.state.vx += this.state.ax * dt;
        this.state.vy += this.state.ay * dt;
        this.state.omega += this.state.alpha * dt;

        this.state.x += this.state.vx * dt;
        this.state.y += this.state.vy * dt;
        this.state.phi += this.state.omega * dt;

        // Keep phi in [-PI, PI]
        this.state.phi = Math.atan2(Math.sin(this.state.phi), Math.cos(this.state.phi));

        // Update target ship state
        if (this.targetShipActive && this.targetShip) {
            this.targetShip.step(dt, towForceShipX, towForceShipY, towTorqueShip);
        }

        // --- 8. Collisions & Boundaries ---
        this.resolveCollisions();
    }

    /**
     * Detect and resolve collisions with boundaries and obstacles
     */
    resolveCollisions() {
        const halfPond = this.config.pondSize / 2.0;
        const R = this.config.collisionRadius;
        const bounce = 0.2; // coefficient of restitution

        // Boundary collisions
        // West Boundary
        if (this.state.x < -halfPond + R) {
            this.state.x = -halfPond + R;
            this.state.vx = -this.state.vx * bounce;
        }
        // East Boundary
        if (this.state.x > halfPond - R) {
            this.state.x = halfPond - R;
            this.state.vx = -this.state.vx * bounce;
        }
        // South Boundary
        if (this.state.y < -halfPond + R) {
            this.state.y = -halfPond + R;
            this.state.vy = -this.state.vy * bounce;
        }
        // North Boundary
        if (this.state.y > halfPond - R) {
            this.state.y = halfPond - R;
            this.state.vy = -this.state.vy * bounce;
        }

        // Obstacle collisions
        for (const obs of this.obstacles) {
            if (obs.type === 'dock') {
                // Rectangular AABB vs Circular Boat
                // Find closest point on AABB to boat center
                const px = Math.max(obs.x1, Math.min(this.state.x, obs.x2));
                const py = Math.max(obs.y1, Math.min(this.state.y, obs.y2));

                const dx = this.state.x - px;
                const dy = this.state.y - py;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < R && dist > 0.0001) {
                    // Collision detected! Push along normal
                    const nx = dx / dist;
                    const ny = dy / dist;

                    this.state.x = px + nx * R;

                    // Project velocity onto normal, reverse normal component
                    const velOnNormal = this.state.vx * nx + this.state.vy * ny;
                    if (velOnNormal < 0) {
                        this.state.vx -= (1.0 + bounce) * velOnNormal * nx;
                        this.state.vy -= (1.0 + bounce) * velOnNormal * ny;
                    }
                    // Add rotational drag due to rubbing
                    this.state.omega *= 0.8;
                }
            } else if (obs.type === 'buoy') {
                // Circle vs Circle
                const dx = this.state.x - obs.x;
                const dy = this.state.y - obs.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const minDist = R + obs.r;

                if (dist < minDist && dist > 0.0001) {
                    const nx = dx / dist;
                    const ny = dy / dist;

                    // Push out
                    this.state.x = obs.x + nx * minDist;
                    this.state.y = obs.y + ny * minDist;

                    // Reverse velocity on normal
                    const velOnNormal = this.state.vx * nx + this.state.vy * ny;
                    if (velOnNormal < 0) {
                        this.state.vx -= (1.0 + bounce) * velOnNormal * nx;
                        this.state.vy -= (1.0 + bounce) * velOnNormal * ny;
                    }
                }
            }
        }

        // --- 9. Tugboat vs Target Ship Collision (Circle vs Oriented Bounding Box) ---
        if (this.targetShipActive && this.targetShip) {
            const ship = this.targetShip;
            const shipL = ship.config.length;
            const shipW = ship.config.width;
            
            // Relative vector from ship to tug
            const dx = this.state.x - ship.state.x;
            const dy = this.state.y - ship.state.y;
            
            // Rotate relative vector into ship's local coordinate system
            const cosS = Math.cos(ship.state.phi);
            const sinS = Math.sin(ship.state.phi);
            const localX = dx * cosS - dy * sinS;
            const localY = dx * sinS + dy * cosS;
            
            // Closest point on AABB in ship local coordinate space
            const hw = shipW / 2.0;
            const hl = shipL / 2.0;
            const clampedX = Math.max(-hw, Math.min(localX, hw));
            const clampedY = Math.max(-hl, Math.min(localY, hl));
            
            // Distance vector in local space
            const diffX = localX - clampedX;
            const diffY = localY - clampedY;
            const dist = Math.sqrt(diffX * diffX + diffY * diffY);
            
            if (dist < R) {
                // Collision detected!
                const pen = R - dist;
                
                // Normal vector in local space (points from closest point on ship to tug center)
                let localNx = 0.0;
                let localNy = 0.0;
                if (dist > 0.0001) {
                    localNx = diffX / dist;
                    localNy = diffY / dist;
                } else {
                    localNx = 1.0; // default push
                }
                
                // Rotate normal back to world space
                const nx = localNx * cosS + localNy * sinS;
                const ny = -localNx * sinS + localNy * cosS;
                
                // Resolve position overlap (Mass weighted push)
                const mTug = this.config.mass;
                const mShip = ship.config.mass;
                const mSum = mTug + mShip;
                
                // Push tug out
                this.state.x += nx * pen * (mShip / mSum);
                this.state.y += ny * pen * (mShip / mSum);
                
                // Push ship back
                ship.state.x -= nx * pen * (mTug / mSum);
                ship.state.y -= ny * pen * (mTug / mSum);
                
                // Relative velocity at collision point (including rotational terms)
                // v_point = v_cg + omega x r
                // In 2D: v_pt_x = vx - omega * r_y; v_pt_y = vy + omega * r_x;
                const xCol = ship.state.x + clampedX * cosS - clampedY * sinS;
                const yCol = ship.state.y + clampedX * sinS + clampedY * cosS;

                const rxShip = xCol - ship.state.x;
                const ryShip = yCol - ship.state.y;
                const rxTug = xCol - this.state.x;
                const ryTug = yCol - this.state.y;

                const vpTugX = this.state.vx - this.state.omega * ryTug;
                const vpTugY = this.state.vy + this.state.omega * rxTug;
                const vpShipX = ship.state.vx - ship.state.omega * ryShip;
                const vpShipY = ship.state.vy + ship.state.omega * rxShip;

                const rvdX = vpTugX - vpShipX;
                const rvdY = vpTugY - vpShipY;
                const velNormal = rvdX * nx + rvdY * ny;
                
                if (velNormal < 0) {
                    const fFriction = this.config.fenderFriction !== undefined ? this.config.fenderFriction : 1.5;
                    const stickLimitNormal = 0.25 * fFriction;
                    const stickLimitTangent = 0.20 * fFriction;

                    const normalSpeed = Math.abs(velNormal);
                    const e = normalSpeed < stickLimitNormal ? 0.0 : 0.15; // inelastic for soft impacts in sticky range
                    
                    // Effective mass for rotation: 1/m_eff = 1/m + (r_perp^2)/I
                    // r_perp = r x n = r_x * n_y - r_y * n_x
                    const rnTug = rxTug * ny - ryTug * nx;
                    const rnShip = rxShip * ny - ryShip * nx;
                    
                    const invMassTug = 1.0 / mTug + (rnTug * rnTug) / this.config.inertia;
                    const invMassShip = 1.0 / mShip + (rnShip * rnShip) / ship.config.inertia;
                    
                    const impulse = -(1.0 + e) * velNormal / (invMassTug + invMassShip);

                    // --- Tangential friction calculation ---
                    const tx = -ny;
                    const ty = nx;
                    const velTangent = rvdX * tx + rvdY * ty;

                    // Tangent perpendicular torque arms: r x t = r_x * t_y - r_y * t_x = r_x * n_x + r_y * n_y
                    const rtTug = rxTug * nx + ryTug * ny;
                    const rtShip = rxShip * nx + ryShip * ny;

                    const invMassTugT = 1.0 / mTug + (rtTug * rtTug) / this.config.inertia;
                    const invMassShipT = 1.0 / mShip + (rtShip * rtShip) / ship.config.inertia;

                    const impulseT_max = -velTangent / (invMassTugT + invMassShipT);

                    // Dynamic friction determination
                    let mu = 0.15; // sliding friction
                    if (normalSpeed < stickLimitNormal && Math.abs(velTangent) < stickLimitTangent) {
                        mu = fFriction; // sticky static friction
                    }

                    const maxFrictionImpulse = mu * impulse;
                    const impulseT = Math.max(-maxFrictionImpulse, Math.min(impulseT_max, maxFrictionImpulse));
                    
                    // Apply linear velocity changes (Normal + Tangent)
                    this.state.vx += nx * (impulse / mTug) + tx * (impulseT / mTug);
                    this.state.vy += ny * (impulse / mTug) + ty * (impulseT / mTug);
                    ship.state.vx -= nx * (impulse / mShip) + tx * (impulseT / mShip);
                    ship.state.vy -= ny * (impulse / mShip) + ty * (impulseT / mShip);
                    
                    // Apply angular velocity changes
                    const FxShip = -(nx * impulse + tx * impulseT);
                    const FyShip = -(ny * impulse + ty * impulseT);
                    const torqueShip = ryShip * FxShip - rxShip * FyShip;
                    ship.state.omega += torqueShip / ship.config.inertia;
                    
                    const FxTug = nx * impulse + tx * impulseT;
                    const FyTug = ny * impulse + ty * impulseT;
                    const torqueTug = ryTug * FxTug - rxTug * FyTug;
                    this.state.omega += torqueTug / this.config.inertia;
                }
            }
        }

        // --- 10. Target Ship vs Boundaries & Obstacles (represented by 5 centerline circles) ---
        if (this.targetShipActive && this.targetShip) {
            const ship = this.targetShip;
            const shipL = ship.config.length;
            const shipR = ship.config.width / 2.0; // segment radius
            const offsets = [-1.8, -0.9, 0.0, 0.9, 1.8];
            const cosS = Math.cos(ship.state.phi);
            const sinS = Math.sin(ship.state.phi);
            
            offsets.forEach(offset => {
                // World coordinates of this segment center
                const sx = ship.state.x + offset * sinS;
                const sy = ship.state.y + offset * cosS;
                
                // A. Boundary check for ship segment
                let pushX = 0;
                let pushY = 0;
                
                if (sx < -halfPond + shipR) pushX = (-halfPond + shipR) - sx;
                if (sx > halfPond - shipR) pushX = (halfPond - shipR) - sx;
                if (sy < -halfPond + shipR) pushY = (-halfPond + shipR) - sy;
                if (sy > halfPond - shipR) pushY = (halfPond - shipR) - sy;
                
                if (pushX !== 0 || pushY !== 0) {
                    // Shift ship center of mass
                    ship.state.x += pushX;
                    ship.state.y += pushY;
                    
                    // Rotate ship away from boundary collision
                    // Torque: r_x * F_y - r_y * F_x
                    const rx = offset * sinS;
                    const ry = offset * cosS;
                    const torque = rx * pushY - ry * pushX;
                    ship.state.phi += torque * 0.05;
                    
                    // Dampen velocities
                    if (pushX !== 0) ship.state.vx = -ship.state.vx * 0.1;
                    if (pushY !== 0) ship.state.vy = -ship.state.vy * 0.1;
                    ship.state.omega *= 0.5;
                }
                
                // B. Obstacle check for ship segment
                this.obstacles.forEach(obs => {
                    if (obs.type === 'dock') {
                        const px = Math.max(obs.x1, Math.min(sx, obs.x2));
                        const py = Math.max(obs.y1, Math.min(sy, obs.y2));
                        
                        const dx = sx - px;
                        const dy = sy - py;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        
                        if (dist < shipR && dist > 0.0001) {
                            const nx = dx / dist;
                            const ny = dy / dist;
                            const pen = shipR - dist;
                            
                            const pushDockX = nx * pen;
                            const pushDockY = ny * pen;
                            
                            // Push ship center
                            ship.state.x += pushDockX;
                            ship.state.y += pushDockY;
                            
                            // Torque to rotate
                            const rx = offset * sinS;
                            const ry = offset * cosS;
                            const torque = rx * pushDockY - ry * pushDockX;
                            ship.state.phi += torque * 0.08;
                            
                            // Velocities
                            const velNormal = ship.state.vx * nx + ship.state.vy * ny;
                            if (velNormal < 0) {
                                ship.state.vx -= 1.1 * velNormal * nx;
                                ship.state.vy -= 1.1 * velNormal * ny;
                            }
                            ship.state.omega *= 0.5;
                        }
                    } else if (obs.type === 'buoy') {
                        const dx = sx - obs.x;
                        const dy = sy - obs.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        const minDist = shipR + obs.r;
                        
                        if (dist < minDist && dist > 0.0001) {
                            const nx = dx / dist;
                            const ny = dy / dist;
                            const pen = minDist - dist;
                            
                            const pushBuoyX = nx * pen;
                            const pushBuoyY = ny * pen;
                            
                            // Push ship center
                            ship.state.x += pushBuoyX;
                            ship.state.y += pushBuoyY;
                            
                            // Torque
                            const rx = offset * sinS;
                            const ry = offset * cosS;
                            const torque = rx * pushBuoyY - ry * pushBuoyX;
                            ship.state.phi += torque * 0.08;
                            
                            const velNormal = ship.state.vx * nx + ship.state.vy * ny;
                            if (velNormal < 0) {
                                ship.state.vx -= 1.1 * velNormal * nx;
                                ship.state.vy -= 1.1 * velNormal * ny;
                            }
                            ship.state.omega *= 0.5;
                        }
                    }
                });
            });
        }
    }
}

export class TargetVessel {
    constructor() {
        this.config = {
            mass: 120.0,          // kg
            inertia: 250.0,       // kg*m^2
            length: 4.8,          // meters
            width: 0.95,          // meters
            collisionRadius: 2.4, // bounding radius
            dragLinearX: 70.0,    // high lateral drag
            dragLinearY: 12.0,    // forward drag
            dragAngular: 60.0,    // angular drag
            thrustMax: 16.0       // Newtons (when engine is active)
        };

        this.state = {
            x: 8.0,              // Position x (meters, starting to the right)
            y: 5.0,              // Position y (meters)
            phi: 0.2,            // Heading angle (radians, tilted slightly)
            vx: 0.0,             // velocity x
            vy: 0.0,             // velocity y
            omega: 0.0,          // angular velocity
            ax: 0.0,
            ay: 0.0,
            alpha: 0.0
        };

        this.controls = {
            engineKilled: false,
            throttle: 0.0,       // -1.0 to 1.0
            rudderAngle: 0.0     // radians
        };
    }

    reset() {
        this.state.x = 8.0;
        this.state.y = 5.0;
        this.state.phi = 0.2;
        this.state.vx = 0.0;
        this.state.vy = 0.0;
        this.state.omega = 0.0;
        this.state.ax = 0.0;
        this.state.ay = 0.0;
        this.state.alpha = 0.0;
        this.controls.engineKilled = false;
        this.controls.throttle = 0.0;
        this.controls.rudderAngle = 0.0;
    }

    step(dt, pullForceX = 0, pullForceY = 0, pullTorque = 0) {
        if (dt <= 0) return;

        // 1. Get local velocities
        const cos = Math.cos(this.state.phi);
        const sin = Math.sin(this.state.phi);
        const u = this.state.vx * cos - this.state.vy * sin; // local lateral
        const v = this.state.vx * sin + this.state.vy * cos; // local forward

        // 2. Linear and angular drag forces in local frame
        const dragForceLocalX = -this.config.dragLinearX * u * Math.abs(u);
        const dragForceLocalY = -this.config.dragLinearY * v * Math.abs(v);
        const dragTorque = -this.config.dragAngular * this.state.omega * Math.abs(this.state.omega);

        // 3. Engine Thrust Force
        const F_thrust = this.controls.engineKilled ? 0.0 : this.controls.throttle * this.config.thrustMax;
        const thrustForceLocalX = 0.0;
        const thrustForceLocalY = F_thrust;

        // 4. Rudder Force and Torque (located at the stern y = -L/2)
        const rudderAngle = this.controls.rudderAngle;
        const rudderLiftCoefficient = 12.0; // lift strength
        const rudderForceLocalX = -rudderLiftCoefficient * v * Math.sin(rudderAngle);
        
        const r_rudder_y = -this.config.length / 2.0;
        const rudderTorque = r_rudder_y * rudderForceLocalX;

        // 5. Net forces in local frame
        const netForceLocalX = dragForceLocalX + rudderForceLocalX;
        const netForceLocalY = dragForceLocalY + thrustForceLocalY;
        const netTorque = dragTorque + rudderTorque;

        // 6. Convert local forces to world coordinates
        let netForceWorldX = netForceLocalX * cos + netForceLocalY * sin;
        let netForceWorldY = -netForceLocalX * sin + netForceLocalY * cos;

        // 7. Add tow line pull force (already in world coords) and torque
        netForceWorldX += pullForceX;
        netForceWorldY += pullForceY;
        const totalTorque = netTorque + pullTorque;

        // 8. Integrate state (Euler Integration)
        this.state.ax = netForceWorldX / this.config.mass;
        this.state.ay = netForceWorldY / this.config.mass;
        this.state.alpha = totalTorque / this.config.inertia;

        this.state.vx += this.state.ax * dt;
        this.state.vy += this.state.ay * dt;
        this.state.omega += this.state.alpha * dt;

        this.state.x += this.state.vx * dt;
        this.state.y += this.state.vy * dt;
        this.state.phi += this.state.omega * dt;

        // Keep phi in range [-PI, PI]
        this.state.phi = Math.atan2(Math.sin(this.state.phi), Math.cos(this.state.phi));
    }
}
