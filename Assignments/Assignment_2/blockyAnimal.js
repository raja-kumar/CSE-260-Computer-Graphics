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
  'uniform mat4 u_ModelMatrix;\n'+
  'uniform mat4 u_GlobalRotateMatrix;\n'+
  'void main() {\n' +
  '  gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;\n' +
  '  gl_PointSize = u_offset;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +  // uniform変数
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';


let g_globalAngle=0;
let g_yellowAngle=0;
let g_mgtAngle=0;
let g_yellowAnimation=false;
let g_mgtAnimation=false;
let g_namasteAnimation=false;
let g_armAngle=0;
let g_handAngle=0;
let g_palmAngle=0;
let g_headAngle=0;
let g_mouseClick=false;
let g_jumpStep=0;
let g_rotateBody=0;
let g_legRotate=0;
let g_handRotate=0;
let g_drag=false;
let origin_x = 400;
let origin_y = 400;
let angle_x = 0;
let angle_y = 0;

// let globalRotMat=new Matrix4().rotate(0,0,0,0);

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

  gl.enable(gl.DEPTH_TEST);
}

function addActionsForHtmlUI(){
  // temp = document.getElementById('camera_angle').value
  // console.log(temp)
  canvas.addEventListener('click', specialAnimation);
  canvas.addEventListener('mousemove', specialAnimation, false);
  // canvas.onmousedown = function(ev){if (ev.shiftKey & ev.type=="click"){g_mouseClick=true}};
  // document.getElementById('animationYellowOn').onclick = function(){g_yellowAnimation=true;};
  // document.getElementById('animationYellowOff').onclick = function(){g_yellowAnimation=false;};
  document.getElementById('namasteOn').onclick = function(){g_namasteAnimation=true;};
  document.getElementById('namasteOff').onclick = function(){g_namasteAnimation=false;};

  // document.getElementById('animationMgtOn').onclick = function(){g_mgtAnimation=true;};
  // document.getElementById('animationMgtOff').onclick = function(){g_mgtAnimation=false;};

  document.getElementById('camera_angle_x').addEventListener('mousemove', function(){angle_x = this.value; renderAllShapes();});
  document.getElementById('camera_angle_y').addEventListener('mousemove', function(){angle_y = this.value; renderAllShapes();});
  // document.getElementById('yellow_angle').addEventListener('mousemove', function(){g_yellowAngle = this.value; renderAllShapes();});
  // document.getElementById('mgt_angle').addEventListener('mousemove', function(){g_mgtAngle = this.value; renderAllShapes();});
}

