// cuon-matrix.js (c) 2012 kanda and matsuda
/**
 * This is a class treating 4x4 matrix.
 * This class contains the function that is equivalent to OpenGL matrix stack.
 * The matrix after conversion is calculated by multiplying a conversion matrix from the right.
 * The matrix is replaced by the calculated result.
 */

class Vec3 {
    constructor(opt_src) {
        var v = new Float32Array(3);
        if (opt_src && typeof opt_src === 'object') {
          v[0] = opt_src[0];
          v[1] = opt_src[1];
          v[2] = opt_src[2];
        }
        this.elements = v;
    }

    /**
     * Copy vector.
     * @param src source vector
     * @return this
     */
    set(src) {
        var i, s, d;

        s = src.elements;
        d = this.elements;

        if (s === d) {
          return;
        }

        for (i = 0; i < 3; ++i) {
          d[i] = s[i];
        }

        return this;
    }

    /**
      * Add other to this vector.
      * @return this
      */
    add(other) {
        // Insert your code here.
        // This function should change this vector (this.elements) and not create a new vector.
        var res_vec,i;
        res_vec = this.elements;
        other = other.elements;

        for (i=0;i<3;i++){
          res_vec[i] = other[i] + this.elements[i]
        }

        this.elements = res_vec
        // Don't delete the return statement.
        return this;
    };

    /**
      * Subtract other from this vector.
      * @return this
      */
    sub(other) {
        // Insert your code here.
        // This function should change this vector (this.elements) and not create a new vector.
        var res_vec,i;
        res_vec = this.elements;
        other=other.elements;

        for (i=0;i<3;i++){
          res_vec[i] =  this.elements[i] - other[i]
        }

        this.elements = res_vec
        // Don't delete the return statement.
        return this;
    };

    /**
      * Divide this vector by a scalar.
      * @return this
      */
    div(scalar) {
        // Insert your code here.
        // This function should change this vector (this.elements) and not create a new vector.
        var res_vec,i;
        res_vec = this.elements;

        for (i=0;i<3;i++){
          res_vec[i] =  this.elements[i]/scalar;
        }

        this.elements = res_vec;
        // Don't delete the return statement.
        return this;
    };

    /**
      * Multiply this vector by a scalar.
      * @return this
      */
    mul(scalar) {
        // Insert your code here.
        // This function should change this vector (this.elements) and not create a new vector.
        var res_vec,i;
        res_vec = this.elements;

        for (i=0;i<3;i++){
          res_vec[i] =  this.elements[i]*scalar;
        }

        this.elements = res_vec;
        // Don't delete the return statement.
        return this;
        // Don't delete the return statement.
        //return this;
    };

    /**
      * Calcualte the dop product between this vector and other.
      * @return scalar
      */
    static dot(other1, other2) {
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

    /**
      * Calcualte the cross product between this vector and other.
      * @return new vector
      */
    static cross(other1, other2) {
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

    /**
      * Calculate the magnitude (or length) of this vector.
      * @return scalar
      */
    magnitude() {
        // Insert your code here.
        let m = 0; // Modify this line to calculate this vector's magnitude.
        var i;
        for (i=0;i<3;i++){
          m += this.elements[i]*this.elements[i]
        }

        m = Math.sqrt(m)

        // Don't delete the return statement.
        return m;
    };

    /**
      * Normalize this vector.
      * @return this
      */
    normalize() {
        // Insert your code here.
        // This function should change this vector (this.elements) and not create a new vector.
        var m = this.magnitude();
        this.div(m)
        // Don't delete the return statement.
        return this;
    };
}

