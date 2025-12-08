let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const currentSlideSpan = document.getElementById('currentSlide');
const totalSlidesSpan = document.getElementById('totalSlides');

totalSlidesSpan.textContent = totalSlides;

function updateSlide() {
    slides.forEach((slide, index) => {
        slide.classList.remove('active', 'prev');
        if (index === currentSlide) {
            slide.classList.add('active');
        } else if (index < currentSlide) {
            slide.classList.add('prev');
        }
    });

    // Actualizar botones
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === totalSlides - 1;

    // Actualizar indicador
    currentSlideSpan.textContent = currentSlide + 1;

    // Scroll al inicio del slide activo
    slides[currentSlide].scrollTop = 0;
    
    // Inicializar karaoke si estamos en el slide de karaoke
    if (currentSlide === 5) {
        setTimeout(checkAndInitKaraoke, 500);
    }
}

function changeSlide(direction) {
    const newSlide = currentSlide + direction;
    if (newSlide >= 0 && newSlide < totalSlides) {
        currentSlide = newSlide;
        updateSlide();
    }
}

// Navegación con teclado
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        changeSlide(-1);
    } else if (e.key === 'ArrowRight') {
        changeSlide(1);
    }
});

// Navegación con swipe (touch)
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe izquierda - siguiente
            changeSlide(1);
        } else {
            // Swipe derecha - anterior
            changeSlide(-1);
        }
    }
}

// Inicializar
updateSlide();

// Crear copos de nieve
function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';
    snowflake.innerHTML = '❄';
    snowflake.style.left = Math.random() * 100 + '%';
    snowflake.style.animationDuration = (Math.random() * 3 + 2) + 's';
    snowflake.style.opacity = Math.random();
    snowflake.style.fontSize = (Math.random() * 10 + 10) + 'px';
    document.body.appendChild(snowflake);

    setTimeout(() => {
        snowflake.remove();
    }, 5000);
}

// Crear estrellas decorativas
function createStar() {
    const star = document.createElement('div');
    star.className = 'star';
    star.innerHTML = '⭐';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDelay = Math.random() * 2 + 's';
    star.style.fontSize = (Math.random() * 15 + 15) + 'px';
    document.body.appendChild(star);
}

// Crear luces navideñas
function createChristmasLight() {
    const light = document.createElement('div');
    light.className = 'christmas-light';
    const colors = ['#ff0000', '#00ff00', '#ffff00', '#ff00ff', '#00ffff'];
    light.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    light.style.left = Math.random() * 100 + '%';
    light.style.top = Math.random() * 100 + '%';
    light.style.animationDelay = Math.random() * 2 + 's';
    document.body.appendChild(light);
}

// Generar efectos navideños
for (let i = 0; i < 30; i++) {
    setTimeout(() => createSnowflake(), i * 200);
}

for (let i = 0; i < 15; i++) {
    setTimeout(() => createStar(), i * 300);
}

for (let i = 0; i < 20; i++) {
    setTimeout(() => createChristmasLight(), i * 250);
}

// Continuar generando copos de nieve
setInterval(createSnowflake, 300);

// Funcionalidad de Karaoke - Resaltado de letras
function initKaraoke() {
    const karaokeContainer = document.querySelector('.slide.active .karaoke-container');
    if (!karaokeContainer) return;

    const video = karaokeContainer.querySelector('video');
    const lyricsLines = karaokeContainer.querySelectorAll('.lyrics-line');
    
    if (!video || lyricsLines.length === 0) return;

    let currentActiveIndex = -1;

    function updateKaraoke() {
        if (!video || video.readyState < 2) return;
        
        const currentTime = Math.floor(video.currentTime);
        let newActiveIndex = -1;

        // Encontrar la línea correspondiente al tiempo actual
        lyricsLines.forEach((line, index) => {
            const lineTime = parseInt(line.getAttribute('data-time')) || 0;
            
            // Remover clases anteriores
            line.classList.remove('active', 'passed');
            
            // Si el tiempo actual coincide o está cerca de esta línea
            if (currentTime >= lineTime && currentTime < lineTime + 3) {
                newActiveIndex = index;
                line.classList.add('active');
                
                // Scroll automático para mantener la línea visible
                line.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else if (currentTime > lineTime + 3) {
                line.classList.add('passed');
            }
        });

        // Si hay una nueva línea activa, actualizar
        if (newActiveIndex !== currentActiveIndex) {
            currentActiveIndex = newActiveIndex;
        }
    }

    // Actualizar cuando el video se reproduce
    video.addEventListener('timeupdate', updateKaraoke);
    video.addEventListener('play', updateKaraoke);
    video.addEventListener('loadedmetadata', updateKaraoke);

    // Permitir clic en las líneas para saltar al tiempo correspondiente
    lyricsLines.forEach((line) => {
        line.addEventListener('click', () => {
            const lineTime = parseInt(line.getAttribute('data-time')) || 0;
            if (video) {
                video.currentTime = lineTime;
                video.play();
            }
        });
    });
}

// Inicializar karaoke cuando el slide activo tenga contenido de karaoke
function checkAndInitKaraoke() {
    const karaokeSlide = document.querySelector('.slide.active .karaoke-container');
    if (karaokeSlide) {
        setTimeout(initKaraoke, 500);
    }
}

// Observar cambios en los slides para inicializar karaoke
const originalUpdateSlide = window.updateSlide || updateSlide;

// Interceptar la función updateSlide
const slideObserver = new MutationObserver(() => {
    checkAndInitKaraoke();
});

// Observar cambios en las clases de los slides
document.querySelectorAll('.slide').forEach(slide => {
    slideObserver.observe(slide, { attributes: true, attributeFilter: ['class'] });
});

// Inicializar si ya está en el slide de karaoke
setTimeout(checkAndInitKaraoke, 1000);

// También inicializar cuando se cambia de slide manualmente
document.addEventListener('click', (e) => {
    if (e.target.closest('.nav-btn')) {
        setTimeout(checkAndInitKaraoke, 300);
    }
});
