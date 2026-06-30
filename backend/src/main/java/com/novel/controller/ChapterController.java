package com.novel.controller;

import com.novel.common.Result;
import com.novel.dto.ChapterDTO;
import com.novel.service.ChapterService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/novels/{novelId}/chapters")
@RequiredArgsConstructor
public class ChapterController {

    private final ChapterService chapterService;

    @GetMapping
    public Result<List<ChapterDTO>> directory(@PathVariable Long novelId) {
        return Result.ok(chapterService.directory(novelId));
    }

    @GetMapping("/{chapterId}")
    public Result<Map<String, Object>> content(@PathVariable Long novelId, @PathVariable Long chapterId) {
        return Result.ok(chapterService.content(novelId, chapterId));
    }
}
