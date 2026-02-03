import {Entity} from './entity';
import {Vector2} from './math';

function hexToRGBA(hex: string): {r: number; g: number; b: number} {
    const n = parseInt(hex.replace('#', ''), 16);
    return {r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255};
}

export class Circle extends Entity {
    constructor(
        x: number,
        y: number,
        vx: number,
        vy: number,
        public r: number,
        colorHex: string,
    ) {
        const {g, b} = hexToRGBA(colorHex);
        super(x, y, vx, vy, {r, g, b, a: 0.9});
    }

    radius(): number {
        return this.r;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        this.ctxColor(ctx);
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }

    contains(p: Vector2): boolean {
        return Math.hypot(p.x - this.pos.x, p.y - this.pos.y) <= this.r;
    }
}

export class Rect extends Entity {
    constructor(
        x: number,
        y: number,
        vx: number,
        vy: number,
        public w: number,
        public h: number,
        colorHex: string,
    ) {
        const {r, g, b} = hexToRGBA(colorHex);
        super(x, y, vx, vy, {r, g, b, a: 0.9});
    }

    radius(): number {
        return Math.max(this.w, this.h) * 0.7071;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        this.ctxColor(ctx);
        ctx.beginPath();
        ctx.rect(
            this.pos.x - this.w / 2,
            this.pos.y - this.h / 2,
            this.w,
            this.h,
        );
        ctx.fill();
        ctx.stroke();
    }

    contains(p: Vector2): boolean {
        return (
            Math.abs(p.x - this.pos.x) <= this.w / 2 &&
            Math.abs(p.y - this.pos.y) <= this.h / 2
        );
    }
}
