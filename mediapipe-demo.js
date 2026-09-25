document.addEventListener('DOMContentLoaded', () => {
  const videoElement = document.getElementById('demo-video');
  const canvasElement = document.getElementById('demo-canvas');
  const canvasCtx = canvasElement?.getContext('2d');
  const startBtn = document.getElementById('start-demo-btn');
  const demoWrap = document.getElementById('demo-wrap');

  if (!videoElement || !canvasElement || !startBtn) return;

  let camera = null;
  let hands = null;
  let isRunning = false;

  function onResults(results) {
    // Keep canvas size synced to display size
    canvasElement.width = canvasElement.clientWidth;
    canvasElement.height = canvasElement.clientHeight;

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    
    // Mirror the canvas so the webcam feels like a mirror
    canvasCtx.translate(canvasElement.width, 0);
    canvasCtx.scale(-1, 1);
    
    // Draw the image filling the canvas (cover mode)
    const hRatio = canvasElement.width / results.image.width;
    const vRatio = canvasElement.height / results.image.height;
    const ratio  = Math.max(hRatio, vRatio);
    const centerShift_x = (canvasElement.width - results.image.width*ratio) / 2;
    const centerShift_y = (canvasElement.height - results.image.height*ratio) / 2;  
    
    // Dark tint over the video to fit the cyberpunk aesthetic
    canvasCtx.globalAlpha = 0.25;
    canvasCtx.drawImage(results.image, 0, 0, results.image.width, results.image.height,
                        centerShift_x, centerShift_y, results.image.width*ratio, results.image.height*ratio);
    canvasCtx.globalAlpha = 1.0;

    // We must scale the drawing context so the landmarks map to the covered image
    canvasCtx.translate(centerShift_x, centerShift_y);
    canvasCtx.scale(ratio, ratio);

    if (results.multiHandLandmarks) {
      for (const landmarks of results.multiHandLandmarks) {
        // Use custom glowing colors matching the portfolio theme
        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {color: '#6C63FF', lineWidth: 4});
        drawLandmarks(canvasCtx, landmarks, {color: '#00D4FF', lineWidth: 2, radius: 4});
      }
    }
    canvasCtx.restore();
  }

  async function startDemo() {
    if (isRunning) return;
    
    // Make sure we have the MediaPipe libraries loaded from the CDN
    if (typeof Hands === 'undefined') {
      startBtn.innerHTML = "Loading libraries...";
      setTimeout(startDemo, 500);
      return;
    }

    startBtn.innerHTML = "Initializing Models...";
    startBtn.style.pointerEvents = "none";
    
    try {
      hands = new Hands({locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      }});
      
      hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7
      });
      
      hands.onResults(onResults);
      
      camera = new Camera(videoElement, {
        onFrame: async () => {
          await hands.send({image: videoElement});
        },
        width: 640,
        height: 480
      });
      
      await camera.start();
      isRunning = true;
      demoWrap.classList.add('is-running');
      startBtn.style.display = 'none';
      
    } catch (e) {
      console.error(e);
      startBtn.innerHTML = "Camera Error";
      startBtn.style.pointerEvents = "auto";
    }
  }

  startBtn.addEventListener('click', startDemo);
});
