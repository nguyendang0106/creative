// ============================================
// MOBILE DETECTION
// ============================================
const isMobile = window.innerWidth <= 768;

// ============================================
// PARTICLE SYSTEM (Sparkling Dust)
// ============================================
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Fireworks Canvas
const fireworksCanvas = document.getElementById('fireworksCanvas');
const fwCtx = fireworksCanvas.getContext('2d');

fireworksCanvas.width = window.innerWidth;
fireworksCanvas.height = window.innerHeight;

class Particle {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.color = this.getRandomColor();
        this.life = Math.random() * 200 + 100;
        this.maxLife = this.life;
    }
    
    getRandomColor() {
        const colors = [
            'rgba(255, 255, 255,',
            'rgba(255, 182, 193,',
            'rgba(255, 192, 203,',
            'rgba(255, 218, 185,',
            'rgba(221, 160, 221,'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life--;
        
        this.opacity = (this.life / this.maxLife) * 0.8;
        
        if (this.life <= 0 || this.x < 0 || this.x > canvas.width || 
            this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }
    
    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.size * 3
        );
        gradient.addColorStop(0, this.color + '0.8)');
        gradient.addColorStop(1, this.color + '0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = this.color + '1)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

const particles = [];
const particleCount = isMobile ? 30 : 80;

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    requestAnimationFrame(animateParticles);
}

animateParticles();

// ============================================
// FIREWORKS SYSTEM
// ============================================
class Firework {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.exploded = false;
        this.targetY = Math.random() * (fireworksCanvas.height * 0.3) + fireworksCanvas.height * 0.1;
        this.speed = 5;
        this.trail = [];
        this.color = this.getRandomColor();
    }
    
    getRandomColor() {
        const colors = [
            '#ff6b9d', '#c471ed', '#12d8fa', '#f9ca24', '#ff6348',
            '#00d2d3', '#ee5a6f', '#f368e0', '#ff9ff3', '#feca57'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    launch() {
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 10) this.trail.shift();
        
        this.y -= this.speed;
        
        if (this.y <= this.targetY) {
            this.explode();
        }
    }
    
    explode() {
        this.exploded = true;
        const particleCount = isMobile ? 30 : 60;
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = Math.random() * 3 + 2;
            
            this.particles.push({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                life: 1,
                decay: Math.random() * 0.015 + 0.01,
                size: Math.random() * 3 + 2,
                color: this.color,
                alpha: 1
            });
        }
    }
    
    update() {
        if (!this.exploded) {
            this.launch();
        } else {
            this.particles.forEach((p, index) => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.05;
                p.vx *= 0.99;
                p.life -= p.decay;
                p.alpha = p.life;
                
                if (p.life <= 0) {
                    this.particles.splice(index, 1);
                }
            });
        }
    }
    
    draw() {
        if (!this.exploded) {
            this.trail.forEach((pos, index) => {
                fwCtx.beginPath();
                fwCtx.arc(pos.x, pos.y, 2, 0, Math.PI * 2);
                fwCtx.fillStyle = this.color;
                fwCtx.globalAlpha = index / this.trail.length;
                fwCtx.fill();
            });
            
            fwCtx.beginPath();
            fwCtx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            fwCtx.fillStyle = this.color;
            fwCtx.globalAlpha = 1;
            fwCtx.fill();
        } else {
            this.particles.forEach(p => {
                fwCtx.beginPath();
                fwCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                fwCtx.fillStyle = p.color;
                fwCtx.globalAlpha = p.alpha;
                fwCtx.fill();
            });
        }
    }
    
    isDone() {
        return this.exploded && this.particles.length === 0;
    }
}

const fireworks = [];

function createFirework() {
    const x = Math.random() * fireworksCanvas.width;
    const y = fireworksCanvas.height;
    fireworks.push(new Firework(x, y));
}

function animateFireworks() {
    fwCtx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    
    fireworks.forEach((firework, index) => {
        firework.update();
        firework.draw();
        
        if (firework.isDone()) {
            fireworks.splice(index, 1);
        }
    });
    
    requestAnimationFrame(animateFireworks);
}

animateFireworks();

const fireworkInterval = isMobile ? 3000 : 1500;
setInterval(createFirework, fireworkInterval);

const initialBurst = isMobile ? 1 : 3;
for (let i = 0; i < initialBurst; i++) {
    setTimeout(createFirework, i * 400);
}

// ============================================
// NEW UPGRADED HEART PARTICLE EFFECT
// ============================================
const heartCanvas = document.getElementById('heartCanvas');
const heartCtx = heartCanvas.getContext('2d');

