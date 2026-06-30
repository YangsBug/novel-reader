package com.novel.service;

import com.novel.dto.ReadingProgressDTO;
import com.novel.entity.ReadingProgress;

public interface ReadingProgressService {
    void save(Long userId, ReadingProgressDTO dto);
    ReadingProgress get(Long userId, Long novelId);
}
