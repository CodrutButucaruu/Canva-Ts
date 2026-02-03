export class Vector2 {
    constructor(
        public x = 0,
        public y = 0,
    ) {}

    copy(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    add(v: Vector2): this {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    sub(v: Vector2): this {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }
    scale(s: number): this {
        this.x *= s;
        this.y *= s;
        return this;
    }

    len(): number {
        return Math.hypot(this.x, this.y);
    }
    norm(): this {
        const l = this.len() || 1;
        this.x /= l;
        this.y /= l;
        return this;
    }

    static fromAngle(theta: number, mag = 1): Vector2 {
        return new Vector2(Math.cos(theta) * mag, Math.sin(theta) * mag);
    }
}
