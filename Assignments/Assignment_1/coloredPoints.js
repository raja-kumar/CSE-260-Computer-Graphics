// ColoredPoint.js (c) 2012 matsuda


// ---------------------------------------

/* things to improve:
- clear button
- how to lift the mouse.
- why do we need the for loop in click
*/

// ---------------------------------------

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
    // gl = getWebGLContext(canvas);
    gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
}


function handleClicks(){
    canvas.onmousedown = function(ev){ click(ev, gl, canvas, a_Position, u_FragColor) };
    console.log("inside click")
    canvas.onmousemove = function(ev){if(ev.buttons==1) {click(ev, gl, canvas, a_Position, u_FragColor) }}
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
  //if (!u_offset) {
    //console.log('Failed to get the storage location of u_offset');
    //return;
  //}


  console.log("inside connect")

}


function renderAllShapes(){
    // Pass the position of a point to a_Position variable
    var len = shapeList.length;
  for(var i = 0; i < len; i++) {
    var xy = shapeList[i].position;
    var rgba = shapeList[i].colors;
    var curr_size = shapeList[i].size;
    
  
    gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.uniform1f(u_offset, curr_size)
    // Draw
    gl.drawArrays(gl.POINTS, 0, 1);
  }
    
}

const POINT=0;
const TRIANGLE=1;
const CIRCLE=2;

shapeList = []
let g_selectedType = POINT;

function click(ev, gl, canvas, a_Position, u_FragColor) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

// Store the coordinates to g_points array
  var r = document.getElementById("redS").value/20;
  var g = document.getElementById("greenS").value/20;
  var b = document.getElementById("blueS").value/20;
  var size = document.getElementById("size").value;
  var seg = document.getElementById("seg_count").value;

  document.getElementById("point").onclick = function(){g_selectedType = POINT};
  document.getElementById("triangle").onclick = function(){g_selectedType = TRIANGLE};
  document.getElementById("circle").onclick = function(){g_selectedType = CIRCLE};

  if (g_selectedType == POINT){
    curr_point = new point();
  }
  else if(g_selectedType == CIRCLE){
    curr_point = new circle();
    curr_point.segments = seg;
  }
  else{
    curr_point = new triangle();
  }

  // console.log(g_selectedType)
  
  curr_point.position = [x,y];
  curr_point.colors = [r,g,b,1.0];
  curr_point.size = size;

  shapeList.push(curr_point);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // curr_point.render();

  var len = shapeList.length;
  for(var i = 0; i < len; i++) {
    shapeList[i].render();
    }
}

function clearCanvas(){
    gl.clear(gl.COLOR_BUFFER_BIT);
    shapeList = [];
    renderAllShapes();
}


function draw_helper(vertices, color){
  let scale = 10;
  let len1 = vertices.length;

  for (var i=0; i<len1; i++){
    curr_vert = vertices[i];
    for (var j =0; j <6; j++){
      curr_vert[j] = curr_vert[j]/scale;
    }
    console.log(curr_vert);
    curr_triangle = new triangle();
    curr_triangle.position = curr_vert;
    curr_triangle.colors = color;
    curr_triangle.coordinates = curr_vert;
    // console.log(curr_triangle)
    curr_triangle.render();
  }

}


