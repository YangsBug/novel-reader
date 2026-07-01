package com.novel.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.novel.entity.Bookshelf;
import com.novel.entity.User;
import com.novel.mapper.BookshelfMapper;
import com.novel.mapper.UserMapper;
import com.novel.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final BookshelfMapper bookshelfMapper;

    @Override
    public User profile(Long userId) {
        User user = userMapper.selectById(userId);
        if (user == null) throw new RuntimeException("用户不存在");
        user.setPassword(null);
        return user;
    }

    @Override
    public void update(Long userId, Map<String, Object> updates) {
        User user = userMapper.selectById(userId);
        if (user == null) throw new RuntimeException("用户不存在");
        if (updates.containsKey("nickname")) user.setNickname((String) updates.get("nickname"));
        if (updates.containsKey("avatar")) user.setAvatar((String) updates.get("avatar"));
        if (updates.containsKey("gender")) user.setGender((Integer) updates.get("gender"));
        if (updates.containsKey("intro")) user.setIntro((String) updates.get("intro"));
        userMapper.updateById(user);
    }

    @Override
    public Map<String, Object> stats(Long userId) {
        long totalBooks = bookshelfMapper.selectCount(new LambdaQueryWrapper<Bookshelf>()
                .eq(Bookshelf::getUserId, userId));
        long readingBooks = bookshelfMapper.selectCount(new LambdaQueryWrapper<Bookshelf>()
                .eq(Bookshelf::getUserId, userId).eq(Bookshelf::getCategory, "READING"));
        long finishedBooks = bookshelfMapper.selectCount(new LambdaQueryWrapper<Bookshelf>()
                .eq(Bookshelf::getUserId, userId).eq(Bookshelf::getCategory, "READ"));
        long wantBooks = bookshelfMapper.selectCount(new LambdaQueryWrapper<Bookshelf>()
                .eq(Bookshelf::getUserId, userId).eq(Bookshelf::getCategory, "WANT_READ"));

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalBooks", totalBooks);
        stats.put("readingBooks", readingBooks);
        stats.put("finishedBooks", finishedBooks);
        stats.put("wantBooks", wantBooks);
        return stats;
    }
}
