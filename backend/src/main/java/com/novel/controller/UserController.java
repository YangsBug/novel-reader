package com.novel.controller;

import com.novel.common.Result;
import com.novel.dto.UpdateUserDTO;
import com.novel.dto.UserStatsDTO;
import com.novel.entity.User;
import com.novel.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public Result<User> profile(Authentication auth) {
        Long userId = Long.parseLong(auth.getName());
        return Result.ok(userService.profile(userId));
    }

    @PutMapping("/profile")
    public Result<?> update(Authentication auth, @RequestBody UpdateUserDTO dto) {
        Long userId = Long.parseLong(auth.getName());
        userService.update(userId, dto);
        return Result.ok();
    }

    @GetMapping("/stats")
    public Result<UserStatsDTO> stats(Authentication auth) {
        Long userId = Long.parseLong(auth.getName());
        return Result.ok(userService.stats(userId));
    }
}
