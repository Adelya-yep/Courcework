package ru.flamexander.spring.security.jwt.service;

import org.springframework.stereotype.Service;

@Service
public class AdminPanelService {
    public String getAdminData() {
        return "Данные для админ-панели";
    }
}