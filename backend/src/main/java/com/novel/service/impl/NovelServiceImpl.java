package com.novel.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.novel.dto.NovelDTO;
import com.novel.dto.PageResult;
import com.novel.entity.*;
import com.novel.mapper.*;
import com.novel.service.NovelService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NovelServiceImpl implements NovelService {

    private final NovelMapper novelMapper;
    private final CategoryMapper categoryMapper;
    private final NovelCategoryMapper novelCategoryMapper;
    private final ChapterMapper chapterMapper;

    @Override
    public PageResult<NovelDTO> list(int page, int pageSize, Long categoryId, String keyword, String sort) {
        LambdaQueryWrapper<Novel> wrapper = new LambdaQueryWrapper<>();
        if (categoryId != null) {
            List<Long> novelIds = novelCategoryMapper.selectList(
                    new LambdaQueryWrapper<NovelCategory>().eq(NovelCategory::getCategoryId, categoryId))
                    .stream().map(NovelCategory::getNovelId).toList();
            if (novelIds.isEmpty()) {
                return new PageResult<>(List.of(), 0, page, pageSize);
            }
            wrapper.in(Novel::getId, novelIds);
        }
        if (keyword != null && !keyword.isBlank()) {
            wrapper.and(w -> w.like(Novel::getTitle, keyword).or().like(Novel::getAuthor, keyword));
        }
        if ("click".equals(sort)) wrapper.orderByDesc(Novel::getClickCount);
        else if ("new".equals(sort)) wrapper.orderByDesc(Novel::getUpdateTime);
        else wrapper.orderByDesc(Novel::getCollectCount);

        Page<Novel> p = novelMapper.selectPage(new Page<>(page, pageSize), wrapper);
        List<NovelDTO> list = p.getRecords().stream().map(this::toDTO).collect(Collectors.toList());
        return new PageResult<>(list, p.getTotal(), page, pageSize);
    }

    @Override
    public NovelDTO detail(Long id) {
        Novel novel = novelMapper.selectById(id);
        if (novel == null) throw new RuntimeException("小说不存在");
        novel.setClickCount(novel.getClickCount() + 1);
        novelMapper.updateById(novel);
        return toDTO(novel);
    }

    @Override
    public List<NovelDTO> hot() {
        List<Novel> novels = novelMapper.selectList(
                new LambdaQueryWrapper<Novel>().orderByDesc(Novel::getClickCount).last("LIMIT 10"));
        return novels.stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<Category> categories() {
        return categoryMapper.selectList(new LambdaQueryWrapper<Category>().orderByAsc(Category::getSort));
    }

    private NovelDTO toDTO(Novel novel) {
        NovelDTO dto = new NovelDTO();
        dto.setId(novel.getId());
        dto.setTitle(novel.getTitle());
        dto.setAuthor(novel.getAuthor());
        dto.setCover(novel.getCover());
        dto.setIntro(novel.getIntro());
        dto.setWordCount(novel.getWordCount());
        dto.setStatus(novel.getStatus());
        dto.setClickCount(novel.getClickCount());
        dto.setCollectCount(novel.getCollectCount());
        dto.setUpdateTime(novel.getUpdateTime());
        List<Long> catIds = novelMapper.selectCategoryIds(novel.getId());
        if (!catIds.isEmpty()) {
            dto.setCategories(categoryMapper.selectBatchIds(catIds).stream()
                    .map(Category::getName).collect(Collectors.toList()));
        }
        Chapter latest = chapterMapper.selectList(new LambdaQueryWrapper<Chapter>()
                .eq(Chapter::getNovelId, novel.getId())
                .orderByDesc(Chapter::getChapterNo).last("LIMIT 1"))
                .stream().findFirst().orElse(null);
        if (latest != null) {
            dto.setLatestChapter(latest.getTitle());
            dto.setLatestChapterId(latest.getId());
        }
        return dto;
    }
}
