package com.novel.service;

import com.novel.dto.ChapterDTO;
import com.novel.entity.Chapter;

import java.util.List;
import java.util.Map;

public interface ChapterService {
    List<ChapterDTO> directory(Long novelId);
    Map<String, Object> content(Long novelId, Long chapterId);
    Chapter findChapter(Long novelId, Integer chapterNo);
}
