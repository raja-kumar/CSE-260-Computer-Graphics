var glb = {}

function main() {  
    // Retrieve <canvas> element

    glb.canvas = document.getElementById('webgl');

    if (!glb.canvas) { 
      console.log('Failed to retrieve the <canvas> element');
      return false; 
    } 
    var test = "ajcndj"
    // Get the rendering context for 2DCG
    glb.ctx = glb.canvas.getContext('2d');
  
    // Draw a blue rectangle
    glb.ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set color to blue
    glb.ctx.fillRect(0, 0, glb.canvas.width, glb.canvas.height);        // Fill a rectangle with the color
}