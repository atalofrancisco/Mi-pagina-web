// ==================== VARIABLES GLOBALES ====================
let cursorPersonalizado = {
    elemento: null,
    x: 0,
    y: 0,
    visible: false,
    hover: false
};

let particulas = [];
let audioContext = null;
let seccionActiva = 'inicio';
let observadorScroll = null;

// Datos de las galerías
const galerias = {
    'unit-tracker': {
        imagenes: Array.from({ length: 12 }, (_, i) => `assets/images/unit-tracker/${i + 1}.png`),
        nombres: [
            'Inicio de Sesión', 'Dashboard Principal', 'Lista de Campañas', 'Detalle de Campaña',
            'Detalle Ampliado', 'Vista de Unidades', 'Localizar Unidad', 'Nueva Campaña',
            'Estadísticas Básicas', 'Estadísticas Avanzadas', 'Configuración Usuario', 'Configuración Extendida'
        ],
        indiceActual: 0
    },
    'marketplace': {
        imagenes: Array.from({ length: 7 }, (_, i) => `assets/images/marketplace/${i + 1}.png`),
        nombres: [
            'Inicio de Sesión', 'Registro de Usuario', 'Home Dashboard', 'Home Modo Oscuro',
            'Filtros Avanzados', 'Búsqueda Categorías', 'Mi Perfil'
        ],
        indiceActual: 0
    }
};
   
        nombres: [
            'Inicio de Sesión', 'Registro de Usuario', 'Home Dashboard', 'Home Modo Oscuro',
            'Filtros Avanzados', 'Búsqueda Categorías', 'Mi Perfil'
        ],
        indiceActual: 0
    }
};

// ==================== UTILIDADES ====================
function throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    
    return function (...args) {
        const currentTime = Date.now();
        
        if (currentTime - lastExecTime > delay) {
            func.apply(this, args);
            lastExecTime = currentTime;
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
                lastExecTime = Date.now();
            }, delay - (currentTime - lastExecTime));
        }
    };
}

