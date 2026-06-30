package com.novel.service;

import com.novel.dto.BookmarkDTO;
import com.novel.entity.Bookmark;

import java.util.List;

public interface BookmarkService {
    List<Bookmark> list(Long userId, Long novelId);
    void add(Long userId, BookmarkDTO dto);
    void remove(Long userId, Long id);
}
