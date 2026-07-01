-- ============================================
-- 星海阅读 种子数据（从原始 init.sql 迁移到 Supabase）
-- ============================================

-- 清空旧数据，确保干净重跑
TRUNCATE comment_likes, comments, bookmarks, reading_history, reading_progress, bookshelf, chapters, novel_categories, novels, categories RESTART IDENTITY CASCADE;

INSERT INTO categories (name, sort) VALUES
('言情', 1), ('科幻', 2), ('悬疑', 3), ('历史', 4), ('游戏', 5);

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

-- 小说-分类关联（id 1-5→言情, 6-10→科幻, 11-15→悬疑, 16-20→历史, 21-25→游戏）
INSERT INTO novel_categories (novel_id, category_id)
SELECT id, CASE
    WHEN id BETWEEN 1 AND 5 THEN 1
    WHEN id BETWEEN 6 AND 10 THEN 2
    WHEN id BETWEEN 11 AND 15 THEN 3
    WHEN id BETWEEN 16 AND 20 THEN 4
    WHEN id BETWEEN 21 AND 25 THEN 5
END FROM novels;

-- ============================================
-- Supabase 版章节生成（每本 50~100 章）
-- ============================================
DO $$
DECLARE
  novel_record RECORD;
  v_chapter_count INT;
  v_chapter_no INT;
  v_word_count INT;
  v_content TEXT;
  v_title TEXT;
  v_rand INT;
  v_seg INT;
  v_content_lines TEXT[];
BEGIN
  FOR novel_record IN SELECT id, title FROM novels ORDER BY id LOOP
    v_chapter_count := 50 + floor(random() * 51)::INT;
    v_chapter_no := 1;

    WHILE v_chapter_no <= v_chapter_count LOOP
      v_title := '第' || v_chapter_no || '章';
      v_seg := 5 + floor(random() * 6)::INT;
      v_content := '';

      FOR i IN 1..v_seg LOOP
        v_rand := floor(random() * 5)::INT;
        v_content_lines := ARRAY[
          CASE v_rand
            WHEN 0 THEN '夜深了，窗外的风吹动着窗帘，月光如水般倾泻进来。他坐在书桌前，台灯的光在纸上投下温暖的黄色光晕。手中的笔在纸上游走，写下那些无法用言语表达的情感。文字有一种神奇的力量，它能穿越时间和空间，把一个人的内心完完整整地呈现给另一个素未谋面的人。不知写了多久，窗外的天边已经泛起了鱼肚白。新的一天即将开始，而他在文字中找到了内心的平静。'
            WHEN 1 THEN '春天的阳光洒满了整条街道，两旁的梧桐树抽出了嫩绿的新芽。她沿着这条熟悉的路慢慢走着，看着来来往往的行人。这座城市每天都有新的故事在发生，而她只是其中一个微小的组成部分。但对她来说，每一个平凡的日子都值得被记住。她想，也许有一天，她也会成为别人故事里的一部分。'
            WHEN 2 THEN '秋天的风带着凉意，吹落了满树的黄叶。公园里的湖面泛着微波，倒映着天空中飘过的云朵。她坐在湖边的长椅上，看着一对老夫妻手牵手走过。不知道他们一起经历了多少风雨，才能在这暮年之时依然如此恩爱。也许，真正的爱情就是经过岁月的打磨后依然能紧握对方的手，不离不弃。'
            WHEN 3 THEN '夏天的暴雨来得毫无征兆。原本晴好的天空突然乌云密布，豆大的雨点噼里啪啦地砸下来。街上的行人纷纷跑进路边的商店避雨。只有他一个人站在雨中，任由雨水打湿了全身。有些回忆就像这场暴雨，来得猝不及防，让人无处躲藏。'
            ELSE '深夜的城市有一种独特的美。远处的霓虹灯闪烁不定，把夜空染成了五颜六色。高架桥上偶尔驶过的车辆打破了夜的寂静。他站在天台上，俯瞰着这座不眠的城市。每个人都有自己的故事，每个窗口后面都藏着一个不为人知的秘密。这座城市就像一个巨大的迷宫，而每个人都在寻找自己的出路。'
          END
        ];
        v_content := v_content || '　　' || v_content_lines[1];
        IF i < v_seg THEN
          v_content := v_content || E'\n\n';
        END IF;
      END LOOP;

      v_word_count := char_length(v_content);

      INSERT INTO chapters (novel_id, title, content, word_count, chapter_no)
      VALUES (novel_record.id, v_title, v_content, v_word_count, v_chapter_no);

      v_chapter_no := v_chapter_no + 1;
    END LOOP;

    -- 更新小说总字数
    UPDATE novels SET word_count = (
      SELECT COALESCE(SUM(word_count), 0) FROM chapters WHERE novel_id = novel_record.id
    ) WHERE id = novel_record.id;

  END LOOP;
END $$;

-- ============================================
-- 预置演示用户 + 评论（按书名查找 ID，不写死）
-- ============================================
DO $$
DECLARE
  u1 UUID; u2 UUID; u3 UUID;
  -- 书名→真实 ID
  v1 BIGINT; v5 BIGINT; v6 BIGINT; v7 BIGINT; v8 BIGINT;
  v11 BIGINT; v12 BIGINT; v13 BIGINT;
  v16 BIGINT; v17 BIGINT; v18 BIGINT; v19 BIGINT;
  v21 BIGINT; v22 BIGINT; v24 BIGINT; v25 BIGINT;
