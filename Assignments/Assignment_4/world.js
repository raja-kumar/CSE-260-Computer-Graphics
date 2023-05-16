// ColoredPoint.js (c) 2012 matsuda


// ---------------------------------------

var VSHADER_SOURCE =`
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec3 a_Normal;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
    v_Normal = a_Normal;
    v_VertPos = u_ModelMatrix * a_Position;
  }
`

var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform sampler2D u_Sampler3;
  uniform int u_whichTexture;
  uniform vec3 u_lightPos;
  uniform vec3 u_cameraPos;
  uniform bool u_lightOn;
  varying vec4 v_VertPos;
  void main() {
    if (u_whichTexture == -3){
      gl_FragColor = vec4((v_Normal+1.0)/2.0,1.0);
    }
    else if (u_whichTexture == -2){
      gl_FragColor = u_FragColor;
    } else if (u_whichTexture == -1) {
      gl_FragColor = vec4(v_UV, 1,1);
    } else if(u_whichTexture == 0){
      gl_FragColor = texture2D(u_Sampler0, v_UV);
    } else if(u_whichTexture == 1){
      gl_FragColor = texture2D(u_Sampler1, v_UV);
    }else if(u_whichTexture == 2){
      gl_FragColor = texture2D(u_Sampler2, v_UV);
    } else if(u_whichTexture == 3){
      gl_FragColor = texture2D(u_Sampler3, v_UV);
    }else{
      gl_FragColor = vec4(1,0.2,0.2,1);
    }

    vec3 lightVector = u_lightPos - vec3(v_VertPos);
    float r=length(lightVector);
    
    // if (r <1.0){
    //   gl_FragColor = vec4(1,0,0,1);
    // } else if(r < 2.0){
    //   gl_FragColor = vec4(0,1,0,1);
    // }

    // gl_FragColor = vec4(vec3(gl_FragColor)/(r*r),1);

    vec3 L = normalize(lightVector);
    vec3 N = normalize(v_Normal);
    float nDotL = max(dot(N,L), 0.0);

    // reflection
    vec3 R = reflect(L,N);

    //eye 
    vec3 E = normalize(u_cameraPos-vec3(v_VertPos));

    //specular
    float specular = pow(max(dot(E,R),0.0),10.0);

    vec3 diffuse = vec3(gl_FragColor)*nDotL*0.7;
    vec3 ambient = vec3(gl_FragColor)*0.3;

    if (u_lightOn){
      gl_FragColor = vec4(specular+diffuse+ambient, 1.0);
      // if(u_whichTexture == 0){
      //   gl_FragColor = vec4(specular+diffuse+ambient, 1.0);
      // }
      // else{
      //   gl_FragColor = vec4(diffuse+ambient, 1.0);
      // }
    }
    
    // gl_FragColor = vec4(diffuse+ambient, 1.0);
  }
