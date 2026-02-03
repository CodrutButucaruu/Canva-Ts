import {Entity} from './entity';

export class Renderer {
    ctx: CanvasRenderingContext2D;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    constructor(public canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('2D context not available');
        this.ctx = ctx;
        this.resize();
    }

    resize() {
        const {canvas} = this;
        const {clientWidth, clientHeight} = canvas;
        this.dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.max(1, Math.floor(clientWidth * this.dpr));
        canvas.height = Math.max(1, Math.floor(clientHeight * this.dpr));
        this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }

    clear() {
        this.ctx.clearRect(
            0,
            0,
            this.canvas.clientWidth,
            this.canvas.clientHeight,
        );
    }

    drawAll(entities: Entity[]) {
        for (const e of entities) e.draw(this.ctx);
    }

    get width() {
        return this.canvas.clientWidth;
    }
    get height() {
        return this.canvas.clientHeight;
    }
}
