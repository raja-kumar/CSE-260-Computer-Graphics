var glb = {}

function main() {  
    // Retrieve <canvas> element

    glb.canvas = document.getElementById('cnv1');

    if (!glb.canvas) { 
      console.log('Failed to retrieve the <canvas> element');
      return false; 
    } 
    var test = "ajcndj"
    // Get the rendering context for 2DCG
    glb.ctx = glb.canvas.getContext('2d');
  
    // Draw a blue rectangle
    glb.ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set color to blue
    glb.ctx.fillRect(0, 0, glb.canvas.width, glb.canvas.height);        // Fill a rectangle with the color
}

function drawVector(v, color){
    glb.ctx.strokeStyle = color;
    let cx = glb.canvas.width/2;
    let cy = glb.canvas.height/2;
    glb.ctx.beginPath(); // Start a new path
    glb.ctx.moveTo(cx, cy); // Move the pen to (30, 50)
    glb.ctx.lineTo((200+v[0]*20), (200-v[1]*20)); // Draw a line to (150, 100)
    glb.ctx.stroke();
}

function handleDrawEvent(){
    let x1 = document.getElementById("x1").value;
    let y1 = document.getElementById("y1").value;

    let x2 = document.getElementById("x2").value;
    let y2 = document.getElementById("y2").value;

    let v1 = new Vector3([x1,y1,0]).elements;
    //v1 = v1.elements
    let v2 = new Vector3([x2, y2, 0]).elements;

    main();

    drawVector(v1, "red");
    drawVector(v2, "blue");

    // console.log(x1)
    // console.log(y1)
    // console.log(x2)
    // console.log(y2)
}

function angleBetween(v1, v2){
    var d = Vector3.dot(v1, v2);
    m1 = v1.magnitude();
    m2 = v2.magnitude();

    var angle = Math.round((Math.acos(d/(m1*m2))*180)/3.1457)

    return angle;
}


function areaTriangle(v1, v2){
    var v3 = Vector3.cross(v1,v2);
    m3 = v3.magnitude();

    return m3/2;
}


function handleDrawOperationEvent(){
    handleDrawEvent()
    let op = document.getElementById("ops").value;
    let s = document.getElementById("scalar").value;

    let x1 = document.getElementById("x1").value;
    let y1 = document.getElementById("y1").value;

    let x2 = document.getElementById("x2").value;
    let y2 = document.getElementById("y2").value;

    // console.log("sa", op);
    let vector1 = new Vector3([x1,y1,0]);
    let v1 = vector1.elements;
    //v1 = v1.elements
    let vector2 = new Vector3([x2, y2, 0]);
    let v2 = vector2.elements;
    
    switch(op){
        case "add":
            vector1.add(vector2);
            // console.log(vector1.elements);
            // console.log("add");
            drawVector(vector1.elements,"green")
            break;
        case "sub":
            vector1.sub(vector2);
            // console.log(vector1.elements);
            // console.log("sub");
            drawVector(vector1.elements, "green")
            break;
        case "mul":
            vector1.mul(s);
            //console.log(vector1.elements);
            vector2.mul(s);
            //console.log(vector2.elements);
            drawVector(vector1.elements, "green")
            drawVector(vector2.elements, "green")
            // console.log(s)
            // console.log("mul");
            break;
        case "div":
            vector1.div(s);
            //console.log(vector1.elements);
            vector2.div(s);
            //console.log(vector2.elements);
            drawVector(vector1.elements, "green")
            drawVector(vector2.elements, "green")
            // console.log(s)
            // console.log("div");
            break;

        case "mag":
            m1 = vector1.magnitude();
            m2 = vector2.magnitude();

            console.log("v1 magnitude:", m1)
            console.log("v2 magnitude:", m2)

            break;

        case "norm":
            vector1.normalize();
            vector2.normalize();
            drawVector(vector1.elements, "green");
            drawVector(vector2.elements, "green");

            // console.log(vector1.elements);
            // console.log(vector2.elements);
            break;
        
        case "angle":
            // var d = Vector3.dot(v1, v2);
            // m1 = vector1.magnitude();
            // m2 = vector2.magnitude();

            // var angle = Math.round((Math.acos(d/(m1*m2))*180)/3.1457)
            var angle = angleBetween(vector1, vector2)
            console.log("Angle:", angle)

            break;
        
        case "area":
            // var v3 = Vector3.cross(v1,v2);
            // m3 = v3.magnitude();
            // console.log(m3);
            area = areaTriangle(vector1, vector2)
            console.log("Area:", area);
            break;

        default:
            console.log("error operation failesxs");
    }
}

  
  