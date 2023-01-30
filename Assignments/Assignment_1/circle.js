class circle{
    constructor(){
      this.type = "triangle";
      this.position = [0.0, 0.0, 0.0];
      this.color = [1.0,1.0,1.0,1.0];
      this.size = 5.0;
      this.segments = 10;
    }
  
    render(){
      var xy = this.position;
      var rgba = this.colors;
      var size = this.size;
  
      // gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      gl.uniform1f(u_offset, size);
      // Draw
      // gl.drawArrays(gl.POINTS, 0, 1);
  
      var d = this.size/200.0;
      let angleStep = 360/this.segments;

      for (var angle = 0; angle < 360; angle += angleStep){
        let centerPt = [xy[0], xy[1]];
        let  angle1 = angle;
        let angle2 = angle + angleStep;
        let vec1 = [Math.cos(angle1*Math.PI/180)*d, Math.sin(angle1*Math.PI/180)*d]
        let vec2 = [Math.cos(angle2*Math.PI/180)*d, Math.sin(angle2*Math.PI/180)*d]

        let p1 = [centerPt[0]+vec1[0], centerPt[1]+vec1[1]];
        let p2 = [centerPt[0]+vec2[0], centerPt[1]+vec2[1]];

        drawTriangle([xy[0], xy[1],p1[0], p1[1],p2[0], p2[1]]);
      }
      // renderAllShapes(this.position, this.colors, this.size);
    }
  }