package com.novel.controller;

import com.novel.common.Result;
import com.novel.dto.NovelQuery;
import com.novel.entity.Category;
import com.novel.entity.Chapter;
import com.novel.entity.Novel;
import com.novel.service.ChapterService;
import com.novel.service.NovelService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class NovelController {

    private final NovelService novelService;
    private final ChapterService chapterService;

    @GetMapping("/novels")
    public Result<?> list(NovelQuery query) {
        var page = novelService.list(query);
        // 加载分类名
        List<Novel> records = page.getList();
        if (!records.isEmpty()) {
            Map<Long, List<String>> catMap = ((com.novel.service.impl.NovelServiceImpl) novelService)
                    .loadCategoryMap(records.stream().map(Novel::getId).toList());
            List<Map<String, Object>> voList = records.stream().map(n -> {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("id", n.getId());
                m.put("title", n.getTitle());
                m.put("author", n.getAuthor());
                m.put("cover", n.getCover());
                m.put("intro", n.getIntro());
                m.put("wordCount", n.getWordCount());
                m.put("status", n.getStatus());
                m.put("clickCount", n.getClickCount());
                m.put("collectCount", n.getCollectCount());
                m.put("updateTime", n.getUpdatedAt() != null ? n.getUpdatedAt().toString() : null);
                m.put("categories", catMap.getOrDefault(n.getId(), Collections.emptyList()));
                return m;
            }).collect(Collectors.toList());
            Map<String, Object> result = new LinkedHashMap<>();
            result.put("list", voList);
            result.put("total", page.getTotal());
            result.put("page", page.getPage());
            result.put("pageSize", page.getPageSize());
            return Result.ok(result);
        }
        return Result.ok(page);
    }

    @GetMapping("/novels/{id}")
    public Result<Map<String, Object>> detail(@PathVariable Long id) {
        Novel novel = novelService.detail(id);
        // 分类名
        Map<Long, List<String>> catMap = ((com.novel.service.impl.NovelServiceImpl) novelService)
                .loadCategoryMap(List.of(id));
        // 最新章节
        List<Chapter> chapters = chapterService.directory(id);
        Chapter lastCh = chapters.isEmpty() ? null : chapters.get(chapters.size() - 1);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", novel.getId());
        result.put("title", novel.getTitle());
        result.put("author", novel.getAuthor());
        result.put("cover", novel.getCover());
        result.put("intro", novel.getIntro());
        result.put("wordCount", novel.getWordCount());
        result.put("status", novel.getStatus());
        result.put("clickCount", novel.getClickCount());
        result.put("collectCount", novel.getCollectCount());
        result.put("updateTime", novel.getUpdatedAt() != null ? novel.getUpdatedAt().toString() : null);
        result.put("categories", catMap.getOrDefault(id, Collections.emptyList()));
        result.put("latestChapter", lastCh != null ? lastCh.getTitle() : null);
        result.put("latestChapterId", lastCh != null ? lastCh.getId() : null);

        return Result.ok(result);
    }

    @GetMapping("/novels/hot")
    public Result<List<Novel>> hot() {
        return Result.ok(novelService.hot());
    }

    @GetMapping("/categories")
    public Result<List<Category>> categories() {
        return Result.ok(novelService.categories());
    }

    @GetMapping("/novels/{novelId}/chapters")
    public Result<List<Map<String, Object>>> directory(@PathVariable Long novelId) {
        List<Chapter> chapters = chapterService.directory(novelId);
        List<Map<String, Object>> list = chapters.stream().map(c -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", c.getId());
            m.put("novelId", c.getNovelId());
            m.put("title", c.getTitle());
            m.put("wordCount", c.getWordCount());
            m.put("chapterNo", c.getChapterNo());
            return m;
        }).collect(Collectors.toList());
        return Result.ok(list);
    }

    @GetMapping("/novels/{novelId}/chapters/{chapterId}")
    public Result<Map<String, Object>> content(@PathVariable Long novelId, @PathVariable Long chapterId) {
        Chapter current = chapterService.content(novelId, chapterId);
        if (current == null) throw new RuntimeException("章节不存在");

        // 上一章 / 下一章
        List<Chapter> all = chapterService.directory(novelId);
        Chapter prev = null, next = null;
        for (int i = 0; i < all.size(); i++) {
            if (all.get(i).getId().equals(chapterId)) {
                if (i > 0) prev = all.get(i - 1);
                if (i < all.size() - 1) next = all.get(i + 1);
                break;
            }
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", current.getId());
        result.put("novelId", current.getNovelId());
        result.put("title", current.getTitle());
        result.put("content", current.getContent());
        result.put("wordCount", current.getWordCount());
        result.put("chapterNo", current.getChapterNo());
        result.put("prevId", prev != null ? prev.getId() : null);
        result.put("prevTitle", prev != null ? prev.getTitle() : null);
        result.put("nextId", next != null ? next.getId() : null);
        result.put("nextTitle", next != null ? next.getTitle() : null);

        return Result.ok(result);
    }
}
