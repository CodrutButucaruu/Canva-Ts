export class HUD {
    private el: HTMLElement;
    private lastFpsUpdate = 0;
    private fps = 0;
    private frames = 0;

    constructor(el: HTMLElement) {
        this.el = el;
    }

    tick(now: number) {
        this.frames++;
        if (now - this.lastFpsUpdate >= 500) {
            this.fps = Math.round(
                (this.frames * 1000) / (now - this.lastFpsUpdate),
            );
            this.frames = 0;
            this.lastFpsUpdate = now;
        }
    }

    render(info: {
        objectCount: number;
        dpr: number;
        width: number;
        height: number;
        scrollX: number;
        scrollY: number;
        shape: string;
        size: number;
        speed: number;
        color: string;
        avoidance: boolean;
        resolve: boolean;
    }) {
        const lines = [
            `<span class="label">FPS:</span> <span class="value">${this.fps}</span>`,
            `<span class="label">DPR:</span> <span class="value">${info.dpr.toFixed(2)}</span>`,
            `<span class="label">Viewport:</span> <span class="value">${info.width}×${info.height}</span>`,
            `<span class="label">Scroll:</span> <span class="value">${Math.round(info.scrollX)}, ${Math.round(info.scrollY)}</span>`,
            `<span class="label">Objects:</span> <span class="value">${info.objectCount}</span>`,
            `<span class="label">Tool:</span> <span class="value">${info.shape}, size ${info.size}, speed ${info.speed}</span>`,
            `<span class="label">Color:</span> <span class="value">${info.color}</span>`,
            `<span class="label">Avoidance:</span> <span class="value">${info.avoidance}</span>`,
            `<span class="label">Resolve:</span> <span class="value">${info.resolve}</span>`,
        ];
        this.el.innerHTML = lines.join('<br/>');
    }
}
