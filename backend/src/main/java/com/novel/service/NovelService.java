package com.novel.service;

import com.novel.common.PageResult;
import com.novel.dto.NovelQuery;
import com.novel.entity.Category;
import com.novel.entity.Novel;

import java.util.List;

public interface NovelService {
    PageResult<Novel> list(NovelQuery query);
    Novel detail(Long id);
    List<Novel> hot();
    List<Category> categories();
}
