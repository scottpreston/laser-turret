### **📌 Camera Motion Detection Service (`cam-motion.py`)**  

This Python script runs a **Flask-based camera server** on a **Raspberry Pi 3**, allowing users to:  
- **Capture live frames** from the PiCamera2.  
- **Detect motion** by comparing two consecutive frames.  
- **Provide a web API** for real-time image and motion tracking.

## **📜 Code Breakdown**
### **1️⃣ Importing Required Libraries**
```python
from flask import Flask, Response, jsonify
from picamera2 import Picamera2
import io
import numpy as np
import libcamera
from flask_cors import CORS
from time import sleep
```
- **Flask** → Creates a web server for streaming and motion detection.  
- **Picamera2** → Controls the **PiCamera2** for image capture.  
- **NumPy** → Performs image processing for motion detection.  
- **Libcamera** → Allows transformations like **flipping the image**.  
- **Flask-CORS** → Enables **Cross-Origin Resource Sharing** for API access.  
- **Time (sleep)** → Introduces a small delay to compare consecutive frames.

### **2️⃣ Flask App Initialization**
```python
app = Flask(__name__)
CORS(app)
```
- **Creates a Flask web server** (`app`) that handles API requests.  
- **Enables CORS** to allow web browsers and external applications to access the API.


### **3️⃣ Camera Initialization**
```python
picam2 = Picamera2()
camera_config = picam2.create_still_configuration(
    main={"size": (640, 480)}
)
camera_config["transform"] = libcamera.Transform(hflip=1, vflip=1)
picam2.configure(camera_config)
picam2.start()
```
- **Initializes the PiCamera2 module** with a **640x480 resolution**.  
- **Applies transformations** (`hflip=1, vflip=1`) to ensure a **properly oriented image**.  
- **Starts the camera** to keep it active for continuous streaming.

### **4️⃣ Capture a Single Frame**
```python
def capture_frame():
    output = io.BytesIO()  # In-memory buffer
    picam2.capture_file(output, format='jpeg')  # Capture image
    output.seek(0)  # Reset buffer position
    return output.getvalue()
```
- **Captures an image** from the camera and **stores it in memory** (not on disk).  
- **Returns the image data as bytes** to be served over HTTP.

### **5️⃣ Motion Detection Algorithm**
```python
def get_center_of_motion(frame1, frame2, threshold=0.3):
    gray1 = np.dot(frame1[...,:3], [0.299, 0.587, 0.114])
    gray2 = np.dot(frame2[...,:3], [0.299, 0.587, 0.114])
    
    diff = np.abs(gray1 - gray2)
    mask = diff > 10  # Threshold to identify motion
    
    total_pixels = gray1.size
    motion_pixels = np.sum(mask)
    motion_percentage = motion_pixels / total_pixels

    if motion_percentage < threshold:
        return {"x": frame1.shape[1] // 2, "y": frame1.shape[0] // 2}
    
    coords = np.argwhere(mask)
    
    if len(coords) == 0:
        return {"x": -1, "y": -1}
    
    x = np.mean(coords[:, 1])
    y = np.mean(coords[:, 0])
    
    return {"x": int(x), "y": int(y)}
```
#### **How It Works:**
1. **Converts images to grayscale** → Easier for motion detection.  
2. **Computes pixel differences** → Finds changes between two consecutive frames.  
3. **Creates a motion mask** → Identifies regions with significant changes.  
4. **Calculates motion percentage** → Determines if movement is above a threshold.  
5. **Returns motion center coordinates** → If no significant motion, defaults to the **center of the frame**.

### **6️⃣ Flask API Routes**
#### **📷 Capture & Return a Frame**
```python
@app.route('/frame')
def get_frame():
    frame = capture_frame()
    return Response(frame, mimetype='image/jpeg')
```
- **Captures an image from the camera**.
- **Serves it as a JPEG response** over HTTP.

#### **🎯 Motion Detection API**
```python
@app.route('/motion')
def get_motion():
    frame1 = picam2.capture_array()
    sleep(0.1)  # Small delay for motion capture
    frame2 = picam2.capture_array()

    center = get_center_of_motion(frame1, frame2)
    return jsonify(center)
```
- **Captures two consecutive frames** with a **small delay**.  
- **Detects movement** and returns the **coordinates of the motion center**.  

### **7️⃣ Running the Server**
```python
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
```
- Runs the **Flask web server** on **port 5000**.  
- Makes the API available **on all network interfaces (`0.0.0.0`)**.  

## **📌 API Usage**
| API Endpoint  | Method | Description |
|--------------|--------|-------------|
| `/frame`     | `GET`  | Captures and returns a **single camera frame** |
| `/motion`    | `GET`  | Compares two frames and returns the **center of motion** |

### **Example Usage**
📸 **Get a Frame**
```bash
curl http://raspberrypi:5000/frame --output frame.jpg
```
🎯 **Get Motion Data**
```bash
curl http://raspberrypi:5000/motion
```
Expected Response:
```json
{"x": 320, "y": 240}
```

## **📂 Related Files**
🔗 **[Python Setup Guide](./py-setup.md)**  
🔗 **[Client Setup (Web UI)](./client-setup.md)**  
🔗 **[Server Setup (Node.js API)](./server-setup.md)**  
