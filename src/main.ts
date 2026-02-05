import {Renderer} from './core/renderer';
import {Vector2} from './core/math';
import {Entity} from './core/entity';
import {Scene} from './core/scene';
import {HUD} from './core/hud';
import {Controls} from './ui/controls';
import {Circle, Rect} from './core/shapes';
import {resolveBounce, collides, steerAway} from './core/collisions';

const canvas = document.getElementById('stage') as HTMLCanvasElement;
const hudEl = document.getElementById('hud')!;
const renderer = new Renderer(canvas);
const scene = new Scene();
const hud = new HUD(hudEl);
const controls = new Controls(scene);

let dragging: Entity | null = null;
let dragOffset = new Vector2(0, 0);
let lastGood: Vector2 | null = null;

function fit() {
    renderer.resize();
}
window.addEventListener('resize', fit);
window.addEventListener('scroll', () => {});
fit();

function pointerPos(e: PointerEvent) {
    const r = canvas.getBoundingClientRect();
    return new Vector2(e.clientX - r.left, e.clientY - r.top);
}

function pickTop(p: Vector2): Entity | null {
    for (let i = scene.entities.length - 1; i >= 0; i--) {
        const ent = scene.entities[i];
        if (ent.contains(p)) return ent;
    }
    return null;
}

canvas.addEventListener('pointerdown', (e) => {
    const p = pointerPos(e);

    const hit = pickTop(p);
    if (hit) {
        dragging = hit;

        const idx = scene.entities.indexOf(hit);
        if (idx >= 0) {
            scene.entities.splice(idx, 1);
            scene.entities.push(hit);
        }

        dragOffset.x = hit.pos.x - p.x;
        dragOffset.y = hit.pos.y - p.y;

        lastGood = hit.pos.copy();

        hit.vel.x = 0;
        hit.vel.y = 0;

        canvas.setPointerCapture(e.pointerId);
        return;
    }
    const x = p.x;
    const y = p.y;

    const speed = controls.state.speed;
    const angle = Math.random() * Math.PI * 2;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;

    if (controls.state.shape === 'circle') {
        const r = controls.state.size;
        scene.add(new Circle(x, y, vx, vy, r, controls.state.color));
    } else if (controls.state.shape === 'rect') {
        const w = controls.state.size * 1.6;
        const h = controls.state.size;
        scene.add(new Rect(x, y, vx, vy, w, h, controls.state.color));
    } else {
        const w = controls.state.size;
        const h = controls.state.size;
        scene.add(new Rect(x, y, vx, vy, w, h, controls.state.color));
    }
});

window.addEventListener('pointermove', (e) => {
    if (!dragging) return;

    const p = pointerPos(e);
    const nextX = p.x + dragOffset.x;
    const nextY = p.y + dragOffset.y;

    dragging.pos.x = nextX;
    dragging.pos.y = nextY;

    if (scene.config.avoidance) {
        let bad = false;
        for (const other of scene.entities) {
            if (other === dragging) continue;
            if (collides(dragging, other)) {
                bad = true;
                break;
            }
        }

        if (bad && lastGood) {
            dragging.pos.x = lastGood.x;
            dragging.pos.y = lastGood.y;
        } else {
            lastGood = dragging.pos.copy();
        }
    }
});

window.addEventListener('pointerup', () => {
    dragging = null;
    lastGood = null;
});

let last = performance.now();
function loop(now: number) {
    const dt = (now - last) / 1000;
    last = now;

    scene.update(
        dt,
        renderer.width,
        renderer.height,
        (a: any, b: any) => steerAway(a, b, 80),
        (a: any, b: any) => {
            if (collides(a, b)) resolveBounce(a, b);
        },
    );

    renderer.clear();
    renderer.drawAll(scene.entities);

    hud.tick(now);
    hud.render({
        objectCount: scene.entities.length,
        dpr: renderer.dpr,
        width: window.innerWidth,
        height: window.innerHeight,
        scrollX: window.scrollX,
        scrollY: window.scrollY,
        shape: controls.state.shape,
        size: controls.state.size,
        speed: controls.state.speed,
        color: controls.state.color,
        avoidance: controls.state.avoidance,
        resolve: controls.state.resolve,
    });

    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
