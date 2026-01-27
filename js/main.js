// Desenvolvido por Geêndersom Araújo
// 12/01/2026

// Main JavaScript - Funcionalidades principais

// Header scroll effect
document.addEventListener('DOMContentLoaded', function() {
  const header = document.querySelector('.header');
  const quemSomosSection = document.querySelector('.quem-somos-section');
  const quemSomosTitle = document.querySelector('.quem-somos-title');
  const quemSomosText = document.querySelector('.quem-somos-text');
  const conviteSection = document.querySelector('.convite-section');
  
  if (header) {
    let lastScroll = 0;
    let ticking = false;
    
    function handleScroll() {
      if (ticking) return;
      ticking = true;
      
      requestAnimationFrame(() => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        
        // ===== HEADER MUDA DE COR QUANDO SEÇÃO BRANCA TOCA =====
        // Seção de convite (branca) - mudar header para branco quando tocar
        // Quando a seção branca sair do topo, voltar header para preto imediatamente
        if (conviteSection) {
          const conviteRect = conviteSection.getBoundingClientRect();
          const headerHeight = header.offsetHeight;
          
          // Verificar se a seção de convite está tocando o header
          // Header branco apenas quando a seção branca está visível no topo
          if (conviteRect.top <= headerHeight && conviteRect.bottom > 0) {
            header.classList.add('header--white');
          } else {
            // Quando a seção branca sair do topo, voltar para preto imediatamente
            header.classList.remove('header--white');
          }
        }
        
        // ===== TÍTULO APARECE QUANDO SEÇÃO ESTÁ VISÍVEL =====
        if (quemSomosTitle && quemSomosSection) {
          const sectionRect = quemSomosSection.getBoundingClientRect();
          const sectionTop = sectionRect.top;
          const viewportHeight = window.innerHeight;
          
          // Título aparece quando a seção está visível
          if (sectionRect.bottom > 0 && sectionTop < viewportHeight) {
            quemSomosTitle.classList.add('visible');
            
            // Aplicar opacidade e transform
            requestAnimationFrame(() => {
              quemSomosTitle.style.opacity = '1';
              quemSomosTitle.style.transform = 'translateY(0)';
            });
          } else {
            // Remover classe quando sair da viewport para permitir animação novamente
            quemSomosTitle.classList.remove('visible');
            quemSomosTitle.style.opacity = '0';
            quemSomosTitle.style.transform = 'translateY(60px)';
          }
        }
        
        // ===== TEXTO APARECE PROGRESSIVAMENTE =====
        if (quemSomosText && quemSomosSection) {
          const sectionRect = quemSomosSection.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          
          if (sectionRect.top < viewportHeight * 0.7 && sectionRect.bottom > 0) {
            const textProgress = Math.max(0, Math.min(1, (viewportHeight * 0.7 - sectionRect.top) / (viewportHeight * 0.3)));
            const textOpacity = Math.min(1, textProgress);
            const textOffset = 30 * (1 - textProgress);
            
            requestAnimationFrame(() => {
              quemSomosText.style.opacity = textOpacity;
              quemSomosText.style.transform = `translateY(${textOffset}px)`;
              if (textOpacity > 0.3) {
                quemSomosText.classList.add('visible');
              }
            });
          } else if (sectionRect.bottom < 0 || sectionRect.top > viewportHeight) {
            // Remover classe quando sair da viewport para permitir animação novamente
            quemSomosText.classList.remove('visible');
            quemSomosText.style.opacity = '0';
            quemSomosText.style.transform = 'translateY(30px)';
          }
        }
        
        lastScroll = currentScroll;
        ticking = false;
      });
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial checks
    handleScroll();
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.header__menu-toggle');
    const nav = document.querySelector('.header__nav');
    
    if (menuToggle && nav) {
      menuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
        
        // Animate hamburger
        const spans = menuToggle.querySelectorAll('span');
        if (nav.classList.contains('active')) {
          spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
          spans[1].style.opacity = '0';
          spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
          spans[0].style.transform = 'none';
          spans[1].style.opacity = '1';
          spans[2].style.transform = 'none';
        }
      });
      
      // Close menu when clicking on a link
      const navLinks = nav.querySelectorAll('.header__nav-link');
      navLinks.forEach(link => {
        link.addEventListener('click', function() {
          nav.classList.remove('active');
          const spans = menuToggle.querySelectorAll('span');
          spans[0].style.transform = 'none';
          spans[1].style.opacity = '1';
          spans[2].style.transform = 'none';
        });
      });
    }
    
    // Smooth scroll for anchor links (if any)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      });
    });
    
    // Form submission handler
    const form = document.querySelector('.inscription-form');
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
          if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = '#dc3545';
          } else {
            field.style.borderColor = '';
          }
        });
        
        // Validate email format
        const emailField = form.querySelector('[type="email"]');
        if (emailField && emailField.value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(emailField.value)) {
            isValid = false;
            emailField.style.borderColor = '#dc3545';
          }
        }
        
        if (!isValid) {
          return;
        }
        
        // Show success message
        const successMessage = form.querySelector('.form-success');
        if (successMessage) {
          successMessage.classList.add('active');
          form.reset();
          
          // Scroll to success message
          successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          
          // Hide after 5 seconds
          setTimeout(() => {
            successMessage.classList.remove('active');
          }, 5000);
        }
        
        // Log form data (in production, send to server)
        console.log('Form submitted:', data);
      });
    }
    
    // Parallax effect for hero images
    const heroBackground = document.querySelector('.hero__background');
    if (heroBackground) {
      window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;
        heroBackground.style.transform = `translateY(${rate}px)`;
      });
    }
  }
});

