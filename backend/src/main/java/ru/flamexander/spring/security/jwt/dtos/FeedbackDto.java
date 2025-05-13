package ru.flamexander.spring.security.jwt.dtos;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackDto {
    private Long id;
    private Long userId;
    private String username; // Добавляем поле для хранения имени пользователя
    private String message;
    private String status;
    private String createdAt;
}