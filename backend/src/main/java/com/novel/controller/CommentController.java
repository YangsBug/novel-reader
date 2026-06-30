package com.novel.controller;

import com.novel.common.Result;
import com.novel.dto.CommentVO;
import com.novel.dto.PageResult;
import com.novel.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/novels/{novelId}/comments")
    public Result<PageResult<CommentVO>> list(@PathVariable Long novelId,
                                               @RequestParam(defaultValue = "1") int page,
                                               @RequestParam(defaultValue = "10") int pageSize,
                                               Authentication auth) {
        Long userId = auth != null ? Long.parseLong(auth.getName()) : null;
        return Result.ok(commentService.list(novelId, page, pageSize, userId));
    }

    @PostMapping("/novels/{novelId}/comments")
    public Result<?> add(@PathVariable Long novelId, Authentication auth,
                          @RequestBody Map<String, String> body) {
        Long userId = Long.parseLong(auth.getName());
        Long parentId = body.containsKey("parentId") ? Long.parseLong(body.get("parentId")) : null;
        commentService.add(userId, novelId, body.get("content"), parentId);
        return Result.ok();
    }

    @PostMapping("/comments/{id}/like")
    public Result<?> like(@PathVariable Long id, Authentication auth) {
        Long userId = Long.parseLong(auth.getName());
        commentService.like(userId, id);
        return Result.ok();
    }
}
