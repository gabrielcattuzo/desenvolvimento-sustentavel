/**
 * Site de Divulgação Científica - Desenvolvimento Sustentável na Engenharia de Computação
 * JavaScript para interatividade e navegação do site
 */

// ===== DADOS DAS PÁGINAS =====
const pageData = {
    energia: {
        title: 'Green IT',
        description: 'Como a engenharia de computação contribui para sistemas de energia renovável e otimização do consumo energético em data centers e dispositivos.',
        keywords: ['green computing', 'data centers sustentáveis', 'algoritmos eficientes', 'hardware verde']
    },
    agua: {
        title: 'Gestão e Redução de Consumo de Energia',
        description: `Na área de computação, a gestão eficiente do consumo de energia é essencial
    para reduzir custos operacionais e minimizar o impacto ambiental. Essa prática envolve o uso
    de tecnologias e estratégias sustentáveis que otimizam o desempenho dos equipamentos de TI
    sem comprometer sua funcionalidade.

    Entre as principais ações estão a utilização de hardware energeticamente eficiente, a
    virtualização de servidores, o uso consciente de recursos computacionais e o monitoramento
    contínuo do gasto energético. Além disso, políticas de desligamento automático e o
    aproveitamento de fontes de energia renovável contribuem para tornar os sistemas mais
    ecológicos e sustentáveis.

    A adoção dessas medidas promove uma computação mais verde, alinhando inovação tecnológica
    à responsabilidade ambiental.`,
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

// ===== ELEMENTOS DO DOM =====
const elements = {
    navBtns: document.querySelectorAll('.nav-btn'),
    contentPages: document.querySelectorAll('.content-page'),
    pageTitle: document.getElementById('pageTitle'),
    pageDescription: document.getElementById('pageDescription'),
    contentArea: document.getElementById('contentArea')
};

// ===== ESTADO DA APLICAÇÃO =====
const appState = {
    currentPage: 'energia',
    isAnimating: false
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
        elements.navBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.target === targetPageId);
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

            // Anuncia mudança para screen readers
            this.announceToScreenReader(`Página alterada para ${pageInfo.title}`);

            // Scroll para o topo do conteúdo
            this.smoothScrollTo(elements.contentArea, 100);

            setTimeout(() => {
                appState.isAnimating = false;
            }, 300);
        }, 150);
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

// ===== GERENCIAMENTO DE EVENTOS =====
const eventManager = {
    /**
     * Configura todos os event listeners
     */
    setupEventListeners() {
        // Botões de navegação
        elements.navBtns.forEach(btn => {
            // Click
            btn.addEventListener('click', () => {
                const targetPage = btn.dataset.target;
                if (targetPage) {
                    pageManager.changePage(targetPage);
                }
            });

            // Navegação por teclado
            btn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const targetPage = btn.dataset.target;
                    if (targetPage) {
                        pageManager.changePage(targetPage);
                    }
                }
            });
        });

        // Navegação do browser (back/forward)
        window.addEventListener('popstate', (e) => {
            const pageId = e.state?.page || window.location.hash.replace('#', '') || 'energia';
            if (pageData[pageId]) {
                pageManager.changePage(pageId, false);
            }
        });
    }
};

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    // Configura event listeners
    eventManager.setupEventListeners();

    // Carrega página inicial baseada na URL
    pageManager.loadPageFromUrl();

    console.log('Aplicação inicializada com sucesso');
});

// ===== TRATAMENTO DE ERROS GLOBAIS =====
window.addEventListener('error', (e) => {
    console.error('Erro na aplicação:', e.error);
});