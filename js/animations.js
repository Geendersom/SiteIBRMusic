// Desenvolvido por Geêndersom Araújo
// 12/01/2026

// Animations JavaScript - Scroll reveal e animações

// Intersection Observer para scroll reveal - Imperceptível e preciso
const observerOptions = {
  threshold: 0.05,
  rootMargin: '0px 0px -150px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    } else {
      // Remover classe quando sair da viewport para permitir animação novamente
      entry.target.classList.remove('visible');
    }
  });
}, observerOptions);

// Inicializar animações quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  // Selecionar todos os elementos com classes de animação
  const animatedElements = document.querySelectorAll(
    '.reveal, .fade-in, .fade-in-up, .slide-in-left, .slide-in-right, .scale-in, .stagger-item, .fade-stagger'
  );
  
  // Observar cada elemento
  animatedElements.forEach(element => {
    observer.observe(element);
  });
  
  // Observer específico para a seção "Sobre o IBR Music" - texto aparece mais tarde
  // Aumentado rootMargin negativo para retardar entrada e criar ritmo de progressão
  const aboutContentObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  }, {
    threshold: 0.15, // Aumentado ligeiramente para mais precisão
    rootMargin: '0px 0px -500px 0px' // Aumentado de -400px para -500px - retarda entrada mantendo fluidez
  });
  
  // Aplicar observer específico aos elementos da seção about-content
  const aboutContentElements = document.querySelectorAll('.about-content .reveal');
  aboutContentElements.forEach(element => {
    aboutContentObserver.observe(element);
  });
  
  // Animação especial para hero - Contemplativa e cinematográfica
  const heroContent = document.querySelector('.hero__content');
  if (heroContent) {
    setTimeout(() => {
      heroContent.classList.add('loaded');
    }, 200);
  }
  
  // Animação de texto reveal
  const textReveals = document.querySelectorAll('.text-reveal');
  textReveals.forEach(textReveal => {
    observer.observe(textReveal);
    
    textReveal.addEventListener('animationend', function() {
      const spans = textReveal.querySelectorAll('span');
      spans.forEach((span, index) => {
        setTimeout(() => {
          span.style.opacity = '1';
          span.style.transform = 'translateY(0)';
        }, index * 50);
      });
    });
  });
  
  // Parallax sutil e imperceptível para elementos com classe parallax
  const parallaxElements = document.querySelectorAll('.parallax');
  
  if (parallaxElements.length > 0) {
    let ticking = false;
    
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          const scrolled = window.pageYOffset;
          
          parallaxElements.forEach(element => {
            const rate = scrolled * 0.06;
            element.style.transform = `translateY(${rate}px)`;
          });
          
          ticking = false;
        });
        
        ticking = true;
      }
    });
  }
  
  // Animação de contador (se houver)
  const counters = document.querySelectorAll('.counter');
  counters.forEach(counter => {
    observer.observe(counter);
    
    counter.addEventListener('animationstart', function() {
      const target = parseInt(counter.getAttribute('data-target'));
      const duration = 2000; // 2 segundos
      const increment = target / (duration / 16); // 60fps
      let current = 0;
      
      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.textContent = Math.floor(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };
      
      updateCounter();
    });
  });
});

// Função para animar elementos manualmente
function animateElement(element, animationClass) {
  element.classList.add(animationClass);
  setTimeout(() => {
    element.classList.add('visible');
  }, 10);
}

// Função para resetar animação
function resetAnimation(element) {
  element.classList.remove('visible');
  void element.offsetWidth; // Trigger reflow
}

// Exportar funções se necessário
if (typeof window !== 'undefined') {
  window.animateElement = animateElement;
  window.resetAnimation = resetAnimation;
}
