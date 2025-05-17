package ru.flamexander.spring.security.jwt.service;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import ru.flamexander.spring.security.jwt.dtos.BookingDto;
import ru.flamexander.spring.security.jwt.dtos.ServiceDto;
import ru.flamexander.spring.security.jwt.entities.Booking;
import ru.flamexander.spring.security.jwt.entities.BookingTicket;
import ru.flamexander.spring.security.jwt.entities.Room;
import ru.flamexander.spring.security.jwt.entities.Services;
import ru.flamexander.spring.security.jwt.entities.User;
import ru.flamexander.spring.security.jwt.exceptions.ResourceNotFoundException;
import ru.flamexander.spring.security.jwt.exceptions.RoomAlreadyBookedException;
import ru.flamexander.spring.security.jwt.repositories.BookingRepository;
import ru.flamexander.spring.security.jwt.repositories.BookingTicketRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookingService {
    private final BookingRepository bookingRepository;
    private final UserService userService;
    private final ServiceService serviceService;
    private final ModelMapper modelMapper;
    private final RoomService roomService;
    private final BookingTicketRepository bookingTicketRepository;
    private final PdfService pdfService;
    private final EmailService emailService;

    @Autowired
    public BookingService(BookingRepository bookingRepository,
                          UserService userService,
                          ServiceService serviceService,
                          ModelMapper modelMapper,
                          RoomService roomService,
                          BookingTicketRepository bookingTicketRepository,
                          PdfService pdfService,
                          EmailService emailService) {
        this.bookingRepository = bookingRepository;
        this.userService = userService;
        this.serviceService = serviceService;
        this.modelMapper = modelMapper;
        this.roomService = roomService;
        this.bookingTicketRepository = bookingTicketRepository;
        this.pdfService = pdfService;
        this.emailService = emailService;
    }

    public Booking createBooking(BookingDto bookingDto) {
        System.out.println("Starting booking creation: " + bookingDto.getRoomId() + ", " + bookingDto.getCheckInDate() + " to " + bookingDto.getCheckOutDate());
        // Booking booking = modelMapper.map(bookingDto, Booking.class);
        // ModelMapper может некорректно смапить serviceIds на List<Services> сущности Booking, сделаем это вручную
        Booking booking = new Booking();
        booking.setCheckInDate(bookingDto.getCheckInDate());
        booking.setCheckOutDate(bookingDto.getCheckOutDate());
        // servicePeopleCounts и totalSum будут установлены позже


        User user = userService.findById(bookingDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь не найден"));

        Optional<Room> roomOptional = roomService.getRoomById(bookingDto.getRoomId());
        Room room = roomOptional.orElseThrow(() -> new ResourceNotFoundException("Комната не найдена"));

        System.out.println("Checking room availability for roomId: " + room.getRoomId() + ", checkInDate: " + bookingDto.getCheckInDate() + ", checkOutDate: " + bookingDto.getCheckOutDate());

        if (bookingDto.getCheckInDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Дата заезда не может быть в прошлом");
        }
        if (bookingDto.getCheckOutDate().isBefore(bookingDto.getCheckInDate())) {
            throw new IllegalArgumentException("Дата выезда не может быть раньше даты заезда");
        }
        if (isRoomBooked(room.getRoomId(), bookingDto.getCheckInDate(), bookingDto.getCheckOutDate())) {
            System.out.println("Room is already booked for the selected dates");
            throw new RoomAlreadyBookedException("Комната уже забронирована на указанные даты");
        }

        List<Services> selectedServicesEntities = null;
        if (bookingDto.getServiceIds() != null && !bookingDto.getServiceIds().isEmpty()) { // Используем getServiceIds()
            selectedServicesEntities = bookingDto.getServiceIds().stream()
                    .map(serviceId -> {
                        ServiceDto serviceFullDto = serviceService.findById(serviceId);
                        return modelMapper.map(serviceFullDto, Services.class);
                    })
                    .collect(Collectors.toList());
            booking.setServices(selectedServicesEntities);
        } else {
            booking.setServices(new ArrayList<>()); // Устанавливаем пустой список, если ID не переданы
        }

        booking.setUser(user);
        booking.setRoom(room);
        booking.setServicePeopleCounts(
                bookingDto.getServicePeopleCounts() != null
                        ? new HashMap<>(bookingDto.getServicePeopleCounts())
                        : new HashMap<>()
        );


        BigDecimal roomPrice = BigDecimal.valueOf(room.getPrice());
        BigDecimal servicesPrice = BigDecimal.ZERO;

        if (selectedServicesEntities != null && booking.getServicePeopleCounts() != null) {
            for (Services serviceEntity : selectedServicesEntities) {
                Integer peopleCount = booking.getServicePeopleCounts().getOrDefault(serviceEntity.getServiceId(), 0);
                if (peopleCount != null && peopleCount > 0) {
                    BigDecimal servicePriceValue = BigDecimal.valueOf(serviceEntity.getServicePrice());
                    if (serviceEntity.isPricePerPerson()) {
                        servicePriceValue = servicePriceValue.multiply(BigDecimal.valueOf(peopleCount));
                    }
                    servicesPrice = servicesPrice.add(servicePriceValue);
                }
            }
        }

        booking.setTotalSum(roomPrice.add(servicesPrice));
        booking.setStatus("PENDING"); // Устанавливаем статус по умолчанию

        Booking savedBooking = bookingRepository.save(booking);

        BookingTicket ticket = new BookingTicket();
        ticket.setBoardingHouseName("ПАНСИОНАТ ЛЕСНЫЕ ДАЛИ");

        String firstName = user.getFirstName() == null ? "" : user.getFirstName();
        String lastName = user.getLastName() == null ? "" : user.getLastName();
        String fullName = (firstName + " " + lastName).trim();
        ticket.setUserFullName(fullName.isEmpty() ? "Имя не указано" : fullName);

        ticket.setRoomName(room.getRoomTitle());
        ticket.setCheckInDate(savedBooking.getCheckInDate());
        ticket.setCheckOutDate(savedBooking.getCheckOutDate());
        ticket.setPrice(savedBooking.getTotalSum());

        ticket.setServicePeopleCounts(
                savedBooking.getServicePeopleCounts() != null
                        ? new HashMap<>(savedBooking.getServicePeopleCounts())
                        : new HashMap<>()
        );

        bookingTicketRepository.save(ticket);

        sendBookingTicketEmailAsync(ticket, user.getEmail());

        System.out.println("Booking created successfully with ID: " + savedBooking.getBookingId());
        return savedBooking;
    }

    @Async
    public void sendBookingTicketEmailAsync(BookingTicket ticket, String email) {
        try {
            byte[] pdf = pdfService.generatePdf(ticket);
            emailService.sendBookingTicketEmail(email, pdf);
        } catch (Exception e) {
            System.err.println("Ошибка при отправке email: " + e.getMessage());
        }
    }

    public Booking updateBooking(Booking booking) {
        Booking existingBooking = bookingRepository.findById(booking.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Бронирование не найдено"));

        User user = userService.findById(booking.getUser().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь не найден"));

        Optional<Room> roomOptional = roomService.getRoomById(booking.getRoom().getRoomId());
        Room room = roomOptional.orElseThrow(() -> new ResourceNotFoundException("Комната не найдена"));

        List<Services> selectedServices = null;
        if (booking.getServices() != null && !booking.getServices().isEmpty()) {
            selectedServices = booking.getServices().stream()
                    .map(service -> {
                        // Предполагается, что в booking.getServices() уже сущности Services
                        // Если это DTO, то нужен findById и map
                        if (service.getServiceId() == null) throw new IllegalArgumentException("Service ID is null");
                        ServiceDto serviceDto = serviceService.findById(service.getServiceId());
                        return modelMapper.map(serviceDto, Services.class);
                    })
                    .collect(Collectors.toList());
        }

        existingBooking.setUser(user);
        existingBooking.setRoom(room);
        existingBooking.setServices(selectedServices != null ? selectedServices : new ArrayList<>());
        existingBooking.setCheckInDate(booking.getCheckInDate());
        existingBooking.setCheckOutDate(booking.getCheckOutDate());
        existingBooking.setStatus(booking.getStatus());
        existingBooking.setTotalSum(booking.getTotalSum());
        existingBooking.setServicePeopleCounts(
                booking.getServicePeopleCounts() != null
                        ? new HashMap<>(booking.getServicePeopleCounts())
                        : new HashMap<>()
        );
        return bookingRepository.save(existingBooking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    public List<BookingDto> getUserBookings(Long userId) {
        List<Booking> bookings = bookingRepository.findByUserId(userId);
        System.out.println("Bookings found: " + bookings.size() + " for user " + userId);
        return bookings.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    private BookingDto convertToDto(Booking booking) {
        BookingDto dto = new BookingDto();
        dto.setBookingId(booking.getBookingId());
        if (booking.getUser() != null) {
            dto.setUserId(booking.getUser().getId());
            dto.setUsername(booking.getUser().getUsername());
        }
        if (booking.getRoom() != null) {
            dto.setRoomId(booking.getRoom().getRoomId());
            dto.setRoomTitle(booking.getRoom().getRoomTitle());
        } else {
            dto.setRoomId(null); // Обработка случая, если комната null
            dto.setRoomTitle("Комната не найдена");
        }
        dto.setCheckInDate(booking.getCheckInDate());
        dto.setCheckOutDate(booking.getCheckOutDate());

        // Заполнение List<ServiceDto> services для ответа
        if (booking.getServices() != null) {
            dto.setServices(booking.getServices().stream()
                    .map(serviceEntity -> serviceService.convertToDto(serviceEntity))
                    .collect(Collectors.toList()));
        } else {
            dto.setServices(new ArrayList<>());
        }

        // serviceIds не нужно заполнять для ответа, если мы отправляем полный список services
        // dto.setServiceIds(null);

        dto.setServicePeopleCounts(booking.getServicePeopleCounts() != null ? new HashMap<>(booking.getServicePeopleCounts()) : new HashMap<>());
        dto.setTotalSum(booking.getTotalSum());
        dto.setStatus(booking.getStatus());
        return dto;
    }

    public List<Booking> getBookingsByRoom(Long roomId) {
        return bookingRepository.findByRoom_RoomId(roomId);
    }

    public boolean isRoomBooked(Long roomId, LocalDate checkInDate, LocalDate checkOutDate) {
        List<Booking> conflictingBookings = bookingRepository.findConflictingBookings(roomId, checkInDate, checkOutDate);
        boolean isBooked = !conflictingBookings.isEmpty();
        System.out.println("Room booked check for roomId: " + roomId + ", checkIn: " + checkInDate + ", checkOut: " + checkOutDate + ". Result (isBooked): " + isBooked);
        return isBooked;
    }

    public void deleteBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Бронирование не найдено"));
        bookingRepository.delete(booking);
    }

    public Booking updateBookingStatus(Long id, String status) {
        return bookingRepository.findById(id)
                .map(bookingEntity -> {
                    bookingEntity.setStatus(status);
                    return bookingRepository.save(bookingEntity);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Бронирование не найдено"));
    }
}