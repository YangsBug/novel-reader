package com.novel.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("comments")
public class Comment {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long userId;
    private Long novelId;
    private String content;
    private Long likeCount;
    private Long parentId;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
}
