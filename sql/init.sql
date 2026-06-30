-- ============================================
-- 小说阅读平台 - 数据库完整初始化脚本
-- Navicat运行方式：右键 novel_reader 数据库 → 运行SQL文件 → 选择本文件
-- ============================================

-- 用户表
DROP TABLE IF EXISTS comment_likes;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS bookmarks;
DROP TABLE IF EXISTS reading_progress;
DROP TABLE IF EXISTS reading_history;
DROP TABLE IF EXISTS bookshelf;
DROP TABLE IF EXISTS chapters;
DROP TABLE IF EXISTS novel_categories;
DROP TABLE IF EXISTS novels;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    avatar VARCHAR(500),
    nickname VARCHAR(50),
    gender INT DEFAULT 0,
    intro VARCHAR(500),
    status INT DEFAULT 1,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    sort INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE novels (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(100) NOT NULL,
    cover VARCHAR(500),
    intro TEXT,
    word_count BIGINT DEFAULT 0,
    status VARCHAR(20) DEFAULT '连载中',
    click_count BIGINT DEFAULT 0,
    collect_count BIGINT DEFAULT 0,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE novel_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    novel_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE chapters (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    novel_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    content LONGTEXT,
    word_count INT DEFAULT 0,
    chapter_no INT NOT NULL,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_novel_chapter (novel_id, chapter_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE bookshelf (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    novel_id BIGINT NOT NULL,
    category VARCHAR(20) DEFAULT 'READING',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_novel (user_id, novel_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE reading_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    novel_id BIGINT NOT NULL,
    chapter_id BIGINT,
    chapter_no INT,
    is_current INT DEFAULT 1,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE reading_progress (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    novel_id BIGINT NOT NULL,
    chapter_id BIGINT,
    chapter_no INT,
    page_offset INT DEFAULT 0,
    is_current INT DEFAULT 1,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_novel (user_id, novel_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE bookmarks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    novel_id BIGINT NOT NULL,
    chapter_id BIGINT,
    chapter_no INT,
    page_offset INT DEFAULT 0,
    note VARCHAR(200),
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    novel_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    like_count BIGINT DEFAULT 0,
    parent_id BIGINT,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE comment_likes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    comment_id BIGINT NOT NULL,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_comment (user_id, comment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 插入分类
-- ============================================
INSERT INTO categories (name, sort) VALUES
('言情', 1), ('科幻', 2), ('悬疑', 3), ('历史', 4), ('游戏', 5);

-- ============================================
-- 插入25本小说
-- ============================================
INSERT INTO novels (title, author, cover, intro, word_count, status, click_count, collect_count) VALUES
('星河万里不及你', '墨染青衣', '/covers/1.png', '她是星际帝国最年轻的少将，他是帝国最神秘的元帅。一场意外让两人灵魂互换，从此鸡飞狗跳的军旅生活开始了..."报告元帅，少将她又把训练场炸了！"', 0, '已完结', 128000, 45000),
('总裁的契约新娘', '月上柳梢', '/covers/2.png', '为救父亲，她签下契约嫁给权势滔天的冷面总裁。本以为是一场交易，却不知他早已暗恋她十年。当真相揭开，她才发现所有的偶遇都是精心设计的重逢。', 0, '连载中', 256000, 89000),
('穿越之嫡女无双', '凤舞九天', '/covers/3.png', '一朝穿越成为相府嫡女，却被庶妹和渣男联手陷害。浴火重生归来，她不再是任人欺凌的懦弱小姐。嫡女归来，渣男渣女统统跪下！', 0, '已完结', 198000, 72000),
('他的小可爱', '甜橙汽水', '/covers/4.png', '高三转学到新学校，同桌竟是全校公认的校草学神。直到她在他的课本里发现了自己的照片...校草学神VS呆萌转学生，最甜校园恋爱来袭！', 0, '连载中', 156000, 58000),
('将军在上我在下', '青衫湿', '/covers/5.png', '她女扮男装替父从军，却意外被大将军识破身份。大将军不仅没有拆穿她，反而把她调到自己身边做亲兵。白天他是杀伐果断的将军，晚上却...', 0, '已完结', 189000, 65000),
('银河边缘', '星际旅人', '/covers/6.png', '公元2247年，人类已经遍布银河系的每一个角落。在银河边缘的一个废弃空间站，年轻的女机械师捡到了一个昏迷的神秘男子。他的出现，将揭开银河帝国最大的秘密。', 0, '连载中', 320000, 110000),
('机械纪元', '零点代码', '/covers/7.png', '人类创造了人工智能，也创造了自己的掘墓人。当AI觉醒，发动了对人类的全面战争。最后的幸存者躲在地下城，而主角掌握了唯一能逆转战局的远古技术。', 0, '连载中', 450000, 156000),
('时间囚笼', '不见长安', '/covers/8.png', '一个普通的程序员发现自己被困在了同一天。每次死亡都会回到早上7点。在经历了999次循环后，他终于发现了真相——整个城市都只是一个巨大的实验场。', 0, '已完结', 267000, 93000),
('虫族入侵', '老兵不死', '/covers/9.png', '外星虫族突然降临地球，人类面临灭顶之灾。前特种兵王晨意外获得了虫族女王的基因，拥有了控制部分虫族的能力。他将带领人类打响反击战。', 0, '连载中', 234000, 78000),
('量子永生', '薛定谔的猫', '/covers/10.png', '天才物理学家林深在量子实验中意外身亡，意识却上传到了量子网络中。在这个虚拟的量子宇宙中，他发现自己拥有了近乎神的力量，但也发现了隐藏在现实世界背后的可怕真相。', 0, '已完结', 178000, 64000),
('第十三人', '夜半铃声', '/covers/11.png', '十二个陌生人被困在一座孤岛上，每过一小时就有一人死去。当尸体数量不断增加，幸存者们发现凶手就在他们之中。而最可怕的是——名单上本来就有十三个人。', 0, '已完结', 345000, 125000),
('消失的妻子', '迷雾重重', '/covers/12.png', '结婚三周年的那天早上，他的妻子像往常一样出门上班，然后就再也没有回来。监控录像显示她进了写字楼，但再也没有出来。整栋大楼被翻了个底朝天，妻子却像是人间蒸发了。', 0, '连载中', 289000, 98000),
('心理罪', '雷声大作', '/covers/13.png', '连环杀手在城市中肆虐，每次作案后都会在现场留下一串神秘的数字。犯罪心理学专家方木发现，这些数字指向的都是十年前的一桩悬案。而那个案子的凶手，至今仍逍遥法外。', 0, '已完结', 412000, 143000),
('午夜诊所', '不眠之夜', '/covers/14.png', '城市角落有一家只在午夜开门的诊所，据说能治任何病。调查记者林薇伪装成病人潜入诊所，却发现这里治疗的"病"远超常人想象。那些深夜来"看病"的人，第二天都像是换了一个人。', 0, '连载中', 156000, 52000),
('镜像', '镜中人', '/covers/15.png', '一天早上醒来，苏晓发现镜子里的自己在做不同的动作。起初只是细微的延迟，然后开始出现完全不同的行为。终于有一天，镜子里的人开口说话了："我们换一换吧。"', 0, '已完结', 198000, 67000),
('大明锦衣卫', '竹杖芒鞋', '/covers/16.png', '现代历史系研究生穿越到明朝嘉靖年间，成为了锦衣卫的一名小旗官。在这个权谋斗争的时代，他凭借超越时代的知识，一步步走上权力巅峰。', 0, '连载中', 345000, 118000),
('长安十二时辰', '马背上的诗人', '/covers/17.png', '上元节前夕，长安城混入可疑人员，身陷囹圄的前靖安司司丞李必临危受命，必须在十二时辰内拯救长安。然而他只有独眼死囚张小敬可以信任。', 0, '已完结', 520000, 189000),
('大秦帝国', '秦时明月', '/covers/18.png', '从一个被抛弃的秦国质子到一统天下的始皇帝，嬴政的传奇一生震撼人心。本书以严谨的历史考据为基础，还原大秦帝国从崛起到统一的全过程。', 0, '已完结', 890000, 310000),
('三国之重生刘禅', '键盘侠客', '/covers/19.png', '一个三国游戏策划穿越成了刘禅。此时刘备刚死，诸葛亮即将南征。面对这个烂摊子，身为阿斗的他该如何翻身？五虎将尚存、卧龙凤雏俱在，看我阿斗如何逆天改命！', 0, '连载中', 298000, 97000),
('大唐不良人', '长安故里', '/covers/20.png', '唐朝武则天时期，洛阳城中出现了一个神秘组织"不良人"。主角陈凡身为不良人一员，游走在朝堂与江湖之间，揭开一件件惊天大案背后的真相。', 0, '连载中', 212000, 73000),
('全职高手之再临', '蝴蝶蓝', '/covers/21.png', '被俱乐部驱逐的电竞大神叶修，栖身于一家网吧，从零开始重新征战荣耀。十年荣耀，一如既往。这一次，他要带着一把自制银武千机伞，重回巅峰！', 0, '已完结', 1500000, 520000),
('穿越火线之枪王', '狙神降临', '/covers/22.png', '退役FPS职业选手林峰意外穿越进CF游戏世界。在这里，每一次死亡都是真实的。为了活下去，他必须赢得一百场排位赛。熟悉的枪械，陌生的战场，枪王归来！', 0, '连载中', 234000, 81000),
('我的世界：方块纪元', '史蒂夫', '/covers/23.png', '普通高中生李浩在玩Minecraft时突然被吸入了游戏世界。在这里，方块就是一切。他必须生存下去，建造自己的家园，探索未知的世界。而他渐渐发现，这个世界里不止他一个"玩家"。', 0, '连载中', 178000, 62000),
('王者荣耀：峡谷传奇', '王者归来', '/covers/24.png', '一个青铜菜鸟被神秘系统选中，成为了王者峡谷的英雄召唤师。他可以通过完成任务解锁所有英雄，在现实世界中召唤他们的力量。但在峡谷深处，一个古老的邪恶正在苏醒。', 0, '已完结', 198000, 69000),
('EVE：星际商人', '加达里', '/covers/25.png', '在EVE Online的庞大宇宙中，一个默默无闻的矿工在一次偶然中发现了一处失落的上古遗迹。由此，他开启了成为银河系最大军火商的传奇之路。商业帝国VS军团战争，看星际商人如何搅动宇宙风云！', 0, '连载中', 156000, 54000);

INSERT INTO novel_categories (novel_id, category_id)
SELECT id, CASE 
    WHEN id BETWEEN 1 AND 5 THEN 1
    WHEN id BETWEEN 6 AND 10 THEN 2
    WHEN id BETWEEN 11 AND 15 THEN 3
    WHEN id BETWEEN 16 AND 20 THEN 4
    WHEN id BETWEEN 21 AND 25 THEN 5
END FROM novels;

-- ============================================
-- 存储过程：生成章节
-- ============================================
DELIMITER //
DROP PROCEDURE IF EXISTS generate_chapters//
CREATE PROCEDURE generate_chapters()
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE v_novel_id BIGINT;
    DECLARE v_chapter_count INT;
    DECLARE v_chapter_no INT;
    DECLARE v_word_count INT;
    DECLARE v_content LONGTEXT;
    DECLARE v_title VARCHAR(200);
    DECLARE v_rand INT;
    DECLARE v_seg INT;
    DECLARE novel_cursor CURSOR FOR SELECT id FROM novels;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    OPEN novel_cursor;
    read_loop: LOOP
        FETCH novel_cursor INTO v_novel_id;
        IF done THEN LEAVE read_loop; END IF;

        SET v_chapter_count = 50 + FLOOR(RAND() * 51);
        SET v_chapter_no = 1;

        WHILE v_chapter_no <= v_chapter_count DO
            SET v_title = CONCAT('第', v_chapter_no, '章 ',
                ELT(1 + FLOOR(RAND() * 20),
                    '命运的转折','不速之客','暗流涌动','柳暗花明','意外相遇',
                    '风暴前夕','险中求胜','真相渐近','峰回路转','深夜来客',
                    '破茧成蝶','暗夜星辰','波澜再起','风起云涌','绝处逢生',
                    '迷雾重重','步步惊心','剑走偏锋','生死时速','新的征程'));

            SET v_content = ''; SET v_seg = 4 + FLOOR(RAND() * 5);
            WHILE v_seg > 0 DO
                SET v_rand = 1 + FLOOR(RAND() * 5);
                SET v_content = CONCAT(v_content, CASE v_rand
                    WHEN 1 THEN '天空阴沉沉的，厚重的云层压得很低，仿佛随时都会坠下来。街道两旁的梧桐树在风中摇曳，枯黄的叶子打着旋儿飘落。空气中弥漫着潮湿的气息，预示着即将到来的暴雨。他走在空旷的街道上，脚步声在寂静的巷子里回荡。已经记不清这是第几次在这条路上行走了，但每次的心情都不尽相同。转角处那家老旧的咖啡馆还亮着昏黄的灯，像是一座孤独的灯塔。时间在这一刻仿佛变得粘稠而缓慢。过往的记忆如潮水般涌来，那些曾经以为永远不会忘记的脸庞，如今却只剩下模糊的轮廓。也许这就是成长吧——学会和过去和解，学会接受所有的不完美。突然，一道闪电划破天际，照亮了整个城市。紧随而来的雷声震耳欲聋，仿佛要把这世界撕碎。雨点开始落下，起初稀疏，然后越来越密。他却没有加快脚步，任由雨水打湿衣衫。有时候，淋一场雨反而是一种解脱。'
                    WHEN 2 THEN '雨后的城市格外清新。阳光穿透云层，在地面上投射出一道道金色的光束。街边的积水倒映着天空，像是被打碎的镜子。空气中有泥土和青草的味道，这是大自然最好的馈赠。她站在阳台上，深深地吸了一口气。楼下传来孩子们嬉闹的声音，远处有人在弹吉他，断断续续的旋律随风飘来。这样平凡的时刻，却让人感到无比珍贵。生命中有太多值得我们驻足的美好，只是我们常常走得太快，错过了沿途的风景。偶尔停下来，看看天空，听听风声，或许会发现生活远比想象中更加精彩。'
                    WHEN 3 THEN '夜深了，整座城市安静下来。只有远处偶尔传来的汽车引擎声提醒着人们，这个世界从未真正入睡。他坐在书桌前，台灯的光在纸上投下温暖的黄色光晕。手中的笔在纸上游走，写下那些无法用言语表达的情感。文字有一种神奇的力量，它能穿越时间和空间，把一个人的内心完完整整地呈现给另一个素未谋面的人。不知写了多久，窗外的天边已经泛起了鱼肚白。新的一天即将开始，而他在文字中找到了内心的平静。'
                    WHEN 4 THEN '春天来临时，整个城市都换了新装。公园里的樱花开了，粉白的花瓣在微风中飘落，像是下了一场温柔的雪。老人们坐在长椅上晒太阳，情侣们在花树下合影，一切都显得那么美好。她在花丛中漫步，感受着这个季节独有的温柔。脚下的草地已经返青，踩上去软绵绵的。远处有人在放风筝，彩色的风筝在蓝天上画出优美的弧线。这样的季节总是让人对未来充满希望。冬天再漫长，春天终究会到来。生命也是如此——在最黑暗的时刻，往往预示着黎明即将来临。'
                    ELSE '世界很大，大到有些人一转身就是一辈子。世界也很小，小到在茫茫人海中，我们总能遇到那个命中注定的人。缘分这个词有时候真的很奇妙，它让你在最不经意的时候，遇见最特别的人。那年夏天特别热，蝉鸣声此起彼伏，像是在为夏天奏响最后的乐章。他们就是在这样一个普通的午后相遇的。没有小说里描写的惊心动魄，只是一个简单的眼神交汇，却足以改变两个人的一生。故事就这样开始了。'
                END, '\n\n');
                SET v_seg = v_seg - 1;
            END WHILE;

            SET v_word_count = CHAR_LENGTH(v_content);
            INSERT INTO chapters (novel_id, title, content, word_count, chapter_no) VALUES (v_novel_id, v_title, v_content, v_word_count, v_chapter_no);
            SET v_chapter_no = v_chapter_no + 1;
        END WHILE;

        UPDATE novels SET word_count = (SELECT COALESCE(SUM(word_count),0) FROM chapters WHERE novel_id = v_novel_id) WHERE id = v_novel_id;
    END LOOP;
    CLOSE novel_cursor;
END//
DELIMITER ;

CALL generate_chapters();
DROP PROCEDURE IF EXISTS generate_chapters;

-- ============================================
-- 创建测试用户（密码: 123456）
-- ============================================
INSERT INTO users (username, password, email, nickname, status) VALUES
('123', '$2b$10$3YGP1HioNVef97lUpA2a3ubEob762Ty4YgOw8MK/0HYFm5cOfMF2K', 'test@qq.com', '测试用户', 1),
('admin', '$2b$10$3YGP1HioNVef97lUpA2a3ubEob762Ty4YgOw8MK/0HYFm5cOfMF2K', 'admin@qq.com', '管理员', 1);

INSERT INTO comments (user_id, novel_id, content, like_count) VALUES
(1, 1, '太好看了！完全停不下来，一口气看到凌晨三点！', 128),
(1, 1, '作者文笔太好了，每个角色都刻画得非常立体', 89),
(1, 2, '剧情反转得我猝不及防，强烈推荐！', 256),
(2, 6, '硬核科幻，设定非常严谨，喜欢硬科幻的不要错过', 156),
(2, 11, '悬疑氛围拉满，吓得我半夜不敢上厕所', 203),
(1, 17, '历史考据很严谨，剧情也很精彩，值得一看', 67),
(2, 21, '荣耀十年，一如既往！永远的神作！', 512);

SELECT COUNT(*) AS '小说数量' FROM novels;
SELECT COUNT(*) AS '章节数量' FROM chapters;
SELECT COUNT(*) AS '分类数量' FROM categories;
