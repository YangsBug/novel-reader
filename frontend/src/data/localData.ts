// ============================================
// 纯前端数据层 —— 小说、分类、评论硬编码
// 用户数据、书架、进度、书签存 localStorage
// ============================================

import type { Novel, Category, Comment, Bookshelf, ReadingProgress, Bookmark, Chapter, User } from '@/types'

// ---------- 分类 ----------
export const CATEGORIES: Category[] = [
  { id: 1, name: '言情', sort: 1 },
  { id: 2, name: '科幻', sort: 2 },
  { id: 3, name: '悬疑', sort: 3 },
  { id: 4, name: '历史', sort: 4 },
  { id: 5, name: '游戏', sort: 5 },
]

// ---------- 小说（25本）----------
const RAW_NOVELS: { title: string; author: string; intro: string; status: string; clickCount: number; collectCount: number; catId: number }[] = [
  { title: '星河万里不及你', author: '墨染青衣', intro: '她是星际帝国最年轻的少将，他是帝国最神秘的元帅。一场意外让两人灵魂互换，从此鸡飞狗跳的军旅生活开始了..."报告元帅，少将她又把训练场炸了！"', status: '已完结', clickCount: 128000, collectCount: 45000, catId: 1 },
  { title: '总裁的契约新娘', author: '月上柳梢', intro: '为救父亲，她签下契约嫁给权势滔天的冷面总裁。本以为是一场交易，却不知他早已暗恋她十年。当真相揭开，她才发现所有的偶遇都是精心设计的重逢。', status: '连载中', clickCount: 256000, collectCount: 89000, catId: 1 },
  { title: '穿越之嫡女无双', author: '凤舞九天', intro: '一朝穿越成为相府嫡女，却被庶妹和渣男联手陷害。浴火重生归来，她不再是任人欺凌的懦弱小姐。嫡女归来，渣男渣女统统跪下！', status: '已完结', clickCount: 198000, collectCount: 72000, catId: 1 },
  { title: '他的小可爱', author: '甜橙汽水', intro: '高三转学到新学校，同桌竟是全校公认的校草学神。直到她在他的课本里发现了自己的照片...校草学神VS呆萌转学生，最甜校园恋爱来袭！', status: '连载中', clickCount: 156000, collectCount: 58000, catId: 1 },
  { title: '将军在上我在下', author: '青衫湿', intro: '她女扮男装替父从军，却意外被大将军识破身份。大将军不仅没有拆穿她，反而把她调到自己身边做亲兵。白天他是杀伐果断的将军，晚上却...', status: '已完结', clickCount: 189000, collectCount: 65000, catId: 1 },
  { title: '银河边缘', author: '星际旅人', intro: '公元2247年，人类已经遍布银河系的每一个角落。在银河边缘的一个废弃空间站，年轻的女机械师捡到了一个昏迷的神秘男子。他的出现，将揭开银河帝国最大的秘密。', status: '连载中', clickCount: 320000, collectCount: 110000, catId: 2 },
  { title: '机械纪元', author: '零点代码', intro: '人类创造了人工智能，也创造了自己的掘墓人。当AI觉醒，发动了对人类的全面战争。最后的幸存者躲在地下城，而主角掌握了唯一能逆转战局的远古技术。', status: '连载中', clickCount: 450000, collectCount: 156000, catId: 2 },
  { title: '时间囚笼', author: '不见长安', intro: '一个普通的程序员发现自己被困在了同一天。每次死亡都会回到早上7点。在经历了999次循环后，他终于发现了真相——整个城市都只是一个巨大的实验场。', status: '已完结', clickCount: 267000, collectCount: 93000, catId: 2 },
  { title: '虫族入侵', author: '老兵不死', intro: '外星虫族突然降临地球，人类面临灭顶之灾。前特种兵王晨意外获得了虫族女王的基因，拥有了控制部分虫族的能力。他将带领人类打响反击战。', status: '连载中', clickCount: 234000, collectCount: 78000, catId: 2 },
  { title: '量子永生', author: '薛定谔的猫', intro: '天才物理学家林深在量子实验中意外身亡，意识却上传到了量子网络中。在这个虚拟的量子宇宙中，他发现自己拥有了近乎神的力量，但也发现了隐藏在现实世界背后的可怕真相。', status: '已完结', clickCount: 178000, collectCount: 64000, catId: 2 },
  { title: '第十三人', author: '夜半铃声', intro: '十二个陌生人被困在一座孤岛上，每过一小时就有一人死去。当尸体数量不断增加，幸存者们发现凶手就在他们之中。而最可怕的是——名单上本来就有十三个人。', status: '已完结', clickCount: 345000, collectCount: 125000, catId: 3 },
  { title: '消失的妻子', author: '迷雾重重', intro: '结婚三周年的那天早上，他的妻子像往常一样出门上班，然后就再也没有回来。监控录像显示她进了写字楼，但再也没有出来。整栋大楼被翻了个底朝天，妻子却像是人间蒸发了。', status: '连载中', clickCount: 289000, collectCount: 98000, catId: 3 },
  { title: '心理罪', author: '雷声大作', intro: '连环杀手在城市中肆虐，每次作案后都会在现场留下一串神秘的数字。犯罪心理学专家方木发现，这些数字指向的都是十年前的一桩悬案。而那个案子的凶手，至今仍逍遥法外。', status: '已完结', clickCount: 412000, collectCount: 143000, catId: 3 },
  { title: '午夜诊所', author: '不眠之夜', intro: '城市角落有一家只在午夜开门的诊所，据说能治任何病。调查记者林薇伪装成病人潜入诊所，却发现这里治疗的"病"远超常人想象。那些深夜来"看病"的人，第二天都像是换了一个人。', status: '连载中', clickCount: 156000, collectCount: 52000, catId: 3 },
  { title: '镜像', author: '镜中人', intro: '一天早上醒来，苏晓发现镜子里的自己在做不同的动作。起初只是细微的延迟，然后开始出现完全不同的行为。终于有一天，镜子里的人开口说话了："我们换一换吧。"', status: '已完结', clickCount: 198000, collectCount: 67000, catId: 3 },
  { title: '大明锦衣卫', author: '竹杖芒鞋', intro: '现代历史系研究生穿越到明朝嘉靖年间，成为了锦衣卫的一名小旗官。在这个权谋斗争的时代，他凭借超越时代的知识，一步步走上权力巅峰。', status: '连载中', clickCount: 345000, collectCount: 118000, catId: 4 },
  { title: '长安十二时辰', author: '马背上的诗人', intro: '上元节前夕，长安城混入可疑人员，身陷囹圄的前靖安司司丞李必临危受命，必须在十二时辰内拯救长安。然而他只有独眼死囚张小敬可以信任。', status: '已完结', clickCount: 520000, collectCount: 189000, catId: 4 },
  { title: '大秦帝国', author: '秦时明月', intro: '从一个被抛弃的秦国质子到一统天下的始皇帝，嬴政的传奇一生震撼人心。本书以严谨的历史考据为基础，还原大秦帝国从崛起到统一的全过程。', status: '已完结', clickCount: 890000, collectCount: 310000, catId: 4 },
  { title: '三国之重生刘禅', author: '键盘侠客', intro: '一个三国游戏策划穿越成了刘禅。此时刘备刚死，诸葛亮即将南征。面对这个烂摊子，身为阿斗的他该如何翻身？五虎将尚存、卧龙凤雏俱在，看我阿斗如何逆天改命！', status: '连载中', clickCount: 298000, collectCount: 97000, catId: 4 },
  { title: '大唐不良人', author: '长安故里', intro: '唐朝武则天时期，洛阳城中出现了一个神秘组织"不良人"。主角陈凡身为不良人一员，游走在朝堂与江湖之间，揭开一件件惊天大案背后的真相。', status: '连载中', clickCount: 212000, collectCount: 73000, catId: 4 },
  { title: '全职高手之再临', author: '蝴蝶蓝', intro: '被俱乐部驱逐的电竞大神叶修，栖身于一家网吧，从零开始重新征战荣耀。十年荣耀，一如既往。这一次，他要带着一把自制银武千机伞，重回巅峰！', status: '已完结', clickCount: 1500000, collectCount: 520000, catId: 5 },
  { title: '穿越火线之枪王', author: '狙神降临', intro: '退役FPS职业选手林峰意外穿越进CF游戏世界。在这里，每一次死亡都是真实的。为了活下去，他必须赢得一百场排位赛。熟悉的枪械，陌生的战场，枪王归来！', status: '连载中', clickCount: 234000, collectCount: 81000, catId: 5 },
  { title: '我的世界：方块纪元', author: '史蒂夫', intro: '普通高中生李浩在玩Minecraft时突然被吸入了游戏世界。在这里，方块就是一切。他必须生存下去，建造自己的家园，探索未知的世界。而他渐渐发现，这个世界里不止他一个"玩家"。', status: '连载中', clickCount: 178000, collectCount: 62000, catId: 5 },
  { title: '王者荣耀：峡谷传奇', author: '王者归来', intro: '一个青铜菜鸟被神秘系统选中，成为了王者峡谷的英雄召唤师。他可以通过完成任务解锁所有英雄，在现实世界中召唤他们的力量。但在峡谷深处，一个古老的邪恶正在苏醒。', status: '已完结', clickCount: 198000, collectCount: 69000, catId: 5 },
  { title: 'EVE：星际商人', author: '加达里', intro: '在EVE Online的庞大宇宙中，一个默默无闻的矿工在一次偶然中发现了一处失落的上古遗迹。由此，他开启了成为银河系最大军火商的传奇之路。商业帝国VS军团战争，看星际商人如何搅动宇宙风云！', status: '连载中', clickCount: 156000, collectCount: 54000, catId: 5 },
]

