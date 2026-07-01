package com.novel.service;

import com.novel.dto.ReadingRequest;
import com.novel.entity.ReadingProgress;

public interface ReadingService {
    void save(Long userId, ReadingRequest request);
    ReadingProgress get(Long userId, Long novelId);
}
