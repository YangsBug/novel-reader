package com.novel.security;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.novel.entity.User;
import com.novel.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserMapper userMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userMapper.selectOne(new LambdaQueryWrapper<User>().eq(User::getUsername, username));
        if (user == null) throw new UsernameNotFoundException("用户不存在");
        return new org.springframework.security.core.userdetails.User(
                user.getId().toString(), user.getPassword(), Collections.emptyList());
    }

    public UserDetails loadUserById(Long userId) {
        User user = userMapper.selectById(userId);
        if (user == null) throw new UsernameNotFoundException("用户不存在");
        return new org.springframework.security.core.userdetails.User(
                user.getId().toString(), user.getPassword(), Collections.emptyList());
    }
}
