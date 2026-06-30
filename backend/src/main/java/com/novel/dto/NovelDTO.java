package com.novel.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class NovelDTO {
    private Long id;
    private String title;
    private String author;
    private String cover;
    private String intro;
    private Integer wordCount;
    private String status;
    private Long clickCount;
    private Long collectCount;
    private LocalDateTime updateTime;
    private List<String> categories;
    private String latestChapter;
    private Long latestChapterId;
}
