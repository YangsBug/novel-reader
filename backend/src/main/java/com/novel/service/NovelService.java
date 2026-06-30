package com.novel.service;

import com.novel.dto.NovelDTO;
import com.novel.dto.PageResult;
import com.novel.entity.Category;

import java.util.List;

public interface NovelService {
    PageResult<NovelDTO> list(int page, int pageSize, Long categoryId, String keyword, String sort);
    NovelDTO detail(Long id);
    List<NovelDTO> hot();
    List<Category> categories();
}
