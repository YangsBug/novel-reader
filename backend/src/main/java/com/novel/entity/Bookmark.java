package com.novel.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("bookmarks")
public class Bookmark {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long userId;
    private Long novelId;
    private Long chapterId;
    private Integer chapterNo;
    private Integer pageOffset;
    private String note;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
}
