package ru.flamexander.spring.security.jwt.dtos;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class BookingDto {
    private Long bookingId;
    private Long userId;
    private Long roomId;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private List<Long> serviceIds; // Список ID услуг, необязательное поле
    private BigDecimal totalSum;
    private String status;
}