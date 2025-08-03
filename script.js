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
    
    // 通知フォームの処理
    const notificationForm = document.querySelector('.notification-form');
    if (notificationForm) {
        notificationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[name="email"]').value;
            const submitBtn = this.querySelector('button[type="submit"]');
            
            // 送信中の表示
            submitBtn.textContent = '送信中...';
            submitBtn.disabled = true;
            
            // 模擬的な送信処理（実際にはサーバーサイドの実装が必要）
            setTimeout(() => {
                alert('ありがとうございます！リリース情報をお送りいたします。');
                this.reset();
                submitBtn.textContent = '通知を受け取る';
                submitBtn.disabled = false;
            }, 1500);
        });
    }
    
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
    
    // 音量警告のシミュレーション
    function showVolumeWarning() {
        const warning = document.createElement('div');
        warning.className = 'volume-warning';
        warning.innerHTML = `
            <div class="warning-content">
                <h3>⚠️ 音量注意</h3>
                <p>音量が高く設定されています。聴覚保護のため、適切な音量でご利用ください。</p>
                <button onclick="this.parentElement.parentElement.remove()">了解</button>
            </div>
        `;
        warning.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        warning.querySelector('.warning-content').style.cssText = `
            background: white;
            padding: 2rem;
            border-radius: 15px;
            text-align: center;
            max-width: 400px;
            margin: 0 20px;
        `;
        warning.querySelector('button').style.cssText = `
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 0.8rem 1.5rem;
            border-radius: 25px;
            cursor: pointer;
            margin-top: 1rem;
        `;
        
        document.body.appendChild(warning);
    }
    
    // デモ用: 5秒後に音量警告を表示
    setTimeout(showVolumeWarning, 5000);
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