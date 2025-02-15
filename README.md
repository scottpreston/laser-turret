### **🚀 Laser Turret Project - Overview**  
This project is a **Raspberry Pi 3-based laser turret** that allows users to **remotely control a laser module** with **precise pan/tilt movement** via a **web interface**.  

It consists of:
- A **PiCamera2 live video feed**  
- A **5V relay to fire the laser**  
- A **servo-based pan/tilt system** controlled by a **Pololu SSC servo module**  
- A **switched 12V battery supply** for power  
- A **Node.js backend server** to handle turret commands  

💡 **Users can control the turret using:**  
✔️ **Keyboard (W, A, S, D, F)**  
✔️ **On-screen buttons**  
✔️ **Clicking the live camera feed**  

---
## **📡 Hardware Requirements**
| Component                 | Description |
|---------------------------|-------------|
| **Raspberry Pi 3**        | Runs the **web server, camera stream, and turret control** logic |
| **PiCamera2 Module**      | Captures live video feed for targeting |
| **Laser Module (Engraver)** | High-powered **laser module from a laser engraver** |
| **5V Relay (GPIO 18)**    | Controls the **laser on/off switch** |
| **Pololu SSC Servo Controller** | Drives **two servos for pan/tilt movement** |
| **2x Servos (Pan/Tilt)**  | **Moves the laser turret** left, right, up, down |
| **5V Power Supply (Switched)** | **Powers the servos** |
| **12V Battery Supply (Switched)** | **Powers the laser system** |

---

## **🖥️ Software Overview**
This project includes **four key components**:  

### **1️⃣ Python Setup (📂 `py-setup.md`)**  
- Installs **PiCamera2** for video streaming.  
- Installs Python packages for use of cam-motion.  

🔗 **[Python Setup Guide](./py-setup.md)**  

---

### **2️⃣ Camera Motion Detection (📂 `cam-motion.md`)**  
- Runs a **Flask-based camera server** on the Raspberry Pi.  
- Provides a **real-time video stream**.  
- Detects **motion** and identifies **the center of movement**.  

🔗 **[Camera Motion Guide](./cam-motion.md)**  

---

### **3️⃣ Web Client (📂 `client-setup.md`)**  
- Provides a **modern web UI** for controlling the turret.  
- Includes **live video streaming**, **crosshair targeting**, and **on-screen movement controls**.  
- Users can **click anywhere on the feed to fire** the laser.  

🔗 **[Client Code Overview](./client-setup.md)**  

---

### **4️⃣ Node.js Server (📂 `server-setup.md`)**  
- Runs a **REST API** for turret control on the **Raspberry Pi**.  
- Handles **commands for pan/tilt movement, laser firing, and reset functions**.  
- Supports **CORS** for remote access.  

🔗 **[Server Code Overview](./server-setup.md)**  

---

## **📌 System Architecture**
```
 User (Browser)  →  Client (HTML/JS)  →  Node.js Server (Express)
                 ↘                    ↙
               PiCamera2          Pololu SSC + Laser Relay
                    |                        |
               Live Video               GPIO + Servos
```
- **Users control the turret from a browser.**  
- **Commands are sent to the server, which controls GPIO pins & servos.**  
- **Live video is streamed back to the browser via PiCamera2 and a Python Script.**  


 <br><br>


# **📌 Raspberry Pi Setup - Laser Turret Control**  

Follow these steps to prepare your **Raspberry Pi 3** for running the **laser turret system**.


## **1️⃣ Update & Upgrade the System**
Ensure your Raspberry Pi is up to date before installing any software:  
```bash
sudo apt update && sudo apt upgrade -y
```

## **2️⃣ Install Essential Utilities**
Install **Git, Vim, and other useful tools**:  
```bash
sudo apt install -y git vim curl wget htop
```
| Package  | Purpose |
|----------|---------|
| **git**  | Version control for code |
| **vim**  | Lightweight text editor |
| **curl** | Command-line tool for API testing |
| **wget** | Download files from the web |
| **htop** | System resource monitoring |


## **3️⃣ Enable Camera & Interfaces**
Enable **PiCamera2**, **I2C**, and **SPI** using `raspi-config`:  
```bash
sudo raspi-config
```
- **Navigate to:** `Interfacing Options`  
- **Enable:**  
  - **Camera** (Required for PiCamera2)  
  - **I2C** (Required for Pololu Servo Controller)  
  - **SPI** (If needed for future expansions)  
- **Exit and Reboot**:  
```bash
sudo reboot
```

## **4️⃣ Verify PiCamera2 Installation**
After rebooting, check if the **PiCamera2 module** is detected:  
```bash
libcamera-hello --list-cameras
```
If detected, test capturing an image:  
```bash
libcamera-still -o test.jpg
```
💡 *If the test image is saved successfully, the camera is working!*



🚀 **Now your Raspberry Pi is set up and ready for software installation!** 🎯

---

## **💡 Future Improvements**
✔️ **AI-Based Auto Targeting** with OpenCV.  
✔️ **WebSocket Control** for real-time turret updates.  
✔️ **Mobile App Integration** for remote control.  

## **🤝 Contributing**
Want to improve the project?  
1. **Fork the repository**  
2. **Create a new branch**  
3. **Submit a pull request**  


## **📜 License**
This project is **open-source** under the **MIT License**.  
Feel free to **modify, distribute, and enhance**!  
