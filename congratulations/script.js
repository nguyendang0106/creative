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
        
        // Fade out as life decreases
        this.opacity = (this.life / this.maxLife) * 0.8;
        
        if (this.life <= 0 || this.x < 0 || this.x > canvas.width || 
            this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }
    
    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        
        // Draw glow
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
        
        // Draw particle
        ctx.fillStyle = this.color + '1)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

// Create particles
const particles = [];
const particleCount = 80;

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
        const particleCount = 60;
        
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
                p.vy += 0.05; // gravity
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
            // Draw trail
            this.trail.forEach((pos, index) => {
                fwCtx.beginPath();
                fwCtx.arc(pos.x, pos.y, 2, 0, Math.PI * 2);
                fwCtx.fillStyle = this.color;
                fwCtx.globalAlpha = index / this.trail.length;
                fwCtx.fill();
            });
            
            // Draw rocket
            fwCtx.globalAlpha = 1;
            fwCtx.beginPath();
            fwCtx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            fwCtx.fillStyle = this.color;
            fwCtx.shadowBlur = 10;
            fwCtx.shadowColor = this.color;
            fwCtx.fill();
            fwCtx.shadowBlur = 0;
        } else {
            // Draw explosion particles
            this.particles.forEach(p => {
                fwCtx.globalAlpha = p.alpha;
                fwCtx.beginPath();
                fwCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                fwCtx.fillStyle = p.color;
                fwCtx.shadowBlur = 15;
                fwCtx.shadowColor = p.color;
                fwCtx.fill();
                fwCtx.shadowBlur = 0;
            });
        }
    }
    
    isDead() {
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
    // Clear with transparency instead of black
    fwCtx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    
    fireworks.forEach((fw, index) => {
        fw.update();
        fw.draw();
        
        if (fw.isDead()) {
            fireworks.splice(index, 1);
        }
    });
    
    requestAnimationFrame(animateFireworks);
}

animateFireworks();

// Create fireworks periodically
setInterval(createFirework, 1500);

// Initial burst
for (let i = 0; i < 3; i++) {
    setTimeout(createFirework, i * 400);
}

// ============================================
// HEARTS ANIMATION
// ============================================
const heartsContainer = document.getElementById('heartsContainer');

