package com.novel.controller;

import com.novel.common.Result;
import com.novel.dto.ReadingProgressDTO;
import com.novel.entity.ReadingProgress;
import com.novel.service.ReadingProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reading-progress")
@RequiredArgsConstructor
public class ReadingProgressController {

    private final ReadingProgressService progressService;

    @PostMapping
    public Result<?> save(Authentication auth, @RequestBody ReadingProgressDTO dto) {
        Long userId = Long.parseLong(auth.getName());
        progressService.save(userId, dto);
        return Result.ok();
    }

    @GetMapping("/{novelId}")
    public Result<ReadingProgress> get(Authentication auth, @PathVariable Long novelId) {
        Long userId = Long.parseLong(auth.getName());
        return Result.ok(progressService.get(userId, novelId));
    }
}
