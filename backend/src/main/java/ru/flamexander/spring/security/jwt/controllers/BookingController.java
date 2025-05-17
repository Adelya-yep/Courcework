package ru.flamexander.spring.security.jwt.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j; // Import Slf4j
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.flamexander.spring.security.jwt.dtos.BookingDto;
import ru.flamexander.spring.security.jwt.entities.Booking;
import ru.flamexander.spring.security.jwt.exceptions.AppError; // Import AppError
import ru.flamexander.spring.security.jwt.exceptions.ResourceNotFoundException;
import ru.flamexander.spring.security.jwt.exceptions.RoomAlreadyBookedException;
import ru.flamexander.spring.security.jwt.service.BookingService;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // Consider refining this for production
@Slf4j // Add Slf4j for logging
public class BookingController {
    private final BookingService bookingService;
    private final ModelMapper modelMapper;

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/{id}")
    public Booking getBookingById(@PathVariable Long id) {
        return bookingService.getBookingById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
    }

    @PostMapping("/add")
    public ResponseEntity<?> createBooking(@RequestBody BookingDto bookingDto) {
        try {
            log.info("Attempting to create booking with DTO: {}", bookingDto);
            Booking booking = bookingService.createBooking(bookingDto);
            log.info("Booking created successfully with ID: {}", booking.getBookingId());
            return ResponseEntity.status(HttpStatus.CREATED).body(booking);
        } catch (RoomAlreadyBookedException e) {
            log.warn("Room already booked: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new AppError(HttpStatus.CONFLICT.value(), e.getMessage()));
        } catch (IllegalArgumentException e) {
            log.warn("Invalid argument for booking: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new AppError(HttpStatus.BAD_REQUEST.value(), e.getMessage()));
        } catch (ResourceNotFoundException e) {
            log.warn("Resource not found during booking: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new AppError(HttpStatus.NOT_FOUND.value(), e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error occurred while creating booking", e); // Log the full stack trace
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new AppError(HttpStatus.INTERNAL_SERVER_ERROR.value(), "An unexpected error occurred: " + e.getMessage()));
        }
    }

    @PutMapping("/update/{id}")
    public Booking updateBooking(@PathVariable Long id, @RequestBody BookingDto bookingDto) {
        Booking booking = modelMapper.map(bookingDto, Booking.class);
        booking.setBookingId(id); // Ensure ID is set for update
        return bookingService.updateBooking(booking);
    }

    @DeleteMapping("/delete/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
    }

    @GetMapping("/user/{userId}")
    public List<BookingDto> getUserBookings(@PathVariable Long userId) {
        return bookingService.getUserBookings(userId);
    }

    @GetMapping("/room/{roomId}")
    public List<Booking> getBookingsByRoom(@PathVariable Long roomId) {
        return bookingService.getBookingsByRoom(roomId);
    }

    @PutMapping("/update-status/{id}")
    public ResponseEntity<Booking> updateBookingStatus(@PathVariable Long id, @RequestBody String status) {
        // Ensure status is just the string value, not a JSON object like {"status":"APPROVED"}
        // If frontend sends JSON, adjust @RequestBody or parsing logic
        String plainStatus = status.replaceAll("\"", ""); // Basic way to remove quotes if sent as JSON string
        Booking updatedBooking = bookingService.updateBookingStatus(id, plainStatus);
        return ResponseEntity.ok(updatedBooking);
    }
}