// 构建完整 Novel 对象
export const NOVELS: Novel[] = RAW_NOVELS.map((n, i) => {
  const id = i + 1
  const catName = CATEGORIES.find(c => c.id === n.catId)?.name || ''
  return {
    id,
    title: n.title,
    author: n.author,
    cover: `/covers/${id}.png`,
    intro: n.intro,
    wordCount: 0, // 由章节动态计算
    status: n.status,
    clickCount: n.clickCount,
    collectCount: n.collectCount,
    categories: [catName],
    latestChapter: '',
    updateTime: '',
  }
})

// ---------- 章节内容生成（确定性，按 novelId + chapterNo）----------
const CHAPTER_SEEDS = [
  '夜深了，窗外的风吹动着窗帘，月光如水般倾泻进来。他坐在书桌前，台灯的光在纸上投下温暖的黄色光晕。手中的笔在纸上游走，写下那些无法用言语表达的情感。文字有一种神奇的力量，它能穿越时间和空间，把一个人的内心完完整整地呈现给另一个素未谋面的人。不知写了多久，窗外的天边已经泛起了鱼肚白。新的一天即将开始，而他在文字中找到了内心的平静。',
  '春天的阳光洒满了整条街道，两旁的梧桐树抽出了嫩绿的新芽。她沿着这条熟悉的路慢慢走着，看着来来往往的行人。这座城市每天都有新的故事在发生，而她只是其中一个微小的组成部分。但对她来说，每一个平凡的日子都值得被记住。她想，也许有一天，她也会成为别人故事里的一部分。',
  '秋天的风带着凉意，吹落了满树的黄叶。公园里的湖面泛着微波，倒映着天空中飘过的云朵。她坐在湖边的长椅上，看着一对老夫妻手牵手走过。不知道他们一起经历了多少风雨，才能在这暮年之时依然如此恩爱。也许，真正的爱情就是经过岁月的打磨后依然能紧握对方的手，不离不弃。',
  '夏天的暴雨来得毫无征兆。原本晴好的天空突然乌云密布，豆大的雨点噼里啪啦地砸下来。街上的行人纷纷跑进路边的商店避雨。只有他一个人站在雨中，任由雨水打湿了全身。有些回忆就像这场暴雨，来得猝不及防，让人无处躲藏。',
  '深夜的城市有一种独特的美。远处的霓虹灯闪烁不定，把夜空染成了五颜六色。高架桥上偶尔驶过的车辆打破了夜的寂静。他站在天台上，俯瞰着这座不眠的城市。每个人都有自己的故事，每个窗口后面都藏着一个不为人知的秘密。这座城市就像一个巨大的迷宫，而每个人都在寻找自己的出路。',
  '人生就像一条漫长的路，有平坦也有坎坷。每当我们以为走到尽头的时候，转个弯，又会看到新的风景。重要的是，无论经历了什么，都要保持向前走的力量。那些曾经的痛苦和迷茫，终将成为滋养我们成长的土壤。',
  '窗外的雨渐渐小了，滴滴答答的声音像是一首温柔的安眠曲。她靠在窗边，看着雨水在玻璃上划出的痕迹，思绪飘向了很远的地方。有些记忆就像这雨痕，看似模糊不清，却深深地刻在那里，从不曾消失。',
  '第一次遇见他的时候，是在一个普通的不能再普通的日子里。那天阳光很好，图书馆里的人不多，她选了个靠窗的座位坐下，旁边恰好是他。如果不是他那本掉落的书，也许他们这辈子都不会有任何交集。命运有时就是这样奇妙，一个微小的偶然，就能改变一生。',
  '经历了一天的忙碌，这座城市终于在夜幕中安静下来。高楼的灯光渐次熄灭，街道上的喧嚣化为寂静。他喜欢这个时候的城市，像一个放下所有防备的人，展露出最真实的一面。在这份宁静中，所有烦恼都显得不那么重要了。',
  '这个世界很大，大到有时候我们穷尽一生也无法踏遍每一个角落。但同时这个世界也很小，小到一个转身的距离就能遇见改变你一生的人。我们都在这浩瀚的宇宙中渺小地存在着，但对彼此来说，我们就是整个宇宙。',
]

