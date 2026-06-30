package com.novel.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

@Data
@TableName("novel_categories")
public class NovelCategory {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long novelId;
    private Long categoryId;
}
