export type ShapeType = 'circle' | 'rect';

export type RGBA = {r: number; g: number; b: number; a?: number};

export interface Drawable {
    draw(ctx: CanvasRenderingContext2D): void;
}

export interface Updatable {
    update(dt: number): void;
}

export interface Collidable {
    radius(): number;
    onBoundary(width: number, height: number): void;
}
