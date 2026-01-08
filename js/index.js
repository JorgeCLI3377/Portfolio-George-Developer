        let currentPdfFile = '';
        let currentPdfTitle = '';
        
        // ============================================
        // SISTEMA DE FONDO 3D AVANZADO
        // ============================================
        
        let scene3D, camera3D, renderer3D, controls3D;
        let particles3D = [];
        let torusKnot, floatingShapes = [];
        let mouseX = 0, mouseY = 0;
        let windowHalfX = window.innerWidth / 2;
        let windowHalfY = window.innerHeight / 2;
        
        function initAdvanced3DBackground() {
            // Verificar si Three.js está cargado
            if (typeof THREE === 'undefined') {
                console.warn('Three.js no está cargado. Inicialización fallida.');
                return;
            }
            
            try {
                // Crear escena
                scene3D = new THREE.Scene();
                scene3D.fog = new THREE.Fog(0x0a0a0f, 10, 50);
                
                // Crear cámara
                camera3D = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
                camera3D.position.z = 15;
                camera3D.position.y = 5;
                
                // Crear renderer
                renderer3D = new THREE.WebGLRenderer({ 
                    antialias: true, 
                    alpha: true,
                    powerPreference: "high-performance"
                });
                renderer3D.setSize(window.innerWidth, window.innerHeight);
                renderer3D.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                renderer3D.setClearColor(0x000000, 0);
                document.getElementById('threejs-background').appendChild(renderer3D.domElement);
                
                // Controles de órbita (solo para desarrollo)
                if (typeof THREE.OrbitControls !== 'undefined') {
                    controls3D = new THREE.OrbitControls(camera3D, renderer3D.domElement);
                    controls3D.enableZoom = false;
                    controls3D.enablePan = false;
                    controls3D.autoRotate = true;
                    controls3D.autoRotateSpeed = 0.5;
                }
                
                // Luz ambiental
                const ambientLight = new THREE.AmbientLight(0x7c3aed, 0.1);
                scene3D.add(ambientLight);
                
                // Luz direccional
                const directionalLight = new THREE.DirectionalLight(0x06b6d4, 0.5);
                directionalLight.position.set(5, 5, 5);
                scene3D.add(directionalLight);
                
                // Luz puntual
                const pointLight = new THREE.PointLight(0x10b981, 0.5, 50);
                pointLight.position.set(-5, 5, 5);
                scene3D.add(pointLight);
                
                // Crear geometrías flotantes
                createFloatingGeometries();
                
                // Crear partículas 3D avanzadas
                createAdvancedParticles();
                
                // Crear nube de puntos interactiva
                createInteractivePointCloud();
                
                // Crear torus knot central
                createTorusKnot();
                
                // Eventos del mouse
                document.addEventListener('mousemove', onDocumentMouseMove, false);
                window.addEventListener('resize', onWindowResize, false);
                
                // Iniciar animación
                animate3DBackground();
                
                console.log('Fondo 3D avanzado inicializado correctamente');
            } catch (error) {
                console.error('Error al inicializar el fondo 3D:', error);
            }
        }
        
        function createFloatingGeometries() {
            const geometries = [
                { type: 'sphere', size: 0.5, color: 0x7c3aed, position: [-8, 3, -5] },
                { type: 'box', size: [0.7, 0.7, 0.7], color: 0x06b6d4, position: [6, -2, -8] },
                { type: 'tetrahedron', size: 0.6, color: 0x10b981, position: [-5, -3, -10] },
                { type: 'octahedron', size: 0.5, color: 0x8b5cf6, position: [7, 2, -12] },
                { type: 'dodecahedron', size: 0.4, color: 0xec4899, position: [-7, 4, -15] }
            ];
            
            geometries.forEach((geo, index) => {
                let geometry, material, mesh;
                
                switch(geo.type) {
                    case 'sphere':
                        geometry = new THREE.SphereGeometry(geo.size, 32, 32);
                        break;
                    case 'box':
                        geometry = new THREE.BoxGeometry(...geo.size);
                        break;
                    case 'tetrahedron':
                        geometry = new THREE.TetrahedronGeometry(geo.size);
                        break;
                    case 'octahedron':
                        geometry = new THREE.OctahedronGeometry(geo.size);
                        break;
                    case 'dodecahedron':
                        geometry = new THREE.DodecahedronGeometry(geo.size);
                        break;
                }
                
                material = new THREE.MeshStandardMaterial({ 
                    color: geo.color,
                    emissive: geo.color,
                    emissiveIntensity: 0.1,
                    metalness: 0.7,
                    roughness: 0.2,
                    transparent: true,
                    opacity: 0.3
                });
                
                mesh = new THREE.Mesh(geometry, material);
                mesh.position.set(...geo.position);
                mesh.userData = { 
                    originalPosition: [...geo.position],
                    speed: 0.001 + Math.random() * 0.002,
                    rotationSpeed: 0.001 + Math.random() * 0.003
                };
                
                scene3D.add(mesh);
                floatingShapes.push(mesh);
            });
        }
        
        function createAdvancedParticles() {
            const particleCount = 2000;
            const particles = new THREE.BufferGeometry();
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);
            const sizes = new Float32Array(particleCount);
            
            for (let i = 0; i < particleCount; i++) {
                // Posiciones aleatorias en un volumen esférico
                const radius = 20;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                
                positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
                positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
                positions[i * 3 + 2] = radius * Math.cos(phi);
                
                // Colores basados en la posición (gradiente)
                colors[i * 3] = 0.5 + positions[i * 3] / 40; // R
                colors[i * 3 + 1] = 0.3 + positions[i * 3 + 1] / 40; // G
                colors[i * 3 + 2] = 0.8 + positions[i * 3 + 2] / 40; // B
                
                // Tamaños aleatorios
                sizes[i] = Math.random() * 0.1 + 0.05;
            }
            
            particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
            
            const particleMaterial = new THREE.PointsMaterial({
                size: 0.1,
                vertexColors: true,
                transparent: true,
                opacity: 0.6,
                blending: THREE.AdditiveBlending,
                sizeAttenuation: true
            });
            
            const particleSystem = new THREE.Points(particles, particleMaterial);
            particleSystem.userData = { speed: 0.0005 };
            scene3D.add(particleSystem);
            particles3D.push(particleSystem);
        }
        
        function createInteractivePointCloud() {
            const pointCount = 5000;
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(pointCount * 3);
            const colors = new Float32Array(pointCount * 3);
            
            for (let i = 0; i < pointCount * 3; i += 3) {
                // Crear una nube en forma de toro
                const radius = 10;
                const tube = 3;
                const u = Math.random() * Math.PI * 2;
                const v = Math.random() * Math.PI * 2;
                
                positions[i] = (radius + tube * Math.cos(v)) * Math.cos(u);
                positions[i + 1] = (radius + tube * Math.cos(v)) * Math.sin(u);
                positions[i + 2] = tube * Math.sin(v);
                
                // Colores basados en la posición
                colors[i] = 0.5 + 0.5 * Math.sin(u); // R
                colors[i + 1] = 0.3 + 0.7 * Math.cos(v); // G
                colors[i + 2] = 0.8 + 0.2 * Math.sin(u + v); // B
            }
            
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            
            const material = new THREE.PointsMaterial({
                size: 0.05,
                vertexColors: true,
                transparent: true,
                opacity: 0.3,
                blending: THREE.AdditiveBlending
            });
            
            const points = new THREE.Points(geometry, material);
            points.userData = { 
                originalPositions: positions.slice(),
                speed: 0.001
            };
            scene3D.add(points);
            particles3D.push(points);
        }
        
        function createTorusKnot() {
            const geometry = new THREE.TorusKnotGeometry(3, 1, 100, 16);
            const material = new THREE.MeshStandardMaterial({
                color: 0x7c3aed,
                emissive: 0x7c3aed,
                emissiveIntensity: 0.2,
                metalness: 0.8,
                roughness: 0.1,
                transparent: true,
                opacity: 0.2,
                wireframe: true
            });
            
            torusKnot = new THREE.Mesh(geometry, material);
            torusKnot.position.y = 2;
            scene3D.add(torusKnot);
        }
        
        function onDocumentMouseMove(event) {
            mouseX = (event.clientX - windowHalfX) / 100;
            mouseY = (event.clientY - windowHalfY) / 100;
        }
        
        function onWindowResize() {
            windowHalfX = window.innerWidth / 2;
            windowHalfY = window.innerHeight / 2;
            
            camera3D.aspect = window.innerWidth / window.innerHeight;
            camera3D.updateProjectionMatrix();
            renderer3D.setSize(window.innerWidth, window.innerHeight);
        }
        
        function animate3DBackground() {
            requestAnimationFrame(animate3DBackground);
            
            // Rotar cámara suavemente
            camera3D.position.x += (mouseX - camera3D.position.x) * 0.05;
            camera3D.position.y += (-mouseY - camera3D.position.y) * 0.05;
            camera3D.lookAt(scene3D.position);
            
            // Animación de formas flotantes
            floatingShapes.forEach((shape, index) => {
                const time = Date.now() * shape.userData.speed;
                shape.position.y = shape.userData.originalPosition[1] + Math.sin(time + index) * 2;
                shape.rotation.x += shape.userData.rotationSpeed;
                shape.rotation.y += shape.userData.rotationSpeed;
                
                // Pulsación suave
                const scale = 1 + Math.sin(time * 2) * 0.1;
                shape.scale.setScalar(scale);
            });
            
            // Animación de partículas
            particles3D.forEach((particleSystem) => {
                particleSystem.rotation.y += particleSystem.userData.speed;
                
                // Efecto de respiración en las partículas
                const time = Date.now() * 0.001;
                const positions = particleSystem.geometry.attributes.position.array;
                const originalPositions = particleSystem.userData.originalPositions || positions;
                
                for (let i = 0; i < positions.length; i += 3) {
                    positions[i] = originalPositions[i] + Math.sin(time + i) * 0.1;
                    positions[i + 1] = originalPositions[i + 1] + Math.cos(time + i) * 0.1;
                    positions[i + 2] = originalPositions[i + 2] + Math.sin(time * 0.5 + i) * 0.1;
                }
                
                particleSystem.geometry.attributes.position.needsUpdate = true;
            });
            
            // Animación del torus knot
            if (torusKnot) {
                torusKnot.rotation.x += 0.005;
                torusKnot.rotation.y += 0.003;
                
                // Efecto de pulsación
                const scale = 1 + Math.sin(Date.now() * 0.001) * 0.1;
                torusKnot.scale.setScalar(scale);
            }
            
            // Actualizar controles si existen
            if (controls3D) {
                controls3D.update();
            }
            
            renderer3D.render(scene3D, camera3D);
        }
        
        // Sistema de partículas 3D con Three.js (original)
        function init3DParticles() {
            const container = document.getElementById('particles-3d');
            if (!container) return;
            
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            container.appendChild(renderer.domElement);
            
            const particlesGeometry = new THREE.BufferGeometry();
            const count = 1500;
            
            const positions = new Float32Array(count * 3);
            const colors = new Float32Array(count * 3);
            
            for (let i = 0; i < count * 3; i += 3) {
                positions[i] = (Math.random() - 0.5) * 50;
                positions[i + 1] = (Math.random() - 0.5) * 50;
                positions[i + 2] = (Math.random() - 0.5) * 50;
                
                colors[i] = Math.random() * 0.5 + 0.5;
                colors[i + 1] = Math.random() * 0.3 + 0.3;
                colors[i + 2] = Math.random() * 0.8 + 0.2;
            }
            
            particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            
            const particlesMaterial = new THREE.PointsMaterial({
                size: 0.05,
                vertexColors: true,
                transparent: true,
                opacity: 0.6
            });
            
            const particles = new THREE.Points(particlesGeometry, particlesMaterial);
            scene.add(particles);
            
            camera.position.z = 5;
            
            function animate() {
                requestAnimationFrame(animate);
                
                particles.rotation.x += 0.0005;
                particles.rotation.y += 0.001;
                
                renderer.render(scene, camera);
            }
            
            animate();
            
            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });
        }
        
        // Función para enviar mensaje por WhatsApp
        function sendViaWhatsApp() {
            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const subject = document.getElementById('contact-subject').value;
            const message = document.getElementById('contact-message').value;
            
            // Validar campos
            if (!name || !email || !subject || !message) {
                alert('Por favor, completa todos los campos antes de enviar.');
                return;
            }
            
            // Formatear mensaje para WhatsApp
            const whatsappMessage = `*Nuevo mensaje de contacto*%0A%0A*Nombre:* ${name}%0A*Email:* ${email}%0A*Asunto:* ${subject}%0A*Mensaje:* ${message}%0A%0A_Enviado desde mi portafolio web_`;
            
            // Número de teléfono (incluye código de país)
            const phoneNumber = '573045517255';
            
            // Crear URL de WhatsApp
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;
            
            // Abrir WhatsApp en nueva pestaña
            window.open(whatsappUrl, '_blank');
            
            // Opcional: Mostrar confirmación
            const submitBtn = document.querySelector('#contact-form button[type="button"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-check"></i> MENSAJE PREPARADO';
            submitBtn.style.background = 'linear-gradient(to right, #10b981, #059669)';
            
            // Restaurar después de 3 segundos
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = 'linear-gradient(to right, #7c3aed, #06b6d4)';
                
                // Limpiar formulario
                document.getElementById('contact-form').reset();
            }, 3000);
        }
        
        // Cursor personalizado
        const cursor = document.querySelector('.custom-cursor');
        const cursorDot = document.querySelector('.cursor-dot');
        
        if (cursor && cursorDot) {
            document.addEventListener('mousemove', (e) => {
                cursor.style.left = `${e.clientX}px`;
                cursor.style.top = `${e.clientY}px`;
                
                cursorDot.style.left = `${e.clientX}px`;
                cursorDot.style.top = `${e.clientY}px`;
            });
            
            document.addEventListener('mousedown', () => {
                cursor.style.transform = 'scale(0.5)';
            });
            
            document.addEventListener('mouseup', () => {
                cursor.style.transform = 'scale(1)';
            });
        }
        
        // Efecto de escritura automática
        function initTyped() {
            const typedElement = document.getElementById('typed-text');
            if (!typedElement) return;
            
            new Typed(typedElement, {
                strings: [
                    'Arquitecto de Software',
                    'Mobile Developer Nativo',
                    'Backend Engineer',
                    'Especialista en Análisis de Datos',
                    'Bootcamp IA 2025-2026',
                    'Innovador Digital'
                ],
                typeSpeed: 60,
                backSpeed: 40,
                backDelay: 2000,
                loop: true,
                showCursor: false
            });
        }
        
        // Animación de contadores
        function animateCounters() {
            const counters = document.querySelectorAll('.counter');
            
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                const increment = target / 100;
                let current = 0;
                
                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        counter.innerText = Math.floor(current);
                        setTimeout(updateCounter, 20);
                    } else {
                        counter.innerText = target;
                    }
                };
                
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            updateCounter();
                            observer.unobserve(counter);
                        }
                    });
                }, { threshold: 0.5 });
                
                observer.observe(counter);
            });
        }
        
        // Navegación suave
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                    
                    // Cerrar menú móvil si está abierto
                    const mobileMenu = document.getElementById('mobile-menu');
                    if (mobileMenu) {
                        mobileMenu.classList.add('hidden');
                    }
                }
            });
        });
        
        // Control del menú móvil
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', function() {
                const menu = document.getElementById('mobile-menu');
                if (menu) {
                    menu.classList.toggle('hidden');
                }
            });
        }
        
        // Cambiar navbar al hacer scroll
        let lastScroll = 0;
        window.addEventListener('scroll', function() {
            const navbar = document.getElementById('navbar');
            if (!navbar) return;
            
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 50) {
                navbar.classList.add('glass-advanced');
                navbar.classList.remove('bg-transparent');
            } else {
                navbar.classList.remove('glass-advanced');
                navbar.classList.add('bg-transparent');
            }
            
            // Ocultar/mostrar navbar al hacer scroll
            if (currentScroll > lastScroll && currentScroll > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        });
        
        // Funciones para modales
        function openModal(id) {
            const modal = document.getElementById(id);
            if (modal) {
                modal.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            }
        }
        
        function closeModal(id) {
            const modal = document.getElementById(id);
            if (modal) {
                modal.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }
        }
        
        // Función para abrir modal de PDF
        function openPdfModal(pdfFile, title) {
            currentPdfFile = pdfFile;
            currentPdfTitle = title;
            
            // Configurar el título del modal
            document.getElementById('pdfModalTitle').textContent = title;
            document.getElementById('pdfModalSubtitle').textContent = 'Visualización del documento';
            
            // Configurar el iframe para mostrar el PDF
            const pdfViewer = document.getElementById('pdfViewer');
            pdfViewer.src = pdfFile;
            
            // Abrir el modal
            openModal('modalPDF');
        }
        
        // Función para descargar el PDF actual
        function downloadCurrentPDF() {
            if (currentPdfFile) {
                // Crear un enlace temporal para descargar el PDF
                const link = document.createElement('a');
                link.href = currentPdfFile;
                link.download = currentPdfFile;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
        
        // Cerrar modal al hacer clic fuera
        window.onclick = (e) => {
            if (e.target.id === 'modalCerts') closeModal('modalCerts');
            if (e.target.id === 'modalPDF') closeModal('modalPDF');
        }
        
        // Manejo del formulario
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                // Ahora el envío se maneja a través de WhatsApp
                sendViaWhatsApp();
            });
        }
        
        // Efecto de tema (claro/oscuro)
        function toggleTheme() {
            document.body.classList.toggle('light-theme');
            
            const icon = document.querySelector('#navbar button:nth-child(1) i');
            if (icon) {
                if (document.body.classList.contains('light-theme')) {
                    document.body.style.backgroundColor = '#f8fafc';
                    document.body.style.color = '#0f172a';
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                    
                    // Ajustar opacidad del fondo 3D para tema claro
                    const threeBg = document.getElementById('threejs-background');
                    if (threeBg) {
                        threeBg.style.opacity = '0.3';
                    }
                } else {
                    document.body.style.backgroundColor = '#0a0a0f';
                    document.body.style.color = '#f1f5f9';
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                    
                    // Restaurar opacidad del fondo 3D para tema oscuro
                    const threeBg = document.getElementById('threejs-background');
                    if (threeBg) {
                        threeBg.style.opacity = '0.6';
                    }
                }
            }
            
            // Actualizar todos los botones glass-advanced
            updateGlassButtonsForTheme();
        }
        
        // Función para actualizar botones glass-advanced según el tema
        function updateGlassButtonsForTheme() {
            const glassButtons = document.querySelectorAll('.glass-advanced');
            glassButtons.forEach(button => {
                if (document.body.classList.contains('light-theme')) {
                    button.classList.add('light-theme-glass');
                    // Asegurar que el texto sea visible
                    const textElements = button.querySelectorAll('.text-slate-300, .text-slate-400, .text-slate-500');
                    textElements.forEach(el => {
                        el.classList.add('light-theme-text');
                    });
                } else {
                    button.classList.remove('light-theme-glass');
                    const textElements = button.querySelectorAll('.light-theme-text');
                    textElements.forEach(el => {
                        el.classList.remove('light-theme-text');
                    });
                }
            });
        }
        
        // Efecto de parallax en elementos
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.parallax-layer');
            
            parallaxElements.forEach(element => {
                const speed = element.getAttribute('data-speed') || 0.3;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
        
        // Inicialización cuando se carga la página
        document.addEventListener('DOMContentLoaded', function() {
            // Inicializar efectos
            initAdvanced3DBackground();
            init3DParticles();
            initTyped();
            animateCounters();
            
            // Efecto de entrada para elementos
            const floatElements = document.querySelectorAll('.float-in');
            floatElements.forEach((el, index) => {
                el.style.animationDelay = `${index * 0.1}s`;
            });
            
            // Preloader sutil
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 100);
            
            // Inicializar botones para tema actual
            updateGlassButtonsForTheme();
        });
        
        // Efecto hover en tarjetas de proyecto
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateY = (x - centerX) / 25;
                const rotateX = (centerY - y) / 25;
                
                this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
        
        // Detectar dispositivo y aplicar ajustes específicos
        function detectDevice() {
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            
            // Detectar Android TV o Smart TV
            const isTV = /TV|SMART-TV|ANDROID-TV|Tizen|WebOS|Roku|Xbox|PlayStation|Chromecast/i.test(userAgent);
            
            // Detectar dispositivos móviles
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
            
            // Aplicar ajustes específicos
            if (isTV) {
                // Aumentar tamaños de fuente para TV
                document.body.style.fontSize = '18px';
                document.querySelectorAll('button, a').forEach(el => {
                    el.style.minHeight = '48px';
                    el.style.padding = '12px 24px';
                });
            }
            
            if (isMobile) {
                // Asegurar que el botón de credenciales esté visible
                const credBtn = document.querySelector('.mobile-credentials-btn');
                if (credBtn) {
                    credBtn.style.display = 'flex !important';
                }
                
                // Reducir efectos 3D en móviles para mejor rendimiento
                const threeBg = document.getElementById('threejs-background');
                if (threeBg) {
                    threeBg.style.opacity = '0.2';
                }
            }
        }
        
        // Ejecutar detección de dispositivo
        detectDevice();
  