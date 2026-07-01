package com.novel.service;

import com.novel.entity.User;
import java.util.Map;

public interface UserService {
    User profile(Long userId);
    void update(Long userId, Map<String, Object> updates);
    Map<String, Object> stats(Long userId);
}
