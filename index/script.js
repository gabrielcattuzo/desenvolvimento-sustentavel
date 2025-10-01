/**
 * Site de Divulgação Científica - Desenvolvimento Sustentável na Engenharia de Computação
 * JavaScript para interatividade e navegação do site
 */

// ===== CONFIGURAÇÕES E CONSTANTES =====
const CONFIG = {
    ANIMATION_DURATION: 300,
    DEBOUNCE_DELAY: 150,
    FOCUS_TRAP_ENABLED: true,
    KEYBOARD_NAVIGATION: true,
    AUTO_CLOSE_DELAY: 5000
};

// ===== ELEMENTOS DO DOM =====
const elements = {
    menuToggle: document.getElementById('menuToggle'),
    navigationDrawer: document.getElementById('navigationDrawer'),
    drawerOverlay: document.getElementById('drawerOverlay'),
    navItems: document.querySelectorAll('.nav-item'),
    contentPages: document.querySelectorAll('.content-page'),
    pageTitle: document.getElementById('pageTitle'),
    pageDescription: document.getElementById('pageDescription'),
    contentArea: document.getElementById('contentArea'),
    mainContent: document.getElementById('main-content'),
    container: document.querySelector('.container')
};

// ===== DADOS DAS PÁGINAS - DESENVOLVIMENTO SUSTENTÁVEL NA ENGENHARIA DE COMPUTAÇÃO =====
const pageData = {
    energia: {
        title: 'Energia Limpa e Eficiência Computacional',
        description: 'Como a engenharia de computação contribui para sistemas de energia renovável e otimização do consumo energético em data centers e dispositivos.',
        keywords: ['green computing', 'data centers sustentáveis', 'algoritmos eficientes', 'hardware verde']
    },
    agua: {
        title: 'Sistemas Inteligentes de Gestão Hídrica',
        description: 'Aplicação de IoT, sensores e algoritmos de machine learning para monitoramento e otimização do uso da água.',
        keywords: ['IoT hídrico', 'sensores inteligentes', 'machine learning', 'automação']
    },
    biodiversidade: {
        title: 'Tecnologia para Conservação da Biodiversidade',
        description: 'Uso de visão computacional, drones e big data para monitoramento de ecossistemas e proteção de espécies.',
        keywords: ['visão computacional', 'drones', 'big data ambiental', 'monitoramento']
    },
    agricultura: {
        title: 'Agricultura de Precisão e Sustentabilidade',
        description: 'Sistemas embarcados, sensores e algoritmos para agricultura inteligente e sustentável.',
        keywords: ['agricultura 4.0', 'sensores agrícolas', 'sistemas embarcados', 'precisão']
    },
    residuos: {
        title: 'Gestão Inteligente de Resíduos',
        description: 'Sistemas de rastreamento, otimização de rotas e automação para economia circular e gestão eficiente de resíduos.',
        keywords: ['rastreamento RFID', 'otimização de rotas', 'automação', 'circular']
    },
    cidades: {
        title: 'Cidades Inteligentes e Mobilidade Sustentável',
        description: 'Infraestrutura de TI, sistemas de transporte inteligente e redes de comunicação para cidades sustentáveis.',
        keywords: ['smart cities', 'ITS', 'redes 5G', 'mobilidade inteligente']
    },
    educacao: {
        title: 'Tecnologia Educacional Sustentável',
        description: 'Plataformas digitais, realidade virtual e gamificação para educação ambiental e conscientização tecnológica.',
        keywords: ['e-learning', 'realidade virtual', 'gamificação', 'educação digital']
    },
    politicas: {
        title: 'Governança Digital e Sustentabilidade',
        description: 'Blockchain, transparência digital e sistemas de governança eletrônica para políticas ambientais eficazes.',
        keywords: ['blockchain verde', 'e-gov', 'transparência digital', 'governança']
    }
};

// ===== ESTADO DA APLICAÇÃO =====
const appState = {
    currentPage: 'energia',
    isDrawerOpen: false,
    isAnimating: false,
    focusedElement: null,
    lastInteraction: Date.now()
};

