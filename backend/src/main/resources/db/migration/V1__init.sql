-- Заполнение таблицы rooms
INSERT INTO rooms (room_id, room_title, room_type, description, price, status, image_url) VALUES
                                                                                     (4,'Номер люкс', 'Люкс', 'Просторный номер с видом на море', 15000.00, 'FREE', '/img/rooms/lux1.jpg'),
                                                                                     (5,'Номер стандарт', 'Стандарт', 'Уютный номер с удобствами', 8000.00, 'FREE', '/img/rooms/standard1.jpg'),
                                                                                     (6,'Номер эконом', 'Эконом', 'Недорогой номер для непритязательных гостей', 5000.00, 'BOOKED', '/img/rooms/economy1.jpg'),
                                                                                     (7,'Семейный номер', 'Семейный', 'Двухкомнатный номер для семьи с детьми', 12000.00, 'FREE', '/img/rooms/family1.jpg'),
                                                                                     (8,'Номер полулюкс', 'Полулюкс', 'Номер повышенной комфортности', 10000.00, 'FREE', '/img/rooms/junior1.jpg'),
                                                                                     (9,'Номер для новобрачных', 'Люкс', 'Романтический номер с джакузи', 18000.00, 'FREE', '/img/rooms/honeymoon1.jpg'),
                                                                                     (10,'Номер с балконом', 'Стандарт', 'Номер с балконом и видом на парк', 9000.00, 'BOOKED', '/img/rooms/standard2.jpg'),
                                                                                     (11,'Номер у бассейна', 'Полулюкс', 'Номер с прямым доступом к бассейну', 13000.00, 'FREE', '/img/rooms/junior2.jpg'),
                                                                                     (12,'Президентский люкс', 'Люкс', 'Самый роскошный номер в отеле', 25000.00, 'FREE', '/img/rooms/presidential1.jpg'),
                                                                                     (13,'Номер для инвалидов', 'Стандарт', 'Номер оборудован для людей с ограниченными возможностями', 8500.00, 'FREE', '/img/rooms/disabled1.jpg');
DELETE FROM rooms WHERE room_id BETWEEN 4 AND 13;
-- Заполнение таблицы services
INSERT INTO services (service_name, service_price, image_url) VALUES
                                                                  ('Завтрак в номер', 1500.00, '/img/services/breakfast.jpg'),
                                                                  ('Трансфер из аэропорта', 3000.00, '/img/services/transfer.jpg'),
                                                                  ('Аренда автомобиля', 5000.00, '/img/services/car_rental.jpg'),
                                                                  ('Экскурсия по городу', 2500.00, '/img/services/city_tour.jpg'),
                                                                  ('Массаж', 4000.00, '/img/services/massage.jpg'),
                                                                  ('Услуги няни', 3500.00, '/img/services/babysitter.jpg'),
                                                                  ('Химчистка', 1000.00, '/img/services/dry_cleaning.jpg'),
                                                                  ('Прачечная', 800.00, '/img/services/laundry.jpg'),
                                                                  ('Аренда конференц-зала', 10000.00, '/img/services/conference_room.jpg'),
                                                                  ('Wi-Fi', 0.00, '/img/services/wifi.jpg');