function drawing(){

  clearCanvas();
  // blue_vertices = [[4,0,5,-1,5,1],[1,-1,-1,-3,-2,2],[1,1,-1,3,-2,2],[2,4,-1,3,0,2], [2,-4,0,-2,-1,-3],[-2,-2,-2,2,-5,0]];
  // red_vertices = [[4,0,-2,2,-2,-2]];
  center_vertices = [[-0.05,4.5,0.05,4.5,0,5],[-0.25,5,0.25,5,0,5.25],[-0.05,5.25,0.05,5.25,0,5.50],[-0.375,5.5,0.375,5.5,0,6.0],[-0.05,6.0,0.05,6.0,0,6.25],[-0.25,6.25,0.25,6.25,0,6.75],[0,4.5,-0.5,4,0.5,4],[-0.5,4,0.5,4,-2,2], [0.5,4,-2,2,2,2],[-2,2,2,2,-2,0],[2,2,-2,0,2,0],[-2,0,2,0,-2,-5], [2,0,-2,-5,2,-5]]
  gate_vertices = [[0,-1,-1,-2,1,-2], [-1,-2,1,-2,-1,-5],[1,-2,-1,-5,1,-5]];
  left_vertices = [[-3.05,1.5,-2.95,1.5,-3.0,2.0],[-3.25,2.0,-2.75,2.0,-3.0,2.25],[-3,1.5,-3.25,1.0,-2.75,1.0], [-3.25,1.0,-2.75,1.0,-4,0.75],[-2.75,1.0,-4,0.75,-2,0.75],[-4,0.75,-2,0.75,-2,0],[-4,0.75,-2,0,-4,0],[-2,0,-4,0,-4,-5],[-2,0,-4,-5,-2,-5]]
  left_left = [[-4,-1,-6,-1.5,-4,-1.5],[-6,-1.5,-4,-1.5,-6,-5],[-4,-1.5,-6,-5, -4,-5]]
  right_vertices = [[-3.05*-1,1.5,-2.95*-1,1.5,-3.0*-1,2.0],[-3.25*-1,2.0,-2.75*-1,2.0,-3.0*-1,2.25],[-3*-1,1.5,-3.25*-1,1.0,-2.75*-1,1.0], [-3.25*-1,1.0,-2.75*-1,1.0,-4*-1,0.75],[-2.75*-1,1.0,-4*-1,0.75,-2*-1,0.75],[-4*-1,0.75,-2*-1,0.75,-2*-1,0],[-4*-1,0.75,-2*-1,0,-4*-1,0],[-2*-1,0,-4*-1,0,-4*-1,-5],[-2*-1,0,-4*-1,-5,-2*-1,-5]]
  right_right = [[-4*-1,-1,-6*-1,-1.5,-4*-1,-1.5],[-6*-1,-1.5,-4*-1,-1.5,-6*-1,-5],[-4*-1,-1.5,-6*-1,-5, -4*-1,-5]]

  right_pillar = [[8.75,1.75,8.25,1.75,8.5,2.25],[8,1.5,9,1.5,8.75,1.75],[8,1.5,8.75,1.75,8.25,1.75],[8,0,9,0,9,1.5],[8,0,9,1.5,8,1.5],[8,0,9,0,7.25,-5],[9,0,7.25,-5,9.75,-5]]
  left_pillar = [[8.75*-1,1.75,8.25*-1,1.75,8.5*-1,2.25],[8*-1,1.5,9*-1,1.5,8.75*-1,1.75],[8*-1,1.5,8.75*-1,1.75,8.25*-1,1.75],[8*-1,0,9*-1,0,9*-1,1.5],[8*-1,0,9*-1,1.5,8*-1,1.5],[8*-1,0,9*-1,0,7.25*-1,-5],[9*-1,0,7.25*-1,-5,9.75*-1,-5]]

  // var r = document.getElementById("redS").value/20;
  // var g = document.getElementById("greenS").value/20;
  // var b = document.getElementById("blueS").value/20;

  draw_helper(center_vertices, [163/255, 194/255, 194/255,1.0]);
  // draw_helper(center_vertices, [r,g,b,1.0]);
  draw_helper(gate_vertices, [64/255, 64/255, 64/255, 1]);
  draw_helper(left_vertices, [163/255, 194/255, 194/255,1.0]);
  draw_helper(left_left, [163/255, 194/255, 194/255,1.0]);
  draw_helper(right_vertices, [163/255, 194/255, 194/255,1.0]);
  draw_helper(right_right, [163/255, 194/255, 194/255,1.0])
  draw_helper(right_pillar, [163/255, 194/255, 194/255,1.0])
  draw_helper(left_pillar, [163/255, 194/255, 194/255,1.0])

  // let len1 = center_vertices.length;
  // let len2 = gate_vertices.length;

  // var scale = 10.0;
  // // var offset = 8.0;
  // // let len2 = red_vertices.length;

  // for (var i=0; i<len1; i++){
  //   curr_vert = center_vertices[i];
  //   for (var j =0; j <6; j++){
  //     curr_vert[j] = curr_vert[j]/scale;
  //   }
  //   console.log(curr_vert);
  //   curr_triangle = new triangle();
  //   curr_triangle.position = curr_vert;
  //   curr_triangle.colors = [163/255, 194/255, 194/255,1.0];
  //   curr_triangle.coordinates = curr_vert;
  //   // console.log(curr_triangle)
  //   curr_triangle.render();
  // }

  // for (var i=0; i<len2; i++){
  //   curr_vert = gate_vertices[i];
  //   for (var j =0; j <6; j++){
  //     curr_vert[j] = curr_vert[j]/scale;
  //   }
  //   curr_triangle = new triangle();
  //   curr_triangle.position = curr_vert;
  //   curr_triangle.colors = [1.0,0.0,0.0,1.0];
  //   curr_triangle.coordinates = curr_vert;
  //   // console.log(curr_triangle)
  //   curr_triangle.render();
  // }
}

function main() {
    setupWebGL();
    connectVariablesToGLSL();
    handleClicks();
    // drawTriangle([0,0.5,-0.5,-0.5,0.5,-0.5]);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear <canvas>
    
    gl.clear(gl.COLOR_BUFFER_BIT);
}









