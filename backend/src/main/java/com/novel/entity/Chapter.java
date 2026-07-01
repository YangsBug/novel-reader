package com.novel.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("chapters")
public class Chapter {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long novelId;
    private String title;
    private String content;
    private Integer wordCount;
    private Integer chapterNo;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
