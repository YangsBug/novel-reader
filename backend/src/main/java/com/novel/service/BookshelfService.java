package com.novel.service;

import java.util.List;
import java.util.Map;

public interface BookshelfService {
    List<Map<String, Object>> list(Long userId, String category);
    void add(Long userId, Long novelId);
    void update(Long id, String category);
    void remove(Long userId, Long novelId);
}
