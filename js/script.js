/**
 * Portafolio de Michelle Aspiazu - script.js
 * Interactividad moderna, animaciones dinámicas y efectos premium.
 */

document.addEventListener('DOMContentLoaded', () => {
  // === 1. CONFIGURACIÓN DEL CURSOR PERSONALIZADO ===
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');
  
  if (cursorDot && cursorOutline) {
    // Variables para suavizado del contorno
    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;
    
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // La bolita central se mueve de inmediato
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });
    
    // Animación suave del contorno usando requestAnimationFrame
    function animateOutline() {
      const ease = 0.15; // Velocidad de seguimiento
      
      outlineX += (mouseX - outlineX) * ease;
      outlineY += (mouseY - outlineY) * ease;
      
      cursorOutline.style.left = `${outlineX}px`;
      cursorOutline.style.top = `${outlineY}px`;
      
      requestAnimationFrame(animateOutline);
    }
    animateOutline();
    
    // Cambios de estado al hacer hover sobre elementos interactivos
    const interactiveElements = document.querySelectorAll('a, button, .tab-btn, .project-card, .info-item, .social-circle-link, .form-input');
    
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('hovered-link');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('hovered-link');
      });
    });
  }

  // === 2. NAVBAR SCROLL Y ACTIVE LINKS ===
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  
  // Cambiar color de la Navbar en scroll
  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
  }
  
  // Resaltar link activo en base a la sección visible
  function highlightActiveLink() {
    const scrollY = window.scrollY;
    
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  
  window.addEventListener('scroll', () => {
    handleNavbarScroll();
    highlightActiveLink();
    handleBackToTopVisibility();
  });
  
  // Llamadas iniciales
  handleNavbarScroll();
  highlightActiveLink();

  // === 3. MENÚ HAMBURGUESA (MÓVIL) ===
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
    
    // Cerrar menú móvil al hacer click en cualquier link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // === 4. ANIMACIÓN DE CONTADORES (ESTADÍSTICAS) ===
  const statsSection = document.querySelector('.stats-section');
  const statNumbers = document.querySelectorAll('.stat-number');
  let animatedStats = false;
  
  function animateCounters() {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const suffix = stat.getAttribute('data-suffix') || '';
      let count = 0;
      const duration = 2000; // 2 segundos
      const increment = target / (duration / 16); // ~60fps
      
      const updateCount = () => {
        count += increment;
        if (count < target) {
          stat.textContent = Math.floor(count) + suffix;
          requestAnimationFrame(updateCount);
        } else {
          stat.textContent = target + suffix;
        }
      };
      
      updateCount();
    });
  }
  
  // Observer para estadísticas
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animatedStats) {
          animateCounters();
          animatedStats = true;
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    statsObserver.observe(statsSection);
  }

  // === 5. BARRAS DE PROGRESO ANIMADAS (HABILIDADES) ===
  const skillsSection = document.getElementById('habilidades');
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  
  if (skillsSection && skillBars.length > 0) {
    const skillsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          skillBars.forEach(bar => {
            const progress = bar.getAttribute('data-progress');
            bar.style.width = `${progress}%`;
          });
          skillsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });
    
    skillsObserver.observe(skillsSection);
  }

  // === 6. TABS DE LA LÍNEA DE TIEMPO ===
  const tabButtons = document.querySelectorAll('.tab-btn');
  const timelinePanes = document.querySelectorAll('.timeline-content-pane');
  
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remover clase activa de botones
      tabButtons.forEach(b => b.classList.remove('active'));
      // Agregar activa al seleccionado
      btn.classList.add('active');
      
      // Pane correspondiente
      const targetPaneId = btn.getAttribute('data-tab');
      
      timelinePanes.forEach(pane => {
        pane.classList.remove('active-pane');
        if (pane.getAttribute('id') === targetPaneId) {
          pane.classList.add('active-pane');
          
          // Forzar re-trigger de animación en los items de la timeline activa
          const items = pane.querySelectorAll('.timeline-item');
          items.forEach((item, index) => {
            item.classList.remove('active-item');
            setTimeout(() => {
              item.classList.add('active-item');
            }, index * 150);
          });
        }
      });
    });
  });
  
  // Activar primera timeline al cargar
  const activePane = document.querySelector('.timeline-content-pane.active-pane');
  if (activePane) {
    const items = activePane.querySelectorAll('.timeline-item');
    items.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('active-item');
      }, index * 150);
    });
  }

  // === 7. SCROLL REVEAL (REVELAR ELEMENTOS AL HACER SCROLL) ===
  const revealElements = document.querySelectorAll('.reveal-element');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target); // Solo revelar una vez
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px' // Revelar un poco antes de entrar por completo
  });
  
  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // === 8. FORMULARIO DE CONTACTO ===
  const contactForm = document.getElementById('contact-form');
  const formMessage = document.getElementById('form-message');
  
  if (contactForm && formMessage) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Obtener inputs
      const name = document.getElementById('nombre').value.trim();
      const email = document.getElementById('correo').value.trim();
      const subject = document.getElementById('asunto').value.trim();
      const message = document.getElementById('mensaje').value.trim();
      
      // Validación básica
      if (!name || !email || !subject || !message) {
        showFormMessage('Por favor, completa todos los campos del formulario.', 'error');
        return;
      }
      
      // Simular envío con loader/animación
      const submitBtn = contactForm.querySelector('.btn-submit');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
      
      setTimeout(() => {
        // Simulación exitosa
        showFormMessage('¡Mensaje enviado con éxito! Me pondré en contacto contigo pronto.', 'success');
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }, 1500);
    });
  }
  
  function showFormMessage(msg, type) {
    formMessage.textContent = msg;
    formMessage.className = `form-message ${type}`;
    
    // Ocultar mensaje después de 5 segundos
    setTimeout(() => {
      formMessage.style.display = 'none';
    }, 5000);
  }

  // === 9. BOTÓN VOLVER ARRIBA ===
  const backToTopBtn = document.getElementById('back-to-top');
  
  function handleBackToTopVisibility() {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  }
  
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  // === 10. AÑO DE COPYRIGHT AUTOMÁTICO ===
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});
