package com.novel.dto;

import lombok.Data;

@Data
public class ChapterDTO {
    private Long id;
    private Long novelId;
    private String title;
    private Integer wordCount;
    private Integer chapterNo;
    private Long prevId;
    private Long nextId;
    private String prevTitle;
    private String nextTitle;
}
