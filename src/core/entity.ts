import {Drawable, Updatable, Collidable, RGBA} from './types';
import {Vector2} from './math';

export abstract class Entity implements Drawable, Updatable, Collidable {
    pos: Vector2;
    vel: Vector2;
    color: RGBA;

    constructor(x: number, y: number, vx: number, vy: number, color: RGBA) {
        this.pos = new Vector2(x, y);
        this.vel = new Vector2(vx, vy);
        this.color = color;
    }

    abstract draw(ctx: CanvasRenderingContext2D): void;

    abstract contains(p: Vector2): boolean;

    abstract radius(): number;

    update(dt: number): void {
        this.pos.x += this.vel.x * dt;
        this.pos.y += this.vel.y * dt;
    }

    onBoundary(width: number, height: number): void {
        const r = this.radius();
        if (this.pos.x < r) {
            this.pos.x = r;
            this.vel.x *= -1;
        }
        if (this.pos.y < r) {
            this.pos.y = r;
            this.vel.y *= -1;
        }
        if (this.pos.x > width - r) {
            this.pos.x = width - r;
            this.vel.x *= -1;
        }
        if (this.pos.y > height - r) {
            this.pos.y = height - r;
            this.vel.y *= -1;
        }
    }

    protected ctxColor(ctx: CanvasRenderingContext2D) {
        const {r, g, b, a = 1} = this.color;
        ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    }
}
