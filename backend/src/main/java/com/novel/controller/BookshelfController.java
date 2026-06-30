package com.novel.controller;

import com.novel.common.Result;
import com.novel.dto.BookshelfVO;
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
    public Result<List<BookshelfVO>> list(Authentication auth,
                                           @RequestParam(required = false) String category) {
        Long userId = Long.parseLong(auth.getName());
        return Result.ok(bookshelfService.list(userId, category));
    }

    @PostMapping
    public Result<?> add(Authentication auth, @RequestBody Map<String, Long> body) {
        Long userId = Long.parseLong(auth.getName());
        bookshelfService.add(userId, body.get("novelId"));
        return Result.ok();
    }

    @PutMapping("/{id}")
    public Result<?> update(Authentication auth, @PathVariable Long id,
                             @RequestBody Map<String, String> body) {
        Long userId = Long.parseLong(auth.getName());
        bookshelfService.updateCategory(userId, id, body.get("category"));
        return Result.ok();
    }

    @DeleteMapping("/{novelId}")
    public Result<?> remove(Authentication auth, @PathVariable Long novelId) {
        Long userId = Long.parseLong(auth.getName());
        bookshelfService.remove(userId, novelId);
        return Result.ok();
    }
}
