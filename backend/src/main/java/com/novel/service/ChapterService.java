package com.novel.service;

import com.novel.entity.Chapter;
import java.util.List;

public interface ChapterService {
    List<Chapter> directory(Long novelId);
    Chapter content(Long novelId, Long chapterId);
}
