class cube{
    constructor(){
      this.type = "cube";
    //   this.position = [0.0, 0.0, 0.0];
      this.color = [1.0,0,0,1.0];
    //   this.size = 5.0;
    //   this.segments = 10;
     this.matrix = new Matrix4();
     this.textureNum = -1;
     this.cubeVertices = new Float32Array([
      0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0,
      0.0,0.0,0.0, 0.0,1.0,0.0, 1.0,1.0,0.0,
      0,1,0, 0,1,1, 1,1,1,
      0,1,0, 1,1,1, 1,1,0,
      0,1,0, 0,1,1, 0,0,1,
      0,1,0, 0,0,1, 0,0,0,
      1,1,0, 1,1,1, 1,0,1,
      1,1,0, 1,0,1, 1,0,0,
      0,1,1, 1,1,1, 0,0,1,
      1,1,1, 0,0,1, 1,0,1,
      0,0,0, 1,0,0, 0,0,1,
      1,0,0, 0,0,1, 1,0,1
     ]);
    }
  
    render(){
      
      var rgba = this.color;
      // Pass the color of a point to u_FragColor variable

      // pass the texture number 
      gl.uniform1i(u_whichTexture, this.textureNum)

      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

      // pass the matrix to u_ModelMatrix attriubte
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

      // front of the matrix (face 0)
      // drawTriangle3D([0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0]);
      // drawTriangle3D([0.0,0.0,0.0, 0.0,1.0,0.0, 1.0,1.0,0.0]);
      drawTriangle3DUV([0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0], [0,0, 1,1, 1,0]);
      drawTriangle3DUV([0.0,0.0,0.0, 0.0,1.0,0.0, 1.0,1.0,0.0], [0,0, 0,1, 1,1]);

      // gl.uniform4f(u_FragColor, 0.1, 0.1, 0.1, rgba[3]);
      // top of the matrix (face 1)
      // drawTriangle3D([0,1,0, 0,1,1, 1,1,1]);
      // drawTriangle3D([0,1,0, 1,1,1, 1,1,0]);
      drawTriangle3DUV([0,1,0, 0,1,1, 1,1,1], [0,0, 1,0, 1,1]);
      drawTriangle3DUV([0,1,0, 1,1,1, 1,1,0], [0,0, 1,1, 0,1]);

      // gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);
      // left face 2
      // drawTriangle3D([0,1,0, 0,1,1, 0,0,1]);
      // drawTriangle3D([0,1,0, 0,0,1, 0,0,0]);
      drawTriangle3DUV([0,1,0, 0,1,1, 0,0,1], [0,0, 1,0, 1,1]);
      drawTriangle3DUV([0,1,0, 0,0,1, 0,0,0], [0,0, 1,1, 0,1]);

      // right face 3
      // gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);
      // drawTriangle3D([1,1,0, 1,1,1, 1,0,1]);
      // drawTriangle3D([1,1,0, 1,0,1, 1,0,0]);
      drawTriangle3DUV([1,1,0, 1,1,1, 1,0,1], [0,0, 1,0, 1,1]);
      drawTriangle3DUV([1,1,0, 1,0,1, 1,0,0], [0,0, 1,1, 0,1]);

      // front
      // gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);
      // drawTriangle3D([0,1,1, 1,1,1, 0,0,1]);
      // drawTriangle3D([1,1,1, 0,0,1, 1,0,1]);
      drawTriangle3DUV([0,1,1, 1,1,1, 0,0,1],[1,0, 0,0, 1,1]);
      drawTriangle3DUV([1,1,1, 0,0,1, 1,0,1], [0,0, 1,1, 0,1]);

      // bottom
      // gl.uniform4f(u_FragColor, 1, 1, 1, rgba[3]);
      // gl.uniform4f(u_FragColor, 0.2, 0.2, 0.2, rgba[3]);
      // drawTriangle3D([0,0,0, 1,0,0, 0,0,1]);
      // drawTriangle3D([1,0,0, 0,0,1, 1,0,1]);
      drawTriangle3DUV([0,0,0, 1,0,0, 0,0,1], [1,0, 0,0, 1,1]);
      drawTriangle3DUV([1,0,0, 0,0,1, 1,0,1], [0,0, 1,1, 0,1]);

    // 
    }

    renderFaster(){
      
      var rgba = this.color;
      // Pass the color of a point to u_FragColor variable

      // pass the texture number 
      gl.uniform1i(u_whichTexture, this.textureNum)

      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

      // pass the matrix to u_ModelMatrix attriubte
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

      if (g_vertexBuffer==null){
        // console.log("no buffer before")
        initTriangle3D();
      }

      gl.bufferData(gl.ARRAY_BUFFER, this.cubeVertices, gl.DYNAMIC_DRAW);

      // drawTriangle3D(this.cubeVertices);

      gl.drawArrays(gl.TRIANGLES, 0, 36)
    }
  }