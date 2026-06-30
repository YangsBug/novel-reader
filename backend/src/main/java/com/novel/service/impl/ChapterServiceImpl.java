package com.novel.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.novel.dto.ChapterDTO;
import com.novel.entity.Chapter;
import com.novel.mapper.ChapterMapper;
import com.novel.service.ChapterService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ChapterServiceImpl implements ChapterService {

    private final ChapterMapper chapterMapper;

    @Override
    public List<ChapterDTO> directory(Long novelId) {
        return chapterMapper.selectSimpleListByNovelId(novelId);
    }

    @Override
    public Map<String, Object> content(Long novelId, Long chapterId) {
        Chapter chapter = chapterMapper.selectById(chapterId);
        if (chapter == null || !chapter.getNovelId().equals(novelId))
            throw new RuntimeException("章节不存在");

        Chapter prev = chapterMapper.selectOne(new LambdaQueryWrapper<Chapter>()
                .eq(Chapter::getNovelId, novelId)
                .eq(Chapter::getChapterNo, chapter.getChapterNo() - 1));
        Chapter next = chapterMapper.selectOne(new LambdaQueryWrapper<Chapter>()
                .eq(Chapter::getNovelId, novelId)
                .eq(Chapter::getChapterNo, chapter.getChapterNo() + 1));

        return Map.of(
                "id", chapter.getId(),
                "novelId", chapter.getNovelId(),
                "title", chapter.getTitle(),
                "content", chapter.getContent(),
                "chapterNo", chapter.getChapterNo(),
                "wordCount", chapter.getWordCount(),
                "prevId", prev != null ? prev.getId() : 0,
                "prevTitle", prev != null ? prev.getTitle() : "",
                "nextId", next != null ? next.getId() : 0,
                "nextTitle", next != null ? next.getTitle() : ""
        );
    }

    @Override
    public Chapter findChapter(Long novelId, Integer chapterNo) {
        return chapterMapper.selectOne(new LambdaQueryWrapper<Chapter>()
                .eq(Chapter::getNovelId, novelId)
                .eq(Chapter::getChapterNo, chapterNo));
    }
}
