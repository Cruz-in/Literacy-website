/* =========================================================
   particles(canvas, options): soft motes drifting on a canvas.
   Reusable: the page dust uses the defaults below; SIGHT's
   dust-in-light-beams or SMELL's rising mist would pass their
   own count / size / speed / drift / color.

   The canvas is sized from its own CSS box, so it works as a
   fixed full-viewport layer or as a canvas inside one section.
   Rendering stops while the canvas is off-screen or the tab is
   hidden. Under prefers-reduced-motion it draws `stillCount`
   motes once and never animates (0 = none).
   ========================================================= */

function particles(canvas, options) {
    const o = {
        count: 55,
        stillCount: 12,
        size: [1, 3],             // px diameter: back tier → front tier
        opacity: [0.12, 0.5],     // back → front
        speed: 14,                // px/s for the front tier; the back tier moves at 30%
        drift: [0.25, -1],        // direction of travel (x, y), y up is negative
        wander: 0.6,              // sideways sway, as a fraction of speed
        twinkle: 0,               // opacity flicker depth, 0–1 (0 = steady)
        repel: 0,                 // px: motes this close to the pointer ease away (0 = ignore it)
        tiers: 3,                 // depth layers
        color: "255, 238, 214",   // rgb
        ...options,
    };

    const ctx = canvas.getContext("2d");
    const dpr = devicePixelRatio || 1;
    const lerp = ([a, b], t) => a + (b - a) * t;
    const len = Math.hypot(...o.drift) || 1;
    const dx = o.drift[0] / len, dy = o.drift[1] / len;

    // one soft dot, drawn once and stamped for every mote
    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = 32;
    const sctx = sprite.getContext("2d");
    const glow = sctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    glow.addColorStop(0, `rgba(${o.color}, 1)`);
    glow.addColorStop(0.4, `rgba(${o.color}, 0.7)`);
    glow.addColorStop(1, `rgba(${o.color}, 0)`);
    sctx.fillStyle = glow;
    sctx.fillRect(0, 0, 32, 32);

    // positions are fractions of the canvas, so a resize never empties the field
    const motes = Array.from({ length: o.count }, () => {
        const tier = Math.floor(o.tiers * Math.random() ** 1.5);   // more far motes than near ones
        const depth = o.tiers > 1 ? tier / (o.tiers - 1) : 1;      // 0 = back, 1 = front
        const jitter = () => 0.8 + Math.random() * 0.4;
        return {
            x: Math.random(),
            y: Math.random(),
            d: lerp(o.size, depth) * jitter() * 2,   // sprite box; its soft edge eats half
            a: lerp(o.opacity, depth) * jitter(),
            v: o.speed * lerp([0.3, 1], depth) * jitter(),
            f: 0.15 + Math.random() * 0.25,          // sway frequency
            tf: 1.5 + Math.random() * 2.5,           // twinkle rate (rad/s): a 1.5–4s flicker
            p: Math.random() * Math.PI * 2,          // sway phase
        };
    });
    // the depth sort means front motes are drawn last, over the back ones
    motes.sort((m, n) => m.v - n.v);

    let w = 0, h = 0;
    const draw = (list, t = 0) => {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);
        for (const m of list) {
            ctx.globalAlpha = m.a * (1 - o.twinkle * (0.5 + 0.5 * Math.sin(t * m.tf + m.p)));
            ctx.drawImage(sprite, m.x * w - m.d / 2, m.y * h - m.d / 2, m.d, m.d);
        }
    };

    // where the pointer is, as a fraction of this canvas (null = nowhere near it).
    // Only read when `repel` is set, and never from a finger: that's a scroll.
    let pointer = null;
    if (o.repel) addEventListener("pointermove", (e) => {
        if (e.pointerType === "touch") return;
        const box = canvas.getBoundingClientRect();
        pointer = { x: (e.clientX - box.left) / box.width, y: (e.clientY - box.top) / box.height };
    }, { passive: true });

    const move = (m, dt, t) => {
        // two slow sines across the drift line: an organic wander, never a straight path
        const sway = (Math.sin(t * m.f + m.p) + 0.5 * Math.sin(t * m.f * 2.3 + m.p * 1.7)) * o.wander;
        m.x += (dx - dy * sway) * m.v * dt / w;
        m.y += (dy + dx * sway) * m.v * dt / h;
        if (pointer) {
            // a push straight out from the pointer, falling off to nothing at `repel`.
            // It's added to the drift, so a mote drifts aside and then carries on.
            const ex = (m.x - pointer.x) * w, ey = (m.y - pointer.y) * h;
            const d = Math.hypot(ex, ey);
            if (d > 0.5 && d < o.repel) {
                const push = (1 - d / o.repel) * o.repel * 1.6 * dt / d;   // px/s at the center
                m.x += ex * push / w;
                m.y += ey * push / h;
            }
        }
        // wrap one mote-width past each edge, so they slide in and out of view
        const mx = m.d / w, my = m.d / h;
        if (m.x < -mx) m.x += 1 + 2 * mx; else if (m.x > 1 + mx) m.x -= 1 + 2 * mx;
        if (m.y < -my) m.y += 1 + 2 * my; else if (m.y > 1 + my) m.y -= 1 + 2 * my;
    };

    const still = matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0, last = 0, onScreen = true;

    const frame = (now) => {
        const dt = Math.min((now - last) / 1000, 0.05);   // no leap after a dropped frame
        last = now;
        for (const m of motes) move(m, dt, now / 1000);
        draw(motes, now / 1000);
        raf = requestAnimationFrame(frame);
    };

    // one place decides whether the loop runs
    const sync = () => {
        cancelAnimationFrame(raf);
        raf = 0;
        if (still.matches) return draw(motes.filter((_, i) => o.stillCount && i %Math.ceil(o.count / o.stillCount) === 0));   // a few, from every depth
        if (onScreen && !document.hidden) raf = requestAnimationFrame((now) => { last = now; frame(now); });
    };

    new ResizeObserver(() => {
        w = canvas.clientWidth;
        h = canvas.clientHeight;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        sync();   // resizing clears the canvas: redraw (still) or restart (moving)
    }).observe(canvas);
    new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; sync(); }).observe(canvas);
    document.addEventListener("visibilitychange", sync);
    still.addEventListener("change", sync);
}
