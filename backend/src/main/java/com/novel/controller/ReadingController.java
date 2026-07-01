package com.novel.controller;

import com.novel.common.Result;
import com.novel.dto.ReadingRequest;
import com.novel.entity.ReadingProgress;
import com.novel.service.ReadingService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/reading")
@RequiredArgsConstructor
public class ReadingController {

    private final ReadingService readingService;

    @PostMapping("/progress")
    public Result<?> save(Authentication auth, @RequestBody ReadingRequest request) {
        Long userId = (Long) auth.getPrincipal();
        readingService.save(userId, request);
        return Result.ok();
    }

    @GetMapping("/progress/{novelId}")
    public Result<Map<String, Object>> get(Authentication auth, @PathVariable Long novelId) {
        Long userId = (Long) auth.getPrincipal();
        ReadingProgress rp = readingService.get(userId, novelId);
        if (rp == null) return Result.ok(null);
        Map<String, Object> vo = new LinkedHashMap<>();
        vo.put("id", rp.getId());
        vo.put("userId", rp.getUserId());
        vo.put("novelId", rp.getNovelId());
        vo.put("chapterId", rp.getChapterId());
        vo.put("chapterNo", rp.getChapterNo());
        vo.put("pageOffset", rp.getPageOffset());
        vo.put("updateTime", rp.getUpdatedAt() != null ? rp.getUpdatedAt().toString() : null);
        return Result.ok(vo);
    }
}
