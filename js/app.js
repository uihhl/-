// ==========================================
// 腹黑值测试 - 主应用逻辑
// SPA 路由 / 页面管理 / 事件绑定
// ==========================================

const App = {
  // ---- 屏幕切换 ----
  showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById('screen-' + screenId);
    if (target) {
      target.classList.add('active');
      target.scrollTop = 0;
    }
  },

  // ---- 首页 ----
  showHome() {
    this.showScreen('home');
  },

  // ---- 开始游戏 ----
  startGame() {
    Game.init();
    this.showScreen('game');
    this.nextQuestion();
  },

  // ---- 渲染下一题 ----
  nextQuestion() {
    if (Game.isFinished()) {
      this.showResult();
      return;
    }

    Game.renderQuestion((score) => {
      Game.submitAnswer(score);
      this.nextQuestion();
    });
  },

  // ---- 显示结果 ----
  showResult() {
    this.showScreen('result');
    const score = Game.getTotalScore();
    const level = getLevel(score);

    // 分数动画
    const scoreEl = document.getElementById('score-number');
    const ringEl = document.getElementById('ring-fill');
    const pct = score / 100;
    const circumference = 2 * Math.PI * 85; // ~534

    // 数字跳动动画
    this.animateNumber(scoreEl, 0, score, 1200);

    // 环形进度动画
    setTimeout(() => {
      ringEl.style.strokeDashoffset = circumference - circumference * pct;
      ringEl.style.stroke = level.color;
    }, 200);

    // 等级卡片
    setTimeout(() => {
      document.getElementById('level-emoji').textContent = level.emoji;
      document.getElementById('level-name').textContent = level.name;
      document.getElementById('level-desc').textContent = level.description;
      document.getElementById('level-card').style.animation = 'none';
      document.getElementById('level-card').offsetHeight;
      document.getElementById('level-card').style.animation = 'slideIn 0.5s ease 0.3s backwards';
    }, 400);
  },

  // ---- 数字跳动动画 ----
  animateNumber(el, from, to, duration) {
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(from + (to - from) * eased);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  },

  // ---- 分享 ----
  async openShareModal() {
    const score = Game.getTotalScore();
    const level = getLevel(score);

    document.getElementById('modal-share').classList.add('active');

    // 生成分享卡片
    const blob = await ShareCard.generate(level, score);
    const previewUrl = URL.createObjectURL(blob);

    // 释放旧 URL
    if (this._sharePreviewUrl) URL.revokeObjectURL(this._sharePreviewUrl);

    // 显示预览图
    const canvas = document.getElementById('share-canvas');
    const preview = document.getElementById('share-preview');
    canvas.style.display = 'none';
    preview.style.display = 'block';
    preview.src = previewUrl;

    // 存储供下载和清理
    this._shareBlob = blob;
    this._shareLevelName = level.name;
    this._sharePreviewUrl = previewUrl;
  },

  closeShareModal() {
    document.getElementById('modal-share').classList.remove('active');
    if (this._sharePreviewUrl) {
      URL.revokeObjectURL(this._sharePreviewUrl);
      this._sharePreviewUrl = null;
    }
  },

  downloadShare() {
    if (this._shareBlob) {
      ShareCard.download(this._shareBlob, this._shareLevelName);
    }
  },

  // ---- 图鉴 ----
  showGallery() {
    this.showScreen('gallery');
    this.renderGallery();
  },

  renderGallery() {
    const grid = document.getElementById('gallery-grid');
    grid.innerHTML = '';

    LEVELS.forEach((level, i) => {
      const card = document.createElement('div');
      card.className = 'gallery-card';
      card.innerHTML = `
        <div class="gallery-card-emoji">${level.emoji}</div>
        <div class="gallery-card-info">
          <div class="gallery-card-name">${level.name}</div>
          <div class="gallery-card-range">${level.minScore} - ${level.maxScore} 分 · ${level.character}</div>
          <div class="gallery-card-desc">${level.description}</div>
        </div>
      `;
      card.style.borderLeft = '4px solid ' + level.color;
      grid.appendChild(card);
    });
  },

  // ---- 初始化 ----
  init() {
    // 首页：开始按钮
    document.getElementById('btn-start').addEventListener('click', () => {
      this.startGame();
    });

    // 首页：查看图鉴
    document.getElementById('btn-gallery-from-home').addEventListener('click', () => {
      this.showGallery();
    });

    // 点击场景文本跳过打字动画
    document.getElementById('scenario-text').addEventListener('click', () => {
      Game.skipTyping();
    });

    // 结果页：分享
    document.getElementById('btn-share').addEventListener('click', () => {
      this.openShareModal();
    });

    // 结果页：查看图鉴
    document.getElementById('btn-gallery-from-result').addEventListener('click', () => {
      this.showGallery();
    });

    // 结果页：重新测试
    document.getElementById('btn-retry').addEventListener('click', () => {
      this.startGame();
    });

    // 图鉴页：返回首页
    document.getElementById('btn-back-home').addEventListener('click', () => {
      this.showHome();
    });

    // 分享弹窗：下载
    document.getElementById('btn-download').addEventListener('click', () => {
      this.downloadShare();
    });

    // 分享弹窗：关闭
    document.getElementById('btn-close-modal').addEventListener('click', () => {
      this.closeShareModal();
    });

    // 点击弹窗背景关闭
    document.getElementById('modal-share').addEventListener('click', (e) => {
      if (e.target.id === 'modal-share') {
        this.closeShareModal();
      }
    });
  }
};

// ---- 启动 ----
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