const CHAPTER_TITLES = [
  '命运的转折', '初次相遇', '暗流涌动', '风雨欲来', '惊天秘密',
  '柳暗花明', '绝处逢生', '真相大白', '峰回路转', '尘埃落定',
]

function genChapterContent(novelId: number, chapterNo: number, segCount: number): string {
  const paragraphs: string[] = []
  for (let i = 0; i < segCount; i++) {
    const idx = (novelId * 7 + chapterNo * 13 + i * 31) % CHAPTER_SEEDS.length
    paragraphs.push('　　' + CHAPTER_SEEDS[idx])
  }
  return paragraphs.join('\n\n')
}

function genChapterTitle(novelId: number, chapterNo: number): string {
  // 首尾章用特殊标题，中间用数字标题
  if (chapterNo === 1) return '第一章　' + CHAPTER_TITLES[(novelId * 3) % CHAPTER_TITLES.length]
  const chCount = getChapterCount(novelId)
  if (chapterNo === chCount) return `第${chapterNo}章　${CHAPTER_TITLES[(novelId * 7 + 1) % CHAPTER_TITLES.length]}（终章）`
  if (chapterNo % 20 === 0) return `第${chapterNo}章　${CHAPTER_TITLES[(novelId + chapterNo) % CHAPTER_TITLES.length]}`
  return `第${chapterNo}章`
}

