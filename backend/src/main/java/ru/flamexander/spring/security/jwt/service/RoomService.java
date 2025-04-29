package ru.flamexander.spring.security.jwt.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ru.flamexander.spring.security.jwt.dtos.RoomDto;
import ru.flamexander.spring.security.jwt.entities.Room;
import ru.flamexander.spring.security.jwt.repositories.RoomRepository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class RoomService {
    private final RoomRepository roomRepository;

    @Autowired
    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public Page<Room> getAllRooms(Pageable pageable) {
        return roomRepository.findAll(pageable);
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Optional<Room> getRoomById(Long id) {
        return roomRepository.findById(id);
    }

    public Room createRoom(RoomDto roomDto) {
        System.out.println("roomTitle length: " + (roomDto.getRoomTitle() != null ? roomDto.getRoomTitle().length() : 0));
        System.out.println("roomType length: " + (roomDto.getRoomType() != null ? roomDto.getRoomType().length() : 0));
        System.out.println("description length: " + (roomDto.getDescription() != null ? roomDto.getDescription().length() : 0));
        System.out.println("status length: " + (roomDto.getStatus() != null ? roomDto.getStatus().length() : 0));
        System.out.println("imageUrl length: " + (roomDto.getImageUrl() != null ? roomDto.getImageUrl().length() : 0));

        Room room = new Room();
        room.setRoomTitle(roomDto.getRoomTitle());
        room.setRoomType(roomDto.getRoomType());
        room.setDescription(roomDto.getDescription());
        room.setPrice(roomDto.getPrice());
        room.setStatus(roomDto.getStatus());
        room.setImageUrl(roomDto.getImageUrl());
        return roomRepository.save(room);
    }

    @Transactional
    public Room updateRoom(Room room) {
        return roomRepository.save(room);
    }

    @Transactional
    public Room updateRoom(Long id, RoomDto roomDto) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Не найдена комната с айдишником: " + id));
        room.setRoomTitle(roomDto.getRoomTitle());
        room.setRoomType(roomDto.getRoomType());
        room.setDescription(roomDto.getDescription());
        room.setPrice(roomDto.getPrice());
        room.setStatus(roomDto.getStatus());
        room.setImageUrl(roomDto.getImageUrl());
        return roomRepository.save(room);
    }

    @Transactional
    public void deleteRoom(Long id) {
        roomRepository.deleteById(id);
    }

    // Поиск по названию с пагинацией
    public Page<Room> searchByTitle(String roomTitle, Pageable pageable) {
        return roomRepository.findByRoomTitleContainingIgnoreCase(roomTitle, pageable);
    }

    // Фильтрация по цене с пагинацией
    public Page<Room> filterByPrice(double minPrice, double maxPrice, Pageable pageable) {
        return roomRepository.findByPriceBetween(minPrice, maxPrice, pageable);
    }

    // Комбинированный поиск по названию и цене с пагинацией
    public Page<Room> searchAndFilter(String roomTitle, double minPrice, double maxPrice, Pageable pageable) {
        return roomRepository.findByRoomTitleContainingIgnoreCaseAndPriceBetween(
                roomTitle, minPrice, maxPrice, pageable
        );
    }

    public Page<Room> getAvailableRooms(Pageable pageable) {
        return roomRepository.findByStatusNot("HIDDEN", pageable);
    }
}