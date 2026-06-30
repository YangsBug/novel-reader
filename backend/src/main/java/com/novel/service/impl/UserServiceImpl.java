package com.novel.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.novel.dto.UpdateUserDTO;
import com.novel.dto.UserStatsDTO;
import com.novel.entity.Bookshelf;
import com.novel.entity.User;
import com.novel.mapper.BookshelfMapper;
import com.novel.mapper.UserMapper;
import com.novel.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final BookshelfMapper bookshelfMapper;

    @Override
    public User profile(Long userId) {
        User user = userMapper.selectById(userId);
        if (user != null) user.setPassword(null);
        return user;
    }

    @Override
    public void update(Long userId, UpdateUserDTO dto) {
        User user = userMapper.selectById(userId);
        if (dto.getNickname() != null) user.setNickname(dto.getNickname());
        if (dto.getAvatar() != null) user.setAvatar(dto.getAvatar());
        if (dto.getGender() != null) user.setGender(dto.getGender());
        if (dto.getIntro() != null) user.setIntro(dto.getIntro());
        if (dto.getEmail() != null) {
            if (userMapper.selectCount(new LambdaQueryWrapper<User>()
                    .eq(User::getEmail, dto.getEmail())
                    .ne(User::getId, userId)) > 0) {
                throw new RuntimeException("邮箱已被使用");
            }
            user.setEmail(dto.getEmail());
        }
        userMapper.updateById(user);
    }

    @Override
    public UserStatsDTO stats(Long userId) {
        long total = bookshelfMapper.selectCount(
                new LambdaQueryWrapper<Bookshelf>().eq(Bookshelf::getUserId, userId));
        long reading = bookshelfMapper.selectCount(
                new LambdaQueryWrapper<Bookshelf>().eq(Bookshelf::getUserId, userId).eq(Bookshelf::getCategory, "READING"));
        long finished = bookshelfMapper.selectCount(
                new LambdaQueryWrapper<Bookshelf>().eq(Bookshelf::getUserId, userId).eq(Bookshelf::getCategory, "READ"));
        long want = bookshelfMapper.selectCount(
                new LambdaQueryWrapper<Bookshelf>().eq(Bookshelf::getUserId, userId).eq(Bookshelf::getCategory, "WANT_READ"));
        return new UserStatsDTO(total, reading, finished, want);
    }
}