`

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

// variables for asg3

let a_UV;
let u_Sampler0;
let u_whichTexture;
let u_ViewMatrix;
let u_Sampler1;
let u_Sampler2;
let u_Sampler3;

// variables for asg4
let a_Normal;
let g_normalOn = false;
let g_lightPos=[0,1,-2];
let u_cameraPos;
let g_lightOn=true;
let g_moveLight=true;

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

  document.getElementById('normalOn').onclick = function(){g_normalOn = true};
  document.getElementById('normalOff').onclick = function(){g_normalOn = false};
  document.getElementById('lightOn').onclick = function(){g_lightOn = true};
  document.getElementById('lightOff').onclick = function(){g_lightOn = false};
  document.getElementById('movelightOn').onclick = function(){g_moveLight = true};
  document.getElementById('movelightOff').onclick = function(){g_moveLight = false};

  document.getElementById('namasteOn').onclick = function(){g_namasteAnimation=true;};
  document.getElementById('namasteOff').onclick = function(){g_namasteAnimation=false;};

  // document.getElementById('animationMgtOn').onclick = function(){g_mgtAnimation=true;};
  // document.getElementById('animationMgtOff').onclick = function(){g_mgtAnimation=false;};

  document.getElementById('camera_angle_x').addEventListener('mousemove', function(){angle_x = this.value; renderAllShapes();});
  document.getElementById('camera_angle_y').addEventListener('mousemove', function(){angle_y = this.value; renderAllShapes();});

  document.getElementById('lightSlideX').addEventListener('mousemove', function(ev){if (ev.buttons==1) {g_lightPos[0] = this.value/100; renderAllShapes();}});
  document.getElementById('lightSlideY').addEventListener('mousemove', function(ev){if(ev.buttons==1){g_lightPos[1] = this.value/100; renderAllShapes();}});
  document.getElementById('lightSlideZ').addEventListener('mousemove', function(ev){if(ev.buttons==1){g_lightPos[2] = this.value/100; renderAllShapes();}});


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

  // // Get the storage location of a_UV
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  // Get the storage location of u_FragColor
   u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // get the storage location of u_offset. u_offset is the point size
  // u_offset = gl.getUniformLocation(gl.program, "u_offset");
  // if (!u_offset) {
  //   console.log('Failed to get the storage location of u_offset');
  //   return;
  // }

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


  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return false;
  }

  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return false;
  }

  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler2) {
    console.log('Failed to get the storage location of u_Sampler2');
    return false;
  }

  u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
  if (!u_Sampler3) {
    console.log('Failed to get the storage location of u_Sampler3');
    return false;
  }

  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if (a_Normal < 0) {
    console.log('Failed to get the storage location of a_Normal');
    return false;
  }

  u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
  if(!u_lightPos){
    console.log('failed to get the storage location of u_lightPos');
    return;
  }

  u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
  if(!u_cameraPos){
    console.log('failed to get the storage location of u_cameraPos');
    return;
  }

  u_lightOn = gl.getUniformLocation(gl.program, 'u_lightOn');
  if(!u_lightOn){
    console.log('failed to get the storage location of u_lightOn');
    return;
  }


  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get the storage location of u_whichTexture');
    return false;
  }

  
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return false;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return false;
  }

  console.log("inside connect")

}

function initTextures() {

  var image = new Image();  // Create the image object
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }

  // Register the event handler to be called on loading an image
  image.onload = function(){ sendImageToTEXTURE0( image); };
  // Tell the browser to load an image
  image.src = 'pink_sky_512.jpeg';

  var image1 = new Image();  // Create the image object
  if (!image1) {
    console.log('Failed to create the image1 object');
    return false;
  }

  // // Register the event handler to be called on loading an image
  image1.onload = function(){ sendImageToTEXTURE1( image1); };
  // Tell the browser to load an image
  image1.src = 'grass_256.jpeg';

  var image2 = new Image();  // Create the image object
  if (!image2) {
    console.log('Failed to create the image2 object');
    return false;
  }

  // // Register the event handler to be called on loading an image
  image2.onload = function(){ sendImageToTEXTURE2( image2); };
  // Tell the browser to load an image
  image2.src = 'trunk_256.jpeg';

  var image3 = new Image();  // Create the image object
  if (!image3) {
    console.log('Failed to create the image3 object');
    return false;
  }

  // // Register the event handler to be called on loading an image
  image3.onload = function(){ sendImageToTEXTURE3( image3); };
  // Tell the browser to load an image
  image3.src = 'chess_board.jpeg';

  return true;
}

function sendImageToTEXTURE0( image) {

  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler0, 0);
  
  // gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
}


function sendImageToTEXTURE1( image) {

  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE1);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler1, 1);
  
  // gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
}

function sendImageToTEXTURE2( image) {

  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE2);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler2, 2);
  
  // gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
}


function sendImageToTEXTURE3( image) {

  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE3);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler3, 3);
  
  // gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
}

// var g_eye=[0,0,-2];
// var g_at=[0,0,100];
// var g_up=[0,1,0];

var g_camera = new Camera();
// g_eye = g_camera.eye.elements;
// g_at = g_camera.at.elements;
// g_up = g_camera.up.elements;

var g_map = [
  [12,24],
  [24,24],
  [18,24],
  [24,18],
  [12,12],
  [24,12],
  [18,12],
  [14,24],
  [24,14]
];

var world_shape = 32;


function drawmap(){
  // var box = new cube();
  for (var x=0;x<world_shape;x++){
    for(var y=0;y<world_shape;y++){
      if (x == 0 || y == 0 || x == world_shape-1 || y == world_shape-1){
        var box = new cube();
        box.color = [94/255, 86/255, 85/255,1.0];
        box.textureNum = -2;
        box.matrix.translate(x-world_shape/2,-0.75,y-world_shape/2);
        box.matrix.scale(1,1,1);
        // box.renderFaster();
        // box.render();
      }
    }
  }


  for (var j = 0; j < g_map.length; j++){

    var t1_x = g_map[j][0]
    var t1_y = g_map[j][1]

    var trunk = new cube();
    trunk.color = [1, 0, 0,1.0];
    trunk.textureNum = 2;
    trunk.matrix.translate(t1_x-world_shape/2,-0.75,t1_y-world_shape/2);
    trunk.matrix.scale(0.2,2,0.2);
    //box.renderFaster();
    trunk.render();

    var leaves = new cube();
    leaves.color = [0,1,0,1.0];
    leaves.textureNum = 3;
    leaves.matrix.translate((t1_x-world_shape/2)-0.15,1.25,(t1_y-world_shape/2)-0.15);
    leaves.matrix.scale(0.5,0.5,0.5);
    //box.renderFaster();
    leaves.render();


  }
  
}


function renderAllShapes(){

  // console.log(g_globalAngle)
  tic = performance.now()/1000.0;

  // passs the projection matrix
  var projMat = new Matrix4();
  // (angle, aspect ratio, near plane, far plane)
  projMat.setPerspective(60, canvas.width/canvas.height, .1, 100) // this is roughly the perspective like view angle near point far point etc
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements)

  // pass the view matrix
  var viewMat = new Matrix4()
  // (eye, at, up)
  viewMat.setLookAt(g_camera.eye.elements[0],g_camera.eye.elements[1],g_camera.eye.elements[2], g_camera.at.elements[0],g_camera.at.elements[1],g_camera.at.elements[2], g_camera.up.elements[0], g_camera.up.elements[1],g_camera.up.elements[2]);
  // viewMat.setLookAt(g_eye[0],g_eye[1],g_eye[2], g_at[0],g_at[1],g_at[2], g_up[0], g_up[1],g_up[2]);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements)

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // drawmap();


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

  // pass the light position to GLSL
  gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);

  //pass the lighton variable to GLSL
  gl.uniform1i(u_lightOn, g_lightOn);

  //pass camera poistion to glsl
  // gl.uniform3f(u_cameraPos, g_camera.eye.x, g_camera.eye.y, g_camera.eye.z);

  // gl.clear(gl.COLOR_BUFFER_BIT);

  // draw the light source
  var light = new cube();
  light.color = [2,2,0,1];
  light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  light.matrix.scale(-.05,-.05,-.05);
  light.matrix.translate(-0.5,-0.5,-0.5);
  light.render();

  //draw the sphere

  var sph = new sphere();
  if (g_normalOn){sph.textureNum=-3}
  sph.matrix.translate(1.0,0.3,0);
  sph.matrix.scale(0.5,0.5,0.5);
  sph.render();

  // Draw the floor
  var floor = new cube();
  floor.color = [3/255, 135/255, 58/255,1.0];
  // if (g_normalOn){
  //   floor.textureNum = -3
  // }
  // else{
  //   floor.textureNum = 1;
  // }
   floor.textureNum = 1;
  
  floor.matrix.translate(0,-0.75,0);
  // body.matrix.rotate(g_rotateBody, 0,1,0);
  floor.matrix.scale(world_shape,0.01,world_shape);
  // body.matrix.rotate(-5,1,0,0);
  floor.matrix.translate(-0.5,0,-0.5);
  // var bodyCoordinateMat = new Matrix4(body.matrix);
  // floor.renderFaster();
  floor.render();

  // // Draw the sky
  var sky = new cube();
  sky.color = [185/255,130/255,30/255,1.0];
  if (g_normalOn){
    sky.textureNum = -3
  }
  else{
    sky.textureNum = 0;
  }
  // sky.textureNum = 0;
  //sky.matrix.translate(0,-0.75,0);
  // body.matrix.rotate(g_rotateBody, 0,1,0);
  sky.matrix.scale(-15,-15,-15);
  // body.matrix.rotate(-5,1,0,0);
  sky.matrix.translate(-0.5,-.5,-0.5);
  // var bodyCoordinateMat = new Matrix4(body.matrix);
  // sky.renderFaster();
  sky.render();

  // drawmap();



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

  if (g_moveLight){
    g_lightPos[0] = Math.cos(g_seconds);
    g_lightPos[1] = Math.sin(g_seconds);
  }


  // g_lightPos[2] = Math.cos(g_seconds);

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

function keydown(ev){
  if (ev.keyCode==87){ // w
    g_camera.forward();
    //console.log(g_camera)
  }else if (ev.keyCode == 83){ // s
    g_camera.back();
    // g_eye[2] -= 0.2
  }else if (ev.keyCode == 65){ // a
    // g_eye[0] -= 0.2
    g_camera.left();
  }else if (ev.keyCode == 68){ // d
    // g_eye[0] += 0.2
    g_camera.right();
  }else if (ev.keyCode == 81){ // q
    // g_at[0] += 0.5
    g_camera.at.elements[0] += 0.5
  }else if (ev.keyCode == 69){ // e
    // g_at[0] -= 0.5
    g_camera.at.elements[0] -= 0.5
  }

  renderAllShapes();
  console.log(ev.keyCode);
}


function main() {
    setupWebGL();
    connectVariablesToGLSL();
    // handleClicks();
    // drawTriangle([0,0.5,-0.5,-0.5,0.5,-0.5]);

    addActionsForHtmlUI();

    document.onkeydown = keydown;

    //intialize the texture
    initTextures()

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear <canvas>

    gl.clear(gl.COLOR_BUFFER_BIT);
    //renderAllShapes();

    requestAnimationFrame(tick);
    
    // renderAllShapes();
}









