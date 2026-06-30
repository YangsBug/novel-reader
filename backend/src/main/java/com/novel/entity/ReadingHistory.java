package com.novel.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("reading_history")
public class ReadingHistory {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long userId;
    private Long novelId;
    private Long chapterId;
    private Integer chapterNo;
    private Integer isCurrent;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
}
