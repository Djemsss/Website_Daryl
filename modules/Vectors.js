// My own implementation of Vector2 because why not

const Vectors = {
  Vector2: class {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }

    magnitude() {
      return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    normalize() {
      const mag = this.magnitude();
      if (mag === 0) {
        return new Vectors.Vector2(0, 0);
      }
      return new Vectors.Vector2(this.x / mag, this.y / mag);
    }

    add(other) {
      return new Vectors.Vector2(this.x + other.x, this.y + other.y);
    }

    subtract(other) {
      return new Vectors.Vector2(this.x - other.x, this.y - other.y);
    }

    multiplyScalar(scalar) {
      return new Vectors.Vector2(this.x * scalar, this.y * scalar);
    }

    distanceTo(other) {
      const dx = this.x - other.x;
      const dy = this.y - other.y;
      return Math.sqrt(dx * dx + dy * dy);
    }

    distanceToSquared(other) {
      const dx = this.x - other.x;
      const dy = this.y - other.y;
      return dx * dx + dy * dy;
    }

    negate() {
      return new Vectors.Vector2(-this.x, -this.y);
    }
  },
};

export { Vectors };
