package com.novel.controller;

import com.novel.common.Result;
import com.novel.dto.NovelDTO;
import com.novel.dto.PageResult;
import com.novel.entity.Category;
import com.novel.service.NovelService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class NovelController {

    private final NovelService novelService;

    @GetMapping("/novels")
    public Result<PageResult<NovelDTO>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "hot") String sort) {
        return Result.ok(novelService.list(page, pageSize, categoryId, keyword, sort));
    }

    @GetMapping("/novels/{id}")
    public Result<NovelDTO> detail(@PathVariable Long id) {
        return Result.ok(novelService.detail(id));
    }

    @GetMapping("/novels/hot")
    public Result<List<NovelDTO>> hot() {
        return Result.ok(novelService.hot());
    }

    @GetMapping("/categories")
    public Result<List<Category>> categories() {
        return Result.ok(novelService.categories());
    }
}
