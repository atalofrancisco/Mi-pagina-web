import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import profileImage from 'figma:asset/1b9fb1ac065ff8dbebb4d451303896f136a9158e.png';
import unitTrackerLogin from 'figma:asset/026dab3e5c4d55d001500a19f32b0af140fb4ab3.png';
import unitTrackerDashboard from 'figma:asset/12ef6860e3884b6f93666494865a5286183c57db.png';
import unitTrackerNuevaCampaña from 'figma:asset/a558bbaeaa1fb8d503fd771ea1f7d4ae2db923a6.png';
import unitTrackerCampañas from 'figma:asset/6b209ff230fe8c91a94d5bc27edfffff27e5b70d.png';
import unitTrackerDetalleCampaña from 'figma:asset/0e2671a90c247480478dc08aefbd5ca74e6563e4.png';
import unitTrackerEstadisticas from 'figma:asset/b3955f73e03c365dcd3744804a95aeff7b702bd0.png';
import unitTrackerDetalleAmpliado from 'figma:asset/f988c59c95258392c63cc2b348c0ce4738706bbf.png';
import unitTrackerUnidades from 'figma:asset/2e2281e34b25f51ea84dba4ec2154f964242ec92.png';
import unitTrackerLocalizar from 'figma:asset/ac98f2591f406730222956b42b728484c2c562fc.png';
import unitTrackerEstadisticasAvanzadas from 'figma:asset/e259039978fb11074488597f7496844487e2ffb6.png';
import unitTrackerConfiguracion from 'figma:asset/8f6451bd866460451bf87c455949604ed2b8aeba.png';
import unitTrackerConfiguracionExtendida from 'figma:asset/6bf0d26c98d4077379227efd53cf1cf4223f579c.png';
import marketPlaceLogin from 'figma:asset/8b7671fb7945f723e4c0e1e2184985ac86481e42.png';
import marketPlaceRegistro from 'figma:asset/4dca62531003ed75dee33c6fcd5e7e1755e74f06.png';
import marketPlaceHome from 'figma:asset/b2cc84455f1d04c7ecbd43c3d92a715ffcbffbc5.png';
import marketPlaceHomeDark from 'figma:asset/a42101695d62a36f21d1188e9c73510091721d7c.png';
import marketPlaceFiltros from 'figma:asset/97762cccfe640f933ccc73033418c4f288430832.png';
import marketPlaceBuscar from 'figma:asset/8a34ea6b01ffc8807a1a733e0a7e8d5a58cb2e56.png';
import marketPlacePerfil from 'figma:asset/923e3e959a6a1ebe965aa229a16c95b963b45ef6.png';

// ==================== HOOKS OPTIMIZADOS ====================

// Hook de throttling para mejor rendimiento
const useThrottle = (callback, delay) => {
  const lastRan = useRef(Date.now());
  
  return useCallback((...args) => {
    if (Date.now() - lastRan.current >= delay) {
      callback(...args);
      lastRan.current = Date.now();
    }
  }, [callback, delay]);
};

// Cursor optimizado con throttling
const useCursorPersonalizado = () => {
  const [posicionMouse, setPosicionMouse] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorHover, setCursorHover] = useState(false);

  const throttledMouseMove = useThrottle((e) => {
    setPosicionMouse({ x: e.clientX, y: e.clientY });
    setCursorVisible(true);
  }, 16); // ~60fps

  useEffect(() => {
    const manejarSalidaMouse = () => setCursorVisible(false);

    document.addEventListener('mousemove', throttledMouseMove, { passive: true });
    document.addEventListener('mouseleave', manejarSalidaMouse);

    return () => {
      document.removeEventListener('mousemove', throttledMouseMove);
      document.removeEventListener('mouseleave', manejarSalidaMouse);
    };
  }, [throttledMouseMove]);

  return { posicionMouse, cursorVisible, cursorHover, setCursorHover };
};

// Ripple effect optimizado
const useEfectoRipple = () => {
  const crearRipple = useCallback((evento) => {
    const elemento = evento.currentTarget;
    const rect = elemento.getBoundingClientRect();
    const tamaño = Math.max(rect.width, rect.height);
    const x = evento.clientX - rect.left - tamaño / 2;
    const y = evento.clientY - rect.top - tamaño / 2;

    const ripple = document.createElement('div');
    ripple.className = 'ripple-effect';
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

    elemento.style.position = 'relative';
    elemento.style.overflow = 'hidden';
    elemento.appendChild(ripple);

    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }, []);

  return crearRipple;
};

// Scroll animations optimizadas
const useAnimacionesScroll = () => {
  const [elementosVisibles, setElementosVisibles] = useState(new Set());
  const observadorRef = useRef();

  useEffect(() => {
    observadorRef.current = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            setElementosVisibles(prev => new Set([...prev, entrada.target.id]));
            entrada.target.classList.add('animate-revealed');
          }
        });
      },
      { threshold: 0.1, rootMargin: '-50px' }
    );

    return () => {
      if (observadorRef.current) {
        observadorRef.current.disconnect();
      }
    };
  }, []);

  const observarElemento = useCallback((elemento) => {
    if (elemento && observadorRef.current) {
      observadorRef.current.observe(elemento);
    }
  }, []);

  return { elementosVisibles, observarElemento };
};

// Partículas optimizadas - reducidas a 50 con mejor rendimiento
const useParticulasInteractivas = (cantidad = 50) => {
  const [particulas, setParticulas] = useState([]);
  const [posicionMouse, setPosicionMouse] = useState({ x: 50, y: 50 });
  const intervalRef = useRef();

  const throttledMouseMove = useThrottle((e) => {
    setPosicionMouse({
      x: (e.clientX / window.innerWidth) * 100,
      y: (e.clientY / window.innerHeight) * 100
    });
  }, 32); // ~30fps para partículas

  useEffect(() => {
    const inicializarParticulas = () => {
      const nuevasParticulas = Array.from({ length: cantidad }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        tamaño: Math.random() * 3 + 1,
        velocidadX: (Math.random() - 0.5) * 1.5,
        velocidadY: (Math.random() - 0.5) * 1.5,
        opacidad: Math.random() * 0.6 + 0.2,
        color: `hsl(${200 + Math.random() * 40}, 60%, ${50 + Math.random() * 20}%)`,
        magnetismo: Math.random() * 0.2 + 0.05
      }));
      setParticulas(nuevasParticulas);
    };

    inicializarParticulas();
    document.addEventListener('mousemove', throttledMouseMove, { passive: true });
    
    return () => {
      document.removeEventListener('mousemove', throttledMouseMove);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [cantidad, throttledMouseMove]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setParticulas(anterior => anterior.map(particula => {
        const distanciaX = posicionMouse.x - particula.x;
        const distanciaY = posicionMouse.y - particula.y;
        const distancia = Math.sqrt(distanciaX * distanciaX + distanciaY * distanciaY);

        let nuevaVelocidadX = particula.velocidadX;
        let nuevaVelocidadY = particula.velocidadY;

        // Simplificar cálculos de magnetismo
        if (distancia < 15) {
          const fuerza = particula.magnetismo / Math.max(distancia, 1);
          nuevaVelocidadX += (distanciaX / distancia) * fuerza;
          nuevaVelocidadY += (distanciaY / distancia) * fuerza;
        }

        let nuevaX = particula.x + nuevaVelocidadX * 0.08;
        let nuevaY = particula.y + nuevaVelocidadY * 0.08;

        // Rebote en bordes simplificado
        if (nuevaX <= 0 || nuevaX >= 100) {
          nuevaVelocidadX *= -0.7;
          nuevaX = Math.max(0, Math.min(100, nuevaX));
        }
        if (nuevaY <= 0 || nuevaY >= 100) {
          nuevaVelocidadY *= -0.7;
          nuevaY = Math.max(0, Math.min(100, nuevaY));
        }

        return {
          ...particula,
          x: nuevaX,
          y: nuevaY,
          velocidadX: nuevaVelocidadX * 0.98,
          velocidadY: nuevaVelocidadY * 0.98,
          opacidad: 0.2 + Math.abs(Math.sin(Date.now() * 0.0005 + particula.id)) * 0.4
        };
      }));
    }, 33); // ~30fps

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [posicionMouse]);

  return particulas;
};

