/**
 * Ad Configuration File
 * Modify this file to update all ads
 * No need to regenerate the entire website
 */

window.AdConfig = {
    version: '2.0.0',
    
    // Global switch
    enabled: true,
    debugMode: false,
    
    // Active platform (null means no active platform, just placeholder slots)
    activePlatform: 'gam',
    
    // Platform credentials (add your real IDs here when ready)
    credentials: {
        adsense: {
            clientId: '',
            adSlots: {}
        },
        adsterra: {
            accountId: '',
            placementIds: {}
        },
        gam: {
            networkId: '',
            adUnits: {}
        }
    },
    
    // Ad code configuration - set your ad HTML here when ready
    adCode: {
        adsense: {
            default: null,
            'AD-01': null,
            'AD-02': null,
            'AD-03': null,
            'AD-04': null,
            'AD-05': null,
            'AD-06': null,
            'AD-07': null,
            'AD-08': null,
            'AD-09': null,
            'AD-10': null,
            'AD-11': null
        },
        adsterra: {
            default: null,
            'AD-01': null,
            'AD-02': null,
            'AD-03': null,
            'AD-04': null,
            'AD-05': null,
            'AD-06': null,
            'AD-07': null,
            'AD-08': null,
            'AD-09': null,
            'AD-10': null,
            'AD-11': null
        },
        gam: {
            default: null,
            'AD-01': null,
            'AD-02': null,
            'AD-03': null,
            'AD-04': null,
            'AD-05': null,
            'AD-06': null,
            'AD-07': null,
            'AD-08': null,
            'AD-09': null,
            'AD-10': null,
            'AD-11': null
        }
    },
    
    // Complete configuration for 11 ad slots
    adSlots: {
        'AD-01': {
            name: 'Top Banner',
            networks: [],
            priority: 'high',
            types: {}
        },
        'AD-02': {
            name: 'Sidebar 1',
            networks: [],
            priority: 'medium',
            types: {}
        },
        'AD-03': {
            name: 'Sidebar 2',
            networks: [],
            priority: 'low',
            types: {}
        },
        'AD-04': {
            name: 'In-Article 1',
            networks: [],
            priority: 'high',
            types: {}
        },
        'AD-05': {
            name: 'In-Article 2',
            networks: [],
            priority: 'medium',
            types: {}
        },
        'AD-06': {
            name: 'In-Article 3',
            networks: [],
            priority: 'low',
            types: {}
        },
        'AD-07': {
            name: 'In-Feed',
            networks: [],
            priority: 'high',
            types: {}
        },
        'AD-08': {
            name: 'Bottom Banner',
            networks: [],
            priority: 'medium',
            types: {}
        },
        'AD-09': {
            name: 'Floating Ad',
            networks: [],
            priority: 'medium',
            types: {}
        },
        'AD-10': {
            name: 'Interstitial',
            networks: [],
            priority: 'low',
            types: {}
        },
        'AD-11': {
            name: 'Search Ad',
            networks: [],
            priority: 'special',
            types: {}
        }
    },
    
    // Ad slot assignment for each page (keeps the positions)
    pageAdSlots: {
        home: ['AD-01', 'AD-07', 'AD-02', 'AD-03', 'AD-08', 'AD-09', 'AD-10'],
        article: ['AD-01', 'AD-04', 'AD-05', 'AD-06', 'AD-02', 'AD-08', 'AD-09'],
        category: ['AD-01', 'AD-07', 'AD-02', 'AD-08'],
        static: ['AD-01', 'AD-02', 'AD-08'],
        search: ['AD-11']
    },
    
    // Performance settings
    performance: {
        lazyLoadOffset: 200,
        topAdImmediate: true,
        deferNonCritical: true,
        timeout: 3000,
        preconnectDomains: []
    },
    
    // Demo content (disabled by default)
    demoContent: {
        enabled: true,
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
    }
};