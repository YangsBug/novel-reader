/** 常用汉字字典：收录小说中常见生僻字、多音字 */

interface CharEntry {
  char: string
  pinyin: string
  strokes: number
  radical: string
  meaning: string
}

const charDict: Record<string, CharEntry> = {
  魑: { char: '魑', pinyin: 'chī', strokes: 19, radical: '鬼', meaning: '古代传说中的山神鬼怪，"魑魅魍魉"指各种妖怪' },
  魅: { char: '魅', pinyin: 'mèi', strokes: 14, radical: '鬼', meaning: '传说中的鬼怪；有吸引力，"魅力"指吸引人的力量' },
  魍: { char: '魍', pinyin: 'wǎng', strokes: 17, radical: '鬼', meaning: '传说中的精怪，"魍魉"指山川中的怪物' },
  魉: { char: '魉', pinyin: 'liǎng', strokes: 16, radical: '鬼', meaning: '传说中的精怪，常与"魍"连用' },
  饕: { char: '饕', pinyin: 'tāo', strokes: 22, radical: '食', meaning: '传说中的贪食恶兽，"饕餮"比喻贪吃的人或丰盛的宴席' },
  餮: { char: '餮', pinyin: 'tiè', strokes: 18, radical: '食', meaning: '传说中的贪食怪兽，与"饕"组成"饕餮"' },
  耄: { char: '耄', pinyin: 'mào', strokes: 10, radical: '老', meaning: '年老，八九十岁的年纪，"耄耋之年"指高龄' },
  耋: { char: '耋', pinyin: 'dié', strokes: 12, radical: '老', meaning: '年老，七八十岁的年纪，与"耄"连用指高龄老人' },
  觊: { char: '觊', pinyin: 'jì', strokes: 15, radical: '见', meaning: '希望得到，"觊觎"指非分地企图得到不属于自己的东西' },
  觎: { char: '觎', pinyin: 'yú', strokes: 13, radical: '见', meaning: '非分的希望，与"觊"组成"觊觎"' },
  鼐: { char: '鼐', pinyin: 'nài', strokes: 14, radical: '鼎', meaning: '大鼎，古代煮食物的大锅' },
  龘: { char: '龘', pinyin: 'dá', strokes: 51, radical: '龙', meaning: '龙腾飞的样子，"龙行龘龘"形容龙飞行的气势' },
  纛: { char: '纛', pinyin: 'dào', strokes: 24, radical: '纟', meaning: '古代军队或仪仗队的大旗，如"大纛"' },
  夔: { char: '夔', pinyin: 'kuí', strokes: 20, radical: '夊', meaning: '传说中的独脚怪兽；也指古代乐官名' },
  鼋: { char: '鼋', pinyin: 'yuán', strokes: 12, radical: '黾', meaning: '一种大型淡水龟，俗称"癞头鼋"' },
  爨: { char: '爨', pinyin: 'cuàn', strokes: 30, radical: '火', meaning: '烧火做饭；也作姓氏' },
  豳: { char: '豳', pinyin: 'bīn', strokes: 17, radical: '豕', meaning: '古地名，在今陕西；《诗经》中有"豳风"' },
  皛: { char: '皛', pinyin: 'xiǎo', strokes: 15, radical: '白', meaning: '洁白明亮的样子' },
  翯: { char: '翯', pinyin: 'hè', strokes: 16, radical: '羽', meaning: '羽毛洁白润泽的样子' },
  翙: { char: '翙', pinyin: 'huì', strokes: 15, radical: '羽', meaning: '鸟飞时翅膀扇动的声音' },
  垚: { char: '垚', pinyin: 'yáo', strokes: 9, radical: '土', meaning: '山高的样子，常用于人名' },
  焱: { char: '焱', pinyin: 'yàn', strokes: 12, radical: '火', meaning: '火花、火焰，形容光彩闪耀' },
  燚: { char: '燚', pinyin: 'yì', strokes: 16, radical: '火', meaning: '火势猛烈的样子，常用于人名' },
  茕: { char: '茕', pinyin: 'qióng', strokes: 8, radical: '艹', meaning: '孤独、无依无靠，"茕茕孑立"形容孤苦伶仃' },
  旮: { char: '旮', pinyin: 'gā', strokes: 6, radical: '日', meaning: '"旮旯"指角落、偏僻的地方' },
  旯: { char: '旯', pinyin: 'lá', strokes: 6, radical: '日', meaning: '与"旮"组成"旮旯"，指角落' },
  旖: { char: '旖', pinyin: 'yǐ', strokes: 14, radical: '方', meaning: '"旖旎"指柔和美好，多形容风光' },
  旎: { char: '旎', pinyin: 'nǐ', strokes: 12, radical: '方', meaning: '与"旖"组成"旖旎"，风光柔美的样子' },
  毳: { char: '毳', pinyin: 'cuì', strokes: 12, radical: '毛', meaning: '鸟兽的细毛；也指毛织物' },
  羴: { char: '羴', pinyin: 'shān', strokes: 18, radical: '羊', meaning: '羊身上的气味，同"膻"' },
  骉: { char: '骉', pinyin: 'biāo', strokes: 20, radical: '马', meaning: '万马奔腾的样子' },
  鱻: { char: '鱻', pinyin: 'xiān', strokes: 33, radical: '鱼', meaning: '同"鲜"，新鲜，味道鲜美' },
  劦: { char: '劦', pinyin: 'xié', strokes: 6, radical: '力', meaning: '合力、同力' },
  赑: { char: '赑', pinyin: 'bì', strokes: 12, radical: '贝', meaning: '"赑屃"是传说中的龙子之一，形似龟，好负重' },
  屃: { char: '屃', pinyin: 'xì', strokes: 7, radical: '尸', meaning: '与"赑"组成"赑屃"，龙之九子之一' },
  氤: { char: '氤', pinyin: 'yīn', strokes: 10, radical: '气', meaning: '"氤氲"指烟气弥漫的样子，也指天地之气交合' },
  氲: { char: '氲', pinyin: 'yūn', strokes: 14, radical: '气', meaning: '与"氤"组成"氤氲"，烟雾缭绕' },
  皈: { char: '皈', pinyin: 'guī', strokes: 9, radical: '白', meaning: '"皈依"指身心归向、依托，多指信仰佛教' },
  筚: { char: '筚', pinyin: 'bì', strokes: 12, radical: '竹', meaning: '用竹子编的篱笆或门，"筚路蓝缕"形容创业艰辛' },
  茀: { char: '茀', pinyin: 'fú', strokes: 7, radical: '艹', meaning: '杂草丛生的样子；也指道路上杂草多妨碍通行' },
  葳: { char: '葳', pinyin: 'wēi', strokes: 12, radical: '艹', meaning: '草木茂盛的样子，"葳蕤"形容枝叶繁茂' },
  蕤: { char: '蕤', pinyin: 'ruí', strokes: 15, radical: '艹', meaning: '草木的花下垂的样子，也指繁盛' },
  缱: { char: '缱', pinyin: 'qiǎn', strokes: 16, radical: '纟', meaning: '"缱绻"形容情意缠绵、难舍难分' },
  绻: { char: '绻', pinyin: 'quǎn', strokes: 11, radical: '纟', meaning: '与"缱"组成"缱绻"，情深意切' },
  婵: { char: '婵', pinyin: 'chán', strokes: 11, radical: '女', meaning: '"婵娟"指女子姿态美好；也代指月亮' },
  媛: { char: '媛', pinyin: 'yuàn / yuán', strokes: 12, radical: '女', meaning: '美女；"名媛"指名门闺秀。多音字' },
  娉: { char: '娉', pinyin: 'pīng', strokes: 10, radical: '女', meaning: '"娉婷"形容女子姿态优美' },
  婀: { char: '婀', pinyin: 'ē', strokes: 10, radical: '女', meaning: '"婀娜"形容女子身姿轻盈柔美' },
  娜: { char: '娜', pinyin: 'nà / nuó', strokes: 9, radical: '女', meaning: '多音字。nuó指柔美的样子；nà常用于音译人名' },
  珂: { char: '珂', pinyin: 'kē', strokes: 9, radical: '王', meaning: '像玉的美石；马笼头上的装饰' },
  璎: { char: '璎', pinyin: 'yīng', strokes: 20, radical: '王', meaning: '"璎珞"指用珠玉串成的颈饰' },
  珞: { char: '珞', pinyin: 'luò', strokes: 10, radical: '王', meaning: '与"璎"组成"璎珞"，珠玉颈饰' },
  珩: { char: '珩', pinyin: 'héng', strokes: 10, radical: '王', meaning: '佩玉上面的横玉，形状像磬' },
  璟: { char: '璟', pinyin: 'jǐng', strokes: 16, radical: '王', meaning: '玉的光彩，常用于人名' },
  琤: { char: '琤', pinyin: 'chēng', strokes: 10, radical: '王', meaning: '玉器相击发出的清脆声音' },
  珺: { char: '珺', pinyin: 'jùn', strokes: 11, radical: '王', meaning: '一种美玉，常用于人名' },

  // 多音字
  长: { char: '长', pinyin: 'cháng / zhǎng', strokes: 4, radical: '长', meaning: '多音字。cháng：长度、擅长；zhǎng：生长、长辈' },
  朝: { char: '朝', pinyin: 'cháo / zhāo', strokes: 12, radical: '月', meaning: '多音字。cháo：朝代、朝向；zhāo：早晨、朝霞' },
  重: { char: '重', pinyin: 'zhòng / chóng', strokes: 9, radical: '里', meaning: '多音字。zhòng：重量、重要；chóng：重复、重新' },
  传: { char: '传', pinyin: 'chuán / zhuàn', strokes: 6, radical: '亻', meaning: '多音字。chuán：传递、传播；zhuàn：传记、自传' },
  弹: { char: '弹', pinyin: 'tán / dàn', strokes: 11, radical: '弓', meaning: '多音字。tán：弹琴、弹劾；dàn：子弹、弹弓' },
  调: { char: '调', pinyin: 'tiáo / diào', strokes: 10, radical: '讠', meaning: '多音字。tiáo：调整、调和；diào：声调、调查' },
  觉: { char: '觉', pinyin: 'jué / jiào', strokes: 9, radical: '见', meaning: '多音字。jué：感觉、觉悟；jiào：睡觉' },
  乐: { char: '乐', pinyin: 'lè / yuè', strokes: 5, radical: '丿', meaning: '多音字。lè：快乐；yuè：音乐' },
  行: { char: '行', pinyin: 'xíng / háng', strokes: 6, radical: '行', meaning: '多音字。xíng：行走、行动；háng：银行、行业' },
  藏: { char: '藏', pinyin: 'cáng / zàng', strokes: 17, radical: '艹', meaning: '多音字。cáng：躲藏、收藏；zàng：西藏、宝藏' },
  降: { char: '降', pinyin: 'jiàng / xiáng', strokes: 8, radical: '阝', meaning: '多音字。jiàng：降落、降温；xiáng：投降、降服' },
  校: { char: '校', pinyin: 'xiào / jiào', strokes: 10, radical: '木', meaning: '多音字。xiào：学校；jiào：校对、校正' },
  盛: { char: '盛', pinyin: 'shèng / chéng', strokes: 11, radical: '皿', meaning: '多音字。shèng：茂盛、盛大；chéng：盛饭、盛放' },
  省: { char: '省', pinyin: 'shěng / xǐng', strokes: 9, radical: '目', meaning: '多音字。shěng：省份、节省；xǐng：反省、省亲' },
  着: { char: '着', pinyin: 'zhe / zháo / zhuó / zhāo', strokes: 11, radical: '目', meaning: '多音字。zhe：看着；zháo：着急；zhuó：着装；zhāo：着数' },
  折: { char: '折', pinyin: 'zhé / shé / zhē', strokes: 7, radical: '扌', meaning: '多音字。zhé：折扣、骨折；shé：折本、腿折了；zhē：折腾' },

  // 小说高频字
  殇: { char: '殇', pinyin: 'shāng', strokes: 9, radical: '歹', meaning: '未成年而死；也指为国家而死的人，如"国殇"' },
  殒: { char: '殒', pinyin: 'yǔn', strokes: 11, radical: '歹', meaning: '死亡，"殒命"指丧生，"香消玉殒"比喻年轻女子死亡' },
  殁: { char: '殁', pinyin: 'mò', strokes: 8, radical: '歹', meaning: '死，去世。常用于文言或正式场合' },
  殂: { char: '殂', pinyin: 'cú', strokes: 9, radical: '歹', meaning: '死亡，"崩殂"指帝王之死' },
  弑: { char: '弑', pinyin: 'shì', strokes: 12, radical: '弋', meaning: '臣子杀君主、子女杀父母，"弑君""弑父"' },
  谥: { char: '谥', pinyin: 'shì', strokes: 12, radical: '讠', meaning: '古代帝王/大臣死后给的称号，"谥号"' },
  祯: { char: '祯', pinyin: 'zhēn', strokes: 10, radical: '礻', meaning: '吉祥的征兆，常用于年号和名字' },
  胤: { char: '胤', pinyin: 'yìn', strokes: 9, radical: '月', meaning: '后代、后嗣，常用于人名' },
  夙: { char: '夙', pinyin: 'sù', strokes: 6, radical: '夕', meaning: '早晨；也指旧有的、平素的，"夙愿""夙夜"' },
  寐: { char: '寐', pinyin: 'mèi', strokes: 12, radical: '宀', meaning: '睡、入睡，"梦寐以求""夜不能寐"' },
  寤: { char: '寤', pinyin: 'wù', strokes: 14, radical: '宀', meaning: '睡醒；通"悟"，醒悟' },
  擢: { char: '擢', pinyin: 'zhuó', strokes: 17, radical: '扌', meaning: '提拔、选拔，"擢升""拔擢"' },
  黜: { char: '黜', pinyin: 'chù', strokes: 17, radical: '黑', meaning: '罢免、降职，"罢黜""废黜"' },
  陟: { char: '陟', pinyin: 'zhì', strokes: 9, radical: '阝', meaning: '登高、升迁，"陟罚臧否"指赏罚褒贬' },
  谪: { char: '谪', pinyin: 'zhé', strokes: 13, radical: '讠', meaning: '古代官员被降职并调到边远地区，"贬谪"' },
  簪: { char: '簪', pinyin: 'zān', strokes: 18, radical: '竹', meaning: '古人用来插定发髻的长针，"簪缨"指高官显贵' },
  缨: { char: '缨', pinyin: 'yīng', strokes: 14, radical: '纟', meaning: '帽带；也指穗状装饰物，"簪缨世家"' },
  珏: { char: '珏', pinyin: 'jué', strokes: 9, radical: '王', meaning: '合在一起的两块玉，常用于人名' },
  琬: { char: '琬', pinyin: 'wǎn', strokes: 12, radical: '王', meaning: '美玉的一种，上端浑圆，常用于人名' },
  璋: { char: '璋', pinyin: 'zhāng', strokes: 15, radical: '王', meaning: '一种珍贵的玉器，"弄璋之喜"指生男孩' },
  珮: { char: '珮', pinyin: 'pèi', strokes: 10, radical: '王', meaning: '佩戴在身上的玉饰，"环珮"' },
  琅: { char: '琅', pinyin: 'láng', strokes: 11, radical: '王', meaning: '一种美石；"琅琅"指清脆的声音如读书声' },
  瑀: { char: '瑀', pinyin: 'yǔ', strokes: 13, radical: '王', meaning: '像玉的石头，常用于人名' },
  瑁: { char: '瑁', pinyin: 'mào', strokes: 13, radical: '王', meaning: '古代天子所持的玉器，常用于人名' },
  璨: { char: '璨', pinyin: 'càn', strokes: 17, radical: '王', meaning: '美玉的光泽，"璀璨"形容光彩夺目' },
  斓: { char: '斓', pinyin: 'lán', strokes: 15, radical: '文', meaning: '颜色驳杂、灿烂多彩，"斑斓"' },
  煜: { char: '煜', pinyin: 'yù', strokes: 13, radical: '火', meaning: '照耀、明亮的样子，常用于人名' },
  烨: { char: '烨', pinyin: 'yè', strokes: 10, radical: '火', meaning: '火光盛大、光辉灿烂的样子' },
  熹: { char: '熹', pinyin: 'xī', strokes: 16, radical: '灬', meaning: '微明、天亮；也指炙热。常用于人名' },
  煦: { char: '煦', pinyin: 'xù', strokes: 13, radical: '灬', meaning: '温暖，"春风和煦"。常用于人名' },
  霁: { char: '霁', pinyin: 'jì', strokes: 14, radical: '雨', meaning: '雨后或雪后天晴，"光风霁月"比喻开阔胸襟' },
  霭: { char: '霭', pinyin: 'ǎi', strokes: 19, radical: '雨', meaning: '云气、烟雾，"暮霭沉沉"' },
  霂: { char: '霂', pinyin: 'mù', strokes: 15, radical: '雨', meaning: '小雨，常用于人名' },
  霙: { char: '霙', pinyin: 'yīng', strokes: 16, radical: '雨', meaning: '雪花；也指雨夹雪' },
  霆: { char: '霆', pinyin: 'tíng', strokes: 14, radical: '雨', meaning: '疾雷、霹雳，"雷霆万钧"形容威力极大' },
  霓: { char: '霓', pinyin: 'ní', strokes: 16, radical: '雨', meaning: '副虹，即彩虹的外环；"霓裳"指仙女的衣服' },
  峥: { char: '峥', pinyin: 'zhēng', strokes: 9, radical: '山', meaning: '"峥嵘"形容山高峻；比喻才气出众、不平凡' },
  嵘: { char: '嵘', pinyin: 'róng', strokes: 12, radical: '山', meaning: '与"峥"组成"峥嵘"，山势高峻；比喻突出' },
  巍: { char: '巍', pinyin: 'wēi', strokes: 20, radical: '山', meaning: '高大雄伟，"巍峨""巍然屹立"' },
  嶙: { char: '嶙', pinyin: 'lín', strokes: 15, radical: '山', meaning: '"嶙峋"形容山石突兀重叠；也形容人消瘦' },
  峋: { char: '峋', pinyin: 'xún', strokes: 9, radical: '山', meaning: '与"嶙"组成"嶙峋"，山石重叠不平' },
  潺: { char: '潺', pinyin: 'chán', strokes: 15, radical: '氵', meaning: '"潺潺"形容溪水、泉水流动的声音' },
  湫: { char: '湫', pinyin: 'qiū / jiǎo', strokes: 12, radical: '氵', meaning: '多音字。qiū：水潭、低洼；jiǎo：低下。常用于地名' },
  潋: { char: '潋', pinyin: 'liàn', strokes: 14, radical: '氵', meaning: '"潋滟"形容水波荡漾，波光相连' },
  滟: { char: '滟', pinyin: 'yàn', strokes: 13, radical: '氵', meaning: '与"潋"组成"潋滟"，水光闪动的样子' },
  漪: { char: '漪', pinyin: 'yī', strokes: 14, radical: '氵', meaning: '水面的波纹，"涟漪"形容微波荡漾' },
  渺: { char: '渺', pinyin: 'miǎo', strokes: 12, radical: '氵', meaning: '水势辽远；也形容微小、模糊，"渺小""虚无缥缈"' },
  瀚: { char: '瀚', pinyin: 'hàn', strokes: 19, radical: '氵', meaning: '广大、众多的样子，"浩瀚"形容水势或知识广博' },
  寰: { char: '寰', pinyin: 'huán', strokes: 16, radical: '宀', meaning: '广大的地域；"寰宇"指全世界、天下' },
  宸: { char: '宸', pinyin: 'chén', strokes: 10, radical: '宀', meaning: '帝王居住的地方，引申为帝王的代称。常用于人名' },
  苕: { char: '苕', pinyin: 'tiáo / sháo', strokes: 8, radical: '艹', meaning: '多音字。tiáo：凌霄花；sháo：甘薯。也常用于人名' },
}

