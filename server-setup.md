# **📌 Server Setup - Laser Turret Control**  

This guide walks through setting up the **Node.js backend** to control the **laser turret** and managing both the **Node.js API and the Python camera service** as daemons using **PM2**.


## **🖥️ Overview**  
The **Node.js server** acts as the **backend API**, handling turret control via RESTful API calls.  
It communicates with:  
✔️ **The servo control module (Pololu SSC)** for pan/tilt movement.  
✔️ **A 5V relay (GPIO18) to fire the laser.**  

This setup ensures that both **services run automatically in the background** using **PM2**, a **process manager for Node.js and Python applications**.

## **🚀 Install Dependencies**
### **1️⃣ Install Node.js and PM2**
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nodejs npm
sudo npm install -g pm2
```

### **2️⃣ Install Required Node.js Packages**
Navigate to the **server directory** and install dependencies:
```bash
cd ~/node/api/
npm install
```
These packages provide:
- **Express.js** → API routing.
- **CORS** → Allows web client access.
- **Body-parser** → Handles JSON requests.
- **Winston** → Handles logging.
- **Serialport** → Handles communication with servo controller.
- **ONOFF Module** → Detects platform for GPIO handling.

### **3️⃣ Running the Server**
Start the server manually to test:
```bash
node src/index.js
```
If it runs without errors, you should see:
```
Laser Turret Service Started On Port 3000...
```
Test the API by running:
```bash
curl http://raspberrypi:3000/api/reset
```
If the turret resets, everything is working.

## **🔄 Running as a Background Service with PM2**
Instead of running the Node.js and Python scripts manually, we use **PM2** to manage them.

### **1️⃣ Create the PM2 Configuration**
Create the **PM2 ecosystem config file**:
```bash
vim ~/node/api/ecosystem.config.js
```
Paste the following configuration:
```javascript
module.exports = {
    apps: [
        {
            name: 'py-cam-service',
            script: '/home/pi/node/api/python/cam-motion.py',
            interpreter: '/usr/bin/python3',
        },
        {
            name: 'turrent-api',
            script: '/home/pi/node/api/src/index.js',
            interpreter: '/usr/bin/node',
        },
    ],
};
```
- **`py-cam-service`** → Runs the Python motion detection service.  
- **`turrent-api`** → Runs the Node.js API for turret control.

### **2️⃣ Start Both Services with PM2**
```bash
cd ~/node/api/
pm2 start ecosystem.config.js
pm2 save
```
💡 **This will automatically restart both services on reboot.**

### **3️⃣ Enable PM2 to Run on Boot**
```bash
pm2 startup
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u pi --hp /home/pi
```

### **4️⃣ Checking and Managing Services**
To check if everything is running:
```bash
pm2 list
```
To restart a service:
```bash
pm2 restart turrent-api
pm2 restart py-cam-service
```
To stop a service:
```bash
pm2 stop turrent-api
```
To delete a service:
```bash
pm2 delete py-cam-service
```

## **📜 API Endpoints**
| Method | Endpoint         | Description         |
|--------|-----------------|----------------------|
| `POST` | `http://nodeserver:3000/api/relay/on`  | Turns the **laser ON**                  |
| `POST` | `http://nodeserver:3000/api/relay/off` | Turns the **laser OFF**                 |
| `POST` | `http://nodeserver:3000/api/pan`       | Moves **left/right**                    |
| `POST` | `http://nodeserver:3000/api/tilt`      | Moves **up/down**                       |
| `GET`  | `http://nodeserver:3000/api/reset`     | Resets the turret                       |
| `GET`  | `http://pyserver:5000/frame`           | Returns a **live camera frame**         |
| `GET`  | `http://pyserver:5000/motion`          | Detects **motion center coordinates**   |

## **📂 Related Files**
🔗 **[Python Setup Guide](./py-setup.md)**  
🔗 **[Camera Motion Guide](./cam-motion.md)**  
🔗 **[Client Setup (Web UI)](./client-setup.md)**  
