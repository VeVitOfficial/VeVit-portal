// app.js - Hlavní logika aplikace (ANF Framework redesign)

const App = {
    // --- SECURITY UTILS ---
    escapeHTML(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    },

    state: {
        language: 'cs',
        isDark: true,
        currentView: 'home',
        themeClickCount: 0,
        isDiscoMode: false,
        discoPhase: 'off',
        clickTimeout: null,
        discoAudio: null,
        isScrolled: false,
        isMobileMenuOpen: false,
        isLangMenuOpen: false,
        isAppsDropdownOpen: false,
        isUserDropdownOpen: false,
        activeSection: 'hero',
        stats: { users: 99, games: 21, tools: 100, lessons: 500 }
    },

    languages: [
        { code: 'cs', label: '🇨🇿', name: 'Čeština' },
        { code: 'en', label: '🇬🇧', name: 'English' },
        { code: 'de', label: '🇩🇪', name: 'Deutsch' },
        { code: 'es', label: '🇪🇸', name: 'Español' },
        { code: 'uk', label: '🇺🇦', name: 'Українська' },
    ],

    navItems: [
        { label: 'nav.home', id: 'home', view: 'home' },
        { label: 'nav.about', id: 'about', view: 'home', scrollTo: 'about' },
        { label: 'nav.contact', id: 'contact', view: 'contact' },
        { label: 'nav.card', id: 'card', view: 'card' },
    ],

    appsDropdown: [
        { label: 'nav.webApp', action: 'scroll', scrollTo: 'hub', icon: 'Monitor', desc: 'appsDropdown.webAppDesc' },
        { label: 'nav.search', href: 'https://search.vevit.fun', icon: 'Search', desc: 'appsDropdown.searchDesc' },
        { label: 'nav.desktopApp', href: '#', icon: 'Download', desc: 'appsDropdown.desktopAppDesc', badge: 'appsDropdown.comingSoon' },
    ],

    // Projekty pro Bento Grid
    projects: [
        { id: 'tools', title: 'projects.tools.title', description: 'projects.tools.desc', icon: 'Wrench', href: 'https://tools.vevit.fun', status: 'live', featured: true },
        { id: 'games', title: 'projects.games.title', description: 'projects.games.desc', icon: 'Gamepad2', href: 'https://games.vevit.fun', status: 'early-access' },
        { id: 'edu', title: 'projects.edu.title', description: 'projects.edu.desc', icon: 'GraduationCap', href: 'https://edu.vevit.fun/', status: 'live' },
        { id: 'services', title: 'projects.services.title', description: 'projects.services.desc', icon: 'Briefcase', href: 'https://services.vevit.fun', status: 'live' },
        { id: 'vevibe', title: 'projects.vevibe.title', description: 'projects.vevibe.desc', icon: 'Users', href: '#', status: 'preparing' },
        { id: 'store', title: 'projects.store.title', description: 'projects.store.desc', icon: 'ShoppingBag', href: 'https://store.vevit.fun', status: 'preparing' },
    ],

    socials: [
        { platform: 'Discord', href: 'https://discord.gg/3X7H4xd8', icon: 'Discord' },
        { platform: 'Twitter', href: 'https://twitter.com/VeVitOfficial', icon: 'Twitter' },
        { platform: 'Instagram', href: 'https://instagram.com/vevit.fun', icon: 'Instagram' },
        { platform: 'Email', href: 'mailto:info@vevit.fun', icon: 'Mail' },
    ],

    premiumTiers: [
        {
            id: 'bronze',
            priceMonthly: 99,
            priceYearly: 990,
            image: './images/bronze_premium.png',
            frame: './images/bronze rámeček.png',
            color: 'bronze'
        },
        {
            id: 'silver',
            priceMonthly: 199,
            priceYearly: 1990,
            image: './images/silver_premium.png',
            frame: './images/silver premium.png',
            isPopular: true,
            color: 'silver'
        },
        {
            id: 'gold',
            priceMonthly: 399,
            priceYearly: 3990,
            image: './images/gold_premium.png',
            frame: './images/gold rámeček.png',
            color: 'gold'
        },
        {
            id: 'platinum',
            priceMonthly: 1499,
            priceYearly: 14990,
            image: './images/platinum_premium.png',
            frame: './images/platinum rámeček.png',
            color: 'platinum'
        }
    ],

    features: [
        { title: 'about.features.innovation.title', description: 'about.features.innovation.desc', icon: 'Wrench' },
        { title: 'about.features.quality.title', description: 'about.features.quality.desc', icon: 'Lock' },
        { title: 'about.features.ecosystem.title', description: 'about.features.ecosystem.desc', icon: 'Cpu' }
    ],

    init() {
        Auth.init();
        this.state.isDark = document.documentElement.classList.contains('dark');
        this.render();
        this.attachGlobalListeners();
        this.handleScroll();
        this.fetchStats();
        this.showPremiumIfLoggedIn();
    },

    showPremiumIfLoggedIn() {
        // Check if user is logged in and show premium section
        setTimeout(() => {
            const premiumSection = document.getElementById('premium');
            if (premiumSection && Auth.user) {
                premiumSection.style.display = 'block';
                premiumSection.style.opacity = '0';
                premiumSection.style.transform = 'translateY(20px)';
                premiumSection.style.transition = 'opacity 400ms ease-out, transform 400ms ease-out';

                requestAnimationFrame(() => {
                    premiumSection.style.opacity = '1';
                    premiumSection.style.transform = 'translateY(0)';
                });
            }
        }, 100);
    },

    navigateToPremium() {
        this.state.isMobileMenuOpen = false;
        this.renderNavbar();

        if (Auth.user) {
            const premiumSection = document.getElementById('premium');
            if (premiumSection) {
                premiumSection.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            App.openLogin();
        }
    },

    async fetchStats() {
        try {
            const response = await fetch('./api.php?action=get_stats');
            const data = await response.json();
            if (data.success && data.stats) {
                this.state.stats = data.stats;
                this.render();
            }
        } catch (e) {
            console.log('Could not fetch stats, using defaults');
        }
    },

    t(key) {
        return UI.t(key, this.state.language);
    },

    setLanguage(code) {
        this.state.language = code;
        this.state.isLangMenuOpen = false;
        this.render();
    },

    toggleTheme() {
        if (this.state.isDiscoMode) return;

        this.state.isDark = !this.state.isDark;
        if (this.state.isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        this.state.themeClickCount++;
        if (this.state.themeClickCount >= 16) {
            this.triggerDiscoMode();
            this.state.themeClickCount = 0;
        }

        if (this.state.clickTimeout) clearTimeout(this.state.clickTimeout);
        this.state.clickTimeout = setTimeout(() => {
            this.state.themeClickCount = 0;
        }, 2000);

        this.renderNavbar();
    },

    triggerDiscoMode() {
        this.state.isDiscoMode = true;
        this.state.discoPhase = 'dropping';

        if (!this.state.isDark) {
            document.documentElement.classList.add('dark');
            this.state.isDark = true;
        }

        if (!this.state.discoAudio) {
            this.state.discoAudio = new Audio('https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=disco-groove-114204.mp3');
        }
        this.state.discoAudio.volume = 0.5;
        this.state.discoAudio.currentTime = 0;
        this.state.discoAudio.play().catch(e => console.log("Audio play failed:", e));

        this.render();

        setTimeout(() => {
            this.state.discoPhase = 'party';
            document.body.classList.add('disco-mode');
            this.render();
        }, 2000);

        setTimeout(() => {
            if (this.state.discoAudio) {
                let fadeInterval = setInterval(() => {
                    if (this.state.discoAudio && this.state.discoAudio.volume > 0.05) {
                        this.state.discoAudio.volume -= 0.05;
                    } else {
                        if (this.state.discoAudio) this.state.discoAudio.volume = 0;
                        clearInterval(fadeInterval);
                    }
                }, 200);
            }
        }, 23000);

        setTimeout(() => {
            this.state.isDiscoMode = false;
            this.state.discoPhase = 'off';
            document.body.classList.remove('disco-mode');
            if (this.state.discoAudio) {
                this.state.discoAudio.pause();
            }
            this.render();
        }, 25000);
    },

    navigate(view, scrollTo) {
        this.state.currentView = view;
        this.state.isMobileMenuOpen = false;
        this.render();

        if (view === 'home' && !scrollTo) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        if (scrollTo) {
            setTimeout(() => {
                const el = document.getElementById(scrollTo);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    },

    handleScroll() {
        const isScrolled = window.scrollY > 20;
        if (this.state.isScrolled !== isScrolled) {
            this.state.isScrolled = isScrolled;
            this.renderNavbar();
        }

        if (this.state.currentView === 'home') {
            const triggerPoint = window.scrollY + (window.innerHeight / 3);
            let currentSection = 'hero';
            const sections = ['hero', 'hub', 'premium', 'about', 'contact'];

            sections.forEach(id => {
                const element = document.getElementById(id);
                if (element && triggerPoint >= element.offsetTop) {
                    currentSection = id;
                }
            });

            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
                currentSection = 'contact';
            }

            if (this.state.activeSection !== currentSection) {
                this.state.activeSection = currentSection;
                this.renderScrollNav();
            }
        }
    },

    attachGlobalListeners() {
        window.addEventListener('scroll', () => this.handleScroll());
        document.addEventListener('mousedown', (e) => {
            const langMenu = document.getElementById('lang-menu-dropdown');
            const langBtn = document.getElementById('lang-menu-btn');
            if (this.state.isLangMenuOpen && langMenu && !langMenu.contains(e.target) && !langBtn.contains(e.target)) {
                this.state.isLangMenuOpen = false;
                this.renderNavbar();
            }
            const appsWrapper = document.getElementById('apps-dropdown-wrapper');
            if (this.state.isAppsDropdownOpen && appsWrapper && !appsWrapper.contains(e.target)) {
                this.state.isAppsDropdownOpen = false;
                this.renderNavbar();
            }
            const userNav = document.getElementById('vevit-user-nav');
            if (this.state.isUserDropdownOpen && userNav && !userNav.contains(e.target)) {
                this.state.isUserDropdownOpen = false;
                this.renderNavbar();
            }
        });
    },

    // --- RENDER FUNCTIONS ---

    render() {
        const root = document.getElementById('root');
        if (this.state.isDiscoMode) {
            root.classList.add('overflow-hidden');
        } else {
            root.classList.remove('overflow-hidden');
        }

        let html = '';

        if (this.state.isDiscoMode) {
            html += this.getDiscoHTML();
        }

        html += `<div id="navbar-container"></div>`;

        if (this.state.currentView === 'home') {
            html += `<div id="scroll-nav-container"></div>`;
        }

        html += `<main class="flex-grow">`;
        if (this.state.currentView === 'home') {
            html += this.getHeroHTML() + this.getHubHTML() + this.getPremiumHTML() + this.getAboutHTML();
        } else if (this.state.currentView === 'contact') {
            html += this.getContactHTML();
        } else if (this.state.currentView === 'card') {
            html += this.getCardHTML();
        } else if (this.state.currentView === 'apps') {
            html += this.getAppsHTML();
        }
        html += `</main>`;

        html += this.getFooterHTML();

        root.innerHTML = html;

        this.renderNavbar();
        if (this.state.currentView === 'home') {
            this.renderScrollNav();
        }
        this.attachEventListeners();
    },

    renderNavbar() {
        const container = document.getElementById('navbar-container');
        if (!container) return;

        const currentLangObj = this.languages.find(l => l.code === this.state.language) || this.languages[0];
        const user = Auth.user;
        const avatarUrl = Auth.getAvatarUrl();

        // Navigace — modern pill style
        let navItemsFirstHalf = this.navItems.slice(0, 2).map(item => {
            const isActive = this.state.currentView === item.view && !item.scrollTo;
            return `<button onclick="App.navigate('${item.view}', ${item.scrollTo ? `'${item.scrollTo}'` : 'null'})" class="relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${isActive ? 'text-white bg-slate-800/70' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'}">
                ${this.t(item.label)}
            </button>`;
        }).join('');

        let navItemsSecondHalf = this.navItems.slice(2).map(item => {
            const isActive = this.state.currentView === item.view;
            return `<button onclick="App.navigate('${item.view}', ${item.scrollTo ? `'${item.scrollTo}'` : 'null'})" class="relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${isActive ? 'text-white bg-slate-800/70' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'}">
                ${this.t(item.label)}
            </button>`;
        }).join('');

        // Apps dropdown — modern style
        let appsDropdownHtml = `
            <div class="relative" id="apps-dropdown-wrapper">
                <button onclick="App.toggleAppsDropdown(event)" class="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-200 text-sm font-medium">
                    ${UI.icons.Grid}
                    ${this.t('nav.apps')}
                    <svg class="w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${this.state.isAppsDropdownOpen ? 'rotate-180' : ''}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
                </button>
                <div id="apps-dropdown-menu" class="absolute top-full left-0 mt-3 w-72 bg-surface-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/40 p-2 z-50 transition-all duration-200 ${this.state.isAppsDropdownOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}">
                    <div class="px-3 py-2 mb-1">
                        <span class="text-[10px] font-semibold text-brand-400 uppercase tracking-wider">${this.t('appsDropdown.header')}</span>
                    </div>
                    ${this.appsDropdown.map(item => {
                        const clickHandler = item.action === 'scroll'
                            ? `onclick="event.preventDefault(); App.navigate('home', '${item.scrollTo}'); App.state.isAppsDropdownOpen = false; App.renderNavbar();"`
                            : (item.href === '#' ? 'onclick="event.preventDefault()"' : '');
                        const hrefAttr = item.action === 'scroll' ? 'href="#"' : `href="${item.href}"`;
                        const targetAttr = item.href && item.href !== '#' ? 'target="_blank" rel="noopener noreferrer"' : '';
                        return `
                            <a ${hrefAttr} ${targetAttr} ${clickHandler} class="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-800/70 transition-all duration-200 group">
                                <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-800/50 flex items-center justify-center flex-shrink-0 group-hover:from-brand-500/20 group-hover:to-brand-600/10 transition-all duration-200">
                                    ${UI.icons[item.icon].replace('width="18"', 'width="18"').replace('height="18"', 'height="18"').replace('text-slate-400', 'text-slate-300 group-hover:text-brand-400')}
                                </div>
                                <div class="min-w-0 flex-1">
                                    <div class="flex items-center gap-2">
                                        <span class="text-sm font-medium text-slate-200">${this.t(item.label)}</span>
                                        ${item.badge ? `<span class="text-[10px] bg-brand-500/20 text-brand-400 px-2 py-0.5 rounded-full">${this.t(item.badge)}</span>` : ''}
                                    </div>
                                    <div class="text-xs text-slate-500">${this.t(item.desc)}</div>
                                </div>
                            </a>
                        `;
                    }).join('')}
                </div>
            </div>
        `;

        // Mobile navigace
        let mobileNavItemsFirstHalf = this.navItems.slice(0, 2).map(item => {
            return `<button onclick="App.navigate('${item.view}', ${item.scrollTo ? `'${item.scrollTo}'` : 'null'})" class="block w-full text-left px-4 py-3.5 rounded-xl text-slate-300 hover:bg-slate-800/70 font-medium transition-all duration-200">${this.t(item.label)}</button>`;
        }).join('');

        let mobileNavItemsSecondHalf = this.navItems.slice(2).map(item => {
            return `<button onclick="App.navigate('${item.view}', ${item.scrollTo ? `'${item.scrollTo}'` : 'null'})" class="block w-full text-left px-4 py-3.5 rounded-xl text-slate-300 hover:bg-slate-800/70 font-medium transition-all duration-200">${this.t(item.label)}</button>`;
        }).join('');

        let mobileAppsDropdownHtml = `
            <div class="mobile-apps-dropdown">
                <button onclick="App.toggleMobileAppsDropdown()" class="block w-full text-left px-4 py-3.5 rounded-xl text-slate-300 hover:bg-slate-800/70 font-medium flex items-center justify-between transition-all duration-200">
                    <span class="flex items-center gap-3">${UI.icons.Grid}<span>${this.t('nav.apps')}</span></span>
                    <svg class="w-4 h-4 text-slate-500 transition-transform duration-200 ${this.state.isAppsDropdownOpen ? 'rotate-180' : ''}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
                </button>
                <div class="overflow-hidden transition-all duration-200 ${this.state.isAppsDropdownOpen ? 'max-h-[300px]' : 'max-h-0'}">
                    ${this.appsDropdown.map(item => {
                        const clickHandler = item.action === 'scroll'
                            ? `onclick="event.preventDefault(); App.navigate('home', '${item.scrollTo}'); App.state.isAppsDropdownOpen = false; App.renderNavbar();"`
                            : (item.href === '#' ? 'onclick="event.preventDefault()"' : '');
                        const hrefAttr = item.action === 'scroll' ? 'href="#"' : `href="${item.href}"`;
                        const targetAttr = item.href && item.href !== '#' ? 'target="_blank" rel="noopener noreferrer"' : '';
                        return `
                            <a ${hrefAttr} ${targetAttr} ${clickHandler} class="flex items-center gap-3 pl-8 pr-4 py-3 hover:bg-slate-800/50 transition-all duration-200">
                                <div class="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                                    ${UI.icons[item.icon].replace('width="18"', 'width="14"').replace('height="18"', 'height="14"')}
                                </div>
                                <div>
                                    <span class="text-sm text-slate-200">${this.t(item.label)}</span>
                                    ${item.badge ? `<span class="text-[10px] bg-brand-500/20 text-brand-400 px-1.5 py-0.5 rounded-full ml-2">${this.t(item.badge)}</span>` : ''}
                                </div>
                            </a>
                        `;
                    }).join('')}
                </div>
            </div>
        `;

        let langOptionsHtml = this.languages.map(lang => `
            <button onclick="App.setLanguage('${lang.code}')" class="w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${this.state.language === lang.code ? 'bg-brand-500/10 text-brand-400' : 'text-slate-300 hover:bg-slate-800'}">
                <div class="flex items-center gap-3"><span class="text-base">${lang.label}</span><span class="font-medium">${lang.name}</span></div>
                ${this.state.language === lang.code ? `<span class="text-brand-400">${UI.icons.Check}</span>` : ''}
            </button>
        `).join('');

        let authHtml = user ? `
            <div class="relative" id="vevit-user-nav">
                <button onclick="App.toggleUserDropdown()" class="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-slate-800/50 transition-all duration-200">
                    <div class="relative group flex items-center justify-center w-9 h-9 rounded-full overflow-hidden border-2 border-slate-700 hover:border-brand-500 transition-all duration-200">
                        <img src="${this.escapeHTML(avatarUrl)}" alt="${this.escapeHTML(user.nickname || user.full_name || 'User')}" class="w-full h-full object-cover" onerror="this.onerror=null; this.src='${this.escapeHTML(Auth.getFallbackAvatarUrl())}';" />
                    </div>
                    <span class="text-sm font-semibold text-slate-200 hidden lg:inline">${this.escapeHTML(user.nickname || '')}</span>
                    <span class="text-xs font-bold text-brand-400 hidden lg:inline">Lv.${user.level || user.xp || ''}</span>
                </button>
                <div id="vevit-dropdown" class="absolute right-0 top-full mt-2 w-52 bg-surface-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl shadow-black/40 overflow-hidden ${this.state.isUserDropdownOpen ? '' : 'hidden'}">
                    <div class="px-4 py-3 border-b border-slate-700/50">
                        <div class="text-sm font-semibold text-white">${this.escapeHTML(user.nickname || user.full_name || 'User')}</div>
                        <div class="text-xs text-slate-500 mt-0.5">${this.escapeHTML(user.email || '')}</div>
                    </div>
                    <a href="https://account.vevit.fun/profile" class="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800/70 hover:text-white transition-colors duration-150">
                        ${UI.icons.User || '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>'}
                        Můj profil
                    </a>
                    <button onclick="App.logout()" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors duration-150 text-left">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                        Odhlásit se
                    </button>
                </div>
            </div>
        ` : `
            <button onclick="App.openLogin()" class="text-sm font-semibold px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white transition-all duration-200 shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30">
                Přihlásit se
            </button>
        `;

        let mobileAuthHtml = user ? `
            <a href="https://account.vevit.fun/profile" class="flex items-center gap-3 px-4 py-3.5 rounded-xl text-slate-300 hover:bg-slate-800/70 font-medium transition-all duration-200">
                <img src="${this.escapeHTML(avatarUrl)}" alt="${this.escapeHTML(user.nickname || 'User')}" class="w-8 h-8 rounded-full object-cover border border-slate-700" onerror="this.onerror=null; this.src='${this.escapeHTML(Auth.getFallbackAvatarUrl())}';" />
                <div class="flex flex-col">
                    <span class="text-sm font-semibold text-white">${this.escapeHTML(user.nickname || user.full_name || 'User')}</span>
                    <span class="text-xs text-brand-400">Lv.${user.level || ''}</span>
                </div>
            </a>
            <button onclick="App.logout()" class="block w-full text-left px-4 py-3.5 rounded-xl text-red-400 hover:bg-red-500/10 font-medium transition-all duration-200">
                Odhlásit se
            </button>
        ` : `
            <div class="pt-4 mt-4 border-t border-slate-700/50">
                <button onclick="App.openLogin()" class="block w-full text-center px-4 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white font-medium shadow-lg shadow-brand-500/20">
                    Přihlásit se
                </button>
            </div>
        `;

        container.innerHTML = `
            <nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${this.state.isScrolled ? 'bg-surface-950/90 backdrop-blur-xl shadow-lg shadow-black/20' : 'bg-gradient-to-b from-surface-950/60 to-transparent backdrop-blur-sm'}">
                <!-- Subtle gradient line -->
                <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent"></div>
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex items-center justify-between h-16">
                        <!-- Logo with glow -->
                        <div class="flex items-center gap-3 cursor-pointer group" onclick="App.navigate('home', 'hero')">
                            <div class="relative">
                                <div class="absolute inset-0 bg-brand-500/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div class="relative w-9 h-9 group-hover:scale-110 transition-transform duration-300">
                                    <img src="./images/logo-light.png" alt="VeVit Logo" class="absolute inset-0 w-full h-full object-contain dark:hidden" />
                                    <img src="./images/logo-dark.png" alt="VeVit Logo" class="absolute inset-0 w-full h-full object-contain hidden dark:block" />
                                </div>
                            </div>
                            <span class="text-xl font-semibold text-white tracking-tight">VeVit</span>
                        </div>

                        <div class="hidden md:flex items-center gap-2">
                            ${navItemsFirstHalf}
                            ${appsDropdownHtml}
                            ${navItemsSecondHalf}
                            <div class="h-5 w-px bg-slate-700/50 mx-3"></div>
                            <div class="relative">
                                <button id="lang-menu-btn" onclick="App.toggleLangMenu()" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800/50 transition-all duration-200 text-slate-400 hover:text-white text-sm font-medium">
                                    <span>${currentLangObj.label}</span>
                                    <svg class="w-3.5 h-3.5 transition-transform duration-200 ${this.state.isLangMenuOpen ? 'rotate-180' : ''}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
                                </button>
                                <div id="lang-menu-dropdown" class="absolute top-full right-0 mt-2 w-40 bg-surface-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-xl overflow-hidden ${this.state.isLangMenuOpen ? 'block' : 'hidden'}">
                                    ${langOptionsHtml}
                                </div>
                            </div>
                            <button onclick="App.toggleTheme()" class="p-2.5 rounded-lg hover:bg-slate-800/50 transition-all duration-200 text-slate-400 hover:text-brand-400">
                                ${this.state.isDark ? UI.icons.Sun : UI.icons.Moon}
                            </button>
                            <div class="h-5 w-px bg-slate-700/50 mx-3"></div>
                            ${authHtml}
                        </div>

                        <div class="flex items-center gap-3 md:hidden">
                            <button onclick="App.nextLanguage()" class="p-2.5 rounded-lg hover:bg-slate-800/50 text-slate-400 flex items-center gap-1.5 text-sm font-medium transition-all duration-200"><span class="text-base">${currentLangObj.label}</span></button>
                            <button onclick="App.toggleTheme()" class="p-2.5 rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-brand-400 transition-all duration-200">${this.state.isDark ? UI.icons.Sun : UI.icons.Moon}</button>
                            ${user ? mobileAuthHtml : ''}
                            <button onclick="App.toggleMobileMenu()" class="p-2.5 rounded-lg hover:bg-slate-800/50 text-slate-400 transition-all duration-200">${this.state.isMobileMenuOpen ? UI.icons.X : UI.icons.Menu}</button>
                        </div>
                    </div>
                </div>
                <div class="md:hidden absolute top-full left-0 right-0 bg-surface-950/95 backdrop-blur-xl border-b border-slate-800/50 overflow-hidden transition-all duration-300 ${this.state.isMobileMenuOpen ? 'max-h-[500px]' : 'max-h-0'}">
                    <div class="px-4 py-4 space-y-1">
                        ${mobileNavItemsFirstHalf}
                        ${mobileAppsDropdownHtml}
                        ${mobileNavItemsSecondHalf}
                        ${!user ? mobileAuthHtml : ''}
                    </div>
                </div>
            </nav>
        `;
    },

    renderScrollNav() {
        const container = document.getElementById('scroll-nav-container');
        if (!container) return;

        const sections = [
            { id: 'hero', label: 'nav.home' },
            { id: 'hub', label: 'nav.projects' },
            { id: 'premium', label: 'nav.premium' },
            { id: 'about', label: 'nav.about' },
            { id: 'contact', label: 'nav.contact' },
        ];

        const visibleSections = sections;

        let html = `
            <div class="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-end gap-6">
                <div class="absolute right-[5px] top-0 bottom-0 w-0.5 bg-slate-800 rounded-full"></div>
                ${visibleSections.map(section => {
                    const isActive = this.state.activeSection === section.id;
                    return `
                        <a href="#${section.id}" onclick="event.preventDefault(); App.navigate('home', '${section.id}')" class="group flex items-center gap-3 relative cursor-pointer">
                            <span class="text-xs font-medium transition-all duration-150 ${isActive ? 'text-brand-400' : 'text-slate-500 group-hover:text-slate-300'}">${this.t(section.label)}</span>
                            <div class="relative flex items-center justify-center">
                                <div class="absolute inset-0 rounded-full bg-brand-500/20 ${isActive ? 'animate-ping' : 'opacity-0'}"></div>
                                <div class="w-2 h-2 rounded-full transition-all duration-150 ${isActive ? 'bg-brand-500 scale-125' : 'bg-slate-700 group-hover:bg-slate-500'}"></div>
                            </div>
                        </a>
                    `;
                }).join('')}
            </div>
        `;
        container.innerHTML = html;
    },

    getDiscoHTML() {
        return `
            <div class="fixed inset-0 z-[100] pointer-events-none flex justify-center overflow-hidden">
                <div class="absolute top-0 origin-top flex flex-col items-center ${this.state.discoPhase === 'dropping' ? 'animate-drop-ball' : 'translate-y-0'}" style="${this.state.discoPhase === 'dropping' ? 'transform: translateY(-100%)' : ''}">
                    <div class="w-1 h-24 bg-gradient-to-b from-gray-800 to-gray-400"></div>
                    <div class="w-40 h-40 rounded-full bg-gradient-to-br from-gray-100 via-gray-400 to-gray-800 shadow-[0_0_80px_rgba(255,255,255,1)] relative overflow-hidden flex flex-wrap" style="animation: spin-slow 3s linear infinite">
                        ${Array.from({ length: 150 }).map(() => `<div class="w-[8%] h-[8%] border border-white/30 bg-white/40" style="opacity: ${Math.random() * 0.8 + 0.2}"></div>`).join('')}
                    </div>
                </div>
                ${this.state.discoPhase === 'party' ? `
                    <div class="absolute top-48 left-1/2 w-full h-full -translate-x-1/2">
                        <div class="absolute top-0 left-1/2 w-24 h-[150vh] -ml-12 bg-gradient-to-b from-pink-500/80 to-transparent blur-2xl origin-top animate-ray-1 mix-blend-screen"></div>
                        <div class="absolute top-0 left-1/2 w-24 h-[150vh] -ml-12 bg-gradient-to-b from-blue-500/80 to-transparent blur-2xl origin-top animate-ray-2 mix-blend-screen"></div>
                        <div class="absolute top-0 left-1/2 w-24 h-[150vh] -ml-12 bg-gradient-to-b from-green-500/80 to-transparent blur-2xl origin-top animate-ray-3 mix-blend-screen"></div>
                        <div class="absolute top-0 left-1/2 w-24 h-[150vh] -ml-12 bg-gradient-to-b from-yellow-500/80 to-transparent blur-2xl origin-top animate-ray-4 mix-blend-screen"></div>
                        <div class="absolute top-0 left-1/2 w-24 h-[150vh] -ml-12 bg-gradient-to-b from-purple-500/80 to-transparent blur-2xl origin-top animate-ray-5 mix-blend-screen"></div>
                    </div>
                ` : ''}
            </div>
        `;
    },

    getHeroHTML() {
        return `
            <section id="hero" class="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
                <!-- Animated background orbs -->
                <div class="absolute inset-0 pointer-events-none overflow-hidden">
                    <div class="absolute top-1/4 -right-32 w-[500px] h-[500px] bg-brand-500/20 rounded-full blur-[100px] animate-pulse"></div>
                    <div class="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-brand-600/15 rounded-full blur-[80px]"></div>
                    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-[120px]"></div>
                    <!-- Grid pattern -->
                    <div class="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
                </div>

                <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <!-- Left side — Text -->
                        <div class="text-center lg:text-left">
                            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-tight leading-[1.1] mb-6">
                                ${this.t('hero.title1')}
                                <br />
                                <span class="bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">${this.t('hero.title2')}</span>
                            </h1>
                            <p class="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">${this.t('hero.description')}</p>
                            <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <button onclick="App.navigate('home', 'hub')" class="group w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40">
                                    ${this.t('hero.explore')}
                                    <span class="group-hover:translate-x-1 transition-transform duration-200">${UI.icons.ArrowRight}</span>
                                </button>
                                <button onclick="App.navigate('contact')" class="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-slate-700 hover:border-brand-500/50 hover:bg-slate-800/50 text-white font-medium transition-all duration-200">
                                    ${this.t('hero.contact')}
                                </button>
                            </div>
                        </div>

                        <!-- Right side — Stats Cards -->
                        <div class="grid grid-cols-2 gap-4">
                            <!-- Main stat card -->
                            <div class="col-span-2 p-6 rounded-2xl bg-gradient-to-br from-surface-900/80 to-surface-900/40 border border-slate-800/50 hover:border-brand-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/5 group">
                                <div class="flex items-center gap-4">
                                    <div class="p-4 rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-600/10 group-hover:scale-110 transition-transform duration-300">
                                        ${UI.icons.Users.replace('text-slate-400', 'text-brand-400')}
                                    </div>
                                    <div>
                                        <div class="text-4xl font-bold text-white mb-1">${this.state.stats.users}+</div>
                                        <div class="text-sm text-slate-500">${this.t('hero.stats.users')}</div>
                                    </div>
                                </div>
                            </div>
                            <!-- Games stat -->
                            <div class="p-6 rounded-2xl bg-surface-900/50 border border-slate-800/50 hover:border-sky-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/5 group">
                                <div class="p-3 rounded-xl bg-sky-500/10 mb-4 w-fit group-hover:scale-110 transition-transform duration-300">
                                    ${UI.icons.Gamepad2 || '<svg class="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4z"/></svg>'}
                                </div>
                                <div class="text-3xl font-bold text-white mb-1">${this.state.stats.games}+</div>
                                <div class="text-sm text-slate-500">${this.t('hero.stats.games')}</div>
                            </div>
                            <!-- Tools stat -->
                            <div class="p-6 rounded-2xl bg-surface-900/50 border border-slate-800/50 hover:border-amber-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/5 group">
                                <div class="p-3 rounded-xl bg-amber-500/10 mb-4 w-fit group-hover:scale-110 transition-transform duration-300">
                                    ${UI.icons.Wrench.replace('text-slate-400', 'text-amber-400')}
                                </div>
                                <div class="text-3xl font-bold text-white mb-1">${this.state.stats.tools}+</div>
                                <div class="text-sm text-slate-500">${this.t('hero.stats.tools')}</div>
                            </div>
                            <!-- Lessons stat -->
                            <div class="col-span-2 p-6 rounded-2xl bg-surface-900/50 border border-slate-800/50 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5 group">
                                <div class="flex items-center gap-4">
                                    <div class="p-3 rounded-xl bg-purple-500/10 group-hover:scale-110 transition-transform duration-300">
                                        <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                                    </div>
                                    <div>
                                        <div class="text-3xl font-bold text-white mb-1">${this.state.stats.lessons}+</div>
                                        <div class="text-sm text-slate-500">${this.t('hero.stats.lessons')}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    },

    getHubHTML() {
        return `
            <section id="hub" class="py-24 relative z-10 scroll-mt-20">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="mb-12">
                        <h2 class="text-3xl font-semibold text-white mb-3">${this.t('hub.title')}</h2>
                        <p class="text-slate-400 max-w-2xl">${this.t('hub.subtitle')}</p>
                    </div>

                    <!-- Bento Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        ${this.projects.map((project, index) => {
                            const isPreparing = project.status === 'preparing';
                            const isFeatured = project.featured;

                            const statusConfigs = {
                                'live': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400', key: 'live' },
                                'early-access': { bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-400', key: 'earlyAccess' },
                                'opening': { bg: 'bg-sky-500/10', text: 'text-sky-400', dot: 'bg-sky-400', key: 'opening' },
                                'preparing': { bg: 'bg-slate-500/10', text: 'text-slate-500', dot: 'bg-slate-500', key: 'preparing' },
                            };
                            const status = statusConfigs[project.status] || statusConfigs['preparing'];

                            return `
                                <div class="${isFeatured ? 'md:col-span-2 lg:col-span-2' : ''} ${isPreparing ? 'opacity-60' : ''} group relative">
                                    ${isPreparing ? `<div class="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
                                        <div class="px-4 py-2 rounded-lg bg-slate-800 text-sm font-medium text-slate-400">${this.t('hub.preparing')}</div>
                                    </div>` : ''}
                                    <a ${!isPreparing ? `href="${project.href}"` : ''} ${!isPreparing ? 'target="_blank" rel="noopener noreferrer"' : ''} class="block p-6 rounded-xl bg-surface-900/50 border border-slate-800 hover:border-slate-700 transition-all duration-150 h-full ${isPreparing ? 'cursor-not-allowed' : 'hover-lift'}">
                                        <div class="flex items-start justify-between mb-4">
                                            <div class="p-2.5 rounded-lg bg-slate-800">
                                                ${UI.icons[project.icon]}
                                            </div>
                                            ${!isPreparing ? `<span class="text-slate-600 group-hover:text-slate-400 transition-colors duration-150">${UI.icons.ExternalLink}</span>` : `<span class="text-slate-600">${UI.icons.Lock}</span>`}
                                        </div>
                                        <h3 class="text-xl font-semibold text-white mb-2 group-hover:text-brand-400 transition-colors duration-150">${this.t(project.title)}</h3>
                                        <p class="text-slate-500 text-sm leading-relaxed mb-4 ${isFeatured ? 'line-clamp-2' : ''}">${this.t(project.description)}</p>
                                        <div class="flex items-center gap-2">
                                            <span class="w-2 h-2 rounded-full ${status.dot} ${project.status === 'live' ? 'animate-pulse' : ''}"></span>
                                            <span class="text-xs font-medium ${status.text}">${this.t('hub.status.' + status.key)}</span>
                                        </div>
                                    </a>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </section>
        `;
    },

    getPremiumHTML() {
        const user = Auth.user;
        const userTier = user?.tier || 'free';
        const premiumTranslations = this.t('premium');
        const tiers = premiumTranslations?.tiers || {};

        return `
            <section id="premium" class="py-24 relative z-10 scroll-mt-20">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="mb-12 text-center">
                        <h2 class="text-3xl font-semibold text-white mb-3 font-sora">${premiumTranslations.title}</h2>
                        <p class="text-slate-400 max-w-2xl mx-auto">${premiumTranslations.subtitle}</p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
                        ${this.premiumTiers.map(tier => {
                            const isCurrentUserTier = userTier === tier.id;
                            const tierData = tiers[tier.id] || { name: tier.id, benefits: [], badge: '' };
                            const isPopular = tier.isPopular;

                            let badgeHtml = '';
                            if (isCurrentUserTier) {
                                badgeHtml = `<div class="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                                    <span class="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30 whitespace-nowrap">
                                        ${premiumTranslations.yourPlan}
                                    </span>
                                </div>`;
                            } else if (tierData.badge) {
                                badgeHtml = `<div class="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                                    <span class="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-semibold border border-purple-500/30 whitespace-nowrap">
                                        ${tierData.badge}
                                    </span>
                                </div>`;
                            } else if (isPopular) {
                                badgeHtml = `<div class="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                                    <span class="px-3 py-1 rounded-full bg-brand-500/20 text-brand-400 text-xs font-semibold border border-brand-500/30 whitespace-nowrap">
                                        ${premiumTranslations.popular}
                                    </span>
                                </div>`;
                            }

                            return `
                                <div class="relative ${isPopular || tierData.badge ? 'lg:-mt-2 lg:mb-2' : ''}">
                                    ${badgeHtml}
                                    <div class="h-full p-6 rounded-2xl bg-surface-900/50 border ${isCurrentUserTier ? 'border-emerald-500/50' : isPopular ? 'border-brand-500/50' : tier.color === 'platinum' ? 'border-purple-500/30' : 'border-slate-800'} hover:border-slate-700 transition-all duration-200 ${isPopular ? 'bg-gradient-to-b from-surface-900/80 to-surface-900/50' : ''}">
                                        <!-- Coin Image -->
                                        <div class="flex justify-center mb-4">
                                            <img src="${tier.image}" alt="${tierData.name}" class="h-20 object-contain" onerror="this.style.display='none'" />
                                        </div>

                                        <!-- Profile Frame Preview -->
                                        <div class="flex flex-col items-center mb-4">
                                            <div class="relative w-14 h-14">
                                                <img src="https://ui-avatars.com/api/?name=V&background=334155&color=f1f5f9&size=40" alt="Avatar" class="w-10 h-10 rounded-full object-cover absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                                <img src="${tier.frame}" alt="${tierData.name} frame" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 object-contain pointer-events-none" onerror="this.style.display='none'" />
                                            </div>
                                            <span class="text-xs text-slate-500 mt-2">${premiumTranslations.profileFrame}</span>
                                        </div>

                                        <!-- Tier Name -->
                                        <h3 class="text-xl font-semibold text-white text-center mb-2 font-sora">${tierData.name}</h3>

                                        <!-- Price -->
                                        <div class="text-center mb-6">
                                            <div class="text-2xl font-bold text-white">
                                                ${tier.priceMonthly} Kč<span class="text-sm font-normal text-slate-400">${premiumTranslations.perMonth}</span>
                                            </div>
                                            <div class="text-sm text-slate-500">
                                                ${tier.priceYearly} Kč${premiumTranslations.perYear}
                                            </div>
                                        </div>

                                        <!-- Benefits -->
                                        <ul class="space-y-3 mb-6">
                                            ${tierData.benefits.map(benefit => `
                                                <li class="flex items-start gap-2 text-sm text-slate-300">
                                                    <svg class="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                        <path d="M20 6 9 17l-5-5"/>
                                                    </svg>
                                                    <span>${benefit}</span>
                                                </li>
                                            `).join('')}
                                        </ul>

                                        <!-- CTA Button -->
                                        <button onclick="App.selectPremiumTier('${tier.id}')" class="block w-full py-3 rounded-xl text-center font-medium transition-all duration-200 ${isCurrentUserTier ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 cursor-default' : 'bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30'}">
                                            ${isCurrentUserTier ? premiumTranslations.yourPlan : `${premiumTranslations.select} ${tierData.name}`}
                                        </button>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </section>
        `;
    },

    openLogin() {
        this.showLoginModal();
    },

    closeLoginModal() {
        const modal = document.getElementById('vevit-login-modal');
        if (modal) modal.remove();
        this.state.isLoginModalOpen = false;
    },

    showLoginModal() {
        this.state.isLoginModalOpen = true;
        const existing = document.getElementById('vevit-login-modal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'vevit-login-modal';
        modal.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" onclick="App.closeLoginModal()"></div>
            <div class="relative w-full max-w-md bg-surface-900 border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/50 animate-slide-up overflow-hidden">
                <div class="px-6 pt-6 pb-4">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-xl font-semibold text-white">Přihlásit se</h2>
                        <button onclick="App.closeLoginModal()" class="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                    </div>
                    <form id="vevit-login-form" onsubmit="App.handleLogin(event)" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-1.5">Přezdívka</label>
                            <input type="text" id="vevit-login-username" required autocomplete="username"
                                class="w-full px-4 py-3 bg-surface-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                                placeholder="Zadejte přezdívku" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-1.5">Heslo</label>
                            <div class="relative">
                                <input type="password" id="vevit-login-password" required autocomplete="current-password"
                                    class="w-full px-4 py-3 bg-surface-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all pr-10"
                                    placeholder="Zadejte heslo" />
                                <button type="button" onclick="App.togglePasswordVisibility()" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                                    <svg id="vevit-eye-icon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                </button>
                            </div>
                        </div>
                        <div id="vevit-login-error" class="hidden text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5"></div>
                        <button type="submit" id="vevit-login-submit"
                            class="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-semibold shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                            Přihlásit se
                        </button>
                    </form>
                </div>
                <div class="px-6 py-4 bg-surface-950/50 border-t border-slate-700/50">
                    <p class="text-sm text-slate-400 text-center">
                        Nemáte účet?
                        <a href="https://account.vevit.fun/register" class="text-brand-400 hover:text-brand-300 font-medium transition-colors">Zaregistrovat se</a>
                    </p>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('vevit-login-username').focus();
    },

    togglePasswordVisibility() {
        const input = document.getElementById('vevit-login-password');
        if (input) {
            input.type = input.type === 'password' ? 'text' : 'password';
        }
    },

    handleLogin(event) {
        event.preventDefault();
        const username = document.getElementById('vevit-login-username').value.trim();
        const password = document.getElementById('vevit-login-password').value;
        const errorEl = document.getElementById('vevit-login-error');
        const submitBtn = document.getElementById('vevit-login-submit');

        if (!username || !password) {
            if (errorEl) { errorEl.textContent = 'Zadejte přezdívku a heslo.'; errorEl.classList.remove('hidden'); }
            return;
        }

        if (errorEl) errorEl.classList.add('hidden');
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Přihlašování...'; }

        Auth.login(username, password)
            .then(() => {
                this.closeLoginModal();
            })
            .catch(err => {
                if (errorEl) { errorEl.textContent = err.message || 'Přihlášení se nezdařilo.'; errorEl.classList.remove('hidden'); }
                if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Přihlásit se'; }
            });
    },

    logout() {
        Auth.logout();
    },

    selectPremiumTier(tierId) {
        if (Auth.user) {
            window.location.href = `https://account.vevit.fun/premium/${tierId}`;
        } else {
            App.openLogin();
        }
    },

    getAboutHTML() {
        return `
            <section id="about" class="py-24 bg-surface-950/50 scroll-mt-20">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="grid lg:grid-cols-5 gap-12 lg:gap-16">
                        <!-- Levá strana — Headline -->
                        <div class="lg:col-span-2">
                            <h2 class="text-3xl lg:text-4xl font-semibold text-white mb-4 leading-tight">
                                ${this.t('about.title1')}
                                <br />
                                <span class="text-brand-400">${this.t('about.title2')}</span>
                            </h2>
                            <p class="text-slate-400 text-lg leading-relaxed mb-6">${this.t('about.p1')}</p>
                            <p class="text-slate-500 leading-relaxed">${this.t('about.p2')}</p>
                            <p class="text-slate-500 leading-relaxed mt-6">${this.t('about.p3')}</p>
                        </div>

                        <!-- Pravá strana — Features -->
                        <div class="lg:col-span-3 space-y-4">
                            ${this.features.map(feature => `
                                <div class="flex gap-4 p-5 rounded-xl bg-surface-900/50 border border-slate-800 hover:border-slate-700 transition-colors duration-150 hover-lift">
                                    <div class="flex-shrink-0">
                                        <div class="p-2.5 rounded-lg bg-brand-500/10">
                                            ${UI.icons[feature.icon]}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 class="text-lg font-semibold text-white mb-1">${this.t(feature.title)}</h4>
                                        <p class="text-slate-400 text-sm leading-relaxed">${this.t(feature.description)}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </section>
        `;
    },

    getContactHTML() {
        return `
            <div class="pt-24 pb-16 min-h-screen">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="mb-12">
                        <h1 class="text-3xl lg:text-4xl font-semibold text-white mb-3">${this.t('contact.title')}</h1>
                        <p class="text-slate-400 max-w-2xl">${this.t('contact.subtitle')}</p>
                    </div>

                    <div class="grid lg:grid-cols-5 gap-8">
                        <!-- Levá strana — Contact Info -->
                        <div class="lg:col-span-2 space-y-6">
                            <div class="p-6 rounded-xl bg-surface-900/50 border border-slate-800">
                                <h3 class="text-lg font-semibold text-white mb-4">${this.t('contact.connectTitle')}</h3>

                                <div class="space-y-4">
                                    <div class="flex items-start gap-3">
                                        <div class="p-2 rounded-lg bg-slate-800">${UI.icons.Mail}</div>
                                        <div>
                                            <div class="text-sm font-medium text-white mb-0.5">Email</div>
                                            <button onclick="App.copyEmail()" class="group flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm">
                                                <span class="font-mono">info@vevit.fun</span>
                                                <span id="copy-icon" class="opacity-50 group-hover:opacity-100">${UI.icons.Copy}</span>
                                            </button>
                                            <span id="copy-success" class="text-xs text-emerald-400 hidden mt-1">${this.t('card.copied')}!</span>
                                        </div>
                                    </div>

                                    <div class="flex items-start gap-3">
                                        <div class="p-2 rounded-lg bg-slate-800">${UI.icons.MessageSquare}</div>
                                        <div>
                                            <div class="text-sm font-medium text-white mb-1">${this.t('contact.socialsTitle')}</div>
                                            <div class="flex flex-col gap-1.5">
                                                <a href="https://discord.gg/3X7H4xd8" class="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
                                                    ${UI.icons.Discord} Discord
                                                </a>
                                                <a href="https://twitter.com/VeVitOfficial" class="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
                                                    ${UI.icons.Twitter} Twitter
                                                </a>
                                                <a href="https://instagram.com/vevit.fun" class="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
                                                    ${UI.icons.Instagram} Instagram
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Social ikony -->
                            <div class="flex gap-2">
                                ${this.socials.filter(s => s.platform !== 'Email').map(s => `
                                    <a href="${s.href}" target="_blank" rel="noopener noreferrer" class="p-2.5 rounded-lg bg-surface-900/50 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all duration-150">
                                        ${UI.icons[s.icon]}
                                    </a>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Pravá strana — Form -->
                        <div class="lg:col-span-3">
                            <div class="p-6 rounded-xl bg-surface-900/50 border border-slate-800">
                                <h3 class="text-lg font-semibold text-white mb-6">${this.t('contact.formTitle')}</h3>
                                <form action="https://formsubmit.co/info@vevit.fun" method="POST" target="_blank" onsubmit="App.handleFormSubmit(event)" class="space-y-5">
                                    <input type="hidden" name="_captcha" value="false" />
                                    <input type="hidden" name="_template" value="table" />
                                    <input type="hidden" name="_subject" id="form-subject-hidden" value="VeVit Web: Obecný dotaz" />

                                    <div class="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-sm font-medium text-slate-300 mb-2">${this.t('contact.form.name')}</label>
                                            <input type="text" name="name" id="name" class="w-full px-4 py-2.5 rounded-lg bg-surface-950 border border-slate-800 text-white placeholder-slate-600 focus:border-brand-500 focus:outline-none transition-colors duration-150" required />
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-slate-300 mb-2">${this.t('contact.form.email')}</label>
                                            <input type="email" name="email" id="email" class="w-full px-4 py-2.5 rounded-lg bg-surface-950 border border-slate-800 text-white placeholder-slate-600 focus:border-brand-500 focus:outline-none transition-colors duration-150" required />
                                        </div>
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-slate-300 mb-2">${this.t('contact.form.subject')}</label>
                                        <select name="subject" id="subject" onchange="document.getElementById('form-subject-hidden').value = 'VeVit Web: ' + this.value" class="w-full px-4 py-2.5 rounded-lg bg-surface-950 border border-slate-800 text-white focus:border-brand-500 focus:outline-none transition-colors duration-150">
                                            <option value="Obecný dotaz">${this.t('contact.form.subjects.general')}</option>
                                            <option value="Spolupráce">${this.t('contact.form.subjects.collab')}</option>
                                            <option value="Podpora">${this.t('contact.form.subjects.support')}</option>
                                            <option value="Hlášení chyby">${this.t('contact.form.subjects.bug')}</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-slate-300 mb-2">${this.t('contact.form.message')}</label>
                                        <textarea name="message" id="message" rows="4" class="w-full px-4 py-2.5 rounded-lg bg-surface-950 border border-slate-800 text-white placeholder-slate-600 focus:border-brand-500 focus:outline-none transition-colors duration-150 resize-none" required></textarea>
                                    </div>

                                    <button type="submit" id="submit-btn" class="w-full px-6 py-3 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium transition-colors duration-150 flex items-center justify-center gap-2">
                                        <span id="submit-icon">${UI.icons.Send}</span>
                                        <span id="submit-text">${this.t('contact.form.send')}</span>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    getCardHTML() {
        return `
            <div class="min-h-screen pt-20 pb-12 flex items-center justify-center">
                <div class="w-full max-w-md px-4">
                    <div class="bg-surface-900/80 backdrop-blur-xl rounded-2xl p-8 md:p-10 border border-slate-800">
                        <!-- Logo & Header -->
                        <div class="flex flex-col items-center text-center mb-8">
                            <div class="w-32 h-32 mb-6 relative">
                                <img src="./images/logo-light.png" alt="VeVit" class="relative w-full h-full object-contain dark:hidden" />
                                <img src="./images/logo-dark.png" alt="VeVit" class="relative w-full h-full object-contain hidden dark:block" />
                            </div>
                            <h1 class="text-2xl font-semibold text-white mb-1">VeVit</h1>
                            <p class="text-brand-400 text-sm font-medium">${this.t('card.role')}</p>
                        </div>

                        <!-- Contact -->
                        <div class="space-y-3 mb-8">
                            <a href="mailto:info@vevit.fun" class="flex items-center gap-3 p-4 rounded-xl bg-surface-950 border border-slate-800 hover:border-slate-700 transition-colors duration-150 group">
                                <div class="p-2 rounded-lg bg-slate-800 group-hover:bg-brand-500/10 transition-colors">
                                    ${UI.icons.Mail}
                                </div>
                                <div>
                                    <div class="text-xs text-slate-500 uppercase font-medium">Email</div>
                                    <div class="text-white font-medium text-sm">info@vevit.fun</div>
                                </div>
                            </a>

                            <div class="grid grid-cols-3 gap-2">
                                <a href="https://discord.gg/3X7H4xd8" class="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-surface-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors duration-150">
                                    ${UI.icons.Discord}
                                    <span class="text-xs">Discord</span>
                                </a>
                                <a href="https://instagram.com/vevit.fun" class="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-surface-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors duration-150">
                                    ${UI.icons.Instagram}
                                    <span class="text-xs">Instagram</span>
                                </a>
                                <a href="https://twitter.com/VeVitOfficial" class="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-surface-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors duration-150">
                                    ${UI.icons.Twitter}
                                    <span class="text-xs">Twitter</span>
                                </a>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="grid grid-cols-2 gap-3">
                            <button onclick="App.downloadVCard()" class="flex items-center justify-center gap-2 p-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium transition-colors duration-150">
                                ${UI.icons.Download}
                                <span class="text-sm">${this.t('card.save')}</span>
                            </button>
                            <button onclick="App.shareCard()" class="flex items-center justify-center gap-2 p-3 rounded-xl bg-surface-950 border border-slate-800 hover:border-slate-700 text-white font-medium transition-colors duration-150">
                                <span id="share-icon">${UI.icons.Share2}</span>
                                <span id="share-text" class="text-sm">${this.t('card.share')}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    getAppsHTML() {
        return `
            <div class="min-h-screen pt-24 pb-16 flex items-center justify-center">
                <div class="text-center px-4">
                    <h1 class="text-6xl font-semibold text-white mb-4">404</h1>
                    <h2 class="text-2xl font-semibold text-white mb-4">${this.t('apps.title')}</h2>
                    <p class="text-slate-400 mb-8 max-w-md mx-auto">${this.t('apps.subtitle')}</p>
                    <button onclick="App.navigate('home')" class="px-6 py-3 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium transition-colors duration-150 flex items-center gap-2 mx-auto">
                        ${UI.icons.ArrowLeft}
                        ${this.t('apps.back')}
                    </button>
                </div>
            </div>
        `;
    },

    getFooterHTML() {
        return `
            <footer class="bg-surface-950 border-t border-slate-800 pt-16 pb-8">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                        <div class="col-span-2 md:col-span-1">
                            <div class="flex items-center gap-2 mb-4 cursor-pointer" onclick="App.navigate('home', 'hero')">
                                <div class="w-6 h-6 relative">
                                    <img src="./images/logo-light.png" alt="VeVit" class="absolute inset-0 w-full h-full object-contain dark:hidden" />
                                    <img src="./images/logo-dark.png" alt="VeVit" class="absolute inset-0 w-full h-full object-contain hidden dark:block" />
                                </div>
                                <span class="text-lg font-semibold text-white">VeVit</span>
                            </div>
                            <p class="text-slate-500 text-sm leading-relaxed">${this.t('footer.desc')}</p>
                            <div class="flex gap-2 mt-4">
                                ${this.socials.map(s => `<a href="${s.href}" target="_blank" rel="noopener noreferrer" class="p-2 rounded-lg bg-surface-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all duration-150">${UI.icons[s.icon]}</a>`).join('')}
                            </div>
                        </div>
                        <div>
                            <h4 class="text-sm font-semibold text-white mb-4">${this.t('footer.projects')}</h4>
                            <ul class="space-y-2">
                                <li><a href="https://tools.vevit.fun" target="_blank" rel="noopener noreferrer" class="text-sm text-slate-500 hover:text-white transition-colors">Tools</a></li>
                                <li><a href="https://games.vevit.fun" target="_blank" rel="noopener noreferrer" class="text-sm text-slate-500 hover:text-white transition-colors">Games</a></li>
                                <li><a href="https://edu.vevit.fun" target="_blank" rel="noopener noreferrer" class="text-sm text-slate-500 hover:text-white transition-colors">Edu</a></li>
                                <li><a href="https://services.vevit.fun" target="_blank" rel="noopener noreferrer" class="text-sm text-slate-500 hover:text-white transition-colors">Services</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="text-sm font-semibold text-white mb-4">${this.t('footer.company')}</h4>
                            <ul class="space-y-2">
                                <li><button onclick="App.navigate('home', 'about')" class="text-sm text-slate-500 hover:text-white transition-colors">${this.t('nav.about')}</button></li>
                                <li><button onclick="App.navigate('contact')" class="text-sm text-slate-500 hover:text-white transition-colors">${this.t('nav.contact')}</button></li>
                                <li><button onclick="App.navigate('card')" class="text-sm text-slate-500 hover:text-white transition-colors">${this.t('nav.card')}</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="text-sm font-semibold text-white mb-4">Support</h4>
                            <a href="https://ko-fi.com/F1F41UHFTK" target="_blank" rel="noopener noreferrer" class="inline-block hover:opacity-80 transition-opacity duration-200">
                                <img src="./images/support_me_on_kofi_badge_dark.webp" alt="Support me on Ko-fi" class="h-20 object-contain" />
                            </a>
                        </div>
                    </div>

                    <div class="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p class="text-slate-500 text-sm">&copy; ${new Date().getFullYear()} VeVit. ${this.t('footer.rights')}</p>
                        <p class="text-slate-600 text-sm flex items-center gap-1">
                            ${this.t('footer.madeWith')} <span class="text-red-400">${UI.icons.Heart}</span> ${this.t('footer.inCz')}
                        </p>
                    </div>
                </div>
            </footer>
        `;
    },

    // --- ACTIONS ---

    toggleLangMenu() {
        this.state.isLangMenuOpen = !this.state.isLangMenuOpen;
        this.renderNavbar();
    },

    toggleAppsDropdown(e) {
        e.stopPropagation();
        this.state.isAppsDropdownOpen = !this.state.isAppsDropdownOpen;
        this.renderNavbar();
    },

    toggleUserDropdown() {
        this.state.isUserDropdownOpen = !this.state.isUserDropdownOpen;
        this.renderNavbar();
    },

    toggleMobileAppsDropdown() {
        this.state.isAppsDropdownOpen = !this.state.isAppsDropdownOpen;
        this.renderNavbar();
    },

    toggleMobileMenu() {
        this.state.isMobileMenuOpen = !this.state.isMobileMenuOpen;
        this.renderNavbar();
    },

    nextLanguage() {
        const idx = this.languages.findIndex(l => l.code === this.state.language);
        this.setLanguage(this.languages[(idx + 1) % this.languages.length].code);
    },

    async copyEmail() {
        try {
            await navigator.clipboard.writeText('info@vevit.fun');
            const icon = document.getElementById('copy-icon');
            const success = document.getElementById('copy-success');
            if (icon) icon.innerHTML = UI.icons.Check;
            if (success) {
                success.classList.remove('hidden');
                success.classList.add('block');
            }

            setTimeout(() => {
                const i = document.getElementById('copy-icon');
                const s = document.getElementById('copy-success');
                if (i) i.innerHTML = UI.icons.Copy;
                if (s) {
                    s.classList.add('hidden');
                    s.classList.remove('block');
                }
            }, 2000);
        } catch(e) {}
    },

    handleFormSubmit(e) {
        const btn = document.getElementById('submit-btn');
        const icon = document.getElementById('submit-icon');
        const text = document.getElementById('submit-text');

        btn.disabled = true;
        btn.className = "w-full px-6 py-3 rounded-lg bg-brand-600 text-white font-medium flex items-center justify-center gap-2 opacity-70 cursor-not-allowed";
        icon.innerHTML = UI.icons.Loader2;
        text.innerText = this.t('contact.form.sending');

        setTimeout(() => {
            btn.className = "w-full px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors duration-150 flex items-center justify-center gap-2";
            icon.innerHTML = UI.icons.CheckCircle;
            text.innerText = this.t('contact.form.success');

            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('message').value = '';

            setTimeout(() => {
                btn.disabled = false;
                btn.className = "w-full px-6 py-3 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium transition-colors duration-150 flex items-center justify-center gap-2";
                icon.innerHTML = UI.icons.Send;
                text.innerText = this.t('contact.form.send');
            }, 5000);
        }, 2000);
    },

    downloadVCard() {
        const vCardData = `BEGIN:VCARD\nVERSION:3.0\nFN:VeVit\nEMAIL:info@vevit.fun\nURL:https://vevit.fun\nEND:VCARD`;
        const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'vevit.vcf';
        link.click();
    },

    saveContact() {
        this.downloadVCard();
    },

    async shareCard() {
        const data = { title: 'VeVit', text: this.t('card.desc'), url: window.location.origin };
        if(navigator.share) {
            await navigator.share(data);
        } else {
            await navigator.clipboard.writeText(data.url);
            const icon = document.getElementById('share-icon');
            const text = document.getElementById('share-text');
            if (icon) icon.innerHTML = UI.icons.Check;
            if (text) text.innerText = this.t('card.copied');

            setTimeout(() => {
                const i = document.getElementById('share-icon');
                const t = document.getElementById('share-text');
                if (i) i.innerHTML = UI.icons.Share2;
                if (t) t.innerText = this.t('card.share');
            }, 2000);
        }
    },

    attachEventListeners() {
        // Event listeners se připojí po renderu
    }
};

window.App = App;

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});