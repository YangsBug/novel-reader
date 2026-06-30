package com.novel.service;

import com.novel.dto.BookshelfVO;

import java.util.List;

public interface BookshelfService {
    List<BookshelfVO> list(Long userId, String category);
    void add(Long userId, Long novelId);
    void updateCategory(Long userId, Long id, String category);
    void remove(Long userId, Long novelId);
}
