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
            collisionRadius: 0.35 // meters (for boundary and dock collisions)
        };

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

        // --- 7. State updates (Euler Integration) ---
        this.state.ax = netForceWorldX / this.config.mass;
        this.state.ay = netForceWorldY / this.config.mass;
        this.state.alpha = netTorque / this.config.inertia;

        this.state.vx += this.state.ax * dt;
        this.state.vy += this.state.ay * dt;
        this.state.omega += this.state.alpha * dt;

        this.state.x += this.state.vx * dt;
        this.state.y += this.state.vy * dt;
        this.state.phi += this.state.omega * dt;

        // Keep phi in [-PI, PI]
        this.state.phi = Math.atan2(Math.sin(this.state.phi), Math.cos(this.state.phi));

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
    }
}