heartCanvas.width = window.innerWidth;
heartCanvas.height = window.innerHeight;

const heartSettings = {
    particles: {
        length: isMobile ? 1000 : 2000,
        duration: 2,
        velocity: isMobile ? 80 : 100,
        effect: -1.3,
        size: isMobile ? 10 : 13,
    },
};

// Point class
class Point {
    constructor(x, y) {
        this.x = typeof x !== 'undefined' ? x : 0;
        this.y = typeof y !== 'undefined' ? y : 0;
    }
    
    clone() {
        return new Point(this.x, this.y);
    }
    
    length(length) {
        if (typeof length == 'undefined')
            return Math.sqrt(this.x * this.x + this.y * this.y);
        this.normalize();
        this.x *= length;
        this.y *= length;
        return this;
    }
    
    normalize() {
        const length = this.length();
        this.x /= length;
        this.y /= length;
        return this;
    }
}

// Heart Particle class
class HeartParticle {
    constructor() {
        this.position = new Point();
        this.velocity = new Point();
        this.acceleration = new Point();
        this.age = 0;
    }
    
    initialize(x, y, dx, dy) {
        this.position.x = x;
        this.position.y = y;
        this.velocity.x = dx;
        this.velocity.y = dy;
        this.acceleration.x = dx * heartSettings.particles.effect;
        this.acceleration.y = dy * heartSettings.particles.effect;
        this.age = 0;
    }
    
    update(deltaTime) {
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
        this.velocity.x += this.acceleration.x * deltaTime;
        this.velocity.y += this.acceleration.y * deltaTime;
        this.age += deltaTime;
    }
    
    draw(context, image) {
        function ease(t) {
            return --t * t * t + 1;
        }
        const size = image.width * ease(this.age / heartSettings.particles.duration);
        context.globalAlpha = 1 - this.age / heartSettings.particles.duration;
        context.drawImage(
            image,
            this.position.x - size / 2,
            this.position.y - size / 2,
            size,
            size
        );
    }
}

// Heart Particle Pool
class HeartParticlePool {
    constructor(length) {
        this.particles = new Array(length);
        for (let i = 0; i < this.particles.length; i++)
            this.particles[i] = new HeartParticle();
        
        this.firstActive = 0;
        this.firstFree = 0;
        this.duration = heartSettings.particles.duration;
    }
    
    add(x, y, dx, dy) {
        this.particles[this.firstFree].initialize(x, y, dx, dy);
        this.firstFree++;
        if (this.firstFree == this.particles.length) this.firstFree = 0;
        if (this.firstActive == this.firstFree) this.firstActive++;
        if (this.firstActive == this.particles.length) this.firstActive = 0;
    }
    
    update(deltaTime) {
        let i;
        if (this.firstActive < this.firstFree) {
            for (i = this.firstActive; i < this.firstFree; i++)
                this.particles[i].update(deltaTime);
        }
        if (this.firstFree < this.firstActive) {
            for (i = this.firstActive; i < this.particles.length; i++)
                this.particles[i].update(deltaTime);
            for (i = 0; i < this.firstFree; i++) 
                this.particles[i].update(deltaTime);
        }
        
        while (
            this.particles[this.firstActive].age >= this.duration &&
            this.firstActive != this.firstFree
        ) {
            this.firstActive++;
            if (this.firstActive == this.particles.length) this.firstActive = 0;
        }
    }
    
    draw(context, image) {
        if (this.firstActive < this.firstFree) {
            for (let i = this.firstActive; i < this.firstFree; i++)
                this.particles[i].draw(context, image);
        }
        if (this.firstFree < this.firstActive) {
            for (let i = this.firstActive; i < this.particles.length; i++)
                this.particles[i].draw(context, image);
            for (let i = 0; i < this.firstFree; i++) 
                this.particles[i].draw(context, image);
        }
    }
}

// Initialize heart effect
const heartParticles = new HeartParticlePool(heartSettings.particles.length);
const particleRate = heartSettings.particles.length / heartSettings.particles.duration;
let time;

function pointOnHeart(t) {
    return new Point(
        160 * Math.pow(Math.sin(t), 3),
        130 * Math.cos(t) - 50 * Math.cos(2 * t) - 20 * Math.cos(3 * t) - 10 * Math.cos(4 * t) + 25
    );
}

