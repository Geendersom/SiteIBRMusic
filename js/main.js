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
      // Only change when white section actually touches the header (no black background visible)
      if (quemSomosSection) {
        const sectionRect = quemSomosSection.getBoundingClientRect();
        const headerHeight = header.offsetHeight;
        const sectionTop = sectionRect.top;
        const sectionBottom = sectionRect.bottom;
        
        // Header becomes white only when white section touches it (sectionTop <= headerHeight)
        // And stays white while section is visible
        if (sectionTop <= headerHeight && sectionBottom >= 0) {
          header.classList.add('header--white');
        } else {
          header.classList.remove('header--white');
        }
      }
      
      // Title appears early and parallax effect
      if (quemSomosTitle && quemSomosSection) {
        const sectionRect = quemSomosSection.getBoundingClientRect();
        const headerHeight = header.offsetHeight;
        const sectionTop = sectionRect.top;
        const viewportHeight = window.innerHeight;
        
        // Show title when white section starts appearing (enters viewport)
        if (sectionTop < viewportHeight && sectionRect.bottom > 0) {
          quemSomosTitle.classList.add('visible');
        }
        
        // Parallax effect: title starts higher and descends to final position
        // Start parallax when section is entering viewport
        if (sectionTop < viewportHeight && sectionTop > -viewportHeight && sectionRect.bottom > 0) {
          // Calculate progress: 0 when section enters viewport, 1 when section reaches final position
          // Final position is when section is well positioned (around headerHeight + 200px)
          const startPoint = viewportHeight; // When section enters viewport
          const endPoint = headerHeight + 200; // When section reaches final position
          const currentPos = sectionTop;
          
          // Calculate progress (0 to 1)
          const progress = Math.max(0, Math.min(1, (startPoint - currentPos) / (startPoint - endPoint)));
          
          // Parallax offset: starts at 120px (higher) and goes to 0 (final position)
          const parallaxOffset = 120 * (1 - progress);
          
          // Use requestAnimationFrame for smooth parallax
          requestAnimationFrame(() => {
            quemSomosTitle.style.transform = `translateY(${parallaxOffset}px)`;
            quemSomosTitle.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            quemSomosTitle.classList.add('parallax-active');
          });
        } else if (sectionTop >= viewportHeight) {
          // Reset when section is above viewport
          requestAnimationFrame(() => {
            quemSomosTitle.style.transform = 'translateY(120px)';
            quemSomosTitle.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
          });
        } else if (sectionTop <= headerHeight + 200) {
          // Lock at final position when section reaches final position
          requestAnimationFrame(() => {
            quemSomosTitle.style.transform = 'translateY(0)';
            quemSomosTitle.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
          });
        }
      }
      
      // Early animation trigger for other quem-somos elements
      if (quemSomosText && quemSomosImage && quemSomosSection) {
        const sectionRect = quemSomosSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Trigger animations when section is entering viewport
        if (sectionRect.top < viewportHeight && sectionRect.bottom > 0) {
          quemSomosText.classList.add('visible');
          quemSomosImage.classList.add('visible');
        }
      }
      
      lastScroll = currentScroll;
    });
    
    // Initial check for quem-somos animations
    if (quemSomosText && quemSomosImage && quemSomosSection) {
      const checkInitialVisibility = () => {
        const sectionRect = quemSomosSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Trigger when section is in viewport (except title, which triggers on header change)
        if (sectionRect.top < viewportHeight && sectionRect.bottom > 0) {
          quemSomosText.classList.add('visible');
          quemSomosImage.classList.add('visible');
        }
      };
      
      // Check on load
      checkInitialVisibility();
      
      // Also check after a short delay to ensure DOM is ready
      setTimeout(checkInitialVisibility, 100);
    }
    
    // Initial check for title visibility and parallax
    if (quemSomosTitle && quemSomosSection && header) {
      const checkInitialState = () => {
        const sectionRect = quemSomosSection.getBoundingClientRect();
        const headerHeight = header.offsetHeight;
        const sectionTop = sectionRect.top;
        const viewportHeight = window.innerHeight;
        
        // Show title if section is in viewport
        if (sectionTop < viewportHeight && sectionRect.bottom > 0) {
          quemSomosTitle.classList.add('visible');
        }
        
        // Set initial parallax position
        if (sectionTop < viewportHeight && sectionTop > -viewportHeight && sectionRect.bottom > 0) {
          const startPoint = viewportHeight;
          const endPoint = headerHeight + 200;
          const currentPos = sectionTop;
          const progress = Math.max(0, Math.min(1, (startPoint - currentPos) / (startPoint - endPoint)));
          const parallaxOffset = 120 * (1 - progress);
          quemSomosTitle.style.transform = `translateY(${parallaxOffset}px)`;
          quemSomosTitle.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
          quemSomosTitle.classList.add('parallax-active');
        }
      };
      
      setTimeout(checkInitialState, 100);
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