function createHeart() {
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
    const duration = Math.random() * 5 + 6; // Faster: 6-11 seconds
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

// Create hearts periodically (more frequent for full screen coverage)
setInterval(createHeart, 2000);

// Initial hearts (more to cover screen)
for (let i = 0; i < 5; i++) {
    setTimeout(createHeart, i * 600);
}

// ============================================
// FLOWERS ANIMATION
// ============================================
const flowersContainer = document.getElementById('flowersContainer');

function createFlower() {
    const flower = document.createElement('div');
    flower.className = 'flower';
    
    // Create petals
    for (let i = 0; i < 5; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        flower.appendChild(petal);
    }
    
    // Create center
    const center = document.createElement('div');
    center.className = 'flower-center';
    flower.appendChild(center);
    
    // Random starting position from any edge - INSIDE viewport
    const edge = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
    const margin = 120; // Start from inside the screen
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
    
    const rotation = Math.random() * 720 + 360;
    const duration = Math.random() * 5 + 8; // Faster: 8-13 seconds
    const delay = Math.random() * 1;
    
    flower.style.left = startX + 'px';
    flower.style.top = startY + 'px';
    
    flowersContainer.appendChild(flower);
    
    // GSAP Animation - fly across screen
    gsap.to(flower, {
        x: endX - startX,
        y: endY - startY,
        rotation: rotation,
        opacity: 0.9,
        duration: duration,
        delay: delay,
        ease: "power1.inOut",
        onStart: () => {
            gsap.to(flower, {
                opacity: 1,
                scale: 1.1,
                duration: 1
            });
        },
        onComplete: () => {
            flower.remove();
        }
    });
    
    // Floating animation - drift effect
    gsap.to(flower, {
        y: `+=${Math.random() * 150 - 75}`,
        x: `+=${Math.random() * 150 - 75}`,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
    
    // Rotation animation for petals
    const petals = flower.querySelectorAll('.petal');
    petals.forEach((petal, index) => {
        gsap.to(petal, {
            scale: 1.08,
            duration: 1.5,
            delay: index * 0.1,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    });
}

// Create flowers periodically (more frequent for full screen coverage)
setInterval(createFlower, 2500);

// Initial flowers (more to cover screen)
for (let i = 0; i < 5; i++) {
    setTimeout(createFlower, i * 700);
}

// ============================================
// BUTTERFLIES ANIMATION
// ============================================
const butterfliesContainer = document.getElementById('butterfliesContainer');

function createButterfly() {
    const butterfly = document.createElement('div');
    butterfly.className = 'butterfly';
    
    // Create wings
    const wingLeft = document.createElement('div');
    wingLeft.className = 'wing wing-left';
    butterfly.appendChild(wingLeft);
    
    const wingRight = document.createElement('div');
    wingRight.className = 'wing wing-right';
    butterfly.appendChild(wingRight);
    
    // Create body
    const body = document.createElement('div');
    body.className = 'butterfly-body';
    butterfly.appendChild(body);
    
    // Random starting position - INSIDE viewport, fly across
    const startPosition = Math.floor(Math.random() * 8);
    const margin = 100;
    let startX, startY, endX, endY;
    
    // 8 directions: 4 corners + 4 edges
    switch(startPosition) {
        case 0: // Top-left to bottom-right (diagonal)
            startX = margin;
            startY = margin;
            endX = window.innerWidth - margin;
            endY = window.innerHeight - margin;
            break;
        case 1: // Top-right to bottom-left (diagonal)
            startX = window.innerWidth - margin;
            startY = margin;
            endX = margin;
            endY = window.innerHeight - margin;
            break;
        case 2: // Bottom-left to top-right (diagonal)
            startX = margin;
            startY = window.innerHeight - margin;
            endX = window.innerWidth - margin;
            endY = margin;
            break;
        case 3: // Bottom-right to top-left (diagonal)
            startX = window.innerWidth - margin;
            startY = window.innerHeight - margin;
            endX = margin;
            endY = margin;
            break;
        case 4: // Top to bottom
            startX = margin + Math.random() * (window.innerWidth - margin * 2);
            startY = margin;
            endX = margin + Math.random() * (window.innerWidth - margin * 2);
            endY = window.innerHeight - margin;
            break;
        case 5: // Bottom to top
            startX = margin + Math.random() * (window.innerWidth - margin * 2);
            startY = window.innerHeight - margin;
            endX = margin + Math.random() * (window.innerWidth - margin * 2);
            endY = margin;
            break;
        case 6: // Left to right
            startX = margin;
            startY = margin + Math.random() * (window.innerHeight - margin * 2);
            endX = window.innerWidth - margin;
            endY = margin + Math.random() * (window.innerHeight - margin * 2);
            break;
        case 7: // Right to left
            startX = window.innerWidth - margin;
            startY = margin + Math.random() * (window.innerHeight - margin * 2);
            endX = margin;
            endY = margin + Math.random() * (window.innerHeight - margin * 2);
            break;
    }
    
    const duration = Math.random() * 6 + 8; // Faster: 8-14 seconds
    const delay = Math.random() * 1;
    
    butterfly.style.left = startX + 'px';
    butterfly.style.top = startY + 'px';
    
    butterfliesContainer.appendChild(butterfly);
    
    // GSAP Animation - Fly diagonally across screen
    gsap.to(butterfly, {
        x: endX - startX,
        y: endY - startY,
        opacity: 0.9,
        duration: duration,
        delay: delay,
        ease: "power1.inOut",
        onStart: () => {
            gsap.to(butterfly, {
                opacity: 1,
                duration: 0.5
            });
        },
        onComplete: () => {
            butterfly.remove();
        }
    });
    
    // Sine wave motion - zigzag effect
    gsap.to(butterfly, {
        x: `+=${Math.random() * 300 - 150}`,
        y: `+=${Math.random() * 200 - 100}`,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
    
    // Random rotation
    gsap.to(butterfly, {
        rotation: Math.random() * 60 - 30,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
}

// Create butterflies periodically (more frequent for full screen coverage)
setInterval(createButterfly, 3000);

// Initial butterflies (more to cover screen)
for (let i = 0; i < 5; i++) {
    setTimeout(createButterfly, i * 800);
}

// ============================================
// SPARKLES ANIMATION
// ============================================
const sparklesContainer = document.getElementById('sparklesContainer');

function createSparkle() {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    
    // Random starting position
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;
    
    sparkle.style.left = startX + 'px';
    sparkle.style.top = startY + 'px';
    
    sparklesContainer.appendChild(sparkle);
    
    // Calculate random drift
    const driftX = (Math.random() - 0.5) * 100;
    const driftY = (Math.random() - 0.5) * 100;
    
    // GSAP Animation with drift
    gsap.to(sparkle, {
        opacity: 1,
        scale: 1.5,
        rotation: 180,
        x: driftX,
        y: driftY,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => {
            gsap.to(sparkle, {
                opacity: 0,
                scale: 0.5,
                duration: 0.4,
                onComplete: () => {
                    sparkle.remove();
                }
            });
        }
    });
}

// Create sparkles periodically (more frequent for full screen coverage)
setInterval(createSparkle, 300);

// Initial sparkles burst (more to cover screen)
for (let i = 0; i < 12; i++) {
    setTimeout(createSparkle, i * 120);
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
// TEXT ANIMATION (GSAP)
// ============================================
gsap.from('.main-title', {
    scale: 0.5,
    opacity: 0,
    duration: 1.5,
    delay: 1.2,
    ease: "back.out(1.7)"
});

gsap.from('.message', {
    y: 30,
    opacity: 0,
    duration: 1.2,
    delay: 1.8,
    ease: "power2.out"
});

gsap.from('.decorative-line', {
    scaleX: 0,
    opacity: 0,
    duration: 1,
    delay: 2.2,
    ease: "power2.out"
});

// ============================================
// EXTRA: RANDOM BURSTS
// ============================================
// Random firework bursts
setInterval(() => {
    const burstCount = 2;
    for (let i = 0; i < burstCount; i++) {
        setTimeout(createFirework, i * 200);
    }
}, 10000);

// Random sparkle bursts
setInterval(() => {
    for (let i = 0; i < 8; i++) {
        setTimeout(createSparkle, i * 100);
    }
}, 8000);

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================
// Reduce particles on mobile
if (window.innerWidth < 768) {
    const particlesToRemove = particles.length - 40;
    particles.splice(0, particlesToRemove);
}

console.log('🌸 Trang web chúc mừng đã được tải thành công! 💖');
console.log('🎆 Hiệu ứng: Pháo hoa, hoa, trái tim, bướm, sparkles!');
console.log('✨ Tất cả hiệu ứng được vẽ thực tế, không phải icon!');
