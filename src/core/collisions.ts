import {Circle, Rect} from './shapes';
import {Vector2} from './math';
import {Entity} from './entity';

export function circleCircleCollide(a: Circle, b: Circle): boolean {
    const dx = a.pos.x - b.pos.x;
    const dy = a.pos.y - b.pos.y;
    const r = a.r + b.r;
    return dx * dx + dy * dy <= r * r;
}

export function rectRectCollide(a: Rect, b: Rect): boolean {
    return (
        Math.abs(a.pos.x - b.pos.x) * 2 <= a.w + b.w &&
        Math.abs(a.pos.y - b.pos.y) * 2 <= a.h + b.h
    );
}

export function circleRectCollide(c: Circle, r: Rect): boolean {
    const cx = Math.max(
        r.pos.x - r.w / 2,
        Math.min(c.pos.x, r.pos.x + r.w / 2),
    );
    const cy = Math.max(
        r.pos.y - r.h / 2,
        Math.min(c.pos.y, r.pos.y + r.h / 2),
    );
    const dx = c.pos.x - cx;
    const dy = c.pos.y - cy;
    return dx * dx + dy * dy <= c.r * c.r;
}

export function collides(a: Entity, b: Entity): boolean {
    if (a instanceof Circle && b instanceof Circle)
        return circleCircleCollide(a, b);
    if (a instanceof Rect && b instanceof Rect) return rectRectCollide(a, b);
    if (a instanceof Circle && b instanceof Rect)
        return circleRectCollide(a, b);
    if (a instanceof Rect && b instanceof Circle)
        return circleRectCollide(b, a);
    return false;
}

export function resolveBounce(a: Entity, b: Entity) {
    const n = new Vector2(a.pos.x - b.pos.x, a.pos.y - b.pos.y);
    const len = n.len() || 1;
    n.scale(1 / len);

    const rel = new Vector2(a.vel.x - b.vel.x, a.vel.y - b.vel.y);
    const sepVel = rel.x * n.x + rel.y * n.y;
    if (sepVel > 0) return;

    const impulse = -sepVel;
    a.vel.x += n.x * impulse * 0.5;
    a.vel.y += n.y * impulse * 0.5;
    b.vel.x -= n.x * impulse * 0.5;
    b.vel.y -= n.y * impulse * 0.5;
}

export function steerAway(a: Entity, b: Entity, strength = 50) {
    const toA = new Vector2(a.pos.x - b.pos.x, a.pos.y - b.pos.y);
    const d = toA.len() || 1;
    toA.scale(1 / d);
    const s = strength / d;
    a.vel.x += toA.x * s;
    a.vel.y += toA.y * s;
    b.vel.x -= toA.x * s;
    b.vel.y -= toA.y * s;
}