// Sonidos simplificados
const useSonidosInteractivos = () => {
  const audioContext = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.AudioContext) {
      try {
        audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
      } catch (error) {
        // Silenciar errores de audio
      }
    }
  }, []);

  const reproducirSonido = useCallback((frecuencia = 800, duracion = 100) => {
    if (!audioContext.current) return;

    try {
      const oscilador = audioContext.current.createOscillator();
      const ganancia = audioContext.current.createGain();

      oscilador.connect(ganancia);
      ganancia.connect(audioContext.current.destination);

      oscilador.frequency.setValueAtTime(frecuencia, audioContext.current.currentTime);
      oscilador.type = 'sine';

      ganancia.gain.setValueAtTime(0.05, audioContext.current.currentTime);
      ganancia.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + duracion / 1000);

      oscilador.start(audioContext.current.currentTime);
      oscilador.stop(audioContext.current.currentTime + duracion / 1000);
    } catch (error) {
      // Silenciar errores de audio
    }
  }, []);

  return {
    sonidoHover: () => reproducirSonido(600, 30),
    sonidoClick: () => reproducirSonido(800, 60),
    sonidoNavegacion: () => reproducirSonido(1000, 50),
    sonidoExito: () => reproducirSonido(523, 100)
  };
};

// Contador animado optimizado
const useContadorAnimado = (valorFinal, duracion = 2000) => {
  const [valor, setValor] = useState(0);
  const [activo, setActivo] = useState(false);

  useEffect(() => {
    if (!activo) return;
    
    let inicio = null;
    let animacionId;

    const animar = (timestamp) => {
      if (!inicio) inicio = timestamp;
      const progreso = Math.min((timestamp - inicio) / duracion, 1);
      const progresoEasing = 1 - Math.pow(1 - progreso, 3); // easeOutCubic
      
      setValor(Math.floor(valorFinal * progresoEasing));

      if (progreso < 1) {
        animacionId = requestAnimationFrame(animar);
      }
    };

    animacionId = requestAnimationFrame(animar);
    return () => {
      if (animacionId) {
        cancelAnimationFrame(animacionId);
      }
    };
  }, [valorFinal, duracion, activo]);

  return { valor, setActivo };
};

// Efecto de escritura optimizado
const useEfectoEscritura = (texto, velocidad = 100) => {
  const [textoMostrado, setTextoMostrado] = useState('');
  const [indiceActual, setIndiceActual] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    if (indiceActual < texto.length) {
      const timer = setTimeout(() => {
        setTextoMostrado(texto.slice(0, indiceActual + 1));
        setIndiceActual(indiceActual + 1);
      }, velocidad + Math.random() * 30);

      return () => clearTimeout(timer);
    }
  }, [texto, indiceActual, velocidad]);

  // Cursor parpadeante optimizado
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return { textoMostrado, cursorVisible };
};

// Parallax simplificado
const useParallax = (multiplicador = 0.5) => {
  const [offsetY, setOffsetY] = useState(0);

  const throttledScroll = useThrottle(() => {
    setOffsetY(window.pageYOffset * multiplicador);
  }, 16);

  useEffect(() => {
    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [throttledScroll]);

  return { offsetY };
};

// ==================== COMPONENTES OPTIMIZADOS ====================

const CursorPersonalizado = ({ posicion, visible, hover }) => (
  <div
    style={{
      position: 'fixed',
      left: posicion.x,
      top: posicion.y,
      width: hover ? '32px' : '16px',
      height: hover ? '32px' : '16px',
      background: hover 
        ? 'radial-gradient(circle, rgba(30, 90, 138, 0.7), rgba(59, 130, 246, 0.3))' 
        : 'radial-gradient(circle, rgba(30, 90, 138, 0.5), transparent)',
      borderRadius: '50%',
      pointerEvents: 'none',
      zIndex: 10000,
      transform: `translate(-50%, -50%) scale(${hover ? 1.2 : 1})`,
      transition: 'all 0.2s ease',
      mixBlendMode: 'screen',
      display: visible ? 'block' : 'none'
    }}
  />
);

const IconoInstagram = ({ size = 20, color = '#e2e8f0' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect 
      x="2" 
      y="2" 
      width="20" 
      height="20" 
      rx="5" 
      ry="5" 
      stroke={color} 
      strokeWidth="2"
    />
    <path 
      d="M16 11.37a4 4 0 1 1-7.74 0" 
      stroke={color} 
      strokeWidth="2"
    />
    <line 
      x1="17.5" 
      y1="6.5" 
      x2="17.51" 
      y2="6.5" 
      stroke={color} 
      strokeWidth="2"
    />
  </svg>
);

const IMAGES = {
  profile: profileImage,
  unitTracker: [
    unitTrackerLogin, unitTrackerDashboard, unitTrackerCampañas, unitTrackerDetalleCampaña,
    unitTrackerDetalleAmpliado, unitTrackerUnidades, unitTrackerLocalizar, unitTrackerNuevaCampaña,
    unitTrackerEstadisticas, unitTrackerEstadisticasAvanzadas, unitTrackerConfiguracion, unitTrackerConfiguracionExtendida
  ],
  marketplace: [
    marketPlaceLogin, marketPlaceRegistro, marketPlaceHome, marketPlaceHomeDark,
    marketPlaceFiltros, marketPlaceBuscar, marketPlacePerfil
  ]
};

const BotonMagnetico = ({ children, onClick, className = '', sonidos, setCursorHover, ...props }) => {
  const botonRef = useRef();
  const [transformacion, setTransformacion] = useState({ x: 0, y: 0 });
  const crearRipple = useEfectoRipple();

  const throttledMouseMove = useThrottle((e) => {
    if (!botonRef.current) return;
    
    const rect = botonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    setTransformacion({ 
      x: x * 0.2, 
      y: y * 0.2 
    });
  }, 16);

  const manejarSalidaMouse = useCallback(() => {
    setTransformacion({ x: 0, y: 0 });
  }, []);

  const manejarClick = useCallback((e) => {
    crearRipple(e);
    sonidos?.sonidoClick();
    onClick?.(e);
  }, [crearRipple, sonidos, onClick]);

  return (
    <button
      ref={botonRef}
      onMouseMove={throttledMouseMove}
      onMouseLeave={manejarSalidaMouse}
      onMouseEnter={() => {
        setCursorHover?.(true);
        sonidos?.sonidoHover();
      }}
      onMouseOut={() => setCursorHover?.(false)}
      onClick={manejarClick}
      className={className}
      style={{
        transform: `translate(${transformacion.x}px, ${transformacion.y}px)`,
        transition: 'transform 0.2s ease',
        cursor: 'pointer',
        ...props.style
      }}
      {...props}
    >
      {children}
    </button>
  );
};

const FondoParticulasInteractivas = () => {
  const particulas = useParticulasInteractivas(50);
  const { offsetY } = useParallax(0.05);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 1,
      transform: `translateY(${offsetY * 0.5}px)`,
      overflow: 'hidden'
    }}>
      {particulas.map(particula => (
        <div
          key={particula.id}
          style={{
            position: 'absolute',
            left: `${particula.x}%`,
            top: `${particula.y}%`,
            width: `${particula.tamaño}px`,
            height: `${particula.tamaño}px`,
            background: particula.color,
            borderRadius: '50%',
            opacity: particula.opacidad,
            filter: 'blur(0.5px)',
            boxShadow: `0 0 ${particula.tamaño * 1.5}px ${particula.color}`,
            willChange: 'transform'
          }}
        />
      ))}
    </div>
  );
};

