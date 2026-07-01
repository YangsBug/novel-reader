package com.novel.service;

import com.novel.common.PageResult;
import com.novel.dto.CommentRequest;
import java.util.Map;

public interface CommentService {
    PageResult<Map<String, Object>> list(Long userId, Long novelId, Integer page, Integer pageSize);
    void add(Long userId, Long novelId, CommentRequest request);
    void like(Long userId, Long commentId);
}