// Create heart particle image
const heartImage = (function () {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = heartSettings.particles.size;
    canvas.height = heartSettings.particles.size;
    
    function to(t) {
        const point = pointOnHeart(t);
        point.x = heartSettings.particles.size / 2 + (point.x * heartSettings.particles.size) / 350;
        point.y = heartSettings.particles.size / 2 - (point.y * heartSettings.particles.size) / 350;
        return point;
    }
    
    context.beginPath();
    let t = -Math.PI;
    let point = to(t);
    context.moveTo(point.x, point.y);
    while (t < Math.PI) {
        t += 0.01;
        point = to(t);
        context.lineTo(point.x, point.y);
    }
    context.closePath();
    
    context.fillStyle = '#FF5CA4';
    context.fill();
    
    const image = new Image();
    image.src = canvas.toDataURL();
    return image;
})();

// Random spawn positions for hearts
let heartSpawnPoints = [];

function generateHeartSpawnPoints() {
    heartSpawnPoints = [];
    // Create multiple spawn points across the screen
    const numPoints = isMobile ? 4 : 8;
    const margin = 100;
    
    for (let i = 0; i < numPoints; i++) {
        heartSpawnPoints.push({
            x: margin + Math.random() * (heartCanvas.width - margin * 2),
            y: margin + Math.random() * (heartCanvas.height - margin * 2)
        });
    }
}

generateHeartSpawnPoints();

function renderHeartParticles() {
    requestAnimationFrame(renderHeartParticles);
    
    const newTime = new Date().getTime() / 1000;
    const deltaTime = newTime - (time || newTime);
    time = newTime;
    
    heartCtx.clearRect(0, 0, heartCanvas.width, heartCanvas.height);
    
    const amount = particleRate * deltaTime;
    for (let i = 0; i < amount; i++) {
        const pos = pointOnHeart(Math.PI - 2 * Math.PI * Math.random());
        const dir = pos.clone().length(heartSettings.particles.velocity);
        
        // Pick a random spawn point from the array
        const spawnPoint = heartSpawnPoints[Math.floor(Math.random() * heartSpawnPoints.length)];
        
        heartParticles.add(
            spawnPoint.x + pos.x,
            spawnPoint.y - pos.y,
            dir.x,
            -dir.y
        );
    }
    
    heartParticles.update(deltaTime);
    heartParticles.draw(heartCtx, heartImage);
}

function onHeartCanvasResize() {
    heartCanvas.width = window.innerWidth;
    heartCanvas.height = window.innerHeight;
    // Regenerate spawn points when window resizes
    generateHeartSpawnPoints();
}

window.addEventListener('resize', onHeartCanvasResize);

setTimeout(function () {
    onHeartCanvasResize();
    renderHeartParticles();
}, 10);

// Periodically change spawn points for more dynamic effect
setInterval(() => {
    generateHeartSpawnPoints();
}, isMobile ? 5000 : 3000); // Change positions every 3-5 seconds

// ============================================
// OLD CSS HEARTS ANIMATION
// ============================================
const heartsContainer = document.getElementById('heartsContainer');
const maxCSSHearts = isMobile ? 3 : 8;

