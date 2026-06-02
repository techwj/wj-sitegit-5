/**
 * 广告注入器核心
 * 生成时写入，后期不修改
 * 负责广告的分级加载、懒加载、动态插入广告检测
 */

class AdInjector {
    constructor() {
        this.config = window.AdConfig;
        this.initialized = false;
        this.currentPage = 'home';
        this.loadedSlots = new Set();
        this.init();
    }
    
    init() {
        if (!this.config?.enabled) {
            console.log('[AdInjector] Ad system disabled');
            return;
        }
        
        console.log('[AdInjector] Initializing...');
        
        // 默认隐藏所有广告位
        this.hideAllAdSlots();
        
        // 预连接广告域名
        this.preconnect();
        
        // 监听页面路由变化
        this.observeRouteChanges();
        
        // 初始加载
        this.loadAdsForCurrentPage();
        
        this.initialized = true;
        console.log('[AdInjector] Initialized');
    }
    
    hideAllAdSlots() {
        // 不隐藏广告位，让它们都显示出来
        const allContainers = document.querySelectorAll('[data-ad-container="true"]');
        allContainers.forEach(container => {
            container.style.display = '';
        });
    }
    
    shouldShowAdForPlatform(network) {
        const activePlatform = this.config?.activePlatform;
        // 如果 activePlatform 为 null，不显示任何广告
        if (!activePlatform) {
            return false;
        }
        return network === activePlatform;
    }
    
    preconnect() {
        const domains = this.config?.performance?.preconnectDomains || [
            'https://pagead2.googlesyndication.com',
            'https://adsterra.com',
            'https://securepubads.g.doubleclick.net'
        ];
        
        domains.forEach(domain => {
            if (!document.querySelector(`link[rel="preconnect"][href="${domain}"]`)) {
                const link = document.createElement('link');
                link.rel = 'preconnect';
                link.href = domain;
                document.head.appendChild(link);
            }
        });
    }
    
    observeRouteChanges() {
        window.addEventListener('hashchange', () => {
            setTimeout(() => {
                this.updatePageType();
                this.loadAdsForCurrentPage();
            }, 100);
        });
    }
    
    updatePageType() {
        const hash = window.location.hash.slice(1) || '/';
        
        if (hash === '/' || hash === '') {
            this.currentPage = 'home';
        } else if (hash.startsWith('/category/')) {
            this.currentPage = 'category';
        } else if (hash.startsWith('/article/')) {
            this.currentPage = 'article';
        } else {
            this.currentPage = 'static';
        }
        
        console.log('[AdInjector] Page type:', this.currentPage);
    }
    
    loadAdsForCurrentPage() {
        // 重置已加载的广告位
        this.loadedSlots.clear();
        
        // 再次隐藏所有广告位（确保页面切换时状态正确）
        this.hideAllAdSlots();
        
        // 获取当前页面应显示的广告位
        const pageAdSlots = this.config?.pageAdSlots?.[this.currentPage] || [];
        console.log('[AdInjector] Loading ads for page:', pageAdSlots);
        
        // 按优先级加载广告
        this.loadAdsByPriority(pageAdSlots);
        
        // 扫描页面上的所有广告容器，加载任何动态插入的广告
        setTimeout(() => {
            this.scanAndLoadAllAds();
        }, 300);
    }
    
    loadAdsByPriority(slotIds) {
        // 分离优先级
        const highPriority = [];
        const mediumPriority = [];
        const lowPriority = [];
        
        slotIds.forEach(slotId => {
            const slotConfig = this.config?.adSlots?.[slotId];
            if (slotConfig) {
                switch (slotConfig.priority) {
                    case 'high':
                        highPriority.push(slotId);
                        break;
                    case 'medium':
                        mediumPriority.push(slotId);
                        break;
                    case 'low':
                        lowPriority.push(slotId);
                        break;
                }
            }
        });
        
        // 立即加载高优先级
        highPriority.forEach(slotId => this.loadAdSlot(slotId, 'immediate'));
        
        // 懒加载中优先级
        setTimeout(() => {
            mediumPriority.forEach(slotId => this.loadAdSlot(slotId, 'lazy'));
        }, 500);
        
        // 延迟加载低优先级
        setTimeout(() => {
            lowPriority.forEach(slotId => this.loadAdSlot(slotId, 'deferred'));
        }, 2000);
        
        // 特殊处理插屏广告
        if (slotIds.includes('AD-10')) {
            this.scheduleInterstitial();
        }
    }
    