// ===== UTILITÁRIOS =====
const utils = {
    /**
     * Debounce function para otimizar performance
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Verifica se um elemento está visível na viewport
     */
    isElementVisible(element) {
        const rect = element.getBoundingClientRect();
        return rect.top >= 0 && rect.left >= 0 && 
               rect.bottom <= window.innerHeight && 
               rect.right <= window.innerWidth;
    },

    /**
     * Smooth scroll para elemento
     */
    smoothScrollTo(element, offset = 0) {
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    },

    /**
     * Gera ID único
     */
    generateId() {
        return `id_${Math.random().toString(36).substr(2, 9)}`;
    },

    /**
     * Sanitiza string para uso em URLs
     */
    sanitizeForUrl(str) {
        return str.toLowerCase().replace(/[^a-z0-9]/g, '');
    }
};

// ===== GERENCIAMENTO DE FOCO =====
const focusManager = {
    focusableElements: [
        'button',
        '[href]',
        'input',
        'select',
        'textarea',
        '[tabindex]:not([tabindex="-1"])'
    ],

    /**
     * Obtém elementos focáveis dentro de um container
     */
    getFocusableElements(container) {
        return container.querySelectorAll(this.focusableElements.join(','));
    },

    /**
     * Configura trap de foco para modal/drawer
     */
    trapFocus(container) {
        const focusableElements = this.getFocusableElements(container);
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleTabKey = (e) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        };

        container.addEventListener('keydown', handleTabKey);
        
        // Foca no primeiro elemento
        if (firstElement) {
            firstElement.focus();
        }

        return () => {
            container.removeEventListener('keydown', handleTabKey);
        };
    },

    /**
     * Restaura foco para elemento anterior
     */
    restoreFocus() {
        if (appState.focusedElement) {
            appState.focusedElement.focus();
            appState.focusedElement = null;
        }
    }
};

// ===== GERENCIAMENTO DE NAVEGAÇÃO =====
const navigationManager = {
    /**
     * Abre o drawer de navegação
     */
    openDrawer() {
        if (appState.isAnimating) return;
        
        appState.isAnimating = true;
        appState.isDrawerOpen = true;
        appState.focusedElement = document.activeElement;

        // Atualiza classes e atributos
        elements.navigationDrawer.classList.add('open');
        elements.menuToggle.classList.add('active');
        elements.menuToggle.setAttribute('aria-expanded', 'true');
        elements.navigationDrawer.setAttribute('aria-hidden', 'false');

        // Previne scroll do body
        document.body.style.overflow = 'hidden';

        // Configura trap de foco
        if (CONFIG.FOCUS_TRAP_ENABLED) {
            this.removeFocusTrap = focusManager.trapFocus(elements.navigationDrawer);
        }

        // Anuncia mudança para screen readers
        this.announceToScreenReader('Menu aberto');

        setTimeout(() => {
            appState.isAnimating = false;
        }, CONFIG.ANIMATION_DURATION);
    },

    /**
     * Fecha o drawer de navegação
     */
    closeDrawer() {
        if (appState.isAnimating) return;
        
        appState.isAnimating = true;
        appState.isDrawerOpen = false;

        // Atualiza classes e atributos
        elements.navigationDrawer.classList.remove('open');
        elements.menuToggle.classList.remove('active');
        elements.menuToggle.setAttribute('aria-expanded', 'false');
        elements.navigationDrawer.setAttribute('aria-hidden', 'true');

        // Restaura scroll do body
        document.body.style.overflow = '';

        // Remove trap de foco
        if (this.removeFocusTrap) {
            this.removeFocusTrap();
            this.removeFocusTrap = null;
        }

        // Restaura foco
        focusManager.restoreFocus();

        // Anuncia mudança para screen readers
        this.announceToScreenReader('Menu fechado');

        setTimeout(() => {
            appState.isAnimating = false;
        }, CONFIG.ANIMATION_DURATION);
    },

    /**
     * Alterna estado do drawer
     */
    toggleDrawer() {
        if (appState.isDrawerOpen) {
            this.closeDrawer();
        } else {
            this.openDrawer();
        }
    },

    /**
     * Anuncia mensagem para screen readers
     */
    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
};

