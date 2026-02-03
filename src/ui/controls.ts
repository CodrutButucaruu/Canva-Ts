import {Scene} from '../core/scene';

export type ControlsState = {
    shape: 'circle' | 'rect' | 'square';
    size: number;
    speed: number;
    color: string;
    avoidance: boolean;
    resolve: boolean;
};

export class Controls {
    state: ControlsState;

    constructor(private scene: Scene) {
        const shape = document.getElementById('shape') as HTMLSelectElement;
        const size = document.getElementById('size') as HTMLInputElement;
        const speed = document.getElementById('speed') as HTMLInputElement;
        const color = document.getElementById('color') as HTMLInputElement;
        const avoid = document.getElementById('avoid') as HTMLInputElement;
        const resolve = document.getElementById('resolve') as HTMLInputElement;
        const clear = document.getElementById('clear') as HTMLButtonElement;

        this.state = {
            shape: (shape.value as any) ?? 'circle',
            size: Number(size.value) || 30,
            speed: Number(speed.value) || 150,
            color: color.value || '#1e88e5',
            avoidance: avoid.checked,
            resolve: resolve.checked,
        };

        shape.addEventListener(
            'change',
            () => (this.state.shape = shape.value as any),
        );
        size.addEventListener(
            'input',
            () => (this.state.size = Number(size.value)),
        );
        speed.addEventListener(
            'input',
            () => (this.state.speed = Number(speed.value)),
        );
        color.addEventListener('input', () => (this.state.color = color.value));
        avoid.addEventListener('change', () => {
            this.state.avoidance = avoid.checked;
            this.scene.config.avoidance = avoid.checked;
        });
        resolve.addEventListener('change', () => {
            this.state.resolve = resolve.checked;
            this.scene.config.resolve = resolve.checked;
        });
        clear.addEventListener('click', () => this.scene.clear());
    }
}
