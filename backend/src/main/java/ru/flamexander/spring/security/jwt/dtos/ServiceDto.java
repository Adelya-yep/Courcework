package ru.flamexander.spring.security.jwt.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ServiceDto {
    private Long serviceId;
    private String serviceName;
    private Double servicePrice;
    private String imageUrl;
    private boolean pricePerPerson; // Новое поле для настраиваемости
}