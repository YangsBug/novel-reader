package com.novel.config;

import com.novel.entity.Chapter;
import com.novel.entity.Novel;
import com.novel.mapper.ChapterMapper;
import com.novel.mapper.NovelMapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * H2 环境章节数据初始化器
 * 由于 H2 不支持 MySQL 存储过程，用 Java 代码生成章节内容
 * 仅在章节表为空时执行
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ChapterDataInitializer implements ApplicationRunner {

    private final ChapterMapper chapterMapper;
    private final NovelMapper novelMapper;

    private static final String[] TITLE_PARTS = {
            "命运的转折", "不速之客", "暗流涌动", "柳暗花明", "意外相遇",
            "风暴前夕", "险中求胜", "真相渐近", "峰回路转", "深夜来客",
            "破茧成蝶", "暗夜星辰", "波澜再起", "风起云涌", "绝处逢生",
            "迷雾重重", "步步惊心", "剑走偏锋", "生死时速", "新的征程"
    };

    private static final String[] PARAGRAPHS = {
            "天空阴沉沉的，厚重的云层压得很低，仿佛随时都会坠下来。街道两旁的梧桐树在风中摇曳，枯黄的叶子打着旋儿飘落。空气中弥漫着潮湿的气息，预示着即将到来的暴雨。他走在空旷的街道上，脚步声在寂静的巷子里回荡。已经记不清这是第几次在这条路上行走了，但每次的心情都不尽相同。转角处那家老旧的咖啡馆还亮着昏黄的灯，像是一座孤独的灯塔。时间在这一刻仿佛变得粘稠而缓慢。过往的记忆如潮水般涌来，那些曾经以为永远不会忘记的脸庞，如今却只剩下模糊的轮廓。也许这就是成长吧——学会和过去和解，学会接受所有的不完美。突然，一道闪电划破天际，照亮了整个城市。紧随而来的雷声震耳欲聋，仿佛要把这世界撕碎。雨点开始落下，起初稀疏，然后越来越密。他却没有加快脚步，任由雨水打湿衣衫。有时候，淋一场雨反而是一种解脱。",
            "雨后的城市格外清新。阳光穿透云层，在地面上投射出一道道金色的光束。街边的积水倒映着天空，像是被打碎的镜子。空气中有泥土和青草的味道，这是大自然最好的馈赠。她站在阳台上，深深地吸了一口气。楼下传来孩子们嬉闹的声音，远处有人在弹吉他，断断续续的旋律随风飘来。这样平凡的时刻，却让人感到无比珍贵。生命中有太多值得我们驻足的美好，只是我们常常走得太快，错过了沿途的风景。偶尔停下来，看看天空，听听风声，或许会发现生活远比想象中更加精彩。",
            "夜深了，整座城市安静下来。只有远处偶尔传来的汽车引擎声提醒着人们，这个世界从未真正入睡。他坐在书桌前，台灯的光在纸上投下温暖的黄色光晕。手中的笔在纸上游走，写下那些无法用言语表达的情感。文字有一种神奇的力量，它能穿越时间和空间，把一个人的内心完完整整地呈现给另一个素未谋面的人。不知写了多久，窗外的天边已经泛起了鱼肚白。新的一天即将开始，而他在文字中找到了内心的平静。",
            "春天来临时，整个城市都换了新装。公园里的樱花开了，粉白的花瓣在微风中飘落，像是下了一场温柔的雪。老人们坐在长椅上晒太阳，情侣们在花树下合影，一切都显得那么美好。她在花丛中漫步，感受着这个季节独有的温柔。脚下的草地已经返青，踩上去软绵绵的。远处有人在放风筝，彩色的风筝在蓝天上画出优美的弧线。这样的季节总是让人对未来充满希望。冬天再漫长，春天终究会到来。生命也是如此——在最黑暗的时刻，往往预示着黎明即将来临。",
            "世界很大，大到有些人一转身就是一辈子。世界也很小，小到在茫茫人海中，我们总能遇到那个命中注定的人。缘分这个词有时候真的很奇妙，它让你在最不经意的时候，遇见最特别的人。那年夏天特别热，蝉鸣声此起彼伏，像是在为夏天奏响最后的乐章。他们就是在这样一个普通的午后相遇的。没有小说里描写的惊心动魄，只是一个简单的眼神交汇，却足以改变两个人的一生。故事就这样开始了。"
    };

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        // 只初始化一次：检查是否已有章节
        Long count = chapterMapper.selectCount(new LambdaQueryWrapper<>());
        if (count != null && count > 0) {
            log.info("章节数据已存在 ({} 章)，跳过初始化", count);
            return;
        }

        log.info("开始生成章节数据...");
        List<Novel> novels = novelMapper.selectList(new LambdaQueryWrapper<>());
        Random random = new Random();
        AtomicInteger totalChapters = new AtomicInteger(0);

        for (Novel novel : novels) {
            int chapterCount = 50 + random.nextInt(51); // 50~100 章

            for (int chapterNo = 1; chapterNo <= chapterCount; chapterNo++) {
                String title = "第" + chapterNo + "章 " + TITLE_PARTS[random.nextInt(TITLE_PARTS.length)];

                StringBuilder content = new StringBuilder();
                int segCount = 4 + random.nextInt(5); // 4~8 段
                for (int j = 0; j < segCount; j++) {
                    content.append(PARAGRAPHS[random.nextInt(PARAGRAPHS.length)]).append("\n\n");
                }

                Chapter chapter = new Chapter();
                chapter.setNovelId(novel.getId());
                chapter.setTitle(title);
                chapter.setContent(content.toString());
                chapter.setWordCount(content.length());
                chapter.setChapterNo(chapterNo);
                chapterMapper.insert(chapter);
                totalChapters.incrementAndGet();
            }

            // 更新小说总字数
            novel.setWordCount((long) contentLengthSum(novel.getId()));
            novelMapper.updateById(novel);
        }

        log.info("章节数据初始化完成！共生成 {} 章", totalChapters.get());
    }

    private int contentLengthSum(Long novelId) {
        List<Chapter> chapters = chapterMapper.selectList(
                new LambdaQueryWrapper<Chapter>().eq(Chapter::getNovelId, novelId));
        return chapters.stream().mapToInt(c -> c.getContent() != null ? c.getContent().length() : 0).sum();
    }
}
