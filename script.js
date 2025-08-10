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