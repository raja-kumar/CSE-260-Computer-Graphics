class triangle{
  constructor(){
    this.type = "triangle";
    this.position = [0.0, 0.0, 0.0];
    this.color = [1.0,1.0,1.0,1.0];
    this.size = 5.0;
    this.coordinates = null;
  }

  render(){
    var xy = this.position;
    var rgba = this.colors;
    var size = this.size;
    var cord = this.coordinates;

    // gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
    // Pass the color of a point to u_FragColor variable
    // gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.uniform1f(u_offset, size)
    // Draw
    // gl.drawArrays(gl.POINTS, 0, 1);

    var d = this.size/200.0
    //console.log(cord);
    if (cord){
      drawTriangle(this.coordinates);
    }
    else{
      drawTriangle([xy[0], xy[1],xy[0]+d, xy[1],xy[0], xy[1]+d]);
    }
    // renderAllShapes(this.position, this.colors, this.size);
  }
}

function drawTriangle(vertices){
  var n = 3; // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  // var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  // if (a_Position < 0) {
  //   console.log('Failed to get the storage location of a_Position');
  //   return -1;
  // }
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  gl.drawArrays(gl.TRIANGLES, 0, n);
}

var g_vertexBuffer=null;
function initTriangle3D(){
  g_vertexBuffer = gl.createBuffer();
  if (!g_vertexBuffer) {
    console.log('Failed to create the vertex buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, g_vertexBuffer);
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

}

function drawTriangle3D(vertices){
  var n = vertices.length/3; // The number of vertices

  if (g_vertexBuffer == null){
    initTriangle3D();
  }

  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER,  new Float32Array(vertices), gl.DYNAMIC_DRAW);

  gl.drawArrays(gl.TRIANGLES, 0, n);
}

function drawTriangle3DUV(vertices, uv){
  var n = 3; // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  var uvBuffer = gl.createBuffer();
  if (!uvBuffer) {
    console.log('Failed to create the buffer object for uv');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);

  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);

  gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_UV);

  gl.drawArrays(gl.TRIANGLES, 0, n);

  g_vertexBuffer = null;
}
// function drawTri3DUVNormal(vertices, uv, normals) {
//   var n = 3; // The number of vertices

//   // Create a vertex buffer object ------------------------
//   var vertexBuffer = gl.createBuffer();
//   if (!vertexBuffer) {
//     console.log('Failed to create the vertex buffer object');
//     return -1;
//   }
//   // Bind the vertex buffer object to target
//   gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
//   // Write date into the vertex buffer object
//   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
//   // Assign the vertex buffer object to a_Position variable
//   gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
//   // Enable the assignment to a_Position variable
//   gl.enableVertexAttribArray(a_Position);

//   // Create a uv buffer object ----------------------------
//   var uvBuffer = gl.createBuffer();
//   if (!uvBuffer) {
//     console.log('Failed to create the uv buffer object');
//     return -1;
//   }
//   // Bind the uv buffer object to target
//   gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
//   // Write date into the uv buffer object
//   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);
//   // Assign the uv buffer object to a_UV variable
//   gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
//   // Enable the assignment to a_UV variable
//   gl.enableVertexAttribArray(a_UV);

//   // Create a normal buffer object ------------------------
//   var normalBuffer = gl.createBuffer();
//   if (!normalBuffer) {
//     console.log('Failed to create the normal buffer object');
//     return -1;
//   }
//   // Bind the normal buffer object to target
//   gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
//   // Write date into the normal buffer object
//   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.DYNAMIC_DRAW);
//   // Assign the normal buffer object to a_Normal variable
//   gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
//   // Enable the assignment to a_UV variable
//   gl.enableVertexAttribArray(a_Normal);

//   // Draw
//   gl.drawArrays(gl.TRIANGLES, 0, n);
// }

function drawTriangle3DUV_Normal(vertices, uv, normals){
  var n = 3; // The number of vertices
  // var n = vertices.length/3;

  // Create a vertex buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  ///// uv buffer assignment
  var uvBuffer = gl.createBuffer();
  if (!uvBuffer) {
    console.log('Failed to create the buffer object for uv');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);

  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);

  gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_UV variable
  gl.enableVertexAttribArray(a_UV);

  // /// normal buffer assignment

  var normalBuffer = gl.createBuffer();
  if (!normalBuffer) {
    console.log('Failed to create the buffer object for normal');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

  // // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.DYNAMIC_DRAW);

  gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);

  // // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Normal);

  gl.drawArrays(gl.TRIANGLES, 0, n);

  g_vertexBuffer = null;
}