# **📌 Python Setup - Laser Turret Control**  

This guide walks through setting up **Python and dependencies** for running **PiCamera2 and Flask** on the **Raspberry Pi 3**.  


## **⚠️ Python Notes**  
🚨 *This setup is designed for a **single-purpose environment**, without virtual environments (`venv`).*  
💡 *Future improvements may involve using **Docker** for better containerization.*  

## **🛠️ Installing Python & Required Libraries**  
Install the necessary **Python libraries** for **camera control** and **web API integration**.

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install python3-picamera2 python3-pip python3-flask python3-flask-cors -y
```

## **📜 Package Overview**

| Package                  | Purpose                                      |
|--------------------------|----------------------------------------------|
| **python3-picamera2**    | Enables **PiCamera2** for live video feed.  |
| **python3-pip**          | Python package manager.                     |
| **python3-flask**        | Runs the **API server** for turret control. |
| **python3-flask-cors**   | Enables **CORS** for API access from UI.    |


## **📌 Running & Testing the Camera Service**  
Once the dependencies are installed, test the **camera streaming service**:  

```bash
python3 cam-motion.py
```

If successful, you should see **no errors** and be able to access the camera feed at:  
```
http://<raspberry-pi-ip>:5000/frame
```

💡 *If the camera feed does not load, double-check that the camera module is properly connected and enabled in `raspi-config`.*

---

## **📂 Related Files**
🔗 **[Camera Motion Guide](./cam-motion.md)**  
🔗 **[Client Setup (Web UI)](./client-setup.md)**  
🔗 **[Server Setup (Node.js API)](./server-setup.md)**  

🚀 **Now your Python environment is fully set up!** 🎯