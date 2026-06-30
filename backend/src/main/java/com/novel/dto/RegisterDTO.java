package com.novel.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterDTO {
    @NotBlank(message = "用户名不能为空")
    @Size(min = 3, max = 20)
    private String username;
    @NotBlank(message = "密码不能为空")
    @Size(min = 6, max = 20)
    private String password;
    private String email;
}
