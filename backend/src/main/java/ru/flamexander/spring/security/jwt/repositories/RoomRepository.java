package ru.flamexander.spring.security.jwt.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.flamexander.spring.security.jwt.entities.Room;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByRoomType(String roomType);

    // Поиск по названию (игнорируя регистр) с пагинацией
    Page<Room> findByRoomTitleContainingIgnoreCase(String roomTitle, Pageable pageable);

    // Фильтрация по цене с пагинацией
    Page<Room> findByPriceBetween(double minPrice, double maxPrice, Pageable pageable);

    // Комбинированный поиск по названию и цене с пагинацией
    Page<Room> findByRoomTitleContainingIgnoreCaseAndPriceBetween(
            String roomTitle, double minPrice, double maxPrice, Pageable pageable
    );

    // Исключение комнат с определённым статусом
    Page<Room> findByStatusNot(String status, Pageable pageable);
}