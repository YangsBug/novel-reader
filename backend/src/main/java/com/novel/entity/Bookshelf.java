package com.novel.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("bookshelf")
public class Bookshelf {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long userId;
    private Long novelId;
    private String category;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
}
