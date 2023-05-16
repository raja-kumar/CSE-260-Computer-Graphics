function add(vec1, vec2) {
    // Insert your code here.
    // This function should change this vector (this.elements) and not create a new vector.
    var res_vec,i;
    res_vec = new Vec3([0,0,0]);
    // res_vec = vec1.elements;
    // other = other.elements;

    for (i=0;i<3;i++){
      res_vec.elements[i] = vec2.elements[i] + vec1.elements[i];
    }

    // this.elements = res_vec
    // Don't delete the return statement.
    return res_vec;
}

function sub(vec1, vec2) {
    // Insert your code here.
    // This function should change this vector (this.elements) and not create a new vector.
    var res_vec,i;
    res_vec = new Vec3([0,0,0]);
    // res_vec = vec1.elements;
    // other = other.elements;

    for (i=0;i<3;i++){
      res_vec.elements[i] = vec2.elements[i] - vec1.elements[i];
    }

    // this.elements = res_vec
    // Don't delete the return statement.
    return res_vec;
}

function magnitude(vec) {
    // Insert your code here.
    let m = 0; // Modify this line to calculate this vector's magnitude.
    var i;
    for (i=0;i<3;i++){
      m += vec.elements[i]*vec.elements[i]
    }

    m = Math.sqrt(m)

    // Don't delete the return statement.
    return m;
}

function div(vec, scalar) {
    // Insert your code here.
    // This function should change this vector (this.elements) and not create a new vector.
    var res_vec,i;
    res_vec = new Vec3([0,0,0]);

    for (i=0;i<3;i++){
      res_vec.elements[i] =  vec.elements[i]/scalar;
    }

    // this.elements = res_vec;
    // Don't delete the return statement.
    return res_vec;
};

function dot(other1, other2) {
    // Insert your code here.
    let d = 0; // Modify this line to calculate this vector's magnitude.
    var i;
    other1 = other1.elements;
    other2 = other2.elements;

    for (i=0;i<3;i++){
      d += other1[i]*other2[i]
    }

    // Don't delete the return statement.
    return d;
}

function cross(other1, other2) {
    // Insert your code here.
    // This function should create and return a new vector.
    other1 = other1.elements;
    other2 = other2.elements;
    
    var x1 = (other1[1]*other2[2]) - (other1[2]*other2[1]);
    var y1 = (other1[2]*other2[0]) - (other1[0]*other2[2]);
    var z1 = (other1[0]*other2[1]) - (other1[1]*other2[0]);

    let v3 = new Vector3([x1,y1,z1]); // Modify this line to calculate cross product between other1 and other2.

    // Don't delete the return statement.
    return v3;
}


class Camera{
    constructor(){
        this.eye=new Vec3([0,0,-4]);
        this.at=new Vec3([0,0,16]);
        this.up=new Vec3([0,1,0])
    }



    forward(){
        var f = sub(this.eye, this.at);
        // console.log('f', f)
        var m = magnitude(f);
        f = div(f,m);
        this.at = add(this.at, f);
        this.eye = add(this.eye, f);
        // console.log('at', this.at)
        // console.log('eye', this.eye)
    }

    back(){
        var f = sub(this.at, this.eye);
        var m = magnitude(f);
        f = div(f,m);
        this.at = add(this.at, f);
        this.eye = add(this.eye, f);
        // console.log('at', this.at)
        // console.log('eye', this.eye)
    }

    right(){
        // var f = this.eye.subtract(this.at);
        var f = sub(this.eye, this.at);
        // f = f.divide(f.length());
        var m = magnitude(f);
        f = div(f,m);
        // var s=f.cross(this.up);
        var s = cross(f, this.up)
        // s = s.divide(s.length);
        var m2 = magnitude(s)
        s = div(s,m)

        // this.at=this.at.add(s);
        // this.eye=this.eye.add(s);

        this.at = add(this.at, s);
        this.eye = add(this.eye, s);
    }

    left(){
        // var f = this.eye.subtract(this.at);
        // f = f.divide(f.length());
        // var s=-1*f.cross(this.up);
        // s = s.divide(s.length);
        // this.at=this.at.add(s);
        // this.eye=this.eye.add(s);

        // var f = this.eye.subtract(this.at);
        var f = sub(this.eye, this.at);
        // f = f.divide(f.length());
        var m = magnitude(f);
        f = div(f,m);
        // var s=f.cross(this.up);
        var s = cross(this.up, f)
        // s = s.divide(s.length);
        var m2 = magnitude(s)
        s = div(s,m)

        // this.at=this.at.add(s);
        // this.eye=this.eye.add(s);

        this.at = add(this.at, s);
        this.eye = add(this.eye, s);
    }




}