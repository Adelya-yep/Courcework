package ru.flamexander.spring.security.jwt.configs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import ru.flamexander.spring.security.jwt.entities.Role;
import ru.flamexander.spring.security.jwt.entities.Room;
import ru.flamexander.spring.security.jwt.entities.Services;
import ru.flamexander.spring.security.jwt.repositories.RoleRepository;
import ru.flamexander.spring.security.jwt.repositories.RoomRepository;
import ru.flamexander.spring.security.jwt.repositories.ServiceRepository;

@Configuration
public class InitialDataConfig {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Bean
    public CommandLineRunner initializeData(RoleRepository roleRepository) {
        return args -> {
            if (!roleRepository.findByName("ROLE_USER").isPresent()) {
                Role userRole = new Role();
                userRole.setName("ROLE_USER");
                roleRepository.save(userRole);
            }

            if (roomRepository.count() == 0) {
//                roomRepository.deleteAll();
                roomRepository.save(new Room(null, "Одноместный стандарт", "Стандарт",
                        "Уютный однокомнатный номер с односпальной кроватью, без балкона. Корпус 1, этаж 1. Ванная комната с душем. Площадь: 19 м². Вид во внутренний двор.",
                        3500.0, "FREE", "/img/live_card-image.png"));

                roomRepository.save(new Room(null, "Двухместный стандарт", "Стандарт",
                        "Однокомнатный номер с двумя односпальными кроватями и выходом на террасу. Корпус 5, этаж 2. Ванная комната с душем. Площадь: 22 м². Вид на сад.",
                        4500.0, "FREE", "/img/live_card-image3.png"));

                roomRepository.save(new Room(null, "Семейный стандарт", "Стандарт",
                        "Двухкомнатный номер с двуспальной кроватью и диваном в гостиной. Есть балкон. Корпус 2, этаж 3. Ванная комната с ванной. Площадь: 37 м². Вид на парк.",
                        6000.0, "FREE", "/img/live_card-image8.png"));

                roomRepository.save(new Room(null, "Одноместный комфорт", "Комфорт",
                        "Просторный однокомнатный номер с двуспальной кроватью и мини-гостиной зоной. Корпус 3, этаж 2. Ванная комната с тропическим душем. Площадь: 25 м². Вид на лес.",
                        5500.0, "FREE", "/img/live_card-image8.png"));

                roomRepository.save(new Room(null, "Двухместный комфорт", "Комфорт",
                        "Улучшенный номер с двуспальной кроватью и балконом. Корпус 4, этаж 3. Ванная комната с гидромассажной панелью. Площадь: 28 м². Вид на озеро.",
                        7000.0, "FREE", "/img/live_card-image8.png"));

                roomRepository.save(new Room(null, "Семейный комфорт", "Комфорт",
                        "Двухкомнатный номер с двуспальной кроватью и детской зоной. Большой балкон с мебелью. Корпус 1, этаж 4. Ванная комната с ванной и душем. Площадь: 45 м². Вид на море.",
                        8500.0, "FREE", "/img/live_card-image8.png"));

                roomRepository.save(new Room(null, "Одноместный люкс", "Люкс",
                        "Просторный номер с панорамными окнами, двуспальной кроватью King Size и зоной отдыха. Корпус 5, этаж 5. Ванная комната с джакузи. Площадь: 40 м². Вид на горы.",
                        12000.0, "FREE", "/img/live_card-image8.png"));

                roomRepository.save(new Room(null, "Двухместный люкс", "Люкс",
                        "Роскошный номер с двуспальной кроватью, гостиной зоной и панорамным балконом. Корпус 6, этаж 6. Ванная комната с сауной. Площадь: 55 м². Вид на озеро и парк.",
                        15000.0, "FREE", "/img/live_card-image8.png"));

                roomRepository.save(new Room(null, "Семейный люкс", "Люкс",
                        "Двухэтажный номер с тремя спальнями, гостиной и террасой. Идеален для семейного отдыха. Корпус 7, этаж 7. Две ванные комнаты (одна с джакузи). Площадь: 80 м². Вид на озеро и горы.",
                        25000.0, "FREE", "/img/live_card-image8.png"));
            }
            if (serviceRepository.count() == 0) {
                serviceRepository.save(new Services(null, "Спа-процедуры",
                        2500.0, "/img/services/spa.jpg"));

                serviceRepository.save(new Services(null, "Массаж",
                        2000.0, "/img/services/massage.jpg"));

                serviceRepository.save(new Services(null, "Тренажерный зал",
                        500.0, "/img/services/gym.jpg"));

                serviceRepository.save(new Services(null, "Бассейн",
                        800.0, "/img/services/pool.jpg"));

                serviceRepository.save(new Services(null, "Теннисный корт",
                        1500.0, "/img/services/tennis.jpg"));

                serviceRepository.save(new Services(null, "Экскурсии",
                        1800.0, "/img/services/excursion.jpg"));

                serviceRepository.save(new Services(null, "Грязевые ванны",
                        700.0, "/img/services/glina.jpg"));

                serviceRepository.save(new Services(null, "Ресторан",
                        3000.0, "/img/services/restaurant.jpg"));

                serviceRepository.save(new Services(null, "Трехразовое питание",
                        1200.0, "/img/services/obed.jpg"));
            }
        };
    }
}