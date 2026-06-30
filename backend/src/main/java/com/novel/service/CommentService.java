package com.novel.service;

import com.novel.dto.CommentVO;
import com.novel.dto.PageResult;

public interface CommentService {
    PageResult<CommentVO> list(Long novelId, int page, int pageSize, Long userId);
    void add(Long userId, Long novelId, String content, Long parentId);
    void like(Long userId, Long commentId);
}
