package com.novel.controller;

import com.novel.common.Result;
import com.novel.dto.BookmarkDTO;
import com.novel.entity.Bookmark;
import com.novel.service.BookmarkService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookmarks")
@RequiredArgsConstructor
public class BookmarkController {

    private final BookmarkService bookmarkService;

    @GetMapping
    public Result<List<Bookmark>> list(Authentication auth, @RequestParam Long novelId) {
        Long userId = Long.parseLong(auth.getName());
        return Result.ok(bookmarkService.list(userId, novelId));
    }

    @PostMapping
    public Result<?> add(Authentication auth, @RequestBody BookmarkDTO dto) {
        Long userId = Long.parseLong(auth.getName());
        bookmarkService.add(userId, dto);
        return Result.ok();
    }

    @DeleteMapping("/{id}")
    public Result<?> remove(Authentication auth, @PathVariable Long id) {
        Long userId = Long.parseLong(auth.getName());
        bookmarkService.remove(userId, id);
        return Result.ok();
    }
}
