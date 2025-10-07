
        // ===== GERENCIAMENTO DE NAVEGAÇÃO ENTRE POSTAGENS =====
        document.addEventListener('DOMContentLoaded', function() {
            const posts = document.querySelectorAll('.post');
            const prevButton = document.getElementById('prevButton');
            const nextButton = document.getElementById('nextButton');
            let currentPostIndex = 0;

            // Função para atualizar a visibilidade das postagens
            function updatePostVisibility() {
                posts.forEach((post, index) => {
                    if (index === currentPostIndex) {
                        post.style.display = 'block';
                    } else {
                        post.style.display = 'none';
                    }
                });

                // Atualizar estado dos botões
                prevButton.disabled = currentPostIndex === 0;
                nextButton.disabled = currentPostIndex === posts.length - 1;

                // Atualizar a rolagem para o topo
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            // Event listeners para os botões
            prevButton.addEventListener('click', function() {
                if (currentPostIndex > 0) {
                    currentPostIndex--;
                    updatePostVisibility();
                }
            });

            nextButton.addEventListener('click', function() {
                if (currentPostIndex < posts.length - 1) {
                    currentPostIndex++;
                    updatePostVisibility();
                }
            });

            // Navegação por teclado
            document.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowLeft' && !prevButton.disabled) {
                    prevButton.click();
                } else if (e.key === 'ArrowRight' && !nextButton.disabled) {
                    nextButton.click();
                }
            });

            // Inicializar a visibilidade
            updatePostVisibility();

            // ===== ANIMAÇÕES DE ENTRADA =====
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);

            // Aplicar animação às postagens
            posts.forEach(post => {
                post.style.opacity = '0';
                post.style.transform = 'translateY(20px)';
                post.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                observer.observe(post);
            });

            // ===== DESTAQUE INTERATIVO NOS INFOGRÁFICOS =====
            const infographics = document.querySelectorAll('.infographic');
            
            infographics.forEach(infographic => {
                infographic.addEventListener('mouseenter', function() {
                    this.style.transform = 'scale(1.02)';
                    this.style.transition = 'transform 0.3s ease';
                });
                
                infographic.addEventListener('mouseleave', function() {
                    this.style.transform = 'scale(1)';
                });
            });

            // ===== BOTÕES DE NAVEGAÇÃO MELHORADOS =====
            const navButtons = document.querySelectorAll('.nav-button');
            
            navButtons.forEach(button => {
                button.addEventListener('mouseenter', function() {
                    if (!this.disabled) {
                        this.style.transform = 'translateY(-2px)';
                    }
                });
                
                button.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                });
            });

            // ===== INDICADOR DE PROGRESSO =====
            function updateProgressIndicator() {
                const progress = ((currentPostIndex + 1) / posts.length) * 100;
                console.log(`Progresso: ${Math.round(progress)}% - Postagem ${currentPostIndex + 1} de ${posts.length}`);
            }

            // Atualizar indicador quando mudar de postagem
            prevButton.addEventListener('click', updateProgressIndicator);
            nextButton.addEventListener('click', updateProgressIndicator);

            // Indicador inicial
            updateProgressIndicator();
        });

        // ===== FUNÇÃO PARA COMPARTILHAMENTO =====
        function sharePost() {
            const currentPost = document.querySelector('.post[style="display: block;"]');
            const postTitle = currentPost.querySelector('.post-title').textContent;
            
            if (navigator.share) {
                navigator.share({
                    title: postTitle,
                    text: 'Confira esta postagem sobre TI Verde!',
                    url: window.location.href,
                })
                .catch(error => console.log('Erro ao compartilhar:', error));
            } else {
                // Fallback para copiar para área de transferência
                const tempInput = document.createElement('input');
                tempInput.value = window.location.href;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                alert('Link copiado para a área de transferência!');
            }
        }

        // ===== DETECÇÃO DE REDUÇÃO DE MOVIMENTO =====
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (reducedMotion.matches) {
            document.documentElement.style.setProperty('--transition-base', '0.01s');
            document.documentElement.style.setProperty('--transition-slow', '0.01s');
        }