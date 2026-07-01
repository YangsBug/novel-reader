package com.novel.controller;

import com.novel.common.Result;
import com.novel.dto.BookmarkRequest;
import com.novel.service.BookmarkService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookmarks")
@RequiredArgsConstructor
public class BookmarkController {

    private final BookmarkService bookmarkService;

    @GetMapping
    public Result<?> list(Authentication auth, @RequestParam Long novelId) {
        Long userId = (Long) auth.getPrincipal();
        return Result.ok(bookmarkService.list(userId, novelId));
    }

    @PostMapping
    public Result<?> add(Authentication auth, @RequestBody BookmarkRequest request) {
        Long userId = (Long) auth.getPrincipal();
        bookmarkService.add(userId, request);
        return Result.ok();
    }

    @DeleteMapping("/{id}")
    public Result<?> remove(@PathVariable Long id) {
        bookmarkService.remove(id);
        return Result.ok();
    }
}
