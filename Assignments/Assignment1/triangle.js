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
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.uniform1f(u_offset, size)
    // Draw
    // gl.drawArrays(gl.POINTS, 0, 1);

    var d = this.size/200.0
    console.log(cord);
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