// ===== GERENCIAMENTO DE PÁGINAS =====
const pageManager = {
    /**
     * Muda para uma página específica
     */
    changePage(targetPageId, updateHistory = true) {
        if (appState.isAnimating || targetPageId === appState.currentPage) return;
        
        const targetPage = document.getElementById(targetPageId);
        const pageInfo = pageData[targetPageId];
        
        if (!targetPage || !pageInfo) {
            console.warn(`Página não encontrada: ${targetPageId}`);
            return;
        }

        appState.isAnimating = true;

        // Atualiza página ativa
        elements.contentPages.forEach(page => {
            page.classList.remove('active');
        });

        // Atualiza navegação ativa
        elements.navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.target === targetPageId);
            item.setAttribute('tabindex', item.dataset.target === targetPageId ? '0' : '-1');
        });

        // Animação de saída
        setTimeout(() => {
            // Atualiza conteúdo do hero
            elements.pageTitle.textContent = pageInfo.title;
            elements.pageDescription.textContent = pageInfo.description;

            // Mostra nova página
            targetPage.classList.add('active');

            // Atualiza estado
            appState.currentPage = targetPageId;

            // Atualiza URL
            if (updateHistory) {
                this.updateUrl(targetPageId);
            }

            // Anuncia mudança
            navigationManager.announceToScreenReader(`Página alterada para ${pageInfo.title}`);

            // Scroll para o topo do conteúdo
            utils.smoothScrollTo(elements.contentArea, 100);

            setTimeout(() => {
                appState.isAnimating = false;
            }, CONFIG.ANIMATION_DURATION);

        }, CONFIG.ANIMATION_DURATION / 2);

        // Fecha drawer em dispositivos móveis
        if (appState.isDrawerOpen) {
            setTimeout(() => {
                navigationManager.closeDrawer();
            }, 200);
        }
    },

    /**
     * Atualiza URL sem recarregar página
     */
    updateUrl(pageId) {
        const newUrl = `${window.location.pathname}#${pageId}`;
        history.pushState({ page: pageId }, '', newUrl);
    },

    /**
     * Carrega página baseada na URL atual
     */
    loadPageFromUrl() {
        const hash = window.location.hash.replace('#', '') || 'energia';
        if (pageData[hash]) {
            this.changePage(hash, false);
        }
    }
};

// ===== GERENCIAMENTO DE EVENTOS =====
const eventManager = {
    /**
     * Configura todos os event listeners
     */
    setupEventListeners() {
        // Menu toggle
        elements.menuToggle.addEventListener('click', () => {
            navigationManager.toggleDrawer();
        });

        // Navegação por teclado no menu toggle
        elements.menuToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigationManager.toggleDrawer();
            }
        });

        // Overlay do drawer
        elements.drawerOverlay.addEventListener('click', () => {
            navigationManager.closeDrawer();
        });

        // Items de navegação
        elements.navItems.forEach(item => {
            // Click
            item.addEventListener('click', () => {
                const targetPage = item.dataset.target;
                if (targetPage) {
                    pageManager.changePage(targetPage);
                }
            });

            // Navegação por teclado
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const targetPage = item.dataset.target;
                    if (targetPage) {
                        pageManager.changePage(targetPage);
                    }
                }
            });
        });

        // Navegação por setas no drawer
        this.setupArrowNavigation();

        // Escape para fechar drawer
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && appState.isDrawerOpen) {
                navigationManager.closeDrawer();
            }
        });

        // Navegação do browser (back/forward)
        window.addEventListener('popstate', (e) => {
            const pageId = e.state?.page || window.location.hash.replace('#', '') || 'energia';
            if (pageData[pageId]) {
                pageManager.changePage(pageId, false);
            }
        });

        // Resize da janela
        window.addEventListener('resize', utils.debounce(() => {
            if (window.innerWidth > 768 && appState.isDrawerOpen) {
                navigationManager.closeDrawer();
            }
        }, CONFIG.DEBOUNCE_DELAY));

        // Detecção de inatividade
        this.setupInactivityDetection();

        // Clique fora do drawer para fechar
        document.addEventListener('click', (e) => {
            if (appState.isDrawerOpen && 
                !elements.navigationDrawer.contains(e.target) && 
                !elements.menuToggle.contains(e.target)) {
                navigationManager.closeDrawer();
            }
        });
    },

    /**
     * Configura navegação por setas no drawer
     */
    setupArrowNavigation() {
        elements.navigationDrawer.addEventListener('keydown', (e) => {
            if (!CONFIG.KEYBOARD_NAVIGATION) return;

            const currentFocus = document.activeElement;
            const navItemsArray = Array.from(elements.navItems);
            const currentIndex = navItemsArray.indexOf(currentFocus);

            if (currentIndex === -1) return;

            let nextIndex;

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    nextIndex = (currentIndex + 1) % navItemsArray.length;
                    navItemsArray[nextIndex].focus();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    nextIndex = currentIndex === 0 ? navItemsArray.length - 1 : currentIndex - 1;
                    navItemsArray[nextIndex].focus();
                    break;
                case 'Home':
                    e.preventDefault();
                    navItemsArray[0].focus();
                    break;
                case 'End':
                    e.preventDefault();
                    navItemsArray[navItemsArray.length - 1].focus();
                    break;
            }
        });
    },

    /**
     * Configura detecção de inatividade
     */
    setupInactivityDetection() {
        const updateLastInteraction = () => {
            appState.lastInteraction = Date.now();
        };

        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
            document.addEventListener(event, updateLastInteraction, true);
        });

        // Verifica inatividade a cada 30 segundos
        setInterval(() => {
            const now = Date.now();
            const timeSinceLastInteraction = now - appState.lastInteraction;
            
            // Se inativo por mais de 5 minutos e drawer aberto, fecha automaticamente
            if (timeSinceLastInteraction > CONFIG.AUTO_CLOSE_DELAY * 60 && appState.isDrawerOpen) {
                navigationManager.closeDrawer();
                navigationManager.announceToScreenReader('Menu fechado automaticamente por inatividade');
            }
        }, 30000);
    }
};

