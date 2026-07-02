# RC ASD Boat Simulator

A real-time, browser-based simulator for **2-channel RC (Radio Control) Azimuth Stern Drive (ASD) boats**. This tool visualizes how a twin azimuth thruster boat responds to joystick inputs, helping hobbyists and engineers design, test, and tune control mixing algorithms before deploying them to physical hardware.

### 🌐 [**Try it live → shaunmurphy.github.io/RCASDBoatSimulator**](https://shaunmurphy.github.io/RCASDBoatSimulator/)

**No build tools, frameworks, or dependencies required** — just open `index.html` in a modern browser, or serve it with any static HTTP server.

## Features

### 🚤 Real-Time Boat Physics Simulation
- **2D rigid-body dynamics** with mass, inertia, and center-of-gravity modeling
- **Hydrodynamic drag** — linear, lateral, and angular drag coefficients simulate realistic water resistance
- **Twin azimuth thruster model** — each thruster pod has independent servo angle and motor speed, positioned at configurable stern offsets
- **Boundary collision detection** with elastic restitution against the simulation area edges

### 🎮 Interactive Joystick Control
- **On-screen virtual joystick** with touch and mouse support
- **Keyboard controls** — Arrow keys or WASD for steering and throttle
- **Gamepad support** — plug in a USB/Bluetooth gamepad and control the boat directly
- **Configurable deadzone** filtering for both joystick and gamepad inputs

### ⚙️ Microprocessor Simulation
- Faithfully simulates the signal processing pipeline of an **ESP32/Arduino microcontroller**:
  - RC PWM input capture (1000–2000 µs pulse width)
  - Normalized joystick axis conversion
  - Configurable steering inversion
  - Servo rotation speed limiting (slew rate)
  - ESC response lag (first-order time constant)

### 🔀 Control Mixing Algorithms

Three built-in mixing modes plus user-defined custom algorithms:

| Mode | Description |
|------|-------------|
| **Vectored** | Full ASD vectoring with translation, rotation, and lateral thrust components. Supports toe-in angle, differential speed, and lateral sideways thrust. |
| **Differential** | Classic differential steering — speed difference between left and right motors drives rotation. No lateral thrust vectoring. |
| **Custom** | User-defined mathematical equations for all four actuator targets — parsed and evaluated securely without JavaScript execution. |

### 📐 Safe Custom Mixing Equations

Custom algorithms use a **secure mathematical expression parser** (Shunting-yard → RPN evaluator) instead of raw JavaScript. This eliminates injection vulnerabilities while providing full mathematical flexibility:

**Available Variables:**
| Variable | Description |
|----------|-------------|
| `x` | Joystick steering axis (−1.0 = left, 1.0 = right) |
| `y` | Joystick throttle axis (−1.0 = reverse, 1.0 = forward) |
| `toeangle` | Active max toe-in angle (radians) |
| `transweight` | Translation mixing weight |
| `rotweight` | Yaw rotation mixing weight |
| `latweight` | Lateral thrust mixing weight |
| `pi` | Math constant π |

**Supported Operators:** `+` `-` `*` `/` `^` (power) `( )`

**Supported Functions:** `sin(a)` `cos(a)` `tan(a)` `abs(a)` `sqrt(a)` `min(a,b)` `max(a,b)`

### 📊 Real-Time Diagnostics HUD
- **Servo angles** and PWM pulse widths for left and right pods
- **ESC speed** percentages and PWM values
- **RC input** pulse width monitoring
- **Visual progress bars** for all actuator channels
- Interactive **help tooltips** on every parameter explaining its function

### 🗺️ Interactive Map View
- Zoomable top-down map with grid overlay
- Configurable map zoom (px/m) and boat scale multiplier
- Google Maps-style **+/−** zoom controls
- Optional **clearance outline overlay** showing the boat's physical footprint
- Real-time heading and position tracking

### 💻 Arduino/ESP32 Code Preview
- Live-generated C++ code that mirrors the active mixing algorithm
- Platform selector: **ESP32** or **Arduino Uno/Nano**
- Direct translation of simulator settings to deployable firmware code
- Configurable pin assignments