/** 常用词语词典：收录小说中常见词/成语解释 */
const wordDict: Record<string, string> = {
  黎明: '天快要亮或刚刚亮的时候。"黎明前的黑暗"比喻最艰难的时刻。',
  晨曦: '清晨的第一缕阳光。',
  黄昏: '日落前后，天光渐暗的时段。',
  暮色: '傍晚昏暗的天色。',
  浩瀚: '水势盛大、广阔无边；也形容知识、数量极其丰富。',
  璀璨: '光彩鲜明、非常绚丽，常形容宝石、星辰或灯火。',
  缥缈: '隐隐约约、若有若无，多形容仙境或遥远不可捉摸的事物。',
  斑斓: '色彩错杂灿烂，"五彩斑斓"。',
  旖旎: '柔和美好，多形容风光秀丽。',
  缱绻: '情意缠绵、难舍难分，常形容恋情或友情。',
  峥嵘: '山势高峻；比喻才气、品格不平凡，或经历不凡。',
  蹉跎: '虚度光阴，"蹉跎岁月"。',
  踟蹰: '心里犹豫，徘徊不前。',
  徜徉: '安闲自在地散步、流连。',
  睥睨: '斜着眼睛看，表示傲视或厌恶。',
  踉跄: '走路不稳，身体摇晃。',
  耄耋: '形容年纪很大，八九十岁。',
  觊觎: '非分地希望得到不属于自己的东西。',
  饕餮: '传说中贪吃的怪兽；比喻贪吃的人或丰盛的宴席。',
  魑魅魍魉: '传说中各种害人的鬼怪；比喻形形色色的坏人。',
  夙愿: '一向怀着的愿望。',
  阴霾: '天空阴云密布；也比喻人心中郁闷、不快的气氛。',
  凛冽: '极为寒冷，刺骨的冷。',
  氤氲: '烟气、雾气弥漫的样子。',
  亵渎: '轻慢、不尊敬（常指对神圣的人或事物）。',
  桎梏: '脚镣和手铐；比喻束缚人或事物的枷锁。',
  涅槃: '佛教用语，指超脱生死的境界；也比喻重生、蜕变。',
  蛰伏: '动物冬眠潜伏；比喻人隐藏不出、积蓄力量。',
  韬光养晦: '隐藏才能，不使外露，等待时机。',
  殚精竭虑: '用尽精力，费尽心思。',
  处心积虑: '长期谋划（多含贬义）。',
  波澜壮阔: '形容水势浩大；比喻声势雄壮或规模宏大。',
  跌宕起伏: '形容事物变化多端，富于曲折。',
  柳暗花明: '形容柳树成荫、繁花似锦的春天景象；比喻困境中出现转机。',
  电光石火: '比喻事物转瞬即逝或行动极为迅速。',
  浮光掠影: '水面上的反光和一闪而过的影子；比喻观察不细致，印象不深。',
  沧海桑田: '大海变成农田，农田变成大海；比喻世事变化巨大。',
  镜花水月: '镜中花、水中月；比喻虚幻景象或难以得到的事物。',
}

