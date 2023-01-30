class point{
    constructor(){
        this.position = [0.0, 0.0, 0.0];  // The array for the position of a mouse press
        this.colors = [1.0,1.0,1.0];  // The array to store the color of a point
        this.size = 5.0;
    }

    render(){
            var xy = this.position;
            var rgba = this.colors;
            var size = this.size;

            gl.disableVertexAttribArray(a_Position);
            gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
            // Pass the color of a point to u_FragColor variable
            gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
            gl.uniform1f(u_offset, size)
            // Draw
             gl.drawArrays(gl.POINTS, 0, 1);
             //drawTriangle([xy[0], xy[1],xy[0]+0.1, xy[1],xy[0], xy[1]+0.1]);
            // renderAllShapes(this.position, this.colors, this.size);
    }
}