BEGIN
  -- 创建演示账号（不存在才建，幂等）
  SELECT id INTO u1 FROM auth.users WHERE email = 'reader1@demo.com' LIMIT 1;
  IF u1 IS NULL THEN
    u1 := gen_random_uuid();
    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
    VALUES ('00000000-0000-0000-0000-000000000000', u1, 'authenticated', 'authenticated', 'reader1@demo.com', crypt('demo123456', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"username":"墨染书虫"}', now(), now());
    INSERT INTO profiles (id, username, nickname, intro) VALUES (u1, '墨染书虫', '墨染书虫', '资深网络小说读者，阅文无数') ON CONFLICT (id) DO NOTHING;
  END IF;

  SELECT id INTO u2 FROM auth.users WHERE email = 'reader2@demo.com' LIMIT 1;
  IF u2 IS NULL THEN
    u2 := gen_random_uuid();
    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
    VALUES ('00000000-0000-0000-0000-000000000000', u2, 'authenticated', 'authenticated', 'reader2@demo.com', crypt('demo123456', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"username":"追更达人"}', now(), now());
    INSERT INTO profiles (id, username, nickname, intro) VALUES (u2, '追更达人', '追更达人', '好书就要追到底') ON CONFLICT (id) DO NOTHING;
  END IF;

  SELECT id INTO u3 FROM auth.users WHERE email = 'reader3@demo.com' LIMIT 1;
  IF u3 IS NULL THEN
    u3 := gen_random_uuid();
    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
    VALUES ('00000000-0000-0000-0000-000000000000', u3, 'authenticated', 'authenticated', 'reader3@demo.com', crypt('demo123456', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"username":"月下独酌"}', now(), now());
    INSERT INTO profiles (id, username, nickname, intro) VALUES (u3, '月下独酌', '月下独酌', '夜深人静时，一杯茶一本书') ON CONFLICT (id) DO NOTHING;
  END IF;

  -- 按书名查找真实 ID
  SELECT id INTO v1  FROM novels WHERE title = '星河万里不及你';
  SELECT id INTO v5  FROM novels WHERE title = '将军在上我在下';
  SELECT id INTO v6  FROM novels WHERE title = '银河边缘';
  SELECT id INTO v7  FROM novels WHERE title = '机械纪元';
  SELECT id INTO v8  FROM novels WHERE title = '时间囚笼';
  SELECT id INTO v11 FROM novels WHERE title = '第十三人';
  SELECT id INTO v12 FROM novels WHERE title = '消失的妻子';
  SELECT id INTO v13 FROM novels WHERE title = '心理罪';
  SELECT id INTO v16 FROM novels WHERE title = '大明锦衣卫';
  SELECT id INTO v17 FROM novels WHERE title = '长安十二时辰';
  SELECT id INTO v18 FROM novels WHERE title = '大秦帝国';
  SELECT id INTO v19 FROM novels WHERE title = '三国之重生刘禅';
  SELECT id INTO v21 FROM novels WHERE title = '全职高手之再临';
  SELECT id INTO v22 FROM novels WHERE title = '穿越火线之枪王';
  SELECT id INTO v24 FROM novels WHERE title = '王者荣耀：峡谷传奇';
  SELECT id INTO v25 FROM novels WHERE title = 'EVE：星际商人';

  -- 删除旧评论，重新插入
  DELETE FROM comments WHERE user_id IN (u1, u2, u3);

  INSERT INTO comments (user_id, novel_id, content, like_count) VALUES
    (u1, v16, '太好看了！一口气看到凌晨三点！历史考据严谨，人物刻画也非常到位。', 128),
    (u1, v17, '把长安城的繁华与暗流写得淋漓尽致，张小敬这个角色太有魅力了！', 256),
    (u1, v18, '大秦帝国系列永远的神！从商鞅变法到统一天下，看得热血沸腾！', 89),
    (u1, v24, '峡谷风云再起！把王者英雄带到现实世界，想象力满分！', 156),
    (u1, v21, '荣耀十年，一如既往！叶修yyds！从零开始的热血故事永远看不腻。', 512),
    (u2, v6, '硬核科幻！废弃空间站那段描写简直身临其境！', 203),
    (u2, v7, 'AI觉醒的题材总能让人思考，当机器有了灵魂人类该如何自处？', 167),
    (u2, v8, '999次循环才发现真相，这个反转绝了！强推！', 145),
    (u2, v21, '千机伞！龙抬头！每个技能名字都燃到爆炸！', 398),
    (u2, v25, 'EVE背景的小说太少见了！星际商人的视角很新鲜！', 134),
    (u3, v11, '孤岛模式+暴风雪山庄！恐怖感拉满了！', 278),
    (u3, v12, '妻子进大楼后再也没出来，细思极恐！', 189),
    (u3, v13, '方木破案环环相扣，雷声大作的悬疑写得真好！', 156),
    (u3, v1, '星际背景+灵魂互换+军旅甜宠，少将和元帅太好嗑了！', 345),
    (u3, v5, '女扮男装从军被大将军看穿却不拆穿，这个设定太甜了！', 267),
    (u3, v19, '阿斗逆天改命！五虎将+卧龙凤雏豪华阵容，这次三国不会再输了！', 178),
    (u3, v22, 'FPS职业选手穿越CF，每次死亡都是真的，好刺激！', 142),
    (u3, v21, '全职高手续作味道没变，十年荣耀一如既往！', 488);
END $$;
