class ConsentManager {
    constructor() {
        this.consentGiven = this.getConsent();
        this.init();
    }

    init() {
        const banner = document.getElementById('consent-banner');
        const acceptBtn = document.getElementById('accept-cookies');
        const declineBtn = document.getElementById('decline-cookies');

        if (!this.consentGiven) {
            banner.style.display = 'block';
        }

        acceptBtn.addEventListener('click', () => {
            this.setConsent(true);
            banner.style.display = 'none';
        });

        declineBtn.addEventListener('click', () => {
            this.setConsent(false);
            banner.style.display = 'none';
        });
    }

    getConsent() {
        const consent = localStorage.getItem('cookieConsent');
        return consent === 'true';
    }

    setConsent(given) {
        this.consentGiven = given;
        localStorage.setItem('cookieConsent', given.toString());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ConsentManager();
});