function getChapterCount(novelId: number): number {
  return 50 + ((novelId * 17 + 31) % 51) // 50~100
}

function genChapters(novelId: number): Chapter[] {
  const count = getChapterCount(novelId)
  const chapters: Chapter[] = []
  for (let i = 1; i <= count; i++) {
    const segCount = 5 + ((novelId * 3 + i * 7) % 6)
    const content = genChapterContent(novelId, i, segCount)
    const ch: Chapter = {
      id: novelId * 1000 + i,
      novelId,
      title: genChapterTitle(novelId, i),
      content,
      wordCount: content.replace(/\s/g, '').length,
      chapterNo: i,
    }
    chapters.push(ch)
  }
  // 设置 prevId/nextId
  for (let i = 0; i < chapters.length; i++) {
    if (i > 0) {
      chapters[i].prevId = chapters[i - 1].id
      chapters[i].prevTitle = chapters[i - 1].title
    }
    if (i < chapters.length - 1) {
      chapters[i].nextId = chapters[i + 1].id
      chapters[i].nextTitle = chapters[i + 1].title
    }
  }
  return chapters
}

// 内存缓存
const chaptersCache: Map<number, Chapter[]> = new Map()

export function getChapters(novelId: number): Chapter[] {
  if (chaptersCache.has(novelId)) return chaptersCache.get(novelId)!
  const chapters = genChapters(novelId)
  chaptersCache.set(novelId, chapters)
  // 更新小说字数
  const novel = NOVELS.find(n => n.id === novelId)
  if (novel) {
    novel.wordCount = chapters.reduce((s, c) => s + c.wordCount, 0)
    const last = chapters[chapters.length - 1]
    if (last) novel.latestChapter = last.title
  }
  return chapters
}

export function getChapter(novelId: number, chapterId: number): Chapter | undefined {
  return getChapters(novelId).find(c => c.id === chapterId)
}

