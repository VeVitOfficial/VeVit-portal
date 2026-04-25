// auth.js - Local login + optional VeVit SSO integration

const Auth = {
    user: null,

    init() {
        // Try SSO first, then local cookie, then fetch from API
        this.user = this._getSSOUser() || this._getLocalUser();
        if (!this.user) {
            this._fetchUserFromAPI();
        }
        if (!this.user && typeof VeVit === 'undefined') {
            this._waitForSSO();
        }
        return this.user;
    },

    _waitForSSO() {
        let attempts = 0;
        const poll = setInterval(() => {
            attempts++;
            const user = this._getSSOUser();
            if (user || attempts > 20) {
                clearInterval(poll);
                if (user && user !== this.user) {
                    this.user = user;
                    if (typeof App !== 'undefined' && App.render) {
                        App.render();
                    }
                }
            }
        }, 250);
    },

    _getSSOUser() {
        if (typeof VeVit !== 'undefined' && typeof VeVit.getUser === 'function') {
            return VeVit.getUser();
        }
        return null;
    },

    _getLocalUser() {
        try {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; vevit_auth=`);
            if (parts.length === 2) {
                const cookieValue = parts.pop().split(';').shift();
                if (cookieValue) {
                    // Signed cookie format: base64.signature
                    const dotIndex = cookieValue.lastIndexOf('.');
                    if (dotIndex > 0) {
                        // Signed cookie - verify via API
                        return null; // will be verified by _fetchUserFromAPI
                    }
                    // Legacy unsigned cookie (SSO fallback)
                    return JSON.parse(decodeURIComponent(cookieValue));
                }
            }
        } catch (e) {
            console.error('Error parsing vevit_auth cookie:', e);
        }
        return null;
    },

    _fetchUserFromAPI() {
        fetch('/api/user.php', { credentials: 'include' })
            .then(r => r.json())
            .then(data => {
                if (data.success && data.user) {
                    this.user = data.user;
                    if (typeof App !== 'undefined' && App.render) {
                        App.render();
                    }
                }
            })
            .catch(() => { /* not authenticated — silently ignore */ });
    },

    login(username, password) {
        return fetch('/api/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, password })
        })
        .then(r => r.json())
        .then(data => {
            if (data.success && data.user) {
                this.user = data.user;
                if (typeof App !== 'undefined' && App.render) {
                    App.render();
                }
                return data;
            }
            throw new Error(data.message || 'Přihlášení se nezdařilo.');
        });
    },

    logout() {
        if (typeof VeVit !== 'undefined' && typeof VeVit.logout === 'function') {
            VeVit.logout();
        }
        document.cookie = 'vevit_auth=; path=/; domain=.vevit.fun; max-age=0';
        document.cookie = 'vevit_auth=; path=/; max-age=0';
        this.user = null;
        if (typeof App !== 'undefined' && App.render) {
            App.render();
        }
    },

    getAvatarUrl() {
        if (!this.user) return null;
        const url = this.user.avatar_url || this.user.avatarUrl;
        if (url && url.trim() !== '') return url;
        const name = this.user.full_name || this.user.fullName || this.user.nickname || 'User';
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0f0f13&color=10b981&bold=true`;
    },

    getFallbackAvatarUrl() {
        if (!this.user) return null;
        const name = this.user.full_name || this.user.fullName || this.user.nickname || 'User';
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0f0f13&color=10b981&bold=true`;
    }
};

window.Auth = Auth;