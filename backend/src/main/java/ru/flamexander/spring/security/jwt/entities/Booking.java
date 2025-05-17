package ru.flamexander.spring.security.jwt.entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "bookings")
@Getter
@Setter
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;

    @Column(name = "check_in_date")
    private LocalDate checkInDate;

    @Column(name = "check_out_date")
    private LocalDate checkOutDate;

    @ManyToMany
    @JoinTable(
            name = "booking_services",
            joinColumns = @JoinColumn(name = "booking_id"),
            inverseJoinColumns = @JoinColumn(name = "service_id")
    )
    private List<Services> services; // Массив услуг, может быть пустым

    @ElementCollection
    @CollectionTable(name = "booking_service_people", joinColumns = @JoinColumn(name = "booking_id"))
    @MapKeyColumn(name = "service_id")
    @Column(name = "people_count")
    private Map<Long, Integer> servicePeopleCounts; // Количество человек для каждой услуги

    @Column(name = "total_sum")
    private BigDecimal totalSum;

    @Column(name = "status")
    private String status = "PENDING"; // По умолчанию "PENDING"
}