const ComponenteImagenPerfil = ({ setCursorHover, sonidos }) => {
  const [hover, setHover] = useState(false);

  return (
    <div 
      style={{
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        background: hover 
          ? 'linear-gradient(135deg, #1e5a8a, #3b82f6, #2563eb)' 
          : 'linear-gradient(135deg, #1e5a8a, #3b82f6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto',
        border: '4px solid #1e5a8a',
        boxShadow: hover 
          ? '0 0 40px rgba(30, 90, 138, 0.6)' 
          : '0 0 20px rgba(30, 90, 138, 0.3)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.4s ease',
        cursor: 'pointer',
        transform: hover ? 'scale(1.05)' : 'scale(1)',
        animation: 'float 6s ease-in-out infinite'
      }}
      onMouseEnter={() => {
        setHover(true);
        setCursorHover(true);
        sonidos?.sonidoHover();
      }}
      onMouseLeave={() => {
        setHover(false);
        setCursorHover(false);
      }}
    >
      <img 
        src={IMAGES.profile}
        alt="Atalo Francisco - Desarrollador iOS"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '50%',
          filter: hover ? 'brightness(1.1) saturate(1.1)' : 'none',
          transition: 'filter 0.3s ease'
        }}
      />
      
      {hover && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'conic-gradient(from 0deg, transparent, rgba(255,255,255,0.1), transparent)',
          borderRadius: '50%',
          animation: 'spin 3s linear infinite'
        }} />
      )}
    </div>
  );
};

