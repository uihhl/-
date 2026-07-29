// ==========================================
// 腹黑值测试 - 分享卡片生成 (Canvas API)
// 含微信二维码 + @账号
// ==========================================

const ShareCard = {
  _wechatQr: null,
  _imagesLoaded: false,

  /**
   * 预加载图片资源
   */
  async loadImages() {
    if (this._imagesLoaded) return;
    const loadImg = (src) => new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
    this._wechatQr = await loadImg('assets/wechat-normal.png');
    this._imagesLoaded = true;
  },

  /**
   * 生成分享卡片
   * @param {object} level - 等级对象
   * @param {number} score - 总分
   * @returns {Promise<Blob>} 图片 Blob
   */
  async generate(level, score) {
    await this.loadImages();

    const canvas = document.getElementById('share-canvas');
    const ctx = canvas.getContext('2d');
    const W = canvas.width;   // 600
    const H = canvas.height;  // 800

    // --- 背景渐变 ---
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#1a1025');
    bgGrad.addColorStop(0.5, '#2a1f35');
    bgGrad.addColorStop(1, '#1a1025');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // --- 装饰光点 ---
    ctx.fillStyle = 'rgba(179, 136, 255, 0.06)';
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * W, Math.random() * H, Math.random() * 40 + 10, 0, Math.PI * 2);
      ctx.fill();
    }

    // --- 顶部标题 ---
    ctx.fillStyle = '#b388ff';
    ctx.font = 'bold 22px "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🖤 腹黑值测试 🖤', W / 2, 70);

    // --- 分割线 ---
    ctx.strokeStyle = 'rgba(179, 136, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, 100);
    ctx.lineTo(W - 60, 100);
    ctx.stroke();

    // --- 等级 Emoji ---
    ctx.font = '80px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(level.emoji, W / 2, 190);

    // --- 分数环 ---
    const cx = W / 2, cy = 310, radius = 100;
    const pct = score / 100;

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 12;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * pct);
    ctx.strokeStyle = level.color;
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 52px "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(score, cx, cy + 5);

    ctx.fillStyle = '#b8a8cc';
    ctx.font = '16px "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.fillText('腹黑值', cx, cy + 45);

    // --- 等级名称 ---
    ctx.fillStyle = level.color;
    ctx.font = 'bold 32px "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.fillText(level.name, W / 2, 480);

    // --- 称号 ---
    ctx.fillStyle = '#ede7f6';
    ctx.font = '18px "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.fillText(level.title, W / 2, 515);

    // --- 角色信息 ---
    ctx.fillStyle = '#b8a8cc';
    ctx.font = '16px "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.fillText('角色定位：' + level.character, W / 2, 555);
    ctx.fillText('特殊能力：' + level.power, W / 2, 582);

    // --- 描述文字（自动换行） ---
    ctx.fillStyle = '#9e8db8';
    ctx.font = '14px "PingFang SC", "Microsoft YaHei", sans-serif';
    const descLines = this.wrapText(ctx, level.description, W - 120);
    descLines.forEach((line, i) => {
      ctx.fillText(line, W / 2, 610 + i * 20);
    });

    // --- Tagline ---
    const tagY = 610 + descLines.length * 20 + 12;
    ctx.fillStyle = level.color;
    ctx.font = 'italic 15px "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.fillText('「' + level.tagline + '」', W / 2, tagY);

    // 返回 Blob
    return new Promise(resolve => {
      canvas.toBlob(blob => resolve(blob), 'image/png');
    });
  },

  /**
   * 文字自动换行
   */
  wrapText(ctx, text, maxWidth) {
    const lines = [];
    let currentLine = '';
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const testLine = currentLine + char;
      if (ctx.measureText(testLine).width > maxWidth && currentLine.length > 0) {
        lines.push(currentLine);
        currentLine = char;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  },

  /**
   * 下载分享卡片
   * @param {Blob} blob - 图片blob
   * @param {string} levelName - 等级名称
   */
  download(blob, levelName) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `腹黑值测试_${levelName}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};
