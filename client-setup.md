# **📌 Client Setup - Laser Turret Control**  

This guide explains how to set up the **web-based control interface** for the **laser turret**.  
The **client UI is served directly from the `static/` directory** on the **Node.js server**, meaning you **do not need a separate web server**.  

## **🖥️ Overview**  
The **client interface** is a **modern web UI** that allows users to:  
✔️ **View the live camera feed** from the **PiCamera2**.  
✔️ **Control turret movement** using **buttons, keyboard shortcuts, or clicking on the video feed**.  
✔️ **Fire the laser** via the **FIRE button or keyboard (`F` key)**.  

💡 **Because the client runs from `static/`, you only need to start the Node.js server** to access the UI.

## **📂 File Location & Structure**  
The client files are located in the **server’s `static/` directory**:  
```
/server
│── static/
│   ├── index.html        # Main UI for turret control
│   ├── style.css         # UI styling
│   ├── script.js         # Handles interactions with the API
│   ├── crosshairs2.svg   # Crosshair overlay
```

### **1️⃣ Start the Node.js Server**
Run the following on your **Raspberry Pi**:  
```bash
cd server/
node server.js
```
This automatically **serves the web client** at:  
```
http://raspberrypi:3000
```
💡 **No need to start a separate web server**. The Node.js backend serves everything.

### **2️⃣ Open the Web Interface**
- Open a **browser** on any device connected to the **same network**.  
- Go to:
  ```
  http://raspberrypi:3000
  ```
- You should see the **Laser Turret Control UI**.


## **🎮 Controls & Features**
| Action                 | Input |
|------------------------|------|
| **Move Up**            | `W` or **UP button** |
| **Move Left**          | `A` or **LEFT button** |
| **Move Down**          | `S` or **DOWN button** |
| **Move Right**         | `D` or **RIGHT button** |
| **Fire Laser**         | `F` or **FIRE button** |
| **Click to Fire**      | Click the **camera feed** |

✔️ **Keyboard and button controls work simultaneously**.  
✔️ **Hover over the camera feed** to get a **crosshair cursor**.  
✔️ **Click anywhere on the live feed** to fire the laser.

## **📜 How It Works**
### **1️⃣ Live Camera Feed**
The browser loads the **video stream** directly from the **Flask-based motion service** running on the Pi:
```html
<img id="cameraImage" src="http://raspberrypi:5000/frame">
```
💡 **The image automatically refreshes every second** using JavaScript.

### **2️⃣ Buttons & Keyboard Events**
Buttons are assigned **event listeners** to send **pan/tilt/fire commands** to the Node.js API:
```javascript
document.getElementById("fire").addEventListener("click", fireOneShot);
document.addEventListener("keydown", (event) => {
    if (event.code === "KeyF") fireOneShot();
});
```
This allows **real-time turret control**.

### **3️⃣ API Requests to Node.js Server**
Each action sends a **POST request** to the backend API:
```javascript
async function pan(value) {
    await fetch(`${baseUrl}/api/pan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pos: value })
    });
}
```

## **📂 Related Files**
🔗 **[Python Setup Guide](./py-setup.md)**  
🔗 **[Camera Motion Guide](./cam-motion.md)**  
🔗 **[Server Setup (Node.js API)](./server-setup.md)**  
