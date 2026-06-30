package com.novel.service.impl;

import cn.hutool.core.util.RandomUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.novel.common.ResultCode;
import com.novel.dto.LoginDTO;
import com.novel.dto.RegisterDTO;
import com.novel.entity.User;
import com.novel.mapper.UserMapper;
import com.novel.security.JwtTokenProvider;
import com.novel.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    @Autowired(required = false)
    private StringRedisTemplate redisTemplate;

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public AuthServiceImpl(UserMapper userMapper, PasswordEncoder passwordEncoder,
                           JwtTokenProvider jwtTokenProvider, AuthenticationManager authenticationManager) {
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.authenticationManager = authenticationManager;
    }

    @Override
    public Map<String, String> login(LoginDTO dto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getUsername(), dto.getPassword()));
        User user = userMapper.selectOne(
                new LambdaQueryWrapper<User>().eq(User::getUsername, dto.getUsername()));
        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", jwtTokenProvider.generateAccessToken(user.getId(), user.getUsername()));
        tokens.put("refreshToken", jwtTokenProvider.generateRefreshToken(user.getId()));
        tokens.put("userId", user.getId().toString());
        tokens.put("username", user.getUsername());
        tokens.put("avatar", user.getAvatar() != null ? user.getAvatar() : "");
        return tokens;
    }

    @Override
    public Map<String, String> register(RegisterDTO dto) {
        if (userMapper.selectCount(
                new LambdaQueryWrapper<User>().eq(User::getUsername, dto.getUsername())) > 0) {
            throw new RuntimeException(ResultCode.USERNAME_EXIST.getMessage());
        }
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setNickname(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setStatus(1);
        userMapper.insert(user);
        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", jwtTokenProvider.generateAccessToken(user.getId(), user.getUsername()));
        tokens.put("refreshToken", jwtTokenProvider.generateRefreshToken(user.getId()));
        tokens.put("userId", user.getId().toString());
        tokens.put("username", user.getUsername());
        return tokens;
    }

    @Override
    public Map<String, String> refreshToken(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken) || !jwtTokenProvider.isRefreshToken(refreshToken)) {
            throw new RuntimeException("无效的Refresh Token");
        }
        Long userId = jwtTokenProvider.getUserId(refreshToken);
        User user = userMapper.selectById(userId);
        if (user == null) throw new RuntimeException("用户不存在");
        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", jwtTokenProvider.generateAccessToken(userId, user.getUsername()));
        tokens.put("refreshToken", jwtTokenProvider.generateRefreshToken(userId));
        return tokens;
    }

    @Override
    public void sendVerifyCode(String email) {
        if (redisTemplate == null) {
            throw new RuntimeException("验证码功能暂未开放");
        }
        String code = RandomUtil.randomNumbers(6);
        redisTemplate.opsForValue().set("code:" + email, code, 5, TimeUnit.MINUTES);
        if (mailSender != null) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(email);
                message.setSubject("小说阅读平台 - 验证码");
                message.setText("您的验证码是：" + code + "，5分钟内有效。");
                mailSender.send(message);
            } catch (Exception e) {
                // 邮件发送失败不影响，验证码已存Redis
            }
        }
    }
}
