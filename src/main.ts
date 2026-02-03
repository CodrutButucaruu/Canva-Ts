import {Renderer} from './core/renderer';
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

function fit() {
    renderer.resize();
}
window.addEventListener('resize', fit);
window.addEventListener('scroll', () => {});
fit();

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const speed = controls.state.speed;
    const angle = Math.random() * Math.PI * 2;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;

    if (controls.state.shape === 'circle') {
        const r = controls.state.size;
        scene.add(new Circle(x, y, vx, vy, r, controls.state.color));
    } else {
        const w = controls.state.size * 1.6;
        const h = controls.state.size;
        scene.add(new Rect(x, y, vx, vy, w, h, controls.state.color));
    }
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
