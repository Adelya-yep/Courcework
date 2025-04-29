package ru.flamexander.spring.security.jwt.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.flamexander.spring.security.jwt.entities.BookingTicket;

public interface BookingTicketRepository extends JpaRepository<BookingTicket, Long> {
}