function specialAnimation(e) {
  if (e.shiftKey & e.type==="click"){
    g_mouseClick=true;
  }
  if(e.type==="click" || e.buttons===1){
    mouse_x = e.clientX;
    mouse_y = e.clientY;
    g_drag = true;
  }
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

  // get the storage location of u_offset. u_offset is the point size
  u_offset = gl.getUniformLocation(gl.program, "u_offset");
  if (!u_offset) {
    console.log('Failed to get the storage location of u_offset');
    return;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix){
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix){
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  console.log("inside connect")

}


function renderAllShapes(){

  // console.log(g_globalAngle)
  tic = performance.now()/1000.0;

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // console.log(g_drag);
  if (g_drag){
    angle_x = ((angle_x + (origin_x - mouse_x))%360)/4;
    angle_y = ((angle_y + (origin_y - mouse_y))%360)/4;
    origin_x = mouse_x;
    origin_x = mouse_y;
    g_drag = false;
    var globalRotMat= new Matrix4().rotate(angle_x, 0, 1, 0).rotate(angle_y, 1, 0, 0);  
  }
  else{
    var globalRotMat= new Matrix4().rotate(angle_x, 0, 1, 0).rotate(angle_y, 1, 0, 0);
    // var globalRotMat = new Matrix4().rotate(g_globalAngle, 0,1,0);
  }
  
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // gl.clear(gl.COLOR_BUFFER_BIT);

  var body = new cube();
  body.color = [185/255,130/255,30/255,1.0];
  body.matrix.translate(g_jumpStep,0,0);
  body.matrix.rotate(g_rotateBody, 0,1,0);
  body.matrix.translate(-0.15,-.1,0);
  // body.matrix.rotate(-5,1,0,0);
  body.matrix.scale(0.3,0.4,0.15);
  var bodyCoordinateMat = new Matrix4(body.matrix);
  body.render();

  var neck = new cube();
  neck.color = [203/255,221/255,223/255,1.0];
  neck.matrix = bodyCoordinateMat;
  neck.matrix.translate(0.4,1,0.3);
  neck.matrix.scale(.25, .25, 0.25);
  var neckCoordinateMat = new Matrix4(neck.matrix);
  neck.render();

  var head = new cube();
  head.color = [203/255,221/255,223/255,1.0]
  head.matrix = neckCoordinateMat;
  head.matrix.translate(-1.5,1,-1);
  head.matrix.rotate(-g_headAngle,1,-0.5,0)
  head.matrix.scale(4,4,3);
  var headCoordinateMat = new Matrix4(head.matrix);
  head.render();

  var left_eye = new cube();
  left_eye.color = [63/255,63/255,63/255,1];
  left_eye.matrix = headCoordinateMat;
  left_eye.matrix.translate(0.2,0.6,-.01);
  left_eye.matrix.scale(0.15,0.15,0.15);
  left_eye.render();

  // var left_eye = new circle();
  // left_eye.matrix = headCoordinateMat;
  // left_eye.matrix.translate(0.2,0.8,-.1);
  // left_eye.matrix.scale(5,5,5);
  // left_eye.render();

  var right_eye = new cube();
  right_eye.color = [63/255,63/255,63/255,1];
  var headCoordinateMat = new Matrix4(head.matrix);
  right_eye.matrix = headCoordinateMat;
  right_eye.matrix.translate(0.6,0.6,-.01);
  right_eye.matrix.scale(0.15,0.15,0.15);
  right_eye.render();

  var mouth = new cube();
  mouth.color = [63/255,63/255,63/255,1];
  var headCoordinateMat = new Matrix4(head.matrix);
  mouth.matrix = headCoordinateMat;
  mouth.matrix.translate(.35,.1,-.01)
  mouth.matrix.scale(0.25,0.25,0.25);
  mouth.render();

  var half_pant = new cube();
  half_pant.color = [0,1,0,1];
  bodyCoordinateMat = new Matrix4(body.matrix);
  half_pant.matrix = bodyCoordinateMat;
  half_pant.matrix.translate(0,-.5,0);
  half_pant.matrix.scale(1,0.5,1);
  // var halfpantCoordinateMat = new Matrix4(half_pant.matrix);
  half_pant.render();

  var leftArm = new cube();
  leftArm.color = [185/255,130/255,30/255,1]; // green
  var bodyCoordinateMat = new Matrix4(body.matrix);
  leftArm.matrix = bodyCoordinateMat;
  leftArm.matrix.translate(-.15,1,0.75);
  leftArm.matrix.rotate(-1*g_armAngle,0,0.2,1);
  leftArm.matrix.rotate(-g_handRotate,0,0.2,1);
  leftArm.matrix.rotate(180,1,0,0);
  leftArm.matrix.scale(.15,0.5,0.5);
  var leftArmCoordinateMat = new Matrix4(leftArm.matrix);
  leftArm.render();

  // console.log("after" , bodyCoordinateMat)
  var leftHand = new cube();
  leftHand.color = [203/255,221/255,223/255,1]; // green
  leftHand.matrix = leftArmCoordinateMat;
  leftHand.matrix.translate(0,1,0);
  leftHand.matrix.rotate(-g_handAngle,0,0,-1);
  leftHand.matrix.scale(1,0.75,1);
  var leftHandCoordinateMat = new Matrix4(leftHand.matrix);
  leftHand.render();

  var leftPalm = new cube();
  leftPalm.color = [230/255,240/255,240/255,1]; 
  leftPalm.matrix = leftHandCoordinateMat;
  leftPalm.matrix.translate(0,1,0);
  leftPalm.matrix.rotate(-g_palmAngle,0,1,1)
  leftPalm.matrix.scale(1,0.33,1);
  leftPalm.render();

  var rightArm = new cube();
  rightArm.color = [185/255,130/255,30/255,1]; // green
  var bodyCoordinateMat = new Matrix4(body.matrix);
  rightArm.matrix = bodyCoordinateMat;
  rightArm.matrix.translate(1,1,0.75);
  rightArm.matrix.rotate(g_armAngle,0,0.2,1);
  rightArm.matrix.rotate(g_handRotate,0,0.2,1);
  rightArm.matrix.rotate(180,1,0,0);
  rightArm.matrix.scale(.15,0.5,0.5);
  var rightArmCoordinateMat = new Matrix4(rightArm.matrix);
  rightArm.render();

  var rightHand = new cube();
  rightHand.color = [203/255,221/255,223/255,1]; // green
  rightHand.matrix = rightArmCoordinateMat;
  rightHand.matrix.translate(0,1,0)
  //rightHand.matrix.rotate(g_armAngle,0,0,1)
  rightHand.matrix.scale(1,0.75,1);
  var rightHandCoordinateMat = new Matrix4(rightHand.matrix);
  rightHand.render();

  var rightPalm = new cube();
  rightPalm.color = [230/255,240/255,240/255,1]; 
  rightPalm.matrix = rightHandCoordinateMat;
  rightPalm.matrix.translate(0,1,0);
  //rightPalm.matrix.rotate(g_palmAngle,1,0.2,0)
  rightPalm.matrix.scale(1,0.33,1);
  rightPalm.render();

  var legLeft = new cube();
  var halfPantCoordinateMat = new Matrix4(half_pant.matrix);
  legLeft.color = [203/255,221/255,223/255,1];
  legLeft.matrix = halfPantCoordinateMat;
  legLeft.matrix.rotate(g_legRotate, 0.2,0,1)
  legLeft.matrix.translate(0.15,-1,.25)
  legLeft.matrix.scale(0.2,1,0.5);
  var leftLegcoordinatemat = new Matrix4(legLeft.matrix);
  legLeft.render();

  var rightLeg = new cube();
  var halfPantCoordinateMat = new Matrix4(half_pant.matrix);
  rightLeg.color = [203/255,221/255,223/255,1];
  rightLeg.matrix = halfPantCoordinateMat;
  rightLeg.matrix.rotate(-g_legRotate, 0.2,0,1)
  rightLeg.matrix.translate(0.65,-1,.25)
  rightLeg.matrix.scale(0.2,1,0.5);
  var rightLegCoordainteMat = new Matrix4(rightLeg.matrix)
  rightLeg.render();

  var footLeft = new tth();
  footLeft.color = [230/255,240/255,240/255,1.0];
  // var halfPantCoordinateMat = new Matrix4(half_pant.matrix);
  footLeft.matrix = leftLegcoordinatemat;
  footLeft.matrix.translate(0.75,0,0.25);
  footLeft.matrix.rotate(180,0,0,1);
  footLeft.matrix.scale(0.5,0.5,0.5);
  footLeft.render();

  var footRight = new tth();
  footRight.color = [230/255,240/255,240/255,1.0];
  // var halfPantCoordinateMat = new Matrix4(half_pant.matrix);
  footRight.matrix = rightLegCoordainteMat;
  footRight.matrix.translate(0.25,0,0.25);
  footRight.matrix.rotate(180,0,1,0);
  footRight.matrix.rotate(180,0,0,1);
  footRight.matrix.scale(0.5,0.5,0.5);
  footRight.render();

  toc = performance.now()/1000.0;
  document.getElementById("fps").innerHTML = 'FPS = ' + Math.round(1 / (toc - tic));
}

var g_startTime=performance.now()/1000.0;
var g_seconds=performance.now()/1000.0-g_startTime;

function tick(){
  // if(g_yellowAngle >89){
  //   return;
  // }

  g_seconds=performance.now()/1000.0-g_startTime;
  // console.log(g_seconds);

  //update animation angels
  updateAnimationAngles();

  // Draw everything
  renderAllShapes();

  //tell the browser to update again
  requestAnimationFrame(tick);
}

function jump(){
  // if(g_yellowAngle >89){
  //   return;
  // }

  g_seconds=performance.now()/1000.0-g_startTime;
  // console.log(g_seconds);

  //update animation angels
  updateAnimationAngles();

  // Draw everything
  renderAllShapes();

  //tell the browser to update again
  requestAnimationFrame(jump);
}

function updateAnimationAngles(){
  if(g_namasteAnimation){
   // for (var i=0; i< 10000; i++){
    g_armAngle = (90*Math.abs(Math.sin(g_seconds)));
    g_handAngle = (145*Math.abs(Math.sin(g_seconds)));
    g_palmAngle = (180*Math.abs(Math.sin(g_seconds)));
    g_headAngle = (60*Math.abs(Math.sin(g_seconds))); 
    // console.log(g_yellowAngle);
    //}
  }
  if(g_mouseClick){
    // g_jumpStep = (0.3*Math.sin(g_seconds*5));
    // g_rotateBody = 60;
    angle_x=0;
    angle_y=0;
    g_handRotate = (180*Math.abs(Math.sin(g_seconds*2)));
    g_legRotate = (20*(Math.sin(g_seconds*5))); 
  }


  // if(g_drag){
  //   angle_x = ((angle_x + (origin_x - mouse_x))%360);
  //   angle_y = ((angle_y + (origin_y - mouse_y))%360);
  //   //document.getElementById("rotation_x").value = parseInt(angle_x);
  //   //document.getElementById("rotation_y").value = parseInt(angle_y);
  //   console.log(angle_x)
  //   origin_x = mouse_x;
  //   origin_x = mouse_y;
  //   drag = false;
  //   globalRotMat.rotate(angle_x, 0, 1, 0).rotate(angle_y, 1, 0, 0);
  // }

}

function handAnimate(){
  for (var i =0; i < 90; i++){
    // updateAnimationAngles(i);
    g_yellowAngle = i;
    // console.log(g_yellowAngle);
    setTimeout(function(){
      renderAllShapes();
    }, 2000); 
  }
}


function main() {
    setupWebGL();
    connectVariablesToGLSL();
    // handleClicks();
    // drawTriangle([0,0.5,-0.5,-0.5,0.5,-0.5]);

    addActionsForHtmlUI();
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear <canvas>

    gl.clear(gl.COLOR_BUFFER_BIT);
    //renderAllShapes();

    requestAnimationFrame(tick);
    
    // renderAllShapes();
}









