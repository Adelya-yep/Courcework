package ru.flamexander.spring.security.jwt.dtos;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public class BookingDto {
    private Long bookingId;
    private Long userId;
    private String username;
    private Long roomId;
    private String roomTitle;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;

    private List<Long> serviceIds; // Для приема ID от фронтенда при создании
    private List<ServiceDto> services; // Для отправки полных данных об услугах клиенту

    private Map<Long, Integer> servicePeopleCounts;
    private BigDecimal totalSum;
    private String status;
}
