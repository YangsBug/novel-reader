package com.novel.service;

import com.novel.dto.UpdateUserDTO;
import com.novel.dto.UserStatsDTO;
import com.novel.entity.User;

public interface UserService {
    User profile(Long userId);
    void update(Long userId, UpdateUserDTO dto);
    UserStatsDTO stats(Long userId);
}
