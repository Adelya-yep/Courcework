package ru.flamexander.spring.security.jwt.configs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import ru.flamexander.spring.security.jwt.entities.Role;
import ru.flamexander.spring.security.jwt.entities.Room;
import ru.flamexander.spring.security.jwt.repositories.RoleRepository;
import ru.flamexander.spring.security.jwt.repositories.RoomRepository;

@Configuration
public class InitialDataConfig {

    @Autowired
    private RoomRepository roomRepository;

    @Bean
    public CommandLineRunner initializeData(RoleRepository roleRepository) {
        return args -> {
            if (!roleRepository.findByName("ROLE_USER").isPresent()) {
                Role userRole = new Role();
                userRole.setName("ROLE_USER");
                roleRepository.save(userRole);
            }

            // Проверяем, есть ли уже комнаты в базе данных
            if (roomRepository.count() == 0) {
                roomRepository.save(new Room(null, "Одноместный стандарт", "Стандарт", "Однокомнатный номер, без балкона, корпус 1, этаж 1. Площадь номера 19 м2", 7380.0, "FREE", "/img/live_card-image.png"));
                roomRepository.save(new Room(null, "Двуместный стандарт", "Стандарт", "Однокомнатный номер с выходом на террасу, корпус 5. Площадь номера 19 м2.", 7380.0, "FREE", "/img/live_card-image3.png"));
                roomRepository.save(new Room(null, "Семейный", "Семейный", "Двухкомнатный номер с балконом, корпус 2. Площадь номера 37 м2.", 7380.0, "FREE", "/img/live_card-image8.png"));
            }
        };
    }
}