// ===== INICIALIZAÇÃO =====
const app = {
    /**
     * Inicializa a aplicação
     */
    init() {
        // Verifica se todos os elementos necessários estão presentes
        if (!this.validateElements()) {
            console.error('Elementos DOM necessários não encontrados');
            return;
        }

        // Configura event listeners
        eventManager.setupEventListeners();

        // Carrega página inicial baseada na URL
        pageManager.loadPageFromUrl();

        // Configura atributos de acessibilidade
        this.setupAccessibility();

        // Anuncia que a aplicação foi carregada
        navigationManager.announceToScreenReader('Site carregado com sucesso');

        console.log('Aplicação inicializada com sucesso');
    },

    /**
     * Valida se todos os elementos DOM necessários estão presentes
     */
    validateElements() {
        const requiredElements = [
            'menuToggle',
            'navigationDrawer',
            'drawerOverlay',
            'pageTitle',
            'pageDescription',
            'contentArea'
        ];

        return requiredElements.every(elementKey => {
            const element = elements[elementKey];
            if (!element) {
                console.error(`Elemento não encontrado: ${elementKey}`);
                return false;
            }
            return true;
        });
    },

    /**
     * Configura atributos de acessibilidade
     */
    setupAccessibility() {
        // Configura ARIA attributes
        elements.menuToggle.setAttribute('aria-expanded', 'false');
        elements.menuToggle.setAttribute('aria-controls', 'navigationDrawer');
        elements.navigationDrawer.setAttribute('aria-hidden', 'true');
        elements.navigationDrawer.setAttribute('aria-labelledby', 'drawer-title');

        // Configura tabindex para navegação
        elements.navItems.forEach((item, index) => {
            item.setAttribute('tabindex', index === 0 ? '0' : '-1');
            item.setAttribute('role', 'menuitem');
        });

        // Configura role para lista de navegação
        const navList = document.querySelector('.navigation-list');
        if (navList) {
            navList.setAttribute('role', 'menu');
        }
    }
};

// ===== INICIALIZAÇÃO QUANDO DOM ESTIVER PRONTO =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        app.init();
    });
} else {
    app.init();
}

// ===== TRATAMENTO DE ERROS GLOBAIS =====
window.addEventListener('error', (e) => {
    console.error('Erro na aplicação:', e.error);
    
    // Tenta recuperar estado básico em caso de erro
    if (appState.isDrawerOpen) {
        navigationManager.closeDrawer();
    }
});

// ===== EXPORTA PARA DEBUGGING (apenas em desenvolvimento) =====
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    window.debugApp = {
        appState,
        pageData,
        navigationManager,
        pageManager,
        utils
    };
}
