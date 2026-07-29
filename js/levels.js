// ==========================================
// 腹黑值测试 - 等级定义 (5级)
// 满分100 = 10题 × 每题计分0-5后 ×2
// ==========================================

const LEVELS = [
  {
    name: '纯白小天使',
    title: '天真无邪·人间小太阳',
    emoji: '🕊️',
    minScore: 0,
    maxScore: 20,
    color: '#69f0ae',
    gradient: 'linear-gradient(135deg, #69f0ae, #00c853)',
    description: '你的内心干净得像一张白纸，总是以善意揣测他人。朋友眼中的你是治愈系担当，温暖又可靠。不过偶尔也要学会保护自己哦，不是所有人都值得你的善良。',
    tagline: '世界以痛吻你，你却报之以歌。',
    character: '治愈系天使',
    power: '净化光环 · 感化身边所有人'
  },
  {
    name: '略有小心机',
    title: '软萌外表·机智小狐狸',
    emoji: '🦊',
    minScore: 21,
    maxScore: 40,
    color: '#ffd740',
    gradient: 'linear-gradient(135deg, #ffd740, #ffab00)',
    description: '你大多数时候都很善良，但也不傻。偶尔会耍点小聪明，不过无伤大雅，反而让人觉得有点可爱。你懂得在必要时保护自己，但不会主动伤害别人。',
    tagline: '我不是腹黑，我只是比较聪明而已~',
    character: '机智小狐狸',
    power: '灵活应变 · 在善良和机智之间自由切换'
  },
  {
    name: '城府渐深',
    title: '运筹帷幄·暗夜谋士',
    emoji: '🐺',
    minScore: 41,
    maxScore: 60,
    color: '#7c4dff',
    gradient: 'linear-gradient(135deg, #7c4dff, #5a2fd0)',
    description: '你的心思已经相当缜密，做事前会考虑各种可能性。你擅长察言观色，在社交中游刃有余。别人很难猜透你在想什么，而你早已看穿了一切。',
    tagline: '你以为我在第二层，其实我在第五层。',
    character: '暗夜谋士',
    power: '洞察人心 · 局势尽在掌握之中'
  },
  {
    name: '腹黑高手',
    title: '笑里藏刀·优雅操盘手',
    emoji: '😈',
    minScore: 61,
    maxScore: 80,
    color: '#e040fb',
    gradient: 'linear-gradient(135deg, #e040fb, #aa00ff)',
    description: '你已经将腹黑修炼成了一门艺术。微笑是你的武器，温柔是你的伪装。你能在谈笑风生间达成自己的目的，而且让人心甘情愿。不过要小心别玩脱了~',
    tagline: '温柔刀，刀刀割人性命（开玩笑的啦~）。',
    character: '优雅操盘手',
    power: '润物细无声 · 用温柔操控一切'
  },
  {
    name: '终极魔王',
    title: '深不可测·混沌本尊',
    emoji: '👑',
    minScore: 81,
    maxScore: 100,
    color: '#ff5252',
    gradient: 'linear-gradient(135deg, #ff5252, #d50000)',
    description: '你是真正的幕后BOSS，心思深沉到连自己都害怕。你的每一步棋都经过精密计算，没有人能猜到你真正的意图。建议适度使用这份天赋——毕竟，魔王也需要朋友，对吧？',
    tagline: '不要试图揣测魔王的想法，因为你永远猜不透。',
    character: '混沌本尊',
    power: '绝对掌控 · 万物皆为棋子'
  }
];

/**
 * 根据总分获取对应等级
 * @param {number} totalScore - 总分 (0-50)
 * @returns {object} 等级对象
 */
function getLevel(totalScore) {
  return LEVELS.find(l => totalScore >= l.minScore && totalScore <= l.maxScore) || LEVELS[0];
}