// Utility function to check if element is in viewport
function isInViewport(element, offset = 0) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= -offset &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * MVV Navigation - Navegação simples por setas
 * 
 * Comportamento:
 * 1. Scroll totalmente normal (sem interceptação)
 * 2. Título sticky no topo (via CSS)
 * 3. Apenas UM card visível por vez
 * 4. Navegação exclusiva por setas
 * 5. Conteúdo do card aparece apenas quando seção toca o topo
 */
function initMVVScrollAnimation() {
  const mvvSection = document.querySelector('.section--dark:has(.mvv-preview)');
  const cards = document.querySelectorAll('.mvv-preview__card');
  const prevButton = document.querySelector('.mvv-controls--prev');
  const nextButton = document.querySelector('.mvv-controls--next');
  
  if (!cards || cards.length === 0) return;
  
  const cardsArray = Array.from(cards);
  let currentIndex = 0;
  let isTransitioning = false;
  
  // Configurações
  const TRANSITION_DURATION = 800; // ms - aumentado para transição mais suave
  
  // ===== INICIALIZAÇÃO =====
  
  // Mostrar primeiro card como ativo
  cardsArray.forEach((card, index) => {
    card.classList.remove('active', 'exiting', 'entering', 'exiting-next', 'exiting-prev', 'entering-next', 'entering-prev');
    if (index === 0) {
      card.classList.add('active');
    }
  });
  
  // ===== NAVEGAÇÃO DE CARDS =====
  
  /**
   * Ativa um card específico com transição suave
   * @param {number} index - Índice do card a ativar
   */
  function showCard(index) {
    if (index < 0 || index >= cardsArray.length || isTransitioning) return;
    if (index === currentIndex) return; // Já está ativo
    
    isTransitioning = true;
    const currentCard = cardsArray[currentIndex];
    const targetCard = cardsArray[index];
    
    // Determinar direção baseada no índice
    const direction = index > currentIndex ? 'next' : 'prev';
    
    // Resetar conteúdo do card atual (esconder)
    const currentTitle = currentCard.querySelector('.mvv-preview__title');
    const currentText = currentCard.querySelector('.mvv-preview__text');
    const currentList = currentCard.querySelector('.mvv-preview__list');
    const currentVerse = currentCard.querySelector('.mvv-preview__verse');
    if (currentTitle) currentTitle.style.opacity = '0';
    if (currentText) currentText.style.opacity = '0';
    if (currentList) currentList.style.opacity = '0';
    if (currentVerse) currentVerse.style.opacity = '0';
    
    // Marcar card atual como saindo
    currentCard.classList.remove('active');
    currentCard.classList.add('exiting', `exiting-${direction}`);
    
    // Marcar próximo card como entrando
    targetCard.classList.remove('exiting', 'entering', 'exiting-next', 'exiting-prev', 'entering-next', 'entering-prev');
    targetCard.classList.add('entering', `entering-${direction}`);
    
    // Forçar reflow para garantir que as classes sejam aplicadas
    void targetCard.offsetHeight;
    
    // Após metade da transição, ativar próximo card
    setTimeout(() => {
      currentCard.classList.remove('exiting', 'exiting-next', 'exiting-prev');
      targetCard.classList.remove('entering', 'entering-next', 'entering-prev');
      targetCard.classList.add('active');
      currentIndex = index;
      
      // Se a seção está no topo, mostrar conteúdo do novo card
      if (mvvSection && mvvSection.classList.contains('mvv-section--at-top')) {
        const targetTitle = targetCard.querySelector('.mvv-preview__title');
        const targetText = targetCard.querySelector('.mvv-preview__text');
        const targetList = targetCard.querySelector('.mvv-preview__list');
        const targetVerse = targetCard.querySelector('.mvv-preview__verse');
        if (targetTitle) targetTitle.style.opacity = '1';
        if (targetText) targetText.style.opacity = '1';
        if (targetList) targetList.style.opacity = '1';
        if (targetVerse) targetVerse.style.opacity = '1';
      }
      
      // Permitir próxima transição após animação completa
      setTimeout(() => {
        isTransitioning = false;
      }, TRANSITION_DURATION / 2);
    }, TRANSITION_DURATION / 2);
  }
  
  /**
   * Próximo card - navegação circular
   */
  function nextCard() {
    if (!isTransitioning) {
      const nextIndex = (currentIndex + 1) % cardsArray.length;
      showCard(nextIndex);
    }
  }
  
  /**
   * Card anterior - navegação circular
   */
  function prevCard() {
    if (!isTransitioning) {
      const prevIndex = (currentIndex - 1 + cardsArray.length) % cardsArray.length;
      showCard(prevIndex);
    }
  }
  
  // ===== EVENT LISTENERS =====
  
  // Event listeners para setas
  if (nextButton) {
    nextButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      nextCard();
    });
  }
  
  if (prevButton) {
    prevButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      prevCard();
    });
  }
  
  // Navegação por teclado (opcional, apenas quando seção está visível)
  document.addEventListener('keydown', function(e) {
    if (!mvvSection) return;
    
    const sectionRect = mvvSection.getBoundingClientRect();
    const isSectionVisible = sectionRect.top < window.innerHeight && sectionRect.bottom > 0;
    
    if (isSectionVisible && !isTransitioning) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevCard();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextCard();
      }
    }
  });
  
  // ===== DETECÇÃO DE TOPO DA SEÇÃO =====
  
  /**
   * Verifica se a seção tocou o topo da página
   */
  function checkSectionAtTop() {
    if (!mvvSection) return;
    
    const sectionRect = mvvSection.getBoundingClientRect();
    const headerHeight = 80; // Altura do header
    
    // Quando a seção toca o topo (considerando header)
    if (sectionRect.top <= headerHeight + 50) {
      if (!mvvSection.classList.contains('mvv-section--at-top')) {
        mvvSection.classList.add('mvv-section--at-top');
        
        // Mostrar conteúdo do card ativo quando seção chega no topo
        const activeCard = cardsArray[currentIndex];
        if (activeCard && activeCard.classList.contains('active')) {
          const title = activeCard.querySelector('.mvv-preview__title');
          const text = activeCard.querySelector('.mvv-preview__text');
          const list = activeCard.querySelector('.mvv-preview__list');
          const verse = activeCard.querySelector('.mvv-preview__verse');
          if (title) title.style.opacity = '1';
          if (text) text.style.opacity = '1';
          if (list) list.style.opacity = '1';
          if (verse) verse.style.opacity = '1';
        }
      }
    } else {
      mvvSection.classList.remove('mvv-section--at-top');
      
      // Esconder conteúdo quando seção sai do topo
      cardsArray.forEach(card => {
        const title = card.querySelector('.mvv-preview__title');
        const text = card.querySelector('.mvv-preview__text');
        const list = card.querySelector('.mvv-preview__list');
        const verse = card.querySelector('.mvv-preview__verse');
        if (title) title.style.opacity = '0';
        if (text) text.style.opacity = '0';
        if (list) list.style.opacity = '0';
        if (verse) verse.style.opacity = '0';
      });
    }
  }
  
  // Verificar no scroll
  let ticking = false;
  function handleScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        checkSectionAtTop();
        ticking = false;
      });
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Verificar inicialmente
  checkSectionAtTop();
  
  // ===== APROXIMAÇÃO DO CARD AO TÍTULO DURANTE O SCROLL =====
  
  const mvvPreview = document.querySelector('.mvv-preview');
  const mvvHeader = document.querySelector('.mvv-header');
  
  if (mvvSection && mvvPreview && mvvHeader) {
    function updateCardPosition() {
      const sectionRect = mvvSection.getBoundingClientRect();
      const headerRect = mvvHeader.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Quando a seção entra na viewport
      if (sectionRect.top < viewportHeight && sectionRect.bottom > 0) {
        // Calcular progresso baseado na posição do header
        const headerTop = headerRect.top;
        const stickyTop = 80; // Posição sticky do header
        
        // Progresso: 0 quando header está longe, 1 quando está no sticky
        const distanceToSticky = headerTop - stickyTop;
        const maxDistance = 300; // Distância máxima para começar aproximação
        const progress = Math.max(0, Math.min(1, 1 - (distanceToSticky / maxDistance)));
        
        // Aplicar transformação: move o card para cima conforme o progresso
        // Máximo de 150px de movimento para cima
        const translateY = -150 * progress;
        mvvPreview.style.transform = `translateY(${translateY}px)`;
        mvvPreview.style.transition = 'transform 0.1s ease-out';
      }
    }
    
    // Atualizar posição no scroll
    let positionTicking = false;
    function handlePositionScroll() {
      if (!positionTicking) {
        window.requestAnimationFrame(() => {
          updateCardPosition();
          positionTicking = false;
        });
        positionTicking = true;
      }
    }
    
    window.addEventListener('scroll', handlePositionScroll, { passive: true });
    updateCardPosition(); // Inicial
  }
}

// ===== REVELAÇÃO DO TÍTULO NO SCROLL - SEÇÃO QUEM SOMOS =====
function initAboutHeroReveal() {
  const aboutHeroContent = document.querySelector('.about-hero__content');
  const aboutHero = document.querySelector('.about-hero');
  
  if (!aboutHeroContent || !aboutHero) return;
  
  // IntersectionObserver para revelar o título quando a seção entra na viewport
  const observerOptions = {
    threshold: 0.2, // Revelar quando 20% da seção estiver visível
    rootMargin: '0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Adicionar classe 'visible' para revelar o título
        aboutHeroContent.classList.add('visible');
      }
    });
  }, observerOptions);
  
  // Observar a seção about-hero
  observer.observe(aboutHero);
  
  // Verificar se já está visível no carregamento
  const rect = aboutHero.getBoundingClientRect();
  const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
  if (isVisible) {
    // Pequeno delay para suavizar a entrada
    setTimeout(() => {
      aboutHeroContent.classList.add('visible');
    }, 300);
  }
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  initMVVScrollAnimation();
  initAboutHeroReveal(); // Revelação do título no scroll (sem parallax)
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { isInViewport };
}
