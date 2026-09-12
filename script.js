// --- Custom Cursor Dynamics ---
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

const bindHoverEffects = () => {
    const interactives = document.querySelectorAll('.interactive');
    interactives.forEach(element => {
        element.addEventListener('mouseenter', () => cursorOutline.classList.add('cursor-hover'));
        element.addEventListener('mouseleave', () => cursorOutline.classList.remove('cursor-hover'));
    });
};
bindHoverEffects();

// --- Interactive Fluid Background Simulation ---
const canvas = document.getElementById('fluid-canvas');
const ctx = canvas.getContext('2d');
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2, radius: 220 };

window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
});

class FluidBlob {
    constructor(color, size, speed) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.baseSize = size;
        this.size = size;
        this.color = color;
        this.vx = (Math.random() - 0.5) * speed;
        this.vy = (Math.random() - 0.5) * speed;
        this.angle = Math.random() * Math.PI * 2;
    }

    update() {
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;

        this.angle += 0.02;
        this.x += this.vx + Math.sin(this.angle) * 1.5;
        this.y += this.vy + Math.cos(this.angle) * 1.5;

        if (this.x < -100 || this.x > width + 100) this.vx *= -1;
        if (this.y < -100 || this.y > height + 100) this.vy *= -1;

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 8;
            this.y -= (dy / dist) * force * 8;
            this.size = this.baseSize + force * 90;
        } else {
            this.size += (this.baseSize - this.size) * 0.05;
        }
    }

    draw() {
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'rgba(3, 7, 18, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

const blobs = [
    new FluidBlob('rgba(56, 189, 248, 0.45)', 350, 1.2),
    new FluidBlob('rgba(129, 140, 248, 0.35)', 400, 0.8),
    new FluidBlob('rgba(236, 72, 153, 0.25)', 300, 1.0),
    new FluidBlob('rgba(14, 165, 233, 0.4)', 380, 1.5)
];

let ripples = [];
window.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.6) {
        ripples.push({ x: e.clientX, y: e.clientY, radius: 10, alpha: 0.6 });
    }
});

function drawRipples() {
    ripples.forEach((ripple, index) => {
        ripple.radius += 3;
        ripple.alpha -= 0.015;
        if (ripple.alpha <= 0) {
            ripples.splice(index, 1);
        } else {
            ctx.strokeStyle = `rgba(56, 189, 248, ${ripple.alpha})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
            ctx.stroke();
        }
    });
}

function animate() {
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, width, height);
    blobs.forEach(blob => { blob.update(); blob.draw(); });
    drawRipples();
    requestAnimationFrame(animate);
}
animate();

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});