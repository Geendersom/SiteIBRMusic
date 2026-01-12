// Desenvolvido por Geêndersom Araújo
// 12/01/2026

// Main JavaScript - Funcionalidades principais

// Header scroll effect
document.addEventListener('DOMContentLoaded', function() {
  const header = document.querySelector('.header');
  const quemSomosSection = document.querySelector('.quem-somos-section');
  const quemSomosTitle = document.querySelector('.quem-somos-title');
  const quemSomosText = document.querySelector('.quem-somos-text');
  const quemSomosImage = document.querySelector('.quem-somos-image');
  
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
        if (quemSomosSection) {
          const sectionRect = quemSomosSection.getBoundingClientRect();
          const headerHeight = header.offsetHeight;
          const sectionTop = sectionRect.top;
          const sectionBottom = sectionRect.bottom;
          
          // Header torna-se branco quando a seção branca toca o header
          if (sectionTop <= headerHeight && sectionBottom >= 0) {
            header.classList.add('header--white');
          } else {
            header.classList.remove('header--white');
          }
        }
        
        // ===== TÍTULO APARECE QUANDO BRANCO ESTÁ 100% =====
        if (quemSomosTitle && quemSomosSection) {
          const sectionRect = quemSomosSection.getBoundingClientRect();
          const sectionTop = sectionRect.top;
          const viewportHeight = window.innerHeight;
          const headerHeight = header.offsetHeight;
          
          // Título aparece quando branco está 100% visível (quando header está branco)
          if (header.classList.contains('header--white') && sectionTop <= headerHeight + 50 && sectionRect.bottom > 0) {
            quemSomosTitle.classList.add('visible');
            
            // Parallax: título desce suavemente até posição final conforme scroll
            const parallaxStart = headerHeight + 50;
            const parallaxEnd = headerHeight + 200;
            const parallaxProgress = Math.max(0, Math.min(1, (parallaxStart - sectionTop) / (parallaxStart - parallaxEnd)));
            const parallaxOffset = 60 * (1 - parallaxProgress);
            
            requestAnimationFrame(() => {
              quemSomosTitle.style.transform = `translateY(${parallaxOffset}px)`;
              quemSomosTitle.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            });
          } else {
            // Remover classe quando sair da viewport para permitir animação novamente
            quemSomosTitle.classList.remove('visible');
            quemSomosTitle.style.opacity = '0';
            quemSomosTitle.style.transform = 'translateY(60px)';
          }
        }
        
        // ===== IMAGEM APARECE PROGRESSIVAMENTE =====
        if (quemSomosImage && quemSomosSection) {
          const sectionRect = quemSomosSection.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const imageRect = quemSomosImage.getBoundingClientRect();
          
          // Calcular visibilidade da imagem
          const imageTop = imageRect.top;
          const imageBottom = imageRect.bottom;
          const imageHeight = imageRect.height;
          const visibleHeight = Math.min(imageBottom, viewportHeight) - Math.max(imageTop, 0);
          const imageVisibility = Math.max(0, Math.min(1, visibleHeight / imageHeight));
          
          // Imagem aparece progressivamente
          if (imageVisibility > 0 && sectionRect.bottom > 0 && sectionRect.top < viewportHeight) {
            const imageOpacity = Math.min(1, imageVisibility * 1.2);
            const imageOffset = 40 * (1 - imageVisibility);
            
            requestAnimationFrame(() => {
              quemSomosImage.style.opacity = imageOpacity;
              quemSomosImage.style.transform = `translateY(${imageOffset}px)`;
              quemSomosImage.classList.add('visible');
            });
          } else if (sectionRect.bottom < 0 || sectionRect.top > viewportHeight) {
            // Remover classe quando sair da viewport para permitir animação novamente
            quemSomosImage.classList.remove('visible');
            quemSomosImage.style.opacity = '0';
            quemSomosImage.style.transform = 'translateY(40px)';
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

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { isInViewport };
}
