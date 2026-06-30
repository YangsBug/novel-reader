package com.novel.common;

import lombok.Getter;

@Getter
public enum ResultCode {
    SUCCESS(200, "操作成功"),
    UNAUTHORIZED(401, "未登录或登录过期"),
    FORBIDDEN(403, "无权限"),
    NOT_FOUND(404, "资源不存在"),
    ERROR(500, "服务器内部错误"),
    PARAM_ERROR(400, "参数错误"),
    USERNAME_EXIST(1001, "用户名已存在"),
    EMAIL_EXIST(1002, "邮箱已被注册"),
    VERIFY_CODE_ERROR(1003, "验证码错误或已过期"),
    LOGIN_FAIL(1004, "用户名或密码错误"),
    TOKEN_EXPIRED(1005, "Token已过期"),
    ;

    private final int code;
    private final String message;

    ResultCode(int code, String message) {
        this.code = code;
        this.message = message;
    }
}