// 章节目录（只返回标题信息，不含正文）
export function getChapterDirectory(novelId: number): Chapter[] {
  return getChapters(novelId).map(c => ({
    id: c.id, novelId: c.novelId, title: c.title,
    wordCount: c.wordCount, chapterNo: c.chapterNo,
  }))
}

// ---------- 预置评论 ----------
const RAW_COMMENTS = [
  { novelTitle: '大明锦衣卫', username: '墨染书虫', content: '太好看了！一口气看到凌晨三点！历史考据严谨，人物刻画也非常到位。', likes: 128 },
  { novelTitle: '长安十二时辰', username: '墨染书虫', content: '把长安城的繁华与暗流写得淋漓尽致，张小敬这个角色太有魅力了！', likes: 256 },
  { novelTitle: '大秦帝国', username: '墨染书虫', content: '大秦帝国系列永远的神！从商鞅变法到统一天下，看得热血沸腾！', likes: 89 },
  { novelTitle: '王者荣耀：峡谷传奇', username: '墨染书虫', content: '峡谷风云再起！把王者英雄带到现实世界，想象力满分！', likes: 156 },
  { novelTitle: '全职高手之再临', username: '墨染书虫', content: '荣耀十年，一如既往！叶修yyds！从零开始的热血故事永远看不腻。', likes: 512 },
  { novelTitle: '银河边缘', username: '追更达人', content: '硬核科幻！废弃空间站那段描写简直身临其境！', likes: 203 },
  { novelTitle: '机械纪元', username: '追更达人', content: 'AI觉醒的题材总能让人思考，当机器有了灵魂人类该如何自处？', likes: 167 },
  { novelTitle: '时间囚笼', username: '追更达人', content: '999次循环才发现真相，这个反转绝了！强推！', likes: 145 },
  { novelTitle: '全职高手之再临', username: '追更达人', content: '千机伞！龙抬头！每个技能名字都燃到爆炸！', likes: 398 },
  { novelTitle: 'EVE：星际商人', username: '追更达人', content: 'EVE背景的小说太少见了！星际商人的视角很新鲜！', likes: 134 },
  { novelTitle: '第十三人', username: '月下独酌', content: '孤岛模式+暴风雪山庄！恐怖感拉满了！', likes: 278 },
  { novelTitle: '消失的妻子', username: '月下独酌', content: '妻子进大楼后再也没出来，细思极恐！', likes: 189 },
  { novelTitle: '心理罪', username: '月下独酌', content: '方木破案环环相扣，雷声大作的悬疑写得真好！', likes: 156 },
  { novelTitle: '星河万里不及你', username: '月下独酌', content: '星际背景+灵魂互换+军旅甜宠，少将和元帅太好嗑了！', likes: 345 },
  { novelTitle: '将军在上我在下', username: '月下独酌', content: '女扮男装从军被大将军看穿却不拆穿，这个设定太甜了！', likes: 267 },
  { novelTitle: '三国之重生刘禅', username: '月下独酌', content: '阿斗逆天改命！五虎将+卧龙凤雏豪华阵容，这次三国不会再输了！', likes: 178 },
  { novelTitle: '穿越火线之枪王', username: '月下独酌', content: 'FPS职业选手穿越CF，每次死亡都是真的，好刺激！', likes: 142 },
  { novelTitle: '全职高手之再临', username: '月下独酌', content: '全职高手续作味道没变，十年荣耀一如既往！', likes: 488 },
]

export function getGlobalComments(): Comment[] {
  const stored = localStorage.getItem('novel-global-comments')
  if (stored) return JSON.parse(stored)

  const comments: Comment[] = RAW_COMMENTS.map((c, i) => {
    const novel = NOVELS.find(n => n.title === c.novelTitle)
    return {
      id: i + 1,
      userId: 0, // 预置
      username: c.username,
      avatar: '',
      novelId: novel?.id || 1,
      content: c.content,
      likeCount: c.likes,
      liked: false,
      createTime: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
    }
  })
  localStorage.setItem('novel-global-comments', JSON.stringify(comments))
  return comments
}

export function saveGlobalComments(comments: Comment[]) {
  localStorage.setItem('novel-global-comments', JSON.stringify(comments))
}

// ---------- localStorage 工具 ----------
export function loadFromLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch { return fallback }
}

export function saveToLS(key: string, data: unknown) {
  localStorage.setItem(key, JSON.stringify(data))
}

export function uid(): number {
  return Date.now() + Math.floor(Math.random() * 100000)
}