function crearRipple(evento) {
    const elemento = evento.currentTarget;
    const rect = elemento.getBoundingClientRect();
    const tamaño = Math.max(rect.width, rect.height);
    const x = evento.clientX - rect.left - tamaño / 2;
    const y = evento.clientY - rect.top - tamaño / 2;

    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: absolute;
        width: ${tamaño}px;
        height: ${tamaño}px;
        left: ${x}px;
        top: ${y}px;
        background: radial-gradient(circle, rgba(30, 90, 138, 0.6), transparent);
        border-radius: 50%;
        pointer-events: none;
        transform: scale(0);
        animation: ripple 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 1000;
    `;

    elemento.style.position = elemento.style.position || 'relative';
    elemento.style.overflow = 'hidden';
    elemento.appendChild(ripple);

    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 600);
}

// ==================== AUDIO ====================
function inicializarAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
        console.log('Audio no disponible');
    }
}

function reproducirSonido(frecuencia = 800, duracion = 100) {
    if (!audioContext) return;

    try {
        const oscilador = audioContext.createOscillator();
        const ganancia = audioContext.createGain();

        oscilador.connect(ganancia);
        ganancia.connect(audioContext.destination);

        oscilador.frequency.setValueAtTime(frecuencia, audioContext.currentTime);
        oscilador.type = 'sine';

        ganancia.gain.setValueAtTime(0.05, audioContext.currentTime);
        ganancia.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duracion / 1000);

        oscilador.start(audioContext.currentTime);
        oscilador.stop(audioContext.currentTime + duracion / 1000);
    } catch (error) {
        // Silenciar errores
    }
}

// ==================== CURSOR PERSONALIZADO ====================
function inicializarCursor() {
    cursorPersonalizado.elemento = document.getElementById('cursor-personalizado');
    
    if (window.innerWidth <= 768) {
        cursorPersonalizado.elemento.style.display = 'none';
        document.body.style.cursor = 'auto';
        return;
    }

    const manejarMovimientoMouse = throttle((e) => {
        cursorPersonalizado.x = e.clientX;
        cursorPersonalizado.y = e.clientY;
        cursorPersonalizado.visible = true;
        actualizarCursor();
    }, 16);

    document.addEventListener('mousemove', manejarMovimientoMouse);
    document.addEventListener('mouseleave', () => {
        cursorPersonalizado.visible = false;
        actualizarCursor();
    });

    // Elementos interactivos
    const elementosInteractivos = document.querySelectorAll('button, a, .tecnologia, .habilidad-card, .tecnologia-adicional, .estadistica');
    
    elementosInteractivos.forEach(elemento => {
        elemento.addEventListener('mouseenter', () => {
            cursorPersonalizado.hover = true;
            actualizarCursor();
            reproducirSonido(600, 30);
        });
        
        elemento.addEventListener('mouseleave', () => {
            cursorPersonalizado.hover = false;
            actualizarCursor();
        });
        
        elemento.addEventListener('click', (e) => {
            crearRipple(e);
            reproducirSonido(800, 60);
        });
    });
}

function actualizarCursor() {
    if (!cursorPersonalizado.elemento) return;
    
    cursorPersonalizado.elemento.style.left = cursorPersonalizado.x + 'px';
    cursorPersonalizado.elemento.style.top = cursorPersonalizado.y + 'px';
    cursorPersonalizado.elemento.style.display = cursorPersonalizado.visible ? 'block' : 'none';
    
    if (cursorPersonalizado.hover) {
        cursorPersonalizado.elemento.classList.add('hover');
    } else {
        cursorPersonalizado.elemento.classList.remove('hover');
    }
}

// ==================== PARTÍCULAS ====================
function inicializarParticulas() {
    const contenedor = document.getElementById('particulas-fondo');
    const cantidadParticulas = window.innerWidth <= 768 ? 30 : 50;
    
    for (let i = 0; i < cantidadParticulas; i++) {
        const particula = {
            elemento: document.createElement('div'),
            x: Math.random() * 100,
            y: Math.random() * 100,
            tamaño: Math.random() * 3 + 1,
            velocidadX: (Math.random() - 0.5) * 1.5,
            velocidadY: (Math.random() - 0.5) * 1.5,
            opacidad: Math.random() * 0.6 + 0.2,
            color: `hsl(${200 + Math.random() * 40}, 60%, ${50 + Math.random() * 20}%)`,
            magnetismo: Math.random() * 0.2 + 0.05
        };
        
        particula.elemento.className = 'particula';
        particula.elemento.style.cssText = `
            left: ${particula.x}%;
            top: ${particula.y}%;
            width: ${particula.tamaño}px;
            height: ${particula.tamaño}px;
            background: ${particula.color};
            opacity: ${particula.opacidad};
            box-shadow: 0 0 ${particula.tamaño * 1.5}px ${particula.color};
        `;
        
        contenedor.appendChild(particula.elemento);
        particulas.push(particula);
    }
    
    animarParticulas();
}

function animarParticulas() {
    const mouseX = (cursorPersonalizado.x / window.innerWidth) * 100;
    const mouseY = (cursorPersonalizado.y / window.innerHeight) * 100;
    
    particulas.forEach(particula => {
        const distanciaX = mouseX - particula.x;
        const distanciaY = mouseY - particula.y;
        const distancia = Math.sqrt(distanciaX * distanciaX + distanciaY * distanciaY);
        
        if (distancia < 15) {
            const fuerza = particula.magnetismo / Math.max(distancia, 1);
            particula.velocidadX += (distanciaX / distancia) * fuerza;
            particula.velocidadY += (distanciaY / distancia) * fuerza;
        }
        
        particula.x += particula.velocidadX * 0.08;
        particula.y += particula.velocidadY * 0.08;
        
        if (particula.x <= 0 || particula.x >= 100) {
            particula.velocidadX *= -0.7;
            particula.x = Math.max(0, Math.min(100, particula.x));
        }
        if (particula.y <= 0 || particula.y >= 100) {
            particula.velocidadY *= -0.7;
            particula.y = Math.max(0, Math.min(100, particula.y));
        }
        
        particula.velocidadX *= 0.98;
        particula.velocidadY *= 0.98;
        particula.opacidad = 0.2 + Math.abs(Math.sin(Date.now() * 0.0005 + particula.x)) * 0.4;
        
        particula.elemento.style.left = particula.x + '%';
        particula.elemento.style.top = particula.y + '%';
        particula.elemento.style.opacity = particula.opacidad;
    });
    
    requestAnimationFrame(animarParticulas);
}

// ==================== NAVEGACIÓN ====================
function inicializarNavegacion() {
    const navegacion = document.getElementById('navegacion');
    const navItems = document.querySelectorAll('.nav-item');
    let ultimoScroll = 0;
    
    const manejarScroll = throttle(() => {
        const scrollActual = window.pageYOffset;
        
        // Cambiar estilo según scroll
        if (scrollActual > 50) {
            navegacion.classList.add('scrolled');
        } else {
            navegacion.classList.remove('scrolled');
        }
        
        // Auto-hide navegación
        if (scrollActual > ultimoScroll && scrollActual > 100) {
            navegacion.classList.add('hidden');
        } else {
            navegacion.classList.remove('hidden');
        }
        
        ultimoScroll = scrollActual;
    }, 16);
    
    window.addEventListener('scroll', manejarScroll);
    
    // Navegación por clicks
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const seccion = item.dataset.section;
            scrollToSection(seccion);
            actualizarNavegacionActiva(seccion);
            reproducirSonido(1000, 50);
        });
    });
    
    // Logo
    document.getElementById('logo-btn').addEventListener('click', () => {
        scrollToSection('inicio');
        actualizarNavegacionActiva('inicio');
    });
    
    // Observador de intersección para navegación activa
    inicializarObservadorScroll();
}

function inicializarObservadorScroll() {
    observadorScroll = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                actualizarNavegacionActiva(entrada.target.id);
            }
        });
    }, { threshold: 0.3 });
    
    ['inicio', 'acerca', 'habilidades', 'proyectos', 'contacto'].forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            observadorScroll.observe(elemento);
        }
    });
}

function actualizarNavegacionActiva(seccion) {
    seccionActiva = seccion;
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === seccion) {
            item.classList.add('active');
        }
    });
}

function scrollToSection(seccion) {
    document.getElementById(seccion)?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

// ==================== ANIMACIONES ====================
function inicializarAnimaciones() {
    // Efecto de escritura
    inicializarEfectoEscritura();
    
    // Contadores animados
    inicializarContadores();
    
    // Barras de progreso
    inicializarBarrasProgreso();
    
    // Animaciones al hacer scroll
    inicializarAnimacionesScroll();
}

function inicializarEfectoEscritura() {
    const texto = 'especializado en SwiftUI';
    const elemento = document.getElementById('texto-animado');
    const cursor = document.getElementById('cursor-parpadeante');
    let indice = 0;
    
    function escribir() {
        if (indice < texto.length) {
            elemento.textContent = texto.slice(0, indice + 1);
            indice++;
            setTimeout(escribir, 80 + Math.random() * 30);
        }
    }
    
    // Cursor parpadeante
    setInterval(() => {
        cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
    }, 500);
    
    setTimeout(escribir, 1000);
}

function inicializarContadores() {
    const contadores = document.querySelectorAll('.estadistica-numero');
    let animado = false;
    
    const observador = new IntersectionObserver((entradas) => {
        if (entradas[0].isIntersecting && !animado) {
            animado = true;
            contadores.forEach(contador => {
                const valorFinal = parseInt(contador.dataset.final);
                animarContador(contador, valorFinal, 2000);
            });
        }
    }, { threshold: 0.3 });
    
    const seccionAcerca = document.getElementById('acerca');
    if (seccionAcerca) {
        observador.observe(seccionAcerca);
    }
}

function animarContador(elemento, valorFinal, duracion) {
    let inicio = null;
    
    function animar(timestamp) {
        if (!inicio) inicio = timestamp;
        const progreso = Math.min((timestamp - inicio) / duracion, 1);
        const progresoEasing = 1 - Math.pow(1 - progreso, 3); // easeOutCubic
        
        elemento.textContent = Math.floor(valorFinal * progresoEasing);
        
        if (progreso < 1) {
            requestAnimationFrame(animar);
        }
    }
    
    requestAnimationFrame(animar);
}

function inicializarBarrasProgreso() {
    const barras = document.querySelectorAll('.habilidad-progreso');
    let animado = false;
    
    const observador = new IntersectionObserver((entradas) => {
        if (entradas[0].isIntersecting && !animado) {
            animado = true;
            barras.forEach(barra => {
                const anchura = barra.dataset.width;
                setTimeout(() => {
                    barra.style.width = anchura + '%';
                }, Math.random() * 500);
            });
        }
    }, { threshold: 0.3 });
    
    const seccionHabilidades = document.getElementById('habilidades');
    if (seccionHabilidades) {
        observador.observe(seccionHabilidades);
    }
}

function inicializarAnimacionesScroll() {
    const elementos = document.querySelectorAll('.habilidad-card, .proyecto, .tecnologia');
    
    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.style.animation = 'fadeIn 0.8s ease-out forwards';
            }
        });
    }, { threshold: 0.1 });
    
    elementos.forEach(elemento => {
        observador.observe(elemento);
    });
}

// ==================== GALERÍAS ====================
function inicializarGalerias() {
    Object.keys(galerias).forEach(id => {
        actualizarGaleria(id);
        inicializarMiniaturas(id);
    });
}

function actualizarGaleria(id) {
    const galeria = galerias[id];
    const container = document.getElementById(`galeria-${id}`);
    
    if (!container) return;
    
    const imagen = container.querySelector('.imagen-app');
    const contador = container.querySelector('.imagen-contador');
    const titulo = container.querySelector('.imagen-titulo');
    const info = container.querySelector('.galeria-info');
    
    imagen.src = galeria.imagenes[galeria.indiceActual];
    contador.textContent = `${galeria.indiceActual + 1}/${galeria.imagenes.length}`;
    titulo.textContent = galeria.nombres[galeria.indiceActual];
    info.textContent = `${galeria.indiceActual + 1} de ${galeria.imagenes.length}`;
    
    // Actualizar miniaturas
    const miniaturas = container.querySelectorAll('.miniatura');
    miniaturas.forEach((miniatura, index) => {
        miniatura.classList.toggle('active', index === galeria.indiceActual);
    });
    
    // Click en imagen para modal
    imagen.onclick = () => abrirModal(imagen.src, galeria.nombres[galeria.indiceActual]);
}

function siguienteImagen(id) {
    const galeria = galerias[id];
    galeria.indiceActual = (galeria.indiceActual + 1) % galeria.imagenes.length;
    actualizarGaleria(id);
    reproducirSonido(1000, 50);
}

function anteriorImagen(id) {
    const galeria = galerias[id];
    galeria.indiceActual = (galeria.indiceActual - 1 + galeria.imagenes.length) % galeria.imagenes.length;
    actualizarGaleria(id);
    reproducirSonido(1000, 50);
}

function inicializarMiniaturas(id) {
    const container = document.getElementById(`galeria-${id}`);
    const miniaturas = container.querySelectorAll('.miniatura');
    
    miniaturas.forEach((miniatura, index) => {
        miniatura.onclick = () => {
            galerias[id].indiceActual = index;
            actualizarGaleria(id);
            reproducirSonido(800, 40);
        };
    });
}

// ==================== MODAL ====================
function abrirModal(src, titulo) {
    const modal = document.getElementById('modal-imagen');
    const img = document.getElementById('modal-img');
    const tituloModal = document.getElementById('modal-titulo');
    
    img.src = src;
    tituloModal.textContent = titulo;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    reproducirSonido(523, 100);
}

function cerrarModal() {
    const modal = document.getElementById('modal-imagen');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ==================== FORMULARIO ====================
function inicializarFormulario() {
    const form = document.getElementById('contacto-form');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const mensaje = document.getElementById('mensaje').value;
        
        // Simulación de envío
        alert(`¡Gracias ${nombre}! Tu mensaje ha sido enviado. Te contactaré pronto.`);
        
        form.reset();
        reproducirSonido(523, 200);
    });
}

// ==================== ATAJOS DE TECLADO ====================
function inicializarAtajosTeclado() {
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            const acciones = {
                '1': 'inicio',
                '2': 'acerca', 
                '3': 'habilidades',
                '4': 'proyectos',
                '5': 'contacto'
            };
            
            if (acciones[e.key]) {
                e.preventDefault();
                scrollToSection(acciones[e.key]);
                reproducirSonido(1000, 50);
            }
        }
        
        if (e.key === 'Escape') {
            cerrarModal();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

// ==================== EFECTOS HOVER ====================
function inicializarEfectosHover() {
    // Tecnologías principales
    document.querySelectorAll('.tecnologia').forEach(tech => {
        tech.addEventListener('mouseenter', () => {
            tech.style.background = 'linear-gradient(135deg, var(--accent), var(--accent-light))';
            tech.style.transform = 'scale(1.05) translateY(-2px)';
            tech.style.boxShadow = '0 8px 25px rgba(30, 90, 138, 0.4)';
        });
        
        tech.addEventListener('mouseleave', () => {
            tech.style.background = 'linear-gradient(135deg, var(--bg-tertiary), var(--bg-secondary))';
            tech.style.transform = 'scale(1) translateY(0)';
            tech.style.boxShadow = 'none';
        });
    });
    
    // Tecnologías adicionales
    document.querySelectorAll('.tecnologia-adicional').forEach(tech => {
        tech.addEventListener('mouseenter', () => {
            tech.style.background = 'var(--accent)';
            tech.style.transform = 'scale(1.05) translateY(-2px)';
            tech.style.boxShadow = '0 8px 20px rgba(30, 90, 138, 0.3)';
        });
        
        tech.addEventListener('mouseleave', () => {
            tech.style.background = 'var(--bg-tertiary)';
            tech.style.transform = 'scale(1) translateY(0)';
            tech.style.boxShadow = 'none';
        });
    });
    
    // Tarjetas de habilidades
    document.querySelectorAll('.habilidad-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.borderColor = 'var(--accent)';
            card.style.boxShadow = '0 10px 30px rgba(30, 90, 138, 0.2)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.borderColor = 'rgba(71, 85, 105, 0.3)';
            card.style.boxShadow = 'none';
        });
    });
    
    // Habilidades técnicas
    document.querySelectorAll('.habilidad-tecnica').forEach(skill => {
        skill.addEventListener('mouseenter', () => {
            skill.style.transform = 'translateY(-3px)';
            skill.style.borderColor = 'var(--accent)';
            skill.style.boxShadow = '0 10px 30px rgba(30, 90, 138, 0.2)';
        });
        
        skill.addEventListener('mouseleave', () => {
            skill.style.transform = 'translateY(0)';
            skill.style.borderColor = 'var(--border)';
            skill.style.boxShadow = 'none';
        });
    });
    
    // Estadísticas
    document.querySelectorAll('.estadistica').forEach(stat => {
        stat.addEventListener('mouseenter', () => {
            stat.style.transform = 'scale(1.05)';
        });
        
        stat.addEventListener('mouseleave', () => {
            stat.style.transform = 'scale(1)';
        });
    });
    
    // Proyectos
    document.querySelectorAll('.proyecto').forEach(proyecto => {
        proyecto.addEventListener('mouseenter', () => {
            proyecto.style.transform = 'translateY(-3px)';
            proyecto.style.boxShadow = '0 15px 40px rgba(30, 90, 138, 0.1)';
        });
        
        proyecto.addEventListener('mouseleave', () => {
            proyecto.style.transform = 'translateY(0)';
            proyecto.style.boxShadow = 'none';
        });
    });
    
    // Etiquetas de tecnología en proyectos
    document.querySelectorAll('.tecnologia-tag').forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            tag.style.background = 'var(--accent-lighter)';
            tag.style.transform = 'scale(1.05)';
            tag.style.boxShadow = '0 4px 15px rgba(37, 99, 235, 0.3)';
        });
        
        tag.addEventListener('mouseleave', () => {
            tag.style.background = 'var(--accent)';
            tag.style.transform = 'scale(1)';
            tag.style.boxShadow = 'none';
        });
    });
}

// ==================== RESPONSIVE ====================
function manejarResponsive() {
    function ajustarParaMobile() {
        if (window.innerWidth <= 768) {
            // Ocultar cursor personalizado
            if (cursorPersonalizado.elemento) {
                cursorPersonalizado.elemento.style.display = 'none';
            }
            document.body.style.cursor = 'auto';
            
            // Reducir partículas
            if (particulas.length > 30) {
                particulas.splice(30).forEach(p => p.elemento.remove());
            }
        } else {
            // Mostrar cursor personalizado
            if (cursorPersonalizado.elemento) {
                cursorPersonalizado.elemento.style.display = 'block';
            }
            document.body.style.cursor = 'none';
        }
    }
    
    window.addEventListener('resize', throttle(ajustarParaMobile, 250));
    ajustarParaMobile();
}

// ==================== OPTIMIZACIONES ====================
function inicializarOptimizaciones() {
    // Lazy loading para imágenes
    const imagenes = document.querySelectorAll('img');
    const observadorImagenes = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                const img = entrada.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observadorImagenes.unobserve(img);
            }
        });
    });
    
    imagenes.forEach(img => {
        observadorImagenes.observe(img);
    });
    
    // Preload de recursos críticos
    const preloadLinks = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
    ];
    
    preloadLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        document.head.appendChild(link);
    });
}

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Inicializando Portfolio de Atalo Francisco...');
    
    // Inicializar sistemas core
    inicializarAudio();
    inicializarCursor();
    inicializarParticulas();
    
    // Inicializar navegación y UI
    inicializarNavegacion();
    inicializarAnimaciones();
    inicializarGalerias();
    inicializarFormulario();
    
    // Inicializar interacciones
    inicializarAtajosTeclado();
    inicializarEfectosHover();
    
    // Optimizaciones
    manejarResponsive();
    inicializarOptimizaciones();
    
    // Modal eventos
    document.getElementById('modal-imagen').addEventListener('click', (e) => {
        if (e.target.id === 'modal-imagen') {
            cerrarModal();
        }
    });
    
    console.log('✅ Portfolio inicializado correctamente');
    
    // Easter egg en consola
    console.log(`
    ██████╗  ██████╗ ██████╗ ████████╗███████╗ ██████╗ ██╗     ██╗ ██████╗ 
    ██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██╔════╝██╔═══██╗██║     ██║██╔═══██╗
    ██████╔╝██║   ██║██████╔╝   ██║   █████╗  ██║   ██║██║     ██║██║   ██║
    ██╔═══╝ ██║   ██║██╔══██╗   ██║   ██╔══╝  ██║   ██║██║     ██║██║   ██║
    ██║     ╚██████╔╝██║  ██║   ██║   ██║     ╚██████╔╝███████╗██║╚██████╔╝
    ╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝      ╚═════╝ ╚══════╝╚═╝ ╚═════╝ 
    
    🍎 Atalo Francisco - Desarrollador iOS
    📱 SwiftUI • Firebase • Xcode
    🚀 Atajos: Ctrl/Cmd + 1-5 para navegar
    `);
});

// Exponer funciones globales necesarias
window.scrollToSection = scrollToSection;
window.siguienteImagen = siguienteImagen;
window.anteriorImagen = anteriorImagen;
window.abrirModal = abrirModal;
window.cerrarModal = cerrarModal;
