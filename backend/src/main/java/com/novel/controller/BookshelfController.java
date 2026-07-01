package com.novel.controller;

import com.novel.common.Result;
import com.novel.service.BookshelfService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookshelf")
@RequiredArgsConstructor
public class BookshelfController {

    private final BookshelfService bookshelfService;

    @GetMapping
    public Result<List<Map<String, Object>>> list(Authentication auth,
                                                   @RequestParam(required = false) String category) {
        Long userId = (Long) auth.getPrincipal();
        return Result.ok(bookshelfService.list(userId, category));
    }

    @PostMapping
    public Result<?> add(Authentication auth, @RequestBody Map<String, Long> body) {
        Long userId = (Long) auth.getPrincipal();
        bookshelfService.add(userId, body.get("novelId"));
        return Result.ok();
    }

    @PutMapping("/{id}")
    public Result<?> update(@PathVariable Long id, @RequestBody Map<String, String> body) {
        bookshelfService.update(id, body.get("category"));
        return Result.ok();
    }

    @DeleteMapping("/{novelId}")
    public Result<?> remove(Authentication auth, @PathVariable Long novelId) {
        Long userId = (Long) auth.getPrincipal();
        bookshelfService.remove(userId, novelId);
        return Result.ok();
    }
}
