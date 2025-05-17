package ru.flamexander.spring.security.jwt.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.flamexander.spring.security.jwt.entities.Booking;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    @Query("SELECT b FROM Booking b WHERE b.room.roomId = :roomId " +
            "AND (b.checkInDate <= :checkOutDate AND b.checkOutDate >= :checkInDate)")
    List<Booking> findConflictingBookings(@Param("roomId") Long roomId,
                                          @Param("checkInDate") LocalDate checkInDate,
                                          @Param("checkOutDate") LocalDate checkOutDate);

    // Существующие методы остаются без изменений
    List<Booking> findByUserId(Long userId);
    List<Booking> findByRoom_RoomId(Long roomId);
}