export function lookupChar(char: string): CharEntry | null {
  return charDict[char] || null
}

export function lookupWord(word: string): string | null {
  // 优先完整匹配；未命中则尝试去除"的""了"等后缀
  const clean = word.replace(/[的了呢啊呀]/g, '')
  return wordDict[word] || wordDict[clean] || null
}

/** 获取汉字/词语的拼音和解释 */
export function explainChar(text: string): string {
  // 去除常见解释类前缀，如"解释黎明""解释一下黎明""什么是黎明"
  let query = text
    .replace(/^(解释一下|解释|说明一下|说明|介绍一下|介绍|讲讲|说说|什么是|什么叫|请解释|请说明|告诉我)\s*/g, '')
    // 在疑问/解释后缀前停止，如"黎明是什么意思""明字怎么读""黎明的含义"
    .replace(/\s*[是什怎何啥意义读音拼音的字词一下吗呢啊呀吧？\?].*$/g, '')
    .trim()

  // 提取开头的连续汉字
  const match = query.match(/^[\u4e00-\u9fff]+/)
  if (!match) return '请输入一个汉字或词语，我来帮你解释'

  const word = match[0]

  // 先查词语/成语
  const wordMeaning = lookupWord(word)
  if (wordMeaning) {
    return `【${word}】\n释义：${wordMeaning}`
  }

  // 单字：逐字解释
  if (word.length === 1) {
    const entry = lookupChar(word)
    if (!entry) {
      return `抱歉，我暂时不认识"${word}"字。你可以尝试换一个汉字，或者在其他字典中查阅 😊`
    }
    return [
      `【${entry.char}】`,
      `拼音：${entry.pinyin}`,
      `笔画：${entry.strokes}画`,
      `部首：${entry.radical}`,
      `释义：${entry.meaning}`,
    ].join('\n')
  }

  // 多字词：逐字解释
  const parts: string[] = [`【${word}】`]
  for (const ch of word) {
    const entry = lookupChar(ch)
    if (entry) {
      parts.push(`${entry.char}：${entry.pinyin}，${entry.meaning}`)
    }
  }
  if (parts.length > 1) {
    parts.push('\n这个词在小说里常用于描写环境或人物气质，可结合上下文理解。')
    return parts.join('\n')
  }

  return `抱歉，我暂时不认识"${word}"中的字。你可以尝试只发其中一个字。😊`
}

export default charDict
