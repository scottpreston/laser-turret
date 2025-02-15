from flask import Flask, Response, jsonify
from picamera2 import Picamera2
import io
import numpy as np
import libcamera
from flask_cors import CORS
from time import sleep

app = Flask(__name__)
CORS(app)

# Initialize the Pi Camera with 640x480 resolution
picam2 = Picamera2()
camera_config = picam2.create_still_configuration(
        main={"size": (640, 480)}
)
camera_config["transform"] = libcamera.Transform(hflip=1, vflip=1)
picam2.configure(camera_config)
# Set both flips to achieve an upside-down image
# Start the camera in preview mode (important for continuous usage)
picam2.start()

# Function to capture a frame and return it as bytes
def capture_frame():
    output = io.BytesIO()  # Create an in-memory buffer
    picam2.capture_file(output, format='jpeg')  # Capture directly into the buffer
    output.seek(0)  # Reset buffer to the beginning
    return output.getvalue()

def get_center_of_motion(frame1, frame2, threshold=0.3):
    # Convert to grayscale for simplicity
    gray1 = np.dot(frame1[...,:3], [0.299, 0.587, 0.114])
    gray2 = np.dot(frame2[...,:3], [0.299, 0.587, 0.114])
    
    # Calculate absolute difference
    diff = np.abs(gray1 - gray2)
    
    # Threshold to identify motion
    mask = diff > 10  # Adjust this threshold as needed
    
    # Calculate the percentage of motion in the frame
    total_pixels = gray1.size
    motion_pixels = np.sum(mask)
    motion_percentage = motion_pixels / total_pixels

    if motion_percentage < threshold:
        # If motion is below threshold, return center of frame
        return {"x": frame1.shape[1] // 2, "y": frame1.shape[0] // 2}
    
    # Find coordinates where motion occurred
    coords = np.argwhere(mask)
    
    if len(coords) == 0:
        return {"x": -1, "y": -1}  # No significant motion detected
    
    # Calculate centroid
    x = np.mean(coords[:, 1])
    y = np.mean(coords[:, 0])
    
    return {"x": int(x), "y": int(y)}

@app.route('/frame')
def get_frame():
    # Capture a frame and return as an image response
    frame = capture_frame()
    return Response(frame, mimetype='image/jpeg')

@app.route('/motion')
def get_motion():
    # Capture two successive frames
    frame1 = picam2.capture_array()
    sleep(0.1)  # Small delay to allow for motion
    frame2 = picam2.capture_array()

    # Get the center of motion
    center = get_center_of_motion(frame1, frame2)
    return jsonify(center)

if __name__ == "__main__":
    # Run Flask app on all available IPs (0.0.0.0) and port 5000
    app.run(host='0.0.0.0', port=5000)