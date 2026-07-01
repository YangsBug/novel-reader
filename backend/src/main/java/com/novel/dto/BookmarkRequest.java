package com.novel.dto;

import lombok.Data;

@Data
public class BookmarkRequest {
    private Long novelId;
    private Long chapterId;
    private Integer chapterNo;
    private Integer pageOffset;
    private String note;
}
