package ru.flamexander.spring.security.jwt.entities;

import lombok.Data;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Data
@Table(name = "booking_tickets")
public class BookingTicket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "boarding_house_name")
    private String boardingHouseName;

    @Column(name = "user_full_name")
    private String userFullName;

    @Column(name = "room_name")
    private String roomName;

    @Column(name = "check_in_date")
    private LocalDate checkInDate;

    @Column(name = "check_out_date")
    private LocalDate checkOutDate;

    @Column(name = "price")
    private BigDecimal price;
}