const GaleriaImagenes = ({ imagenes, titulo, indiceActual, setIndiceActual, setCursorHover, sonidos }) => {
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [previsualizar, setPrevisualizar] = useState(false);

  const siguienteImagen = useCallback(() => {
    setCargando(true);
    sonidos?.sonidoNavegacion();
    setTimeout(() => {
      setIndiceActual((anterior) => (anterior + 1) % imagenes.length);
      setCargando(false);
    }, 150);
  }, [imagenes.length, setIndiceActual, sonidos]);

  const imagenAnterior = useCallback(() => {
    setCargando(true);
    sonidos?.sonidoNavegacion();
    setTimeout(() => {
      setIndiceActual((anterior) => (anterior - 1 + imagenes.length) % imagenes.length);
      setCargando(false);
    }, 150);
  }, [imagenes.length, setIndiceActual, sonidos]);

  const abrirModal = useCallback((indice) => {
    setImagenSeleccionada(indice);
    document.body.style.overflow = 'hidden';
    sonidos?.sonidoExito();
  }, [sonidos]);

  const cerrarModal = useCallback(() => {
    setImagenSeleccionada(null);
    document.body.style.overflow = 'auto';
  }, []);

  const obtenerNombreCaptura = useCallback((indice) => {
    if (titulo === 'Unit Tracker') {
      const nombres = [
        'Inicio de Sesión', 'Dashboard Principal', 'Lista de Campañas', 'Detalle de Campaña',
        'Detalle Ampliado', 'Vista de Unidades', 'Localizar Unidad', 'Nueva Campaña',
        'Estadísticas Básicas', 'Estadísticas Avanzadas', 'Configuración Usuario', 'Configuración Extendida'
      ];
      return nombres[indice] || `Captura ${indice + 1}`;
    } else if (titulo === 'MarketPlace iOS') {
      const nombres = [
        'Inicio de Sesión', 'Registro de Usuario', 'Home Dashboard', 'Home Modo Oscuro',
        'Filtros Avanzados', 'Búsqueda Categorías', 'Mi Perfil'
      ];
      return nombres[indice] || `Captura ${indice + 1}`;
    }
    return `Captura ${indice + 1}`;
  }, [titulo]);

  const esImagenReal = useCallback((indice) => {
    if (titulo === 'Unit Tracker') return indice < 12;
    if (titulo === 'MarketPlace iOS') return indice < 7;
    return false;
  }, [titulo]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem'
    }}>
      <div 
        style={{
          position: 'relative',
          width: '200px',
          height: '400px',
          borderRadius: '25px',
          overflow: 'hidden',
          border: '8px solid #1e5a8a',
          boxShadow: previsualizar 
            ? '0 20px 50px rgba(30, 90, 138, 0.4)' 
            : '0 10px 25px rgba(30, 90, 138, 0.2)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          opacity: cargando ? 0.7 : 1,
          transform: previsualizar ? 'scale(1.03)' : 'scale(1)',
          perspective: '1000px'
        }}
        onClick={() => abrirModal(indiceActual)}
        onMouseEnter={() => {
          setPrevisualizar(true);
          setCursorHover(true);
          sonidos?.sonidoHover();
        }}
        onMouseLeave={() => {
          setPrevisualizar(false);
          setCursorHover(false);
        }}
      >
        <img 
          src={imagenes[indiceActual]}
          alt={`${titulo} - ${obtenerNombreCaptura(indiceActual)}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'all 0.3s ease',
            filter: previsualizar ? 'brightness(1.05) contrast(1.05)' : 'none'
          }}
        />

        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'rgba(0, 0, 0, 0.8)',
          color: '#ffffff',
          padding: '6px 12px',
          borderRadius: '15px',
          fontSize: '12px',
          fontWeight: 'bold',
          backdropFilter: 'blur(10px)'
        }}>
          {indiceActual + 1}/{imagenes.length}
        </div>
        
        {esImagenReal(indiceActual) && (
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            background: 'linear-gradient(45deg, #10b981, #34d399)',
            color: '#ffffff',
            padding: '6px 10px',
            borderRadius: '12px',
            fontSize: '10px',
            fontWeight: 'bold',
            animation: 'pulse 2s infinite'
          }}>
            ✓ Real
          </div>
        )}

        {cargando && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(11, 20, 38, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(4px)'
          }}>
            <div style={{
              width: '30px',
              height: '30px',
              border: '3px solid rgba(30, 90, 138, 0.3)',
              borderTop: '3px solid #1e5a8a',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
          </div>
        )}
      </div>

      <div style={{
        textAlign: 'center',
        color: '#1e5a8a',
        fontSize: '0.875rem',
        fontWeight: '600',
        marginBottom: '0.5rem',
        maxWidth: '200px',
        minHeight: '20px'
      }}>
        {obtenerNombreCaptura(indiceActual)}
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <BotonMagnetico
          onClick={imagenAnterior}
          disabled={cargando}
          sonidos={sonidos}
          setCursorHover={setCursorHover}
          style={{
            background: 'linear-gradient(135deg, #2a3441, #1e293b)',
            color: '#ffffff',
            border: '2px solid #475569',
            borderRadius: '12px',
            padding: '0.75rem 1rem',
            fontSize: '1.2rem',
            minWidth: '50px',
            opacity: cargando ? 0.5 : 1
          }}
        >
          ←
        </BotonMagnetico>

        <div style={{
          background: 'rgba(42, 52, 65, 0.8)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(71, 85, 105, 0.5)',
          borderRadius: '20px',
          padding: '0.5rem 1rem',
          color: '#94a3b8',
          fontSize: '0.875rem',
          fontWeight: '500'
        }}>
          {indiceActual + 1} de {imagenes.length}
        </div>

        <BotonMagnetico
          onClick={siguienteImagen}
          disabled={cargando}
          sonidos={sonidos}
          setCursorHover={setCursorHover}
          style={{
            background: 'linear-gradient(135deg, #2a3441, #1e293b)',
            color: '#ffffff',
            border: '2px solid #475569',
            borderRadius: '12px',
            padding: '0.75rem 1rem',
            fontSize: '1.2rem',
            minWidth: '50px',
            opacity: cargando ? 0.5 : 1
          }}
        >
          →
        </BotonMagnetico>
      </div>

      <div style={{
        display: 'flex',
        gap: titulo === 'Unit Tracker' ? '0.3rem' : '0.4rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: titulo === 'Unit Tracker' ? '420px' : '380px'
      }}>
        {imagenes.slice(0, titulo === 'Unit Tracker' ? 12 : 7).map((imagen, indice) => (
          <div
            key={indice}
            onClick={() => {
              setIndiceActual(indice);
              sonidos?.sonidoNavegacion();
            }}
            onMouseEnter={() => setCursorHover(true)}
            onMouseLeave={() => setCursorHover(false)}
            style={{
              width: titulo === 'Unit Tracker' ? '30px' : '45px',
              height: titulo === 'Unit Tracker' ? '50px' : '80px',
              borderRadius: titulo === 'Unit Tracker' ? '4px' : '8px',
              overflow: 'hidden',
              border: indice === indiceActual 
                ? '3px solid #1e5a8a' 
                : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              opacity: indice === indiceActual ? 1 : 0.6,
              position: 'relative',
              transform: indice === indiceActual ? 'scale(1.1)' : 'scale(1)'
            }}
          >
            <img 
              src={imagen}
              alt={`Miniatura ${obtenerNombreCaptura(indice)}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: indice === indiceActual ? 'brightness(1.1)' : 'brightness(0.9)'
              }}
            />
            
            {esImagenReal(indice) && (
              <div style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                background: 'linear-gradient(45deg, #10b981, #34d399)',
                color: '#ffffff',
                borderRadius: '50%',
                width: titulo === 'Unit Tracker' ? '10px' : '14px',
                height: titulo === 'Unit Tracker' ? '10px' : '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: titulo === 'Unit Tracker' ? '6px' : '8px',
                fontWeight: 'bold'
              }}>
                ✓
              </div>
            )}
          </div>
        ))}
      </div>

      {imagenSeleccionada !== null && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '2rem',
            backdropFilter: 'blur(20px)'
          }}
          onClick={cerrarModal}
        >
          <div 
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={imagenes[imagenSeleccionada]}
              alt={`${titulo} - ${obtenerNombreCaptura(imagenSeleccionada)} ampliada`}
              style={{
                maxWidth: '100%',
                maxHeight: 'calc(100% - 100px)',
                objectFit: 'contain',
                borderRadius: '20px',
                boxShadow: '0 30px 100px rgba(0, 0, 0, 0.8)'
              }}
            />
            
            <div style={{
              color: '#ffffff',
              fontSize: '1.2rem',
              fontWeight: '600',
              textAlign: 'center',
              background: 'rgba(0, 0, 0, 0.9)',
              padding: '1rem 1.5rem',
              borderRadius: '15px',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              {esImagenReal(imagenSeleccionada) && (
                <span style={{
                  background: 'linear-gradient(45deg, #10b981, #34d399)',
                  color: '#ffffff',
                  padding: '4px 8px',
                  borderRadius: '10px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  ✓ Real
                </span>
              )}
              {obtenerNombreCaptura(imagenSeleccionada)}
            </div>

            <BotonMagnetico
              onClick={cerrarModal}
              sonidos={sonidos}
              setCursorHover={setCursorHover}
              style={{
                position: 'absolute',
                top: '-15px',
                right: '-15px',
                background: 'linear-gradient(45deg, #1e5a8a, #2563eb)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                fontSize: '24px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </BotonMagnetico>
          </div>
        </div>
      )}
    </div>
  );
};

const Cabecera = ({ seccionActiva, setSeccionActiva, setCursorHover, sonidos }) => {
  const [scrolled, setScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const ultimoScroll = useRef(0);

  const throttledScroll = useThrottle(() => {
    const scrollActual = window.scrollY;
    setScrolled(scrollActual > 50);
    setNavVisible(scrollActual < ultimoScroll.current || scrollActual < 100);
    ultimoScroll.current = scrollActual;
  }, 16);

  useEffect(() => {
    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [throttledScroll]);

  const navegacion = [
    { id: 'inicio', etiqueta: 'Inicio', icono: '🏠' },
    { id: 'acerca', etiqueta: 'Acerca de', icono: '👨‍💻' },
    { id: 'habilidades', etiqueta: 'Habilidades', icono: '🚀' },
    { id: 'proyectos', etiqueta: 'Proyectos', icono: '💼' },
    { id: 'contacto', etiqueta: 'Contacto', icono: '📧' }
  ];

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: scrolled 
        ? 'rgba(11, 20, 38, 0.98)' 
        : 'rgba(11, 20, 38, 0.95)',
      backdropFilter: scrolled ? 'blur(25px)' : 'blur(10px)',
      borderBottom: `1px solid rgba(71, 85, 105, ${scrolled ? 0.6 : 0.3})`,
      zIndex: 1000,
      padding: scrolled ? '0.5rem 0' : '1rem 0',
      transition: 'all 0.4s ease',
      boxShadow: scrolled 
        ? '0 4px 30px rgba(0, 0, 0, 0.4)' 
        : 'none',
      transform: navVisible ? 'translateY(0)' : 'translateY(-100%)'
    }}>
      <nav style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 2rem'
      }}>
        <BotonMagnetico
          onClick={() => {
            setSeccionActiva('inicio');
            document.getElementById('inicio')?.scrollIntoView({ behavior: 'smooth' });
          }}
          sonidos={sonidos}
          setCursorHover={setCursorHover}
          style={{
            background: 'none',
            border: 'none',
            fontSize: scrolled ? '1.3rem' : '1.5rem',
            fontWeight: 'bold',
            color: '#1e5a8a',
            padding: '0.5rem',
            borderRadius: '8px'
          }}
        >
          Atalo Francisco
        </BotonMagnetico>
        
        <div style={{
          display: 'flex',
          gap: '1rem',
          background: 'rgba(42, 52, 65, 0.6)',
          padding: '0.5rem',
          borderRadius: '15px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {navegacion.map((item) => (
            <BotonMagnetico
              key={item.id}
              onClick={() => {
                setSeccionActiva(item.id);
                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
              }}
              sonidos={sonidos}
              setCursorHover={setCursorHover}
              style={{
                background: seccionActiva === item.id 
                  ? 'linear-gradient(45deg, #1e5a8a, #2563eb)' 
                  : 'transparent',
                border: 'none',
                color: seccionActiva === item.id ? '#ffffff' : '#94a3b8',
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                position: 'relative'
              }}
            >
              <span style={{ fontSize: '0.75rem' }}>{item.icono}</span>
              {item.etiqueta}
            </BotonMagnetico>
          ))}
        </div>
      </nav>
    </header>
  );
};