### 🎨 UI / UX
- **Dark and Light themes** with smooth transitions
- Modern glassmorphic design with the **Inter** and **JetBrains Mono** font families
- Collapsible sidebar widgets for organized parameter grouping
- Responsive layout

## Quick Start

### Option 1: Open Directly
Simply open `index.html` in any modern browser (Chrome, Firefox, Safari, Edge).

> **Note:** Some browsers block ES module imports from `file://` URLs. If you see a blank page, use Option 2 instead.

### Option 2: Local HTTP Server

```bash
# Python 3
python3 -m http.server 8080

# Node.js
npx serve .

# PHP
php -S localhost:8080
```

Then navigate to `http://localhost:8080`.

## Project Structure

```
├── index.html       # Main application shell — sidebar UI, canvas, modal editor
├── style.css        # Complete design system — dark/light themes, layout, components
├── controller.js    # Microprocessor simulation — mixing algorithms, MathParser, PWM
├── physics.js       # 2D rigid-body boat physics — forces, drag, collisions
├── ui.js            # UI orchestration — rendering loop, input handling, diagnostics
└── LICENSE          # Apache License 2.0
```

### Module Architecture

```
┌──────────────────────────────────────────────────────┐
│                    index.html                        │
│              (DOM structure & layout)                 │
├──────────────────────────────────────────────────────┤
│                      ui.js                           │
│  ┌─────────────┐ ┌───────────┐ ┌──────────────────┐ │
│  │  Rendering   │ │  Inputs   │ │   Diagnostics    │ │
│  │  (Canvas)    │ │ (Joystick │ │   (HUD sidebar)  │ │
│  │             │ │  Keyboard │ │                  │ │
│  │             │ │  Gamepad) │ │                  │ │
│  └──────┬──────┘ └─────┬─────┘ └────────┬─────────┘ │
├─────────┼──────────────┼────────────────┼────────────┤
│         ▼              ▼                ▼            │
│  ┌─────────────┐ ┌───────────────────────────┐       │
│  │ physics.js  │ │      controller.js        │       │
│  │             │ │  ┌─────────────────────┐   │       │
│  │ Rigid Body  │ │  │    MathParser       │   │       │
│  │ Dynamics    │◄┤  │  (Shunting-yard/RPN)│   │       │
│  │ Drag Model  │ │  └─────────────────────┘   │       │
│  │ Collisions  │ │  Mixing Algorithms         │       │
│  └─────────────┘ │  Servo/ESC Simulation      │       │
│                  └───────────────────────────┘       │
└──────────────────────────────────────────────────────┘
```

## Configuration Parameters

All parameters are adjustable in real-time via the sidebar UI:

| Parameter | Default | Description |
|-----------|---------|-------------|
| Max Toe-in Angle | 45° | Maximum inward angle of thruster pods at idle |
| Servo Speed Limit | 360°/s | Maximum angular rotation rate of servo motors |
| Motor Time Constant | 0.15 s | ESC first-order response lag |
| Deadzone | 0.02 | Joystick/gamepad input dead band |
| Translation Weight | 1.0 | Forward/reverse throttle mixing weight |
| Rotation Weight | 0.8 | Yaw differential steering weight |
| Lateral Weight | 0.7 | Sideways thrust vectoring weight (vectored mode) |
| Boat Mass | 5.0 kg | Simulated vessel mass |
| Boat Length | 0.6 m | Hull length for physics and rendering |
| Boat Beam | 0.25 m | Hull width |

## Browser Compatibility

| Browser | Supported |
|---------|-----------|
| Chrome 90+ | ✅ |
| Firefox 90+ | ✅ |
| Safari 15+ | ✅ |
| Edge 90+ | ✅ |

Requires ES Modules support and HTML5 Canvas.

## License

This project is licensed under the **Apache License 2.0** — see the [LICENSE](LICENSE) file for details.

## Copyright

Copyright 2026 Shaun Murphy and Charles Murphy
