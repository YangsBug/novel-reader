package com.novel.dto;

import lombok.Data;

@Data
public class BookshelfVO {
    private Long id;
    private Long novelId;
    private String novelTitle;
    private String novelCover;
    private String novelAuthor;
    private String novelStatus;
    private String category;
    private Integer latestChapterNo;
    private String latestChapterTitle;
    private String progress;
    /** 用户实际读到的章节号（序号） */
    private Integer progressChapterNo;
    /** 用户实际读到的章节ID（数据库主键） */
    private Long progressChapterId;
    /** 第一章ID（数据库主键），用于无进度时跳转 */
    private Long firstChapterId;
}