const SeccionPrincipal = ({ setCursorHover, sonidos, observarElemento }) => {
  const { textoMostrado, cursorVisible } = useEfectoEscritura('especializado en SwiftUI', 80);
  const { offsetY } = useParallax(0.02);

  return (
    <section 
      id="inicio" 
      ref={observarElemento}
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6rem 2rem 2rem',
        position: 'relative',
        zIndex: 2,
        transform: `translateY(${offsetY}px)`
      }}
    >
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <ComponenteImagenPerfil setCursorHover={setCursorHover} sonidos={sonidos} />
        
        <div 
          style={{
            background: 'linear-gradient(135deg, rgba(30, 90, 138, 0.2), rgba(59, 130, 246, 0.1))',
            border: '1px solid #1e5a8a',
            borderRadius: '25px',
            padding: '8px 20px',
            display: 'inline-block',
            marginBottom: '30px',
            marginTop: '30px',
            fontSize: '16px',
            backdropFilter: 'blur(10px)'
          }}
          onMouseEnter={() => setCursorHover(true)}
          onMouseLeave={() => setCursorHover(false)}
        >
          👋 ¡Hola! Soy Atalo Francisco
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: 'bold',
          marginBottom: '20px',
          lineHeight: '1.2'
        }}>
          <span style={{ color: '#ffffff' }}>Desarrollador iOS</span>
          <br />
          <span style={{ 
            color: '#1e5a8a', 
            minHeight: '1.2em', 
            display: 'inline-block'
          }}>
            {textoMostrado}
            <span style={{ 
              opacity: cursorVisible ? 1 : 0,
              color: '#3b82f6'
            }}>|</span>
          </span>
        </h1>

        <p style={{
          fontSize: '1.2rem',
          color: '#94a3b8',
          marginBottom: '40px',
          lineHeight: '1.6',
          maxWidth: '600px',
          margin: '0 auto 40px auto'
        }}>
          Creando aplicaciones iOS innovadoras con{' '}
          <span style={{ 
            color: '#1e5a8a', 
            fontWeight: '600'
          }}>SwiftUI</span> y{' '}
          <span style={{ 
            color: '#1e5a8a', 
            fontWeight: '600'
          }}>Firebase</span>.
          <br />
          Transformando ideas en experiencias móviles excepcionales.
        </p>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '40px'
        }}>
          {['Swift', 'SwiftUI', 'Firebase', 'Xcode', 'Face ID', 'Core Data'].map((tecnologia) => (
            <div
              key={tecnologia}
              style={{
                background: 'linear-gradient(135deg, #2a3441, #1e293b)',
                color: '#e2e8f0',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                border: '1px solid #475569',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #1e5a8a, #2563eb)';
                e.target.style.transform = 'scale(1.05) translateY(-2px)';
                setCursorHover(true);
                sonidos?.sonidoHover();
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #2a3441, #1e293b)';
                e.target.style.transform = 'scale(1) translateY(0)';
                setCursorHover(false);
              }}
            >
              {tecnologia}
            </div>
          ))}
        </div>

        <div style={{
          display: 'flex',
          gap: '15px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '50px'
        }}>
          <BotonMagnetico
            onClick={() => window.open('https://github.com/atalofrancisco', '_blank')}
            sonidos={sonidos}
            setCursorHover={setCursorHover}
            style={{
              background: 'linear-gradient(135deg, transparent, rgba(30, 90, 138, 0.1))',
              color: '#1e5a8a',
              border: '2px solid #1e5a8a',
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            🐙 GitHub
          </BotonMagnetico>

          <BotonMagnetico
            onClick={() => window.open('https://instagram.com/atalofrancisco', '_blank')}
            sonidos={sonidos}
            setCursorHover={setCursorHover}
            style={{
              background: 'linear-gradient(135deg, transparent, rgba(30, 90, 138, 0.1))',
              color: '#1e5a8a',
              border: '2px solid #1e5a8a',
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <IconoInstagram size={20} color="currentColor" />
            Instagram
          </BotonMagnetico>
        </div>
      </div>
    </section>
  );
};

const SeccionAcerca = ({ setCursorHover, sonidos, observarElemento }) => {
  const contador1 = useContadorAnimado(1, 2000);
  const contador2 = useContadorAnimado(2, 2200);
  const contador3 = useContadorAnimado(2, 2400);
  const contador4 = useContadorAnimado(100, 2800);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          contador1.setActivo(true);
          contador2.setActivo(true);
          contador3.setActivo(true);
          contador4.setActivo(true);
        }
      },
      { threshold: 0.3 }
    );

    const section = document.getElementById('acerca');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, [contador1, contador2, contador3, contador4]);

  return (
    <section 
      id="acerca" 
      ref={observarElemento}
      style={{
        padding: '6rem 2rem',
        background: 'linear-gradient(135deg, #1a2332 0%, #0f1419 100%)',
        borderTop: '1px solid #475569',
        position: 'relative',
        zIndex: 2
      }}
    >
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: '2.5rem',
          color: '#1e5a8a',
          marginBottom: '2rem',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          Acerca de Mí
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '3rem',
          alignItems: 'center'
        }}>
          <div>
            <p style={{
              fontSize: '1.1rem',
              color: '#e2e8f0',
              lineHeight: '1.8',
              marginBottom: '1.5rem'
            }}>
              Soy un desarrollador iOS apasionado con más de 1 año de experiencia creando 
              aplicaciones móviles innovadoras. Me especializo en <strong style={{color: '#1e5a8a'}}>SwiftUI</strong> y 
              <strong style={{color: '#1e5a8a'}}> Firebase</strong>, enfocándome en crear experiencias de usuario 
              excepcionales y código limpio y mantenible.
            </p>
            
            <p style={{
              fontSize: '1rem',
              color: '#94a3b8',
              lineHeight: '1.7'
            }}>
              Mi pasión por el desarrollo móvil comenzó cuando vi el potencial de crear aplicaciones 
              que realmente impacten la vida de las personas. Desde entonces, he trabajado en proyectos 
              que van desde aplicaciones de seguimiento personal hasta plataformas de marketplace, 
              siempre buscando la excelencia en cada línea de código.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1.5rem'
          }}>
            {[
              { icono: '📱', titulo: 'Desarrollo iOS', descripcion: 'SwiftUI, UIKit, Core Data' },
              { icono: '🔥', titulo: 'Firebase', descripcion: 'Auth, Firestore, Storage' },
              { icono: '🎨', titulo: 'UI/UX', descripcion: 'Diseño intuitivo y moderno' },
              { icono: '⚡', titulo: 'Rendimiento', descripcion: 'Optimización y testing' }
            ].map((habilidad, indice) => (
              <div 
                key={indice} 
                style={{
                  background: 'linear-gradient(135deg, rgba(42, 52, 65, 0.8), rgba(30, 41, 59, 0.6))',
                  padding: '1.5rem',
                  borderRadius: '15px',
                  border: '1px solid rgba(71, 85, 105, 0.3)',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.borderColor = '#1e5a8a';
                  setCursorHover(true);
                  sonidos?.sonidoHover();
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(71, 85, 105, 0.3)';
                  setCursorHover(false);
                }}
              >
                <div style={{
                  fontSize: '2.5rem', 
                  marginBottom: '0.5rem'
                }}>
                  {habilidad.icono}
                </div>
                <h3 style={{
                  color: '#1e5a8a', 
                  marginBottom: '0.5rem', 
                  fontSize: '1rem'
                }}>
                  {habilidad.titulo}
                </h3>
                <p style={{color: '#94a3b8', fontSize: '0.875rem'}}>{habilidad.descripcion}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          marginTop: '4rem',
          background: 'linear-gradient(135deg, rgba(26, 35, 50, 0.9), rgba(15, 20, 25, 0.8))',
          border: '1px solid rgba(30, 90, 138, 0.3)',
          borderRadius: '25px',
          padding: '3rem 2rem',
          backdropFilter: 'blur(20px)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '2rem',
            textAlign: 'center'
          }}>
            {[
              { numero: contador1.valor, sufijo: '+', etiqueta: 'Años Experiencia' },
              { numero: contador2.valor, sufijo: '', etiqueta: 'Apps Desarrolladas' },
              { numero: contador3.valor, sufijo: '', etiqueta: 'Proyectos Activos' },
              { numero: contador4.valor, sufijo: '%', etiqueta: 'Dedicación' }
            ].map((estadistica, indice) => (
              <div 
                key={indice} 
                style={{
                  transition: 'transform 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  setCursorHover(true);
                  sonidos?.sonidoHover();
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  setCursorHover(false);
                }}
              >
                <div style={{
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #1e5a8a, #3b82f6, #2563eb)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '0.5rem'
                }}>
                  {estadistica.numero}{estadistica.sufijo}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#94a3b8'
                }}>
                  {estadistica.etiqueta}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const SeccionHabilidades = ({ setCursorHover, sonidos, observarElemento }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const section = document.getElementById('habilidades');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const habilidades = [
    { nombre: 'Swift', nivel: 90, icono: '🟠' },
    { nombre: 'SwiftUI', nivel: 85, icono: '🔷' },
    { nombre: 'Firebase', nivel: 80, icono: '🔥' },
    { nombre: 'Xcode', nivel: 88, icono: '🔨' },
    { nombre: 'Jetpack Compose', nivel: 70, icono: '🟢' },
    { nombre: 'Git', nivel: 85, icono: '📂' }
  ];

  return (
    <section 
      id="habilidades" 
      ref={observarElemento}
      style={{
        padding: '6rem 2rem',
        backgroundColor: '#0b1426',
        position: 'relative',
        zIndex: 2
      }}
    >
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: '2.5rem',
          color: '#1e5a8a',
          marginBottom: '3rem',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          Habilidades Técnicas
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {habilidades.map((habilidad) => (
            <div 
              key={habilidad.nombre} 
              style={{
                backgroundColor: '#1a2332',
                padding: '1.5rem',
                borderRadius: '15px',
                border: '1px solid #475569',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = '#1e5a8a';
                setCursorHover(true);
                sonidos?.sonidoHover();
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#475569';
                setCursorHover(false);
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>{habilidad.icono}</span>
                <h3 style={{ color: '#ffffff', fontSize: '1.1rem', flex: 1 }}>{habilidad.nombre}</h3>
                <span style={{ color: '#1e5a8a', fontWeight: 'bold' }}>{habilidad.nivel}%</span>
              </div>
              
              <div style={{
                backgroundColor: '#2a3441',
                borderRadius: '10px',
                overflow: 'hidden',
                height: '10px'
              }}>
                <div style={{
                  backgroundColor: '#1e5a8a',
                  height: '100%',
                  width: visible ? `${habilidad.nivel}%` : '0%',
                  borderRadius: '10px',
                  transition: 'width 1.5s ease',
                  background: 'linear-gradient(90deg, #1e5a8a, #3b82f6)'
                }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: '3rem',
          textAlign: 'center'
        }}>
          <h3 style={{
            color: '#1e5a8a',
            marginBottom: '1.5rem',
            fontSize: '1.5rem'
          }}>
            Otras Tecnologías
          </h3>
          
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1rem'
          }}>
            {['Core Data', 'CloudKit', 'Notificaciones', 'MapKit', 'AVFoundation', 'StoreKit', 'WidgetKit', 'Combine'].map((tecnologia) => (
              <span 
                key={tecnologia} 
                style={{
                  backgroundColor: '#2a3441',
                  color: '#e2e8f0',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '25px',
                  fontSize: '0.875rem',
                  border: '1px solid #475569',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#1e5a8a';
                  e.target.style.transform = 'scale(1.05) translateY(-2px)';
                  setCursorHover(true);
                  sonidos?.sonidoHover();
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#2a3441';
                  e.target.style.transform = 'scale(1) translateY(0)';
                  setCursorHover(false);
                }}
              >
                {tecnologia}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const SeccionProyectos = ({ setCursorHover, sonidos, observarElemento }) => {
  const [indiceUnitTracker, setIndiceUnitTracker] = useState(0);
  const [indiceMarketplace, setIndiceMarketplace] = useState(0);

  const proyectos = [
    {
      titulo: 'Unit Tracker',
      año: '2025',
      descripcion: 'Sistema completo de localización y seguimiento de unidades desarrollado con SwiftUI y Firebase. Aplicación de nivel empresarial con autenticación biométrica, gestión colaborativa de campañas, localización granular, análisis estadístico avanzado con filtros temporales, configuración completa de usuario y herramientas de soporte integradas.',
      tecnologias: ['SwiftUI', 'Firebase', 'Face ID', 'Core Data', 'CloudKit'],
      caracteristicas: [
        'Autenticación biométrica con Face ID',
        'Dashboard en tiempo real con métricas detalladas',
        'Gestión completa de campañas multiusuario',
        'Lista y filtrado avanzado de campañas activas',
        'Vista detallada con acciones rápidas (exportar, compartir)',
        'Gestión granular de unidades con búsqueda por VIN',
        'Formulario completo de localización con ubicación específica',
        'Sistema colaborativo de equipos y permisos',
        'Estadísticas avanzadas con filtros temporales',
        'Configuración completa de usuario y preferencias',
        'Sistema de notificaciones personalizables',
        'Soporte integrado con FAQ y contacto',
        'Importación masiva de datos CSV/Excel',
        'Códigos únicos copiables para campañas',
        'Interfaz nativa optimizada para productividad'
      ],
      estado: 'En App Store Connect',
      imagenes: IMAGES.unitTracker,
      indiceActual: indiceUnitTracker,
      setIndiceActual: setIndiceUnitTracker,
      destacados: '✓ 12 capturas reales del flujo completo - Aplicación empresarial completada'
    },
    {
      titulo: 'MarketPlace iOS',
      año: '2024',
      descripcion: 'Plataforma de marketplace móvil completa con sistema de autenticación, registro de usuarios, dashboard principal, modo oscuro, filtros avanzados, búsqueda por categorías y perfil de usuario. Desarrollada con SwiftUI y diseño nativo iOS, incluye sistema completo de navegación, gestión de productos, estadísticas personalizadas y experiencia de usuario optimizada.',
      tecnologias: ['SwiftUI', 'Firebase', 'Stripe', 'MapKit'],
      caracteristicas: [
        'Sistema de autenticación completo con validación',
        'Registro de usuarios con formulario detallado',
        'Dashboard principal con búsqueda avanzada',
        'Modo oscuro nativo integrado',
        'Filtros avanzados (precio, condición, ordenamiento)',
        'Búsqueda por categorías (Electrónicos, Ropa, Hogar)',
        'Perfil de usuario con estadísticas personalizadas',
        'Sistema de rating y reputación',
        'Gestión de productos con métricas de rendimiento',
        'Dashboard de estadísticas del vendedor',
        'Acciones rápidas para gestión eficiente',
        'Sistema de navegación por pestañas',
        'Estados vacíos con call-to-action',
        'Interfaz adaptativa y responsive',
        'Integración con servicios de pago',
        'Experiencia de usuario optimizada para iOS'
      ],
      estado: 'En desarrollo',
      imagenes: IMAGES.marketplace,
      indiceActual: indiceMarketplace,
      setIndiceActual: setIndiceMarketplace,
      destacados: '✓ 7 capturas reales del flujo completo - Sistema de marketplace completado'
    }
  ];

  return (
    <section 
      id="proyectos" 
      ref={observarElemento}
      style={{
        padding: '6rem 2rem',
        backgroundColor: '#1a2332',
        borderTop: '1px solid #475569',
        position: 'relative',
        zIndex: 2
      }}
    >
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: '2.5rem',
          color: '#1e5a8a',
          marginBottom: '1rem',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          Proyectos Destacados
        </h2>
        
        <p style={{
          textAlign: 'center',
          color: '#94a3b8',
          marginBottom: '4rem',
          fontSize: '1.1rem'
        }}>
          Explora las capturas reales de mis aplicaciones iOS en funcionamiento
        </p>

        <div style={{
          display: 'grid',
          gap: '4rem'
        }}>
          {proyectos.map((proyecto, indice) => (
            <div 
              key={proyecto.titulo} 
              style={{
                display: 'grid',
                gridTemplateColumns: window.innerWidth > 768 
                  ? (indice % 2 === 0 ? '1fr 350px' : '350px 1fr') 
                  : '1fr',
                gap: '3rem',
                alignItems: 'start',
                backgroundColor: '#2a3441',
                padding: '3rem',
                borderRadius: '25px',
                border: '1px solid #475569',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(30, 90, 138, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                order: window.innerWidth > 768 ? (indice % 2 === 0 ? 1 : 2) : 1
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '1rem',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <h3 style={{
                    fontSize: '2rem',
                    color: '#ffffff',
                    marginRight: '1rem'
                  }}>
                    {proyecto.titulo}
                  </h3>
                  <span style={{
                    backgroundColor: proyecto.estado === 'En App Store Connect' ? '#3b82f6' : '#f59e0b',
                    color: '#ffffff',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    animation: 'pulse 2s infinite'
                  }}>
                    {proyecto.estado}
                  </span>
                </div>

                <div style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid #10b981',
                  borderRadius: '12px',
                  padding: '0.75rem 1.25rem',
                  marginBottom: '1.5rem',
                  display: 'inline-block'
                }}>
                  <span style={{ color: '#10b981', fontSize: '0.875rem', fontWeight: '600' }}>
                    {proyecto.destacados}
                  </span>
                </div>

                <p style={{
                  color: '#94a3b8',
                  lineHeight: '1.7',
                  marginBottom: '2rem',
                  fontSize: '1rem'
                }}>
                  {proyecto.descripcion}
                </p>

                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{
                    color: '#1e5a8a',
                    marginBottom: '1rem',
                    fontSize: '1.1rem'
                  }}>
                    Características principales:
                  </h4>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '0.5rem'
                  }}>
                    {proyecto.caracteristicas.slice(0, 8).map((caracteristica, idx) => (
                      <div 
                        key={idx} 
                        style={{
                          color: '#e2e8f0',
                          fontSize: '0.875rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          transition: 'color 0.3s ease',
                          cursor: 'default'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#e2e8f0';
                        }}
                      >
                        <span style={{ color: '#1e5a8a', fontWeight: 'bold' }}>•</span>
                        {caracteristica}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}>
                  {proyecto.tecnologias.map((tecnologia) => (
                    <span 
                      key={tecnologia} 
                      style={{
                        backgroundColor: '#1e5a8a',
                        color: '#ffffff',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#2563eb';
                        e.target.style.transform = 'scale(1.05)';
                        setCursorHover(true);
                        sonidos?.sonidoHover();
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#1e5a8a';
                        e.target.style.transform = 'scale(1)';
                        setCursorHover(false);
                      }}
                    >
                      {tecnologia}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{
                order: window.innerWidth > 768 ? (indice % 2 === 0 ? 2 : 1) : 2,
                display: 'flex',
                justifyContent: 'center'
              }}>
                <GaleriaImagenes 
                  imagenes={proyecto.imagenes}
                  titulo={proyecto.titulo}
                  indiceActual={proyecto.indiceActual}
                  setIndiceActual={proyecto.setIndiceActual}
                  setCursorHover={setCursorHover}
                  sonidos={sonidos}
                />
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: '4rem',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(30, 90, 138, 0.1), rgba(59, 130, 246, 0.05))',
          border: '1px solid #1e5a8a',
          borderRadius: '20px',
          padding: '3rem 2rem',
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{
            color: '#1e5a8a',
            marginBottom: '1rem',
            fontSize: '1.8rem',
            fontWeight: 'bold'
          }}>
            ¿Interesado en colaborar?
          </h3>
          <p style={{
            color: '#94a3b8',
            marginBottom: '2rem',
            fontSize: '1.1rem',
            maxWidth: '600px',
            margin: '0 auto 2rem auto'
          }}>
            Siempre estoy abierto a nuevos proyectos y oportunidades emocionantes.
            ¡Hablemos sobre tu próxima aplicación iOS!
          </p>
          <BotonMagnetico
            onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
            sonidos={sonidos}
            setCursorHover={setCursorHover}
            style={{
              backgroundColor: '#1e5a8a',
              color: '#ffffff',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Contactar ahora
          </BotonMagnetico>
        </div>
      </div>
    </section>
  );
};

const SeccionContacto = ({ setCursorHover, sonidos, observarElemento }) => {
  const [datosFormulario, setDatosFormulario] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  });

  const manejarEnvio = (e) => {
    e.preventDefault();
    alert(`¡Gracias ${datosFormulario.nombre}! Tu mensaje ha sido enviado. Te contactaré pronto.`);
    setDatosFormulario({ nombre: '', email: '', mensaje: '' });
    sonidos?.sonidoExito();
  };

  return (
    <section 
      id="contacto" 
      ref={observarElemento}
      style={{
        padding: '6rem 2rem',
        backgroundColor: '#0b1426',
        borderTop: '1px solid #475569',
        position: 'relative',
        zIndex: 2
      }}
    >
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: '2.5rem',
          color: '#1e5a8a',
          marginBottom: '3rem',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          Contacto
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '3rem'
        }}>
          <div>
            <h3 style={{
              color: '#ffffff',
              marginBottom: '1.5rem',
              fontSize: '1.5rem'
            }}>
              ¡Hablemos!
            </h3>
            
            <p style={{
              color: '#94a3b8',
              lineHeight: '1.6',
              marginBottom: '2rem'
            }}>
              Estoy siempre abierto a nuevas oportunidades y proyectos interesantes. 
              Si tienes una idea o simplemente quieres charlar sobre desarrollo iOS, 
              no dudes en contactarme.
            </p>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1rem',
                color: '#e2e8f0'
              }}>
                <span style={{ fontSize: '1.5rem', marginRight: '1rem' }}>📧</span>
                <span>atalofrancisco@icloud.com</span>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1rem',
                color: '#e2e8f0',
                gap: '1rem'
              }}>
                <IconoInstagram size={24} color="#e2e8f0" />
                <span>@atalofrancisco</span>
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '1rem'
            }}>
              <BotonMagnetico
                onClick={() => window.open('https://github.com/atalofrancisco', '_blank')}
                sonidos={sonidos}
                setCursorHover={setCursorHover}
                style={{
                  backgroundColor: '#2a3441',
                  color: '#ffffff',
                  border: '1px solid #475569',
                  padding: '0.75rem',
                  borderRadius: '8px'
                }}
              >
                🐙 GitHub
              </BotonMagnetico>
              
              <BotonMagnetico
                onClick={() => window.open('https://instagram.com/atalofrancisco', '_blank')}
                sonidos={sonidos}
                setCursorHover={setCursorHover}
                style={{
                  backgroundColor: '#2a3441',
                  color: '#ffffff',
                  border: '1px solid #475569',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <IconoInstagram size={20} color="#ffffff" />
                Instagram
              </BotonMagnetico>
            </div>
          </div>

          <form onSubmit={manejarEnvio} style={{
            backgroundColor: '#1a2332',
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid #475569'
          }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                color: '#e2e8f0',
                marginBottom: '0.5rem',
                fontSize: '0.875rem'
              }}>
                Nombre
              </label>
              <input
                type="text"
                value={datosFormulario.nombre}
                onChange={(e) => setDatosFormulario({...datosFormulario, nombre: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#2a3441',
                  border: '1px solid #475569',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '1rem'
                }}
                placeholder="Tu nombre completo"
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                color: '#e2e8f0',
                marginBottom: '0.5rem',
                fontSize: '0.875rem'
              }}>
                Correo Electrónico
              </label>
              <input
                type="email"
                value={datosFormulario.email}
                onChange={(e) => setDatosFormulario({...datosFormulario, email: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#2a3441',
                  border: '1px solid #475569',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '1rem'
                }}
                placeholder="tu@email.com"
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                color: '#e2e8f0',
                marginBottom: '0.5rem',
                fontSize: '0.875rem'
              }}>
                Mensaje
              </label>
              <textarea
                value={datosFormulario.mensaje}
                onChange={(e) => setDatosFormulario({...datosFormulario, mensaje: e.target.value})}
                required
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#2a3441',
                  border: '1px solid #475569',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
                placeholder="Cuéntame sobre tu proyecto o idea..."
              />
            </div>

            <BotonMagnetico
              type="submit"
              sonidos={sonidos}
              setCursorHover={setCursorHover}
              style={{
                width: '100%',
                backgroundColor: '#1e5a8a',
                color: '#ffffff',
                border: 'none',
                padding: '0.75rem',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              Enviar Mensaje
            </BotonMagnetico>
          </form>
        </div>
      </div>
    </section>
  );
};

const PiePagina = ({ setCursorHover, sonidos }) => (
  <footer style={{
    backgroundColor: '#0f1419',
    padding: '3rem 2rem 1rem',
    borderTop: '1px solid #475569',
    position: 'relative',
    zIndex: 2
  }}>
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        <div>
          <h3 style={{
            color: '#1e5a8a',
            marginBottom: '1rem',
            fontSize: '1.2rem'
          }}>
            Atalo Francisco
          </h3>
          <p style={{
            color: '#94a3b8',
            lineHeight: '1.6',
            fontSize: '0.875rem'
          }}>
            Desarrollador iOS especializado en SwiftUI y Firebase. 
            Creando aplicaciones móviles que marcan la diferencia.
          </p>
        </div>

        <div>
          <h4 style={{
            color: '#ffffff',
            marginBottom: '1rem',
            fontSize: '1rem'
          }}>
            Enlaces Rápidos
          </h4>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            {[
              { id: 'inicio', texto: 'Inicio' },
              { id: 'acerca', texto: 'Acerca de' },
              { id: 'habilidades', texto: 'Habilidades' },
              { id: 'proyectos', texto: 'Proyectos' },
              { id: 'contacto', texto: 'Contacto' }
            ].map((enlace) => (
              <BotonMagnetico
                key={enlace.id}
                onClick={() => document.getElementById(enlace.id)?.scrollIntoView({ behavior: 'smooth' })}
                sonidos={sonidos}
                setCursorHover={setCursorHover}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  textAlign: 'left',
                  padding: '0.25rem 0',
                  fontSize: '0.875rem'
                }}
              >
                {enlace.texto}
              </BotonMagnetico>
            ))}
          </div>
        </div>

        <div>
          <h4 style={{
            color: '#ffffff',
            marginBottom: '1rem',
            fontSize: '1rem'
          }}>
            Contacto
          </h4>
          <div style={{
            color: '#94a3b8',
            fontSize: '0.875rem'
          }}>
            <p style={{ marginBottom: '0.5rem' }}>📧 atalofrancisco@icloud.com</p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <IconoInstagram size={16} color="#94a3b8" />
              <span>@atalofrancisco</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        borderTop: '1px solid #475569',
        paddingTop: '1.5rem',
        textAlign: 'center',
        color: '#94a3b8',
        fontSize: '0.875rem'
      }}>
        <p>© 2025 Atalo Francisco. Todos los derechos reservados.</p>
        <p style={{ marginTop: '0.5rem' }}>
          Desarrollado con ❤️ usando React y pasión por iOS
        </p>
      </div>
    </div>
  </footer>
);

export default function App() {
  const [seccionActiva, setSeccionActiva] = useState('inicio');
  const { posicionMouse, cursorVisible, cursorHover, setCursorHover } = useCursorPersonalizado();
  const { elementosVisibles, observarElemento } = useAnimacionesScroll();
  const sonidos = useSonidosInteractivos();

  useEffect(() => {
    document.title = 'Atalo Francisco - Portfolio Desarrollador iOS';

    const estilos = document.createElement('style');
    estilos.textContent = `
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes slideUp { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
      @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
      @keyframes ripple { 0% { transform: scale(0); opacity: 1; } 100% { transform: scale(4); opacity: 0; } }
      @keyframes revealed { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      
      .animate-revealed { animation: revealed 0.6s ease forwards; }
      .ripple-effect { animation: ripple 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
      
      html { scroll-behavior: smooth; scroll-padding-top: 100px; }
      
      /* Cursor normal como fallback */
      * { cursor: auto; }
      button, a, [role="button"] { cursor: pointer; }
      input, textarea { cursor: text; }
      
      /* Optimizaciones de rendimiento */
      .gpu-accelerated { 
        transform: translateZ(0); 
        will-change: transform; 
        backface-visibility: hidden; 
      }
      
      /* Responsive */
      @media (max-width: 768px) {
        .cursor-custom { display: none !important; }
      }
    `;
    document.head.appendChild(estilos);

    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            setSeccionActiva(entrada.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    ['inicio', 'acerca', 'habilidades', 'proyectos', 'contacto'].forEach((id) => {
      const elemento = document.getElementById(id);
      if (elemento) observador.observe(elemento);
    });

    const manejarTeclado = (e) => {
      if (e.ctrlKey || e.metaKey) {
        const acciones = {
          '1': 'inicio', '2': 'acerca', '3': 'habilidades', 
          '4': 'proyectos', '5': 'contacto'
        };
        
        if (acciones[e.key]) {
          e.preventDefault();
          document.getElementById(acciones[e.key])?.scrollIntoView({ behavior: 'smooth' });
          sonidos.sonidoNavegacion();
        }
      }
    };

    window.addEventListener('keydown', manejarTeclado);

    return () => {
      observador.disconnect();
      window.removeEventListener('keydown', manejarTeclado);
      document.head.removeChild(estilos);
    };
  }, [sonidos]);

  return (
    <div className="gpu-accelerated" style={{
      backgroundColor: '#0b1426',
      color: '#ffffff',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative'
    }}>
      <div className="cursor-custom">
        <CursorPersonalizado 
          posicion={posicionMouse} 
          visible={cursorVisible} 
          hover={cursorHover} 
        />
      </div>
      
      <FondoParticulasInteractivas />
      
      <Cabecera 
        seccionActiva={seccionActiva} 
        setSeccionActiva={setSeccionActiva}
        setCursorHover={setCursorHover}
        sonidos={sonidos}
      />
      
      <SeccionPrincipal 
        setCursorHover={setCursorHover}
        sonidos={sonidos}
        observarElemento={observarElemento}
      />
      
      <SeccionAcerca 
        setCursorHover={setCursorHover}
        sonidos={sonidos}
        observarElemento={observarElemento}
      />

      <SeccionHabilidades 
        setCursorHover={setCursorHover}
        sonidos={sonidos}
        observarElemento={observarElemento}
      />

      <SeccionProyectos 
        setCursorHover={setCursorHover}
        sonidos={sonidos}
        observarElemento={observarElemento}
      />

      <SeccionContacto 
        setCursorHover={setCursorHover}
        sonidos={sonidos}
        observarElemento={observarElemento}
      />

      <PiePagina 
        setCursorHover={setCursorHover}
        sonidos={sonidos}
      />
    </div>
  );
}