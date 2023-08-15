document.addEventListener('DOMContentLoaded', () => {
    const navigationContainer = document.querySelector('nav ul');
  
    navigationContainer.addEventListener('click', (event) => {
      const targetButton = event.target.closest('button');
      if (targetButton) {
        const targetId = targetButton.id.replace('Button', ''); // Remove 'Button' from the ID
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
    });
  });
  