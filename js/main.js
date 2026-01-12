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
    
    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      
      // Header color change based on quem-somos section
      if (quemSomosSection) {
        const sectionRect = quemSomosSection.getBoundingClientRect();
        const headerHeight = header.offsetHeight;
        const sectionTop = sectionRect.top;
        const sectionBottom = sectionRect.bottom;
        
        // When section is approaching header (within 200px of top)
        if (sectionTop <= headerHeight + 200 && sectionBottom >= 0) {
          header.classList.add('header--white');
        } else {
          header.classList.remove('header--white');
        }
      }
      
      // Early animation trigger for quem-somos elements
      if (quemSomosTitle && quemSomosText && quemSomosImage) {
        const sectionRect = quemSomosSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Trigger animations when section is approaching (80% of viewport)
        if (sectionRect.top < viewportHeight * 0.8 && sectionRect.bottom > 0) {
          quemSomosTitle.classList.add('visible');
          quemSomosText.classList.add('visible');
          quemSomosImage.classList.add('visible');
        }
      }
      
      lastScroll = currentScroll;
    });
    
    // Initial check for quem-somos animations
    if (quemSomosTitle && quemSomosText && quemSomosImage && quemSomosSection) {
      const checkInitialVisibility = () => {
        const sectionRect = quemSomosSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        if (sectionRect.top < viewportHeight * 0.8 && sectionRect.bottom > 0) {
          quemSomosTitle.classList.add('visible');
          quemSomosText.classList.add('visible');
          quemSomosImage.classList.add('visible');
        }
      };
      
      // Check on load
      checkInitialVisibility();
      
      // Also check after a short delay to ensure DOM is ready
      setTimeout(checkInitialVisibility, 100);
    }
  }
  
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
      const successMessage = document.querySelector('.form-success');
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
