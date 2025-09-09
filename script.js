// ナビゲーションメニューの制御
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // スムーススクロール
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // スクロール時のヘッダー効果
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'var(--background-white)';
            header.style.backdropFilter = 'none';
        }
    });
    
    // 要素の表示アニメーション
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
    
    // アニメーション対象要素を監視
    const animateElements = document.querySelectorAll('.feature-card, .benefit-card, .tech-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // 音量バーのアニメーション
    const volumeFill = document.querySelector('.volume-fill');
    if (volumeFill) {
        let volumeLevel = 75;
        setInterval(() => {
            volumeLevel = Math.random() * 50 + 50; // 50-100%の範囲
            volumeFill.style.width = volumeLevel + '%';
            
            const volumeText = document.querySelector('.volume-text');
            if (volumeText) {
                volumeText.textContent = Math.round(volumeLevel * 2) + '%'; // 200%スケール
            }
        }, 3000);
    }
    
    // プリセットボタンの切り替え
    const presetButtons = document.querySelectorAll('.preset-btn');
    presetButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            presetButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // GA4: ストアボタンクリック計測（URL確定後もそのまま動作）
    function trackClick(eventName, url) {
        try {
            if (typeof gtag === 'function') {
                gtag('event', eventName, {
                    link_url: url || '',
                    event_source: 'lp_button'
                });
            }
        } catch (_) {}
    }
    const iosBtn = document.querySelector('.ios-btn');
    if (iosBtn) {
        iosBtn.addEventListener('click', () => trackClick('app_store_click', iosBtn.getAttribute('href')));
    }
    const androidBtn = document.querySelector('.android-btn');
    if (androidBtn) {
        androidBtn.addEventListener('click', () => trackClick('google_play_click', androidBtn.getAttribute('href')));
    }

    // GA4: Tally フォーム送信検知（iframe postMessage 受信）
    function isTallySubmitEvent(message) {
        try {
            if (!message) return false;
            // 文字列/オブジェクトどちらでも検知できるように包括的に評価
            const text = (typeof message === 'string') ? message : JSON.stringify(message);
            const lower = text.toLowerCase();
            return (lower.includes('tally') || lower.includes('form')) && (lower.includes('submit'));
        } catch (_) { return false; }
    }
    window.addEventListener('message', (evt) => {
        // 送信元の確認（tally.so 域からのメッセージのみ）
        if (!evt.origin || !evt.origin.includes('tally.so')) return;
        if (!isTallySubmitEvent(evt.data)) return;
        try {
            if (typeof gtag === 'function') {
                gtag('event', 'generate_lead', {
                    method: 'tally',
                    event_source: 'contact_iframe'
                });
            }
        } catch (_) {}
    });


    
    // パフォーマンス最適化: 画像の遅延読み込み
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // ダークモード対応（将来的な機能）
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDarkScheme.matches) {
        document.body.classList.add('dark-mode');
    }

    // 多言語対応: 初回のみブラウザ言語で自動遷移 + 明示指定の優先（同一ページ間でのマッピング対応）
    (function handleLanguageRouting() {
        try {
            const storageKey = 'preferredLang';
            const saved = localStorage.getItem(storageKey);
            const params = new URLSearchParams(window.location.search);
            const paramLang = params.get('lang'); // 'ja' | 'en'
            const path = location.pathname;
            // 日本語→英語への自動遷移はトップページのみに限定（明示的に日本語ページを開いた場合は尊重）
            const isRootJa = path === '/' || path === '/index.html';
            const isEnPath = location.pathname === '/en' || location.pathname === '/en/' || location.pathname.startsWith('/en/');

            function toEnPath(p) {
                if (p === '/' || p === '/index.html') return '/en/';
                if (p === '/contact' || p === '/contact.html') return '/en/contact';
                if (p === '/privacy-policy' || p === '/privacy-policy.html') return '/en/privacy-policy';
                if (p === '/terms-of-service' || p === '/terms-of-service.html') return '/en/terms-of-service';
                if (p.startsWith('/en/')) return p; // already en
                return '/en/';
            }
            function toJaPath(p) {
                if (p === '/en' || p === '/en/' || p === '/en/index.html') return '/';
                if (p === '/en/contact' || p === '/en/contact.html') return '/contact';
                if (p === '/en/privacy-policy' || p === '/en/privacy-policy.html') return '/privacy-policy';
                if (p === '/en/terms-of-service' || p === '/en/terms-of-service.html') return '/terms-of-service';
                return '/';
            }

            // 明示指定があれば保存して反映
            if (paramLang === 'en') {
                localStorage.setItem(storageKey, 'en');
                if (!isEnPath) {
                    location.replace(toEnPath(path));
                }
                return;
            }
            if (paramLang === 'ja') {
                localStorage.setItem(storageKey, 'ja');
                if (isEnPath) {
                    location.replace(toJaPath(path));
                }
                return;
            }

            // 既に選好があっても、トップ以外では自動遷移しない（ユーザーの明示を優先）
            if (saved === 'en' && !isEnPath && isRootJa) {
                location.replace(toEnPath(path));
                return;
            }
            // saved が 'ja' の場合でも、ユーザーが明示的に /en/ を開いたときは尊重する

            // 初回のみ: ブラウザ優先言語でトップを振り分け
            if (!saved && (location.pathname === '/' || location.pathname === '/index.html')) {
                const langs = navigator.languages || [navigator.language || ''];
                const primary = (langs[0] || '').toLowerCase();
                if (primary.startsWith('en')) {
                    localStorage.setItem(storageKey, 'en');
                    location.replace('/en/');
                } else {
                    localStorage.setItem(storageKey, 'ja');
                }
            }
        } catch (_) {
            // 失敗時は何もしない
        }
    })();

    // 同意バナー（Consent Mode v2）
    (function setupConsentBanner() {
        try {
            const storageKey = 'vc_cookie_consent_v1';
            const saved = localStorage.getItem(storageKey);
            if (saved) return; // 既に応答済み

            const lang = (document.documentElement.getAttribute('lang') || 'ja').toLowerCase();
            const isJa = lang.startsWith('ja');

            const banner = document.createElement('div');
            banner.className = 'consent-banner';
            banner.innerHTML = `
                <div class="consent-banner__inner">
                    <div class="consent-banner__text">
                        ${isJa ? '当サイトでは、分析および広告のためにクッキー等を使用します。設定はいつでも変更できます。' : 'We use cookies for analytics and ads. You can change your preferences anytime.'}
                    </div>
                    <div class="consent-banner__actions">
                        <button class="consent-btn consent-reject">${isJa ? '拒否' : 'Reject'}</button>
                        <button class="consent-btn consent-accept">${isJa ? '同意' : 'Accept'}</button>
                    </div>
                </div>
            `;
            document.body.appendChild(banner);

            function hide() { banner.remove(); }

            const onAccept = () => {
                try { if (typeof gtag === 'function') {
                    gtag('consent', 'update', {
                        'ad_user_data': 'granted',
                        'ad_personalization': 'granted',
                        'ad_storage': 'granted',
                        'analytics_storage': 'granted'
                    });
                }} catch(_) {}
                localStorage.setItem(storageKey, 'accepted');
                hide();
            };
            const onReject = () => {
                try { if (typeof gtag === 'function') {
                    gtag('consent', 'update', {
                        'ad_user_data': 'denied',
                        'ad_personalization': 'denied',
                        'ad_storage': 'denied',
                        'analytics_storage': 'denied'
                    });
                }} catch(_) {}
                localStorage.setItem(storageKey, 'rejected');
                hide();
            };

            banner.querySelector('.consent-accept').addEventListener('click', onAccept);
            banner.querySelector('.consent-reject').addEventListener('click', onReject);
        } catch (_) {}
    })();


});

// ユーティリティ関数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// スクロール位置に基づくナビゲーションハイライト
function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + currentSection) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', debounce(updateActiveNavigation, 100));