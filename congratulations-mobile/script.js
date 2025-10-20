// ============================================
// MOBILE-OPTIMIZED VERSION
// Only CSS animations, no canvas, minimal JS
// EXTREME conservative limits for zero crashes
// ============================================

const heartsContainer = document.getElementById('heartsContainer');
const flowersContainer = document.getElementById('flowersContainer');
const sparklesContainer = document.getElementById('sparklesContainer');

// EXTREME strict limits - absolute minimum
const MAX_HEARTS = 1;      // Only 1 at a time!
const MAX_FLOWERS = 1;     // Only 1 at a time!
const MAX_SPARKLES = 3;    // Only 3 at a time!

// Performance monitoring
let frameDrops = 0;
let lastTime = Date.now();

// Check device performance
function checkPerformance() {
    const now = Date.now();
    const delta = now - lastTime;
    
    // If more than 100ms between checks, consider it a frame drop
    if (delta > 100) {
        frameDrops++;
    }
    
    lastTime = now;
    
    // If too many frame drops, reduce effects
    if (frameDrops > 10) {
        console.warn('Performance issue detected, reducing effects...');
        // Clear all effects
        heartsContainer.innerHTML = '';
        flowersContainer.innerHTML = '';
        sparklesContainer.innerHTML = '';
        frameDrops = 0;
    }
}

setInterval(checkPerformance, 50);

// ============================================
// HEARTS - Simple CSS Animation
// ============================================
function createHeart() {
    if (heartsContainer.children.length >= MAX_HEARTS) return;
    
    const heart = document.createElement('div');
    heart.className = 'heart';
    
    // Random horizontal position
    const randomX = Math.random() * (window.innerWidth - 60);
    heart.style.left = randomX + 'px';
    heart.style.bottom = '-60px';
    
    // Random animation duration - LONGER for less load
    const duration = 10 + Math.random() * 5; // 10-15 seconds (was 8-12)
    heart.style.animation = `heartFloat ${duration}s ease-out forwards`;
    
    heartsContainer.appendChild(heart);
    
    // Remove after animation
    setTimeout(() => {
        heart.remove();
    }, duration * 1000);
}

// ============================================
// FLOWERS - Simple CSS Animation
// ============================================
function createFlower() {
    if (flowersContainer.children.length >= MAX_FLOWERS) return;
    
    const flower = document.createElement('div');
    flower.className = 'flower';
    
    // Create 5 petals
    for (let i = 0; i < 5; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        flower.appendChild(petal);
    }
    
    // Create center
    const center = document.createElement('div');
    center.className = 'flower-center';
    flower.appendChild(center);
    
    // Random position - start from edges
    const edge = Math.floor(Math.random() * 4);
    let startX, startY, moveX, moveY;
    
    switch(edge) {
        case 0: // Top
            startX = Math.random() * window.innerWidth;
            startY = -70;
            moveX = (Math.random() - 0.5) * 200;
            moveY = window.innerHeight + 140;
            break;
        case 1: // Right
            startX = window.innerWidth;
            startY = Math.random() * window.innerHeight;
            moveX = -window.innerWidth - 140;
            moveY = (Math.random() - 0.5) * 200;
            break;
        case 2: // Bottom
            startX = Math.random() * window.innerWidth;
            startY = window.innerHeight;
            moveX = (Math.random() - 0.5) * 200;
            moveY = -window.innerHeight - 140;
            break;
        case 3: // Left
            startX = -70;
            startY = Math.random() * window.innerHeight;
            moveX = window.innerWidth + 140;
            moveY = (Math.random() - 0.5) * 200;
            break;
    }
    
    flower.style.left = startX + 'px';
    flower.style.top = startY + 'px';
    flower.style.setProperty('--tx', moveX + 'px');
    flower.style.setProperty('--ty', moveY + 'px');
    
    const duration = 12 + Math.random() * 6; // 12-18 seconds (was 10-15)
    flower.style.animation = `flowerFloat ${duration}s ease-in-out forwards`;
    
    flowersContainer.appendChild(flower);
    
    // Remove after animation
    setTimeout(() => {
        flower.remove();
    }, duration * 1000);
}

// ============================================
// SPARKLES - Ultra Simple
// ============================================
function createSparkle() {
    if (sparklesContainer.children.length >= MAX_SPARKLES) return;
    
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    
    // Random position
    sparkle.style.left = Math.random() * window.innerWidth + 'px';
    sparkle.style.top = Math.random() * window.innerHeight + 'px';
    
    const duration = 1.5 + Math.random(); // 1.5-2.5 seconds
    sparkle.style.animation = `sparkleShine ${duration}s ease-in-out forwards`;
    
    sparklesContainer.appendChild(sparkle);
    
    // Remove after animation
    setTimeout(() => {
        sparkle.remove();
    }, duration * 1000);
}

// ============================================
// TIMING - EXTREMELY slow for maximum stability
// ============================================

// Initial effects - minimal start
setTimeout(createHeart, 1000);
setTimeout(createSparkle, 500);

// Periodic creation - VERY SLOW
setInterval(createHeart, 8000);      // Every 8 seconds
setInterval(createFlower, 10000);    // Every 10 seconds
setInterval(createSparkle, 4000);    // Every 4 seconds

// ============================================
// CLEANUP - More aggressive cleanup
// ============================================
setInterval(() => {
    // Clean up ANY elements immediately if over limit
    while (heartsContainer.children.length > MAX_HEARTS) {
        heartsContainer.children[0].remove();
    }
    
    while (flowersContainer.children.length > MAX_FLOWERS) {
        flowersContainer.children[0].remove();
    }
    
    while (sparklesContainer.children.length > MAX_SPARKLES) {
        sparklesContainer.children[0].remove();
    }
}, 2000); // Check every 2 seconds (was 5)

// Emergency cleanup - force remove all if too many total
setInterval(() => {
    const totalElements = heartsContainer.children.length + 
                         flowersContainer.children.length + 
                         sparklesContainer.children.length;
    
    // If more than 5 total elements, clear everything
    if (totalElements > 5) {
        console.warn('Too many elements, clearing...');
        while (heartsContainer.children.length > 0) {
            heartsContainer.children[0].remove();
        }
        while (flowersContainer.children.length > 0) {
            flowersContainer.children[0].remove();
        }
        while (sparklesContainer.children.length > 1) {
            sparklesContainer.children[0].remove();
        }
    }
}, 3000);
