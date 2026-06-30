package com.novel.dto;

import lombok.Data;

@Data
public class ReadingProgressDTO {
    private Long novelId;
    private Long chapterId;
    private Integer chapterNo;
    private Integer pageOffset;
}
