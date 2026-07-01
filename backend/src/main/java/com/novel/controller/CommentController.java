package com.novel.controller;

import com.novel.common.Result;
import com.novel.dto.CommentRequest;
import com.novel.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/novel/{novelId}")
    public Result<?> list(@PathVariable Long novelId,
                          @RequestParam(defaultValue = "1") Integer page,
                          @RequestParam(defaultValue = "10") Integer pageSize,
                          Authentication auth) {
        Long userId = auth != null ? (Long) auth.getPrincipal() : null;
        return Result.ok(commentService.list(userId, novelId, page, pageSize));
    }

    @PostMapping
    public Result<?> add(Authentication auth, @RequestParam Long novelId,
                         @RequestBody CommentRequest request) {
        Long userId = (Long) auth.getPrincipal();
        commentService.add(userId, novelId, request);
        return Result.ok();
    }

    @PostMapping("/{id}/like")
    public Result<?> like(Authentication auth, @PathVariable Long id) {
        Long userId = (Long) auth.getPrincipal();
        commentService.like(userId, id);
        return Result.ok();
    }
}
