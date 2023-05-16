class tth{
    constructor(){
      this.type = "tetrahedron";
    //   this.position = [0.0, 0.0, 0.0];
      this.color = [1.0,1.0,1.0,1.0];
    //   this.size = 5.0;
    //   this.segments = 10;
     this.matrix = new Matrix4();
    }
  
    render(){
      
      var rgba = this.color;
      // Pass the color of a point to u_FragColor variable
      // gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

      // pass the matrix to u_ModelMatrix attriubte
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

      // front of the matrix (face 0)
      drawTriangle3D([0.0,0.0,0.0, 1.0,0.0,0.0, 0.0,1.0,0.0]);

      // gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);

      drawTriangle3D([0.0,0.0,0.0, 0.0,1.0,0.0, 0,0,1]);

      // gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);
      
      drawTriangle3D([0,0,0, 0,0,1, 1,0,0]);

      // gl.uniform4f(u_FragColor, rgba[0]*0.5, rgba[1]*0.5, rgba[2]*0.5, rgba[3]);
      drawTriangle3D([0,0,1, 1,0,0, 0,1,0]);
    // 
      // renderAllShapes(this.position, this.colors, this.size);
    }
  }