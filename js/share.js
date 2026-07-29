// ==========================================
// 腹黑值测试 - 分享卡片生成 (Canvas API)
// 含水印 + 小红书二维码
// ==========================================

const ShareCard = {
  _qrImage: null,
  _wmImage: null,
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
    this._qrImage = await loadImg('assets/qrcode.png');
    this._wmImage = await loadImg('assets/watermark.png');
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

    // --- 水印图片：平铺半透明背景 ---
    if (this._wmImage) {
      ctx.save();
      ctx.globalAlpha = 0.04;
      const wmW = 200;
      const wmH = (this._wmImage.height / this._wmImage.width) * wmW;
      for (let x = -50; x < W + 50; x += wmW + 40) {
        for (let y = -50; y < H + 50; y += wmH + 40) {
          ctx.drawImage(this._wmImage, x, y, wmW, wmH);
        }
      }
      ctx.restore();
    }

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
      ctx.fillText(line, W / 2, 625 + i * 24);
    });

    // --- Tagline ---
    const tagY = 625 + descLines.length * 24 + 20;
    ctx.fillStyle = level.color;
    ctx.font = 'italic 15px "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.fillText('「' + level.tagline + '」', W / 2, tagY);

    // --- 底部分割线 ---
    const footerY = tagY + 30;
    ctx.strokeStyle = 'rgba(179, 136, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, footerY);
    ctx.lineTo(W - 60, footerY);
    ctx.stroke();

    // --- 底部区域：水印 + 二维码 ---
    const footerTop = footerY + 16;
    const qrSize = 90;

    // 小红书水印（左下）
    if (this._wmImage) {
      const wmH = 60;
      const wmW = (this._wmImage.width / this._wmImage.height) * wmH;
      ctx.globalAlpha = 0.85;
      ctx.drawImage(this._wmImage, 36, footerTop + 4, wmW, wmH);
      ctx.globalAlpha = 1;
    }

    // 二维码（右下）
    const qrX = W - qrSize - 40;
    const qrY = footerTop;

    if (this._qrImage) {
      ctx.drawImage(this._qrImage, qrX, qrY, qrSize, qrSize);
    } else {
      ctx.strokeStyle = 'rgba(179, 136, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.strokeRect(qrX, qrY, qrSize, qrSize);
      ctx.fillStyle = '#b8a8cc';
      ctx.font = '11px "PingFang SC", "Microsoft YaHei", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('小红书', qrX + qrSize / 2, qrY + qrSize / 2);
    }

    // 二维码引导文字
    ctx.fillStyle = '#b8a8cc';
    ctx.font = '12px "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('📕 扫码关注小红书', qrX - 14, qrY + qrSize + 18);

    // --- 斜角水印文字 ---
    ctx.save();
    ctx.globalAlpha = 0.04;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center';
    ctx.translate(W / 2, H / 2);
    ctx.rotate(-25 * Math.PI / 180);
    ctx.fillText('腹黑值测试', 0, 0);
    ctx.fillText('腹黑值测试', -60, 120);
    ctx.fillText('腹黑值测试', 60, -120);
    ctx.restore();

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
