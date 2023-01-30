// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform float u_offset;\n'+
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = u_offset;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +  // uniform変数
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';

function setupWebGL(){
    console.log("inside setup webgl");
    canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
    gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
}

function handleClicks(){
    canvas.onmousedown = function(ev){ click(ev, gl, canvas, a_Position, u_FragColor) };
    console.log("inside click")
}

function connectVariablesToGLSL(){
    // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
   u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_offset = gl.getUniformLocation(gl.program, "u_offset");

  console.log("inside connect")

}

function renderAllShapes(xy, rgba, size){
    // Pass the position of a point to a_Position variable
    gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.uniform1f(u_offset, size)
    // Draw
    gl.drawArrays(gl.POINTS, 0, 1);
    
}

function main() {
  // Retrieve <canvas> element

  setupWebGL();
  connectVariablesToGLSL();
  // Register function (event handler) to be called on a mouse press
  handleClicks();

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_points = [];  // The array for the position of a mouse press
var g_colors = [];  // The array to store the color of a point
var g_sizes = [];

function click(ev, gl, canvas, a_Position, u_FragColor) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  // Store the coordinates to g_points array
  g_points.push([x, y]);
  var r = document.getElementById("redS").value/20;
  var g = document.getElementById("greenS").value/20;
  var b = document.getElementById("blueS").value/20;
  var size = document.getElementById("size").value;

  // Store the coordinates to g_points array
  /*if (x >= 0.0 && y >= 0.0) {      // First quadrant
    g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
  } else if (x < 0.0 && y < 0.0) { // Third quadrant
    g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
  } else {                         // Others
    g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
  }*/
  g_sizes.push(size);
  g_colors.push([r,g,b,1.0]);
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_points.length;
  for(var i = 0; i < len; i++) {
    var xy = g_points[i];
    var rgba = g_colors[i];
    var curr_size = g_sizes[i];
    renderAllShapes(xy, rgba,curr_size);
  }
}