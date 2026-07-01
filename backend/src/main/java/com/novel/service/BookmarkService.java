package com.novel.service;

import com.novel.dto.BookmarkRequest;
import com.novel.entity.Bookmark;
import java.util.List;

public interface BookmarkService {
    List<Bookmark> list(Long userId, Long novelId);
    void add(Long userId, BookmarkRequest request);
    void remove(Long id);
}
