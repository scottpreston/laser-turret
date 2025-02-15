### **📌 Python Setup - Laser Turret Control**  

This guide walks through setting up **Python and dependencies** for running **PiCamera2 and Flask** on the **Raspberry Pi 3**.  

## **⚠️ Python Notes**
🚨 *This setup is designed for a **single-purpose environment**, without virtual environments (`venv`).*  
💡 *Future improvements may involve using **Docker** for better containerization.*  

## **🛠️ Installing Python & Required Libraries**
Install the necessary **Python libraries** for **camera control** and **web API integration**.

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install python3-picamera python3-pip python3-flask python3-flask-cors -y
```

## **📷 Testing the Camera**
Verify that the **PiCamera2 module** is working:
```bash
libcamera-hello --list-cameras
```
If the camera is detected, test capturing an image:
```bash
libcamera-still -o test.jpg
```
If successful, the camera is correctly configured.


## **📂 Related Files**
🔗 **[Camera Motion Guide](./cam-motion.md)**  
🔗 **[Client Code (Web UI)](./client-setup.md)**  
🔗 **[Server Code (Node.js API)](./server-setup.md)**  
