package com.novel.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class CommentVO {
    private Long id;
    private Long userId;
    private String username;
    private String avatar;
    private Long novelId;
    private String content;
    private Long likeCount;
    private Boolean liked;
    private LocalDateTime createTime;
    private List<CommentVO> replies;
}
