import {Entity} from './entity';

export type SceneConfig = {
    avoidance: boolean;
    resolve: boolean;
};

export class Scene {
    entities: Entity[] = [];
    config: SceneConfig = {avoidance: false, resolve: true};

    // drag(e: Entity) {
    //     this.entities.push(e);
    // }

    add(e: Entity) {
        this.entities.push(e);
    }
    clear() {
        this.entities.length = 0;
    }

    update(
        dt: number,
        width: number,
        height: number,
        steerFn: Function,
        resolveFn: Function,
    ) {
        for (const e of this.entities) {
            e.update(dt);
            e.onBoundary(width, height);
        }

        for (let i = 0; i < this.entities.length; i++) {
            for (let j = i + 1; j < this.entities.length; j++) {
                const a = this.entities[i],
                    b = this.entities[j];

                const dx = a.pos.x - b.pos.x,
                    dy = a.pos.y - b.pos.y;
                const r = a.radius() + b.radius();
                if (dx * dx + dy * dy > r * r * 1.5) continue;

                if (this.config.avoidance) steerFn(a, b);

                if (this.config.resolve) {
                    resolveFn(a, b);
                }
            }
        }
    }
}
