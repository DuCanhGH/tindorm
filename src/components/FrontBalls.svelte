<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    type Vortex = { R: number; speed: number; amp: number; phase: number };
    const vortices: Vortex[] = [
        { R: 0.28, speed: 0.0017, amp: 210, phase: 0.0 },
        { R: 0.38, speed: -0.0015, amp: 240, phase: 1.9 },
        { R: 0.50, speed: 0.0019, amp: 190, phase: 3.2 }
    ];
    let running = false;
    function start() {
        if (typeof window === "undefined" || running) return;
        running = true;
        raf = window.requestAnimationFrame(frame);
    }
    function stop() {
        if (typeof window === "undefined") return;
        running = false;
        window.cancelAnimationFrame(raf);
        raf = 0;
    }

    let { count = 28 } = $props();
    let canvas: HTMLCanvasElement | null = null;

    let ctx: CanvasRenderingContext2D | null = null;
    let raf = 0;
    let dpr = 1;
    let w = 0, h = 0, cx = 0, cy = 0;
    let t = 0;

    type Orb = { angle: number; speed: number; baseR: number; amp: number; size: number; phase: number; };
    const orbs: Orb[] = [];

    function resize() {
        if (!canvas) return;
        dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
        w = canvas.clientWidth;
        h = canvas.clientHeight;
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        ctx = canvas.getContext("2d");
        cx = (w * dpr) / 2;
        cy = (h * dpr) / 2;
    }

    function initOrbs() {
        orbs.length = 0;
        const minDim = Math.min(w, h) * dpr;
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const baseR = (minDim * 0.15) + (minDim * 0.35) * Math.random();
            const amp = 18 + Math.random() * 28;
            const size = 3 + Math.random() * 7;
            const speed = 0.004 + Math.random() * 0.007;
            const phase = Math.random() * Math.PI * 2;
            orbs.push({ angle, speed, baseR, amp, size, phase });
        }
    }

    function frame() {
        if (!ctx || !canvas || !running) return;

        // fade trails
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = "rgba(0,0,0,0.22)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.globalCompositeOperation = "lighter";
        ctx.shadowBlur = 8 * dpr;
        ctx.shadowColor = "rgba(251, 191, 36, 0.6)";   // softer glow
        ctx.fillStyle = "rgba(250, 204, 21, 0.9)";

        for (const o of orbs) {
            o.angle += o.speed;
            const baseR = o.baseR + Math.sin(t * 0.02 + o.phase) * o.amp;

            // base circular motion around center
            let x = cx + Math.cos(o.angle) * baseR;
            let y = cy + Math.sin(o.angle * 1.12 + o.phase) * baseR * 0.85;

            // swirling offsets from moving vortices
            const minDim = Math.min(w, h) * dpr;
            let offX = 0, offY = 0;
            for (const v of vortices) {
                const vx0 = cx + Math.cos(t * v.speed + v.phase) * (minDim * v.R);
                const vy0 = cy + Math.sin(t * v.speed + v.phase) * (minDim * v.R * 0.85);
                const dx = vx0 - x, dy = vy0 - y;
                const dist = Math.hypot(dx, dy) + 60;
                // perpendicular (curl-like) component for swirl
                offX += (-dy) * (v.amp / dist) * 0.02;
                offY += (dx)  * (v.amp / dist) * 0.02;
            }

            x += offX;
            y += offY;

            const s = o.size * dpr;
            ctx.beginPath();
            ctx.arc(x, y, s, 0, Math.PI * 2);
            ctx.fill();
        }

        t++;
        raf = requestAnimationFrame(frame);
    }

    onMount(() => {
        resize();
        initOrbs();
        start();

        const onResize = () => { resize(); initOrbs(); };
        const onVis = () => document.visibilityState === "hidden" ? stop() : start();
        window.addEventListener("resize", onResize);
        document.addEventListener("visibilitychange", onVis);

        return () => {
            window.removeEventListener("resize", onResize);
            document.removeEventListener("visibilitychange", onVis);
            stop();
        };
    });

    onDestroy(stop);
</script>

<canvas
    bind:this={canvas}
    class="absolute pointer-events-none w-full h-full z-40"
    style="opacity:0.7;mix-blend-mode:screen;"
/>