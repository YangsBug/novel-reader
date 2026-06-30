package com.novel.service;

import com.novel.dto.LoginDTO;
import com.novel.dto.RegisterDTO;

import java.util.Map;

public interface AuthService {
    Map<String, String> login(LoginDTO dto);
    Map<String, String> register(RegisterDTO dto);
    Map<String, String> refreshToken(String refreshToken);
    void sendVerifyCode(String email);
}
