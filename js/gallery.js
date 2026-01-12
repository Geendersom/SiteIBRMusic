// Desenvolvido por Geêndersom Araújo
// 12/01/2026

// Gallery JavaScript - Galeria de imagens com slider

document.addEventListener('DOMContentLoaded', function() {
  const gallery = document.querySelector('.gallery-slider');
  if (!gallery) return;
  
  const slides = gallery.querySelectorAll('.gallery-slide');
  const indicators = document.querySelectorAll('.gallery-indicator');
  const prevButton = document.querySelector('.gallery-controls--prev');
  const nextButton = document.querySelector('.gallery-controls--next');
  const counter = document.querySelector('.gallery-counter');
  
  let currentSlide = 0;
  let autoplayInterval;
  const autoplayDelay = 5000; // 5 segundos
  
  // Função para mostrar slide
  function showSlide(index) {
    // Remover active de todos os slides
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    // Adicionar active ao slide atual
    if (slides[index]) {
      slides[index].classList.add('active');
    }
    if (indicators[index]) {
      indicators[index].classList.add('active');
    }
    
    // Atualizar contador
    if (counter) {
      counter.textContent = `${index + 1} / ${slides.length}`;
    }
    
    currentSlide = index;
  }
  
  // Próximo slide
  function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }
  
  // Slide anterior
  function prevSlide() {
    const prev = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prev);
  }
  
  // Event listeners para botões
  if (nextButton) {
    nextButton.addEventListener('click', nextSlide);
  }
  
  if (prevButton) {
    prevButton.addEventListener('click', prevSlide);
  }
  
  // Event listeners para indicadores
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => showSlide(index));
  });
  
  // Navegação por teclado
  document.addEventListener('keydown', function(e) {
    if (gallery.closest('body')) {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    }
  });
  
  // Touch/swipe support para mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  gallery.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  gallery.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
  
  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - próximo
        nextSlide();
      } else {
        // Swipe right - anterior
        prevSlide();
      }
    }
  }
  
  // Autoplay
  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, autoplayDelay);
  }
  
  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
    }
  }
  
  // Pausar autoplay ao interagir
  gallery.addEventListener('mouseenter', stopAutoplay);
  gallery.addEventListener('mouseleave', startAutoplay);
  
  // Iniciar autoplay
  startAutoplay();
  
  // Mostrar primeiro slide
  if (slides.length > 0) {
    showSlide(0);
  }
  
  // Pausar autoplay quando a página não está visível
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });
});
