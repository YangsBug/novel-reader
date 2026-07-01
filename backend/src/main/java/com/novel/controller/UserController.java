package com.novel.controller;

import com.novel.common.Result;
import com.novel.entity.User;
import com.novel.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public Result<Map<String, Object>> profile(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        User user = userService.profile(userId);
        Map<String, Object> vo = toVO(user);
        return Result.ok(vo);
    }

    @PutMapping("/profile")
    public Result<?> update(Authentication auth, @RequestBody Map<String, Object> updates) {
        Long userId = (Long) auth.getPrincipal();
        userService.update(userId, updates);
        return Result.ok();
    }

    @GetMapping("/stats")
    public Result<Map<String, Object>> stats(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return Result.ok(userService.stats(userId));
    }

    private Map<String, Object> toVO(User user) {
        Map<String, Object> vo = new LinkedHashMap<>();
        vo.put("id", user.getId());
        vo.put("username", user.getUsername());
        vo.put("email", user.getUsername()); // 兼容前端用 username 当 email 显示
        vo.put("avatar", user.getAvatar());
        vo.put("nickname", user.getNickname());
        vo.put("gender", user.getGender());
        vo.put("intro", user.getIntro());
        vo.put("status", user.getStatus());
        vo.put("createTime", user.getCreatedAt() != null ? user.getCreatedAt().toString() : null);
        return vo;
    }
}
