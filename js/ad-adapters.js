/**
 * Ad adapters
 * Provides rendering support for different ad networks
 */

(function() {
    'use strict';
    
    // Base ad adapter class
    class AdAdapter {
        constructor(name) {
            this.name = name;
        }
        
        render(container, config, adSlotId) {
            throw new Error('Must implement render method');
        }
        
        loadScript() {
            return Promise.resolve();
        }
    }
    
    // AdSense adapter
    class AdsenseAdapter extends AdAdapter {
        constructor() {
            super('adsense');
            this.scriptLoaded = false;
        }
        
        render(container, config, adSlotId) {
            
            const contentEl = container.querySelector('[data-ad-network="adsense"]');
            if (!contentEl) return;
            
            if (config?.demoContent?.enabled) {
                contentEl.innerHTML = this.createDemoAd('AdSense', adSlotId);
                container.setAttribute('data-ad-status', 'loaded');
                return;
            }
            
            const slotId = config?.credentials?.adsense?.adSlots?.[adSlotId] || '1234567890';
            contentEl.innerHTML = `
                <ins class="adsbygoogle"
                     style="display:block"
                     data-ad-client="${config?.credentials?.adsense?.clientId || 'ca-pub-XXXXXXXXXXXXXXXX'}"
                     data-ad-slot="${slotId}"
                     data-ad-format="auto"
                     data-full-width-responsive="true"></ins>
            `;
            
            this.loadScript(config).then(() => {
                try {
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                    container.setAttribute('data-ad-status', 'loaded');
                } catch (e) {
                    console.error('[AdSense] Error:', e);
                    container.setAttribute('data-ad-status', 'failed');
                }
            });
        }
        
        loadScript(config) {
            if (this.scriptLoaded) return Promise.resolve();
            
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
                script.async = true;
                script.crossOrigin = 'anonymous';
                script.onload = () => {
                    this.scriptLoaded = true;
                    resolve();
                };
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }
        
        createDemoAd(label, adSlotId) {
            const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            return `
                <div style="background:${color};color:white;padding:2rem;text-align:center;border-radius:8px;min-height:90px;display:flex;flex-direction:column;justify-content:center;align-items:center;">
                    <strong>${label}</strong>
                    <span style="font-size:0.75rem;opacity:0.8;">${adSlotId || 'AD-XX'}</span>
                </div>
            `;
        }
    }
    
    // Adsterra adapter
    class AdsterraAdapter extends AdAdapter {
        constructor() {
            super('adsterra');
            this.scriptLoaded = false;
        }
        
        render(container, config, adSlotId) {
            
            const contentEl = container.querySelector('[data-ad-network="adsterra"]');
            if (!contentEl) return;
            
            if (config?.demoContent?.enabled) {
                contentEl.innerHTML = this.createDemoAd('Adsterra', adSlotId);
                container.setAttribute('data-ad-status', 'loaded');
                return;
            }
            
            // Use user-provided Adsterra code
            contentEl.innerHTML = `
                <div id="container-15424439857d228e149e188e5419ccd5"></div>
            `;
            
            this.loadScript().then(() => {
                container.setAttribute('data-ad-status', 'loaded');
            }).catch(() => {
                container.setAttribute('data-ad-status', 'failed');
            });
        }
        
        loadScript() {
            if (this.scriptLoaded) return Promise.resolve();
            
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://pl29608230.effectivecpmnetwork.com/15424439857d228e149e188e5419ccd5/invoke.js';
                script.async = true;
                script.setAttribute('data-cfasync', 'false');
                script.onload = () => {
                    this.scriptLoaded = true;
                    resolve();
                };
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }
        
        createDemoAd(label, adSlotId) {
            const colors = ['#ec4899', '#f97316', '#06b6d4', '#8b5cf6', '#10b981'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            return `
                <div style="background:${color};color:white;padding:2rem;text-align:center;border-radius:8px;min-height:90px;display:flex;flex-direction:column;justify-content:center;align-items:center;">
                    <strong>${label}</strong>
                    <span style="font-size:0.75rem;opacity:0.8;">${adSlotId || 'AD-XX'}</span>
                </div>
            `;
        }
    }
    
    // Google Ad Manager (GAM) adapter
    class GamAdapter extends AdAdapter {
        constructor() {
            super('gam');
            this.scriptLoaded = false;
        }
        
        render(container, config, adSlotId) {
            
            const contentEl = container.querySelector('[data-ad-network="gam"]');
            if (!contentEl) return;
            
            if (config?.demoContent?.enabled) {
                contentEl.innerHTML = this.createDemoAd('Google Ad Manager', adSlotId);
                container.setAttribute('data-ad-status', 'loaded');
                return;
            }
            
            contentEl.innerHTML = `
                <div style="min-height:90px;display:flex;align-items:center;justify-content:center;background:#f0f9ff;border:1px dashed #0284c7;border-radius:4px;">
                    GAM ${adSlotId}
                </div>
            `;
            container.setAttribute('data-ad-status', 'loaded');
        }
        
        createDemoAd(label, adSlotId) {
            const colors = ['#0ea5e9', '#06b6d4', '#14b8a6', '#0d9488', '#059669'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            return `
                <div style="background:${color};color:white;padding:2rem;text-align:center;border-radius:8px;min-height:90px;display:flex;flex-direction:column;justify-content:center;align-items:center;">
                    <strong>${label}</strong>
                    <span style="font-size:0.75rem;opacity:0.8;">${adSlotId || 'AD-XX'}</span>
                </div>
            `;
        }
    }
    
    // Register adapters
    const adapters = {
        adsense: new AdsenseAdapter(),
        adsterra: new AdsterraAdapter(),
        gam: new GamAdapter()
    };
    
    // Expose to global
    window.AdAdapters = adapters;
    
})();
