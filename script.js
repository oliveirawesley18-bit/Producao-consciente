document.addEventListener('DOMContentLoaded', () => {
  // Inicializa todas as funções interativas do site eco-consciente
  initMobileMenu();
  initImpactCounter();
  initEcoFilter();
});

/* ==========================================================================
   1. MENU MOBILE (Acessibilidade e Navegação)
   ========================================================================== */
function initMobileMenu() {
  const header = document.querySelector('.eco-header');
  const nav = document.querySelector('.nav-menu');
  
  if (!nav) return;

  // Cria o botão do menu hambúrguer dinamicamente se não existir no HTML
  let menuToggle = document.querySelector('.menu-toggle');
  if (!menuToggle) {
    menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '☰';
    menuToggle.setAttribute('aria-label', 'Abrir menu de navegação');
    // Estilo rápido via JS para manter o isolamento
    menuToggle.style.cssText = 'background:none; border:none; font-size:1.8rem; cursor:pointer; display:none; color:var(--clr-primary);';
    header.insertBefore(menuToggle, nav);
  }

  // Monitora mudanças na largura da tela para exibir/esconder o botão
  const checkWidth = () => {
    if (window.innerWidth <= 768) {
      menuToggle.style.display = 'block';
      nav.style.display = nav.classList.contains('active') ? 'flex' : 'none';
    } else {
      menuToggle.style.display = 'none';
      nav.style.display = 'flex';
    }
  };

  menuToggle.addEventListener('click', () => {
    const isActive = nav.classList.toggle('active');
    nav.style.display = isActive ? 'flex' : 'none';
    menuToggle.innerHTML = isActive ? '✕' : '☰';
    menuToggle.setAttribute('aria-expanded', isActive);
  });

  window.addEventListener('resize', checkWidth);
  checkWidth(); // Executa ao carregar a página
}

/* ==========================================================================
   2. CONTADOR DE IMPACTO SUSTENTÁVEL (Animação de Números)
   ========================================================================== */
function initImpactCounter() {
  const counters = document.querySelectorAll('.eco-counter');
  
  if (counters.length === 0) return;

  const animateCounter = (counter) => {
    const target = +counter.getAttribute('data-target');
    const speed = 100; // Quanto maior, mais lenta a animação
    const increment = target / speed;

    const updateCount = () => {
      const current = +counter.innerText;
      if (current < target) {
        counter.innerText = Math.ceil(current + increment);
        setTimeout(updateCount, 15);
      } else {
        counter.innerText = target;
      }
    };
    updateCount();
  };

  // Ativa a animação apenas quando o usuário rolar a tela até os números
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target); // Anima apenas uma vez
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

/* ==========================================================================
   3. FILTRO DE PILARES/PRODUTOS (Navegação Dinâmica)
   ========================================================================== */
function initEcoFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const ecoCards = document.querySelectorAll('.eco-card');

  if (filterButtons.length === 0 || ecoCards.length === 0) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Atualiza estado visual do botão ativo
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      // Filtra os cards com efeito suave de fade
      ecoCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filterValue === 'all' || filterValue === category) {
          card.style.display = 'block';
          setTimeout(() => { card.style.opacity = '1'; }, 10);
        } else {
          card.style.opacity = '0';
          setTimeout(() => { card.style.display = 'none'; }, 300); // Tempo da transição CSS
        }
      });
    });
  });
}