function createCSSHeart() {
    if (heartsContainer.children.length >= maxCSSHearts) return;
    
    const heart = document.createElement('div');
    heart.className = 'heart';
    
    // Random starting position from any edge - INSIDE viewport
    const edge = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
    const margin = 100; // Start from inside the screen
    let startX, startY, endX, endY;
    
    switch(edge) {
        case 0: // Start from top edge, go to bottom
            startX = margin + Math.random() * (window.innerWidth - margin * 2);
            startY = margin;
            endX = margin + Math.random() * (window.innerWidth - margin * 2);
            endY = window.innerHeight - margin;
            break;
        case 1: // Start from right edge, go to left
            startX = window.innerWidth - margin;
            startY = margin + Math.random() * (window.innerHeight - margin * 2);
            endX = margin;
            endY = margin + Math.random() * (window.innerHeight - margin * 2);
            break;
        case 2: // Start from bottom edge, go to top
            startX = margin + Math.random() * (window.innerWidth - margin * 2);
            startY = window.innerHeight - margin;
            endX = margin + Math.random() * (window.innerWidth - margin * 2);
            endY = margin;
            break;
        case 3: // Start from left edge, go to right
            startX = margin;
            startY = margin + Math.random() * (window.innerHeight - margin * 2);
            endX = window.innerWidth - margin;
            endY = margin + Math.random() * (window.innerHeight - margin * 2);
            break;
    }
    
    const rotation = Math.random() * 360;
    const duration = Math.random() * 5 + 6; // 6-11 seconds
    const delay = Math.random() * 1;
    
    heart.style.left = startX + 'px';
    heart.style.top = startY + 'px';
    
    heartsContainer.appendChild(heart);
    
    // GSAP Animation - fly across screen
    gsap.to(heart, {
        x: endX - startX,
        y: endY - startY,
        rotation: rotation,
        opacity: 0.9,
        duration: duration,
        delay: delay,
        ease: "power1.inOut",
        onStart: () => {
            gsap.to(heart, {
                opacity: 1,
                duration: 0.5
            });
        },
        onComplete: () => {
            heart.remove();
        }
    });
    
    // Add floating effect
    gsap.to(heart, {
        y: `+=${Math.random() * 100 - 50}`,
        x: `+=${Math.random() * 100 - 50}`,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
    
    // Scale animation
    gsap.to(heart, {
        scale: Math.random() * 0.3 + 0.9,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
}

// Create CSS hearts periodically
const cssHeartInterval = isMobile ? 4000 : 2000;
setInterval(createCSSHeart, cssHeartInterval);

// Initial CSS hearts
const initialCSSHearts = isMobile ? 2 : 5;
for (let i = 0; i < initialCSSHearts; i++) {
    setTimeout(createCSSHeart, i * 600);
}

// ============================================
// FLOWERS ANIMATION
// ============================================
const flowersContainer = document.getElementById('flowersContainer');
const maxFlowers = isMobile ? 2 : 8;

function createFlower() {
    if (flowersContainer.children.length >= maxFlowers) return;
    
    const flower = document.createElement('div');
    flower.className = 'flower';
    
    for (let i = 0; i < 5; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        flower.appendChild(petal);
    }
    
    const center = document.createElement('div');
    center.className = 'flower-center';
    flower.appendChild(center);
    
    const edge = Math.floor(Math.random() * 4);
    const margin = 120;
    let startX, startY, endX, endY;
    
    switch(edge) {
        case 0:
            startX = margin + Math.random() * (window.innerWidth - margin * 2);
            startY = margin;
            endX = margin + Math.random() * (window.innerWidth - margin * 2);
            endY = window.innerHeight - margin;
            break;
        case 1:
            startX = window.innerWidth - margin;
            startY = margin + Math.random() * (window.innerHeight - margin * 2);
            endX = margin;
            endY = margin + Math.random() * (window.innerHeight - margin * 2);
            break;
        case 2:
            startX = margin + Math.random() * (window.innerWidth - margin * 2);
            startY = window.innerHeight - margin;
            endX = margin + Math.random() * (window.innerWidth - margin * 2);
            endY = margin;
            break;
        case 3:
            startX = margin;
            startY = margin + Math.random() * (window.innerHeight - margin * 2);
            endX = window.innerWidth - margin;
            endY = margin + Math.random() * (window.innerHeight - margin * 2);
            break;
    }
    
    flower.style.left = startX + 'px';
    flower.style.top = startY + 'px';
    
    const rotation = Math.random() * 720 + 360;
    const duration = Math.random() * 5 + 8;
    const delay = Math.random() * 1;
    
    flowersContainer.appendChild(flower);
    
    gsap.to(flower, {
        left: endX,
        top: endY,
        rotation: rotation,
        opacity: 1,
        duration: duration,
        delay: delay,
        ease: "none",
        onComplete: () => {
            flower.remove();
        }
    });
    
    gsap.to(flower, {
        x: `+=${(Math.random() - 0.5) * 150}`,
        y: `+=${(Math.random() - 0.5) * 150}`,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
}

const flowerInterval = isMobile ? 5000 : 2500;
const initialFlowers = isMobile ? 2 : 5;
setInterval(createFlower, flowerInterval);

for (let i = 0; i < initialFlowers; i++) {
    setTimeout(createFlower, i * 900);
}

// ============================================
// BUTTERFLIES ANIMATION
// ============================================
const butterfliesContainer = document.getElementById('butterfliesContainer');
const maxButterflies = isMobile ? 2 : 6;

function createButterfly() {
    if (butterfliesContainer.children.length >= maxButterflies) return;
    
    const butterfly = document.createElement('div');
    butterfly.className = 'butterfly';
    
    const wingLeft = document.createElement('div');
    wingLeft.className = 'wing wing-left';
    butterfly.appendChild(wingLeft);
    
    const wingRight = document.createElement('div');
    wingRight.className = 'wing wing-right';
    butterfly.appendChild(wingRight);
    
    const body = document.createElement('div');
    body.className = 'butterfly-body';
    butterfly.appendChild(body);
    
    const startPosition = Math.floor(Math.random() * 8);
    const margin = 100;
    let startX, startY, endX, endY;
    
    switch(startPosition) {
        case 0:
            startX = margin;
            startY = margin;
            endX = window.innerWidth - margin;
            endY = window.innerHeight - margin;
            break;
        case 1:
            startX = window.innerWidth - margin;
            startY = margin;
            endX = margin;
            endY = window.innerHeight - margin;
            break;
        case 2:
            startX = margin;
            startY = window.innerHeight - margin;
            endX = window.innerWidth - margin;
            endY = margin;
            break;
        case 3:
            startX = window.innerWidth - margin;
            startY = window.innerHeight - margin;
            endX = margin;
            endY = margin;
            break;
        case 4:
            startX = margin + Math.random() * (window.innerWidth - margin * 2);
            startY = margin;
            endX = margin + Math.random() * (window.innerWidth - margin * 2);
            endY = window.innerHeight - margin;
            break;
        case 5:
            startX = margin + Math.random() * (window.innerWidth - margin * 2);
            startY = window.innerHeight - margin;
            endX = margin + Math.random() * (window.innerWidth - margin * 2);
            endY = margin;
            break;
        case 6:
            startX = margin;
            startY = margin + Math.random() * (window.innerHeight - margin * 2);
            endX = window.innerWidth - margin;
            endY = margin + Math.random() * (window.innerHeight - margin * 2);
            break;
        case 7:
            startX = window.innerWidth - margin;
            startY = margin + Math.random() * (window.innerHeight - margin * 2);
            endX = margin;
            endY = margin + Math.random() * (window.innerHeight - margin * 2);
            break;
    }
    
    butterfly.style.left = startX + 'px';
    butterfly.style.top = startY + 'px';
    
    const duration = Math.random() * 6 + 8;
    const delay = Math.random() * 1;
    
    butterfliesContainer.appendChild(butterfly);
    
    gsap.to(butterfly, {
        left: endX,
        top: endY,
        opacity: 1,
        duration: duration,
        delay: delay,
        ease: "none",
        onComplete: () => {
            butterfly.remove();
        }
    });
    
    gsap.to(butterfly, {
        x: `+=${(Math.random() - 0.5) * 300}`,
        y: `+=${(Math.random() - 0.5) * 200}`,
        rotation: Math.random() * 60 - 30,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
}

const butterflyInterval = isMobile ? 6000 : 3000;
const initialButterflies = isMobile ? 2 : 5;
setInterval(createButterfly, butterflyInterval);

for (let i = 0; i < initialButterflies; i++) {
    setTimeout(createButterfly, i * 1000);
}

// ============================================
// SPARKLES ANIMATION
// ============================================
const sparklesContainer = document.getElementById('sparklesContainer');
const maxSparkles = isMobile ? 10 : 25;

function createSparkle() {
    if (sparklesContainer.children.length >= maxSparkles) return;
    
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;
    
    sparkle.style.left = startX + 'px';
    sparkle.style.top = startY + 'px';
    
    const driftX = (Math.random() - 0.5) * 100;
    const driftY = (Math.random() - 0.5) * 100;
    
    sparklesContainer.appendChild(sparkle);
    
    gsap.to(sparkle, {
        opacity: 1,
        x: driftX,
        y: driftY,
        scale: 1.5,
        duration: 1.2,
        ease: "power2.out",
        onComplete: () => {
            gsap.to(sparkle, {
                opacity: 0,
                scale: 0.5,
                duration: 0.8,
                onComplete: () => {
                    sparkle.remove();
                }
            });
        }
    });
}

const sparkleInterval = isMobile ? 1000 : 300;
const initialSparkles = isMobile ? 5 : 12;
setInterval(createSparkle, sparkleInterval);

for (let i = 0; i < initialSparkles; i++) {
    setTimeout(createSparkle, i * 150);
}

// ============================================
// RESIZE HANDLER
// ============================================
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;
});

// ============================================
// CLEANUP
// ============================================
setInterval(() => {
    while (heartsContainer.children.length > maxCSSHearts) {
        heartsContainer.children[0].remove();
    }
    
    while (flowersContainer.children.length > maxFlowers) {
        flowersContainer.children[0].remove();
    }
    
    while (butterfliesContainer.children.length > maxButterflies) {
        butterfliesContainer.children[0].remove();
    }
    
    while (sparklesContainer.children.length > maxSparkles) {
        sparklesContainer.children[0].remove();
    }
}, 2000);
