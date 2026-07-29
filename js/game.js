// ==========================================
// 腹黑值测试 - 游戏引擎
// 抽题、计分、进度管理、打字机效果
// ==========================================

const Game = {
  questions: [],       // 本轮抽取的10道题
  currentIndex: 0,     // 当前题目索引 (0-9)
  totalScore: 0,       // 累计分数
  isTyping: false,     // 打字机是否进行中
  typeTimer: null,     // 打字机定时器
  _choiceCallback: null, // 当前题目的选项回调

  /**
   * 初始化游戏：从题库中随机抽取10道题
   */
  init() {
    const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
    this.questions = shuffled.slice(0, 10);
    this.currentIndex = 0;
    this.totalScore = 0;
    this.isTyping = false;
    if (this.typeTimer) clearTimeout(this.typeTimer);
  },

  /**
   * 获取当前题目
   */
  getCurrentQuestion() {
    return this.questions[this.currentIndex];
  },

  /**
   * 提交答案
   * @param {number} score - 选项对应的分数
   */
  submitAnswer(score) {
    this.totalScore += score;
    this.currentIndex++;
  },

  /**
   * 游戏是否结束
   */
  isFinished() {
    return this.currentIndex >= this.questions.length;
  },

  /**
   * 获取当前进度信息
   */
  getProgress() {
    return {
      current: this.currentIndex + 1, // 显示用 (1-10)
      total: this.questions.length,
      percent: ((this.currentIndex) / this.questions.length) * 100
    };
  },

  /**
   * 获取总分
   */
  getTotalScore() {
    return this.totalScore * 2;
  },

  /**
   * 渲染当前题目到页面
   * @param {function} onChoiceClick - 选项点击回调
   */
  renderQuestion(onChoiceClick) {
    this._choiceCallback = onChoiceClick;
    const q = this.getCurrentQuestion();
    const progress = this.getProgress();

    // 更新进度条
    document.getElementById('progress-fill').style.width = progress.percent + '%';
    document.getElementById('progress-text').textContent = progress.current + ' / ' + progress.total;

    // 更新题号
    document.getElementById('scenario-number').textContent = 'Q' + progress.current;

    // 更新场景卡片动画
    const card = document.getElementById('scenario-card');
    card.style.animation = 'none';
    card.offsetHeight; // 强制回流
    card.style.animation = 'slideIn 0.4s ease';

    // 打字机效果显示场景文本
    const textEl = document.getElementById('scenario-text');
    this.typeText(textEl, q.scenario, () => {
      // 打字完成后渲染选项
      this.renderChoices(q.choices, onChoiceClick);
    });
  },

  /**
   * 打字机效果
   * @param {HTMLElement} el - 文本元素
   * @param {string} text - 完整文本
   * @param {function} onComplete - 完成回调
   */
  typeText(el, text, onComplete) {
    if (this.typeTimer) clearTimeout(this.typeTimer);
    this.isTyping = true;
    el.innerHTML = '';

    let i = 0;
    const speed = 50; // 每个字50ms

    const tick = () => {
      if (i < text.length) {
        el.innerHTML += text.charAt(i);
        i++;
        // 标点符号后稍作停顿
        const pause = '，。！？、：；'.includes(text.charAt(i - 1)) ? 200 : speed;
        this.typeTimer = setTimeout(tick, pause);
      } else {
        // 移除光标
        el.innerHTML = text;
        this.isTyping = false;
        if (onComplete) onComplete();
      }
    };

    tick();
  },

  /**
   * 渲染选项按钮
   * @param {array} choices - 选项数组
   * @param {function} onChoiceClick - 点击回调
   */
  renderChoices(choices, onChoiceClick) {
    const container = document.getElementById('choices-container');
    container.innerHTML = '';

    const letters = ['A', 'B', 'C', 'D'];

    choices.forEach((choice, idx) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.innerHTML = `<span class="choice-letter">${letters[idx]}</span>${choice.text}`;

      btn.addEventListener('click', () => {
        // 防止重复点击
        if (this.isTyping) return;

        // 禁用所有按钮
        container.querySelectorAll('.choice-btn').forEach(b => {
          b.disabled = true;
          b.style.pointerEvents = 'none';
        });

        // 高亮选中
        btn.classList.add('selected');

        // 延迟进入下一题
        setTimeout(() => {
          onChoiceClick(choice.score);
        }, 500);
      });

      container.appendChild(btn);
    });
  },

  /**
   * 跳过打字动画（点击加速）
   */
  skipTyping() {
    if (this.isTyping && this.typeTimer) {
      clearTimeout(this.typeTimer);
      const q = this.getCurrentQuestion();
      document.getElementById('scenario-text').innerHTML = q.scenario;
      this.isTyping = false;
      this.renderChoices(q.choices, this._choiceCallback);
    }
  }
};
