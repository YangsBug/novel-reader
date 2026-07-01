package com.novel.dto;

import lombok.Data;

@Data
public class NovelQuery {
    private Integer page = 1;
    private Integer pageSize = 12;
    private Long categoryId;
    private String keyword;
    private String sort;
}
