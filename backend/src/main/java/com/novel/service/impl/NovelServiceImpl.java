package com.novel.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.novel.common.PageResult;
import com.novel.dto.NovelQuery;
import com.novel.entity.*;
import com.novel.mapper.*;
import com.novel.service.NovelService;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class NovelServiceImpl extends ServiceImpl<NovelMapper, Novel> implements NovelService {

    private final CategoryMapper categoryMapper;
    private final NovelCategoryMapper novelCategoryMapper;
    private final ChapterMapper chapterMapper;

    public NovelServiceImpl(CategoryMapper categoryMapper, NovelCategoryMapper ncMapper, ChapterMapper chapterMapper) {
        this.categoryMapper = categoryMapper;
        this.novelCategoryMapper = ncMapper;
        this.chapterMapper = chapterMapper;
    }

    @Override
    public PageResult<Novel> list(NovelQuery query) {
        LambdaQueryWrapper<Novel> wrapper = new LambdaQueryWrapper<>();

        // 分类筛选
        if (query.getCategoryId() != null) {
            List<Long> novelIds = novelCategoryMapper.selectList(
                    new LambdaQueryWrapper<NovelCategory>()
                            .eq(NovelCategory::getCategoryId, query.getCategoryId()))
                    .stream().map(NovelCategory::getNovelId).toList();
            if (novelIds.isEmpty()) {
                return PageResult.of(Collections.emptyList(), 0, query.getPage(), query.getPageSize());
            }
            wrapper.in(Novel::getId, novelIds);
        }

        // 关键词搜索
        if (query.getKeyword() != null && !query.getKeyword().isBlank()) {
            wrapper.and(w -> w.like(Novel::getTitle, query.getKeyword())
                    .or().like(Novel::getAuthor, query.getKeyword()));
        }

        // 排序
        if ("hot".equals(query.getSort())) {
            wrapper.orderByDesc(Novel::getClickCount);
        } else if ("collect".equals(query.getSort())) {
            wrapper.orderByDesc(Novel::getCollectCount);
        } else {
            wrapper.orderByDesc(Novel::getUpdatedAt);
        }

        Page<Novel> page = page(new Page<>(query.getPage(), query.getPageSize()), wrapper);

        // 加载分类名
        if (!page.getRecords().isEmpty()) {
            Map<Long, List<String>> catMap = loadCategoryMap(
                    page.getRecords().stream().map(Novel::getId).toList());
            // 使用 transient 或直接 ignore - 这里简单处理：不设置 categories 到 entity
            // 由 Controller 层进行转换
        }

        return PageResult.of(page.getRecords(), page.getTotal(), query.getPage(), query.getPageSize());
    }

    @Override
    public Novel detail(Long id) {
        Novel novel = getById(id);
        if (novel == null) throw new RuntimeException("小说不存在");
        // 更新点击量
        novel.setClickCount(novel.getClickCount() == null ? 1 : novel.getClickCount() + 1);
        updateById(novel);
        return novel;
    }

    @Override
    public List<Novel> hot() {
        return list(new LambdaQueryWrapper<Novel>().orderByDesc(Novel::getClickCount).last("LIMIT 10"));
    }

    @Override
    public List<Category> categories() {
        return categoryMapper.selectList(new LambdaQueryWrapper<Category>().orderByAsc(Category::getSort));
    }

    /** 批量加载小说分类名 */
    public Map<Long, List<String>> loadCategoryMap(List<Long> novelIds) {
        if (novelIds.isEmpty()) return Map.of();
        List<NovelCategory> ncs = novelCategoryMapper.selectList(
                new LambdaQueryWrapper<NovelCategory>().in(NovelCategory::getNovelId, novelIds));
        Set<Long> catIds = ncs.stream().map(NovelCategory::getCategoryId).collect(Collectors.toSet());
        Map<Long, String> catNameMap = categoryMapper.selectBatchIds(catIds)
                .stream().collect(Collectors.toMap(Category::getId, Category::getName));
        Map<Long, List<String>> result = new HashMap<>();
        for (NovelCategory nc : ncs) {
            result.computeIfAbsent(nc.getNovelId(), k -> new ArrayList<>())
                    .add(catNameMap.getOrDefault(nc.getCategoryId(), ""));
        }
        return result;
    }
}
