package com.novel.dto;

import lombok.Data;

@Data
public class UpdateUserDTO {
    private String nickname;
    private String avatar;
    private Integer gender;
    private String intro;
    private String email;
}
