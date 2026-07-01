package com.novel.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.novel.entity.*;
import com.novel.mapper.*;
import com.novel.service.BookshelfService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class BookshelfServiceImpl extends ServiceImpl<BookshelfMapper, Bookshelf> implements BookshelfService {

    private final NovelMapper novelMapper;
    private final ChapterMapper chapterMapper;
    private final ReadingProgressMapper progressMapper;

    public BookshelfServiceImpl(NovelMapper novelMapper, ChapterMapper chapterMapper,
                                ReadingProgressMapper progressMapper) {
        this.novelMapper = novelMapper;
        this.chapterMapper = chapterMapper;
        this.progressMapper = progressMapper;
    }

    @Override
    public List<Map<String, Object>> list(Long userId, String category) {
        LambdaQueryWrapper<Bookshelf> wrapper = new LambdaQueryWrapper<Bookshelf>()
                .eq(Bookshelf::getUserId, userId)
                .orderByDesc(Bookshelf::getCreatedAt);
        if (category != null && !category.isBlank()) {
            wrapper.eq(Bookshelf::getCategory, category);
        }
        List<Bookshelf> shelves = list(wrapper);
        if (shelves.isEmpty()) return Collections.emptyList();

        List<Long> novelIds = shelves.stream().map(Bookshelf::getNovelId).distinct().toList();

        // 小说信息
        Map<Long, Novel> novelMap = novelMapper.selectBatchIds(novelIds)
                .stream().collect(Collectors.toMap(Novel::getId, n -> n, (a, b) -> a));

        // 阅读进度
        List<ReadingProgress> progresses = progressMapper.selectList(
                new LambdaQueryWrapper<ReadingProgress>()
                        .eq(ReadingProgress::getUserId, userId)
                        .in(ReadingProgress::getNovelId, novelIds));
        Map<Long, ReadingProgress> progressMap = progresses.stream()
                .collect(Collectors.toMap(ReadingProgress::getNovelId, p -> p, (a, b) -> a));

        // 第一章
        List<Chapter> firstChapters = chapterMapper.selectList(
                new LambdaQueryWrapper<Chapter>()
                        .in(Chapter::getNovelId, novelIds)
                        .eq(Chapter::getChapterNo, 1));
        Map<Long, Chapter> firstChMap = firstChapters.stream()
                .collect(Collectors.toMap(Chapter::getNovelId, c -> c, (a, b) -> a));

        List<Map<String, Object>> result = new ArrayList<>();
        for (Bookshelf s : shelves) {
            Novel n = novelMap.get(s.getNovelId());
            if (n == null) continue;
            ReadingProgress p = progressMap.get(s.getNovelId());
            Chapter fc = firstChMap.get(s.getNovelId());

            Map<String, Object> item = new LinkedHashMap<>();
            item.put("id", s.getId());
            item.put("novelId", s.getNovelId());
            item.put("novelTitle", n.getTitle());
            item.put("novelCover", n.getCover());
            item.put("novelAuthor", n.getAuthor());
            item.put("novelStatus", n.getStatus());
            item.put("category", s.getCategory());
            item.put("progressChapterNo", p != null ? p.getChapterNo() : null);
            item.put("progressChapterId", p != null ? p.getChapterId() : null);
            item.put("firstChapterId", fc != null ? fc.getId() : null);
            item.put("latestChapterNo", p != null ? p.getChapterId() : (fc != null ? fc.getId() : null));
            item.put("latestChapterTitle", p != null ? "第" + p.getChapterNo() + "章" : null);
            if (p != null) item.put("progress", "第" + p.getChapterNo() + "章");

            result.add(item);
        }
        return result;
    }

    @Override
    @Transactional
    public void add(Long userId, Long novelId) {
        Bookshelf exist = getOne(new LambdaQueryWrapper<Bookshelf>()
                .eq(Bookshelf::getUserId, userId).eq(Bookshelf::getNovelId, novelId));
        if (exist == null) {
            Bookshelf bs = new Bookshelf();
            bs.setUserId(userId);
            bs.setNovelId(novelId);
            bs.setCategory("READING");
            save(bs);
        }
    }

    @Override
    public void update(Long id, String category) {
        update(new LambdaUpdateWrapper<Bookshelf>()
                .eq(Bookshelf::getId, id).set(Bookshelf::getCategory, category));
    }

    @Override
    public void remove(Long userId, Long novelId) {
        remove(new LambdaQueryWrapper<Bookshelf>()
                .eq(Bookshelf::getUserId, userId).eq(Bookshelf::getNovelId, novelId));
    }
}