    scanAndLoadAllAds() {
        const allContainers = document.querySelectorAll('[data-ad-container="true"]');
        
        allContainers.forEach(container => {
            const slotId = container.getAttribute('data-ad-id');
            const currentStatus = container.getAttribute('data-ad-status');
            
            // 只有 pending 状态的才需要加载
            if (slotId && (currentStatus === 'pending' || !this.loadedSlots.has(slotId))) {
                // 先从 loadedSlots 中移除，确保能重新加载
                this.loadedSlots.delete(slotId);
                this.loadAdSlot(slotId, 'auto');
            }
        });
    }
    
    loadAdSlot(slotId, loadType) {
        const container = document.querySelector(`[data-ad-id="${slotId}"]`);
        if (!container) {
            // 对于动态生成的广告（如 AD-04, AD-05, AD-06, AD-07），可能在初始化时尚未插入 DOM 中
            // 我们不记录错误，而是默默返回，依赖 scanAndLoadAllAds 稍后重试
            return;
        }
        
        // 检查是否已经加载过
        const currentStatus = container.getAttribute('data-ad-status');
        if (currentStatus === 'loaded' || currentStatus === 'loading') {
            return;
        }
        
        // 获取广告位配置
        const slotConfig = this.config?.adSlots?.[slotId];
        
        // 显示容器（所有广告位都显示）
        container.style.display = '';
        
        // 标记为已加载
        this.loadedSlots.add(slotId);
        
        // 渲染广告
        this.renderAdSlot(container, slotId, slotConfig);
    }
    
    async renderAdSlot(container, slotId, slotConfig) {
        const currentStatus = container.getAttribute('data-ad-status');
        if (currentStatus === 'loaded' || currentStatus === 'loading') {
            return;
        }
        
        container.setAttribute('data-ad-status', 'loading');
        
        try {
            // 渲染所有平台的演示广告（因为 demoContent 已启用）
            if (window.AdAdapters) {
                // 先尝试用 activePlatform
                const activePlatform = this.config?.activePlatform;
                if (activePlatform && window.AdAdapters[activePlatform]) {
                    await window.AdAdapters[activePlatform].render(container, this.config, slotId);
                } else {
                    // 如果没有 activePlatform，尝试所有平台
                    for (const platform in window.AdAdapters) {
                        if (window.AdAdapters[platform]) {
                            await window.AdAdapters[platform].render(container, this.config, slotId);
                            break; // 只渲染第一个可用的平台
                        }
                    }
                }
            }
            
            console.log('[AdInjector] Ad loaded:', slotId);
        } catch (error) {
            console.error('[AdInjector] Failed to load ad:', slotId, error);
            container.setAttribute('data-ad-status', 'failed');
        }
    }
    
    scheduleInterstitial() {
        // 30秒后显示插屏广告
        setTimeout(() => {
            const interstitial = document.getElementById('interstitial-ad');
            const activePlatform = this.config?.activePlatform;
            if (interstitial && activePlatform) {
                interstitial.classList.add('active');
                this.loadAdSlot('AD-10', 'deferred');
                
                // 5秒后或用户点击后关闭
                setTimeout(() => {
                    interstitial.classList.remove('active');
                }, 5000);
                
                interstitial.addEventListener('click', () => {
                    interstitial.classList.remove('active');
                });
            }
        }, 30000);
    }
    
    // 公共API：重新加载所有广告
    reloadAll() {
        console.log('[AdInjector] Reloading all ads...');
        this.init();
    }
}

// 初始化广告注入器
document.addEventListener('DOMContentLoaded', () => {
    if (window.AdConfig) {
        window.AdInjector = new AdInjector();
    }
});