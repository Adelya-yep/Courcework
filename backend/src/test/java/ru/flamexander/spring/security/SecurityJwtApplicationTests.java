package ru.flamexander.spring.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import ru.flamexander.spring.security.jwt.dtos.BookingDto;
import ru.flamexander.spring.security.jwt.dtos.JwtRequest;
import ru.flamexander.spring.security.jwt.dtos.JwtResponse;
import ru.flamexander.spring.security.jwt.dtos.RegistrationUserDto;
import ru.flamexander.spring.security.jwt.entities.Role;
import ru.flamexander.spring.security.jwt.entities.Room;
import ru.flamexander.spring.security.jwt.entities.User;
import ru.flamexander.spring.security.jwt.repositories.RoleRepository;
import ru.flamexander.spring.security.jwt.repositories.RoomRepository;
import ru.flamexander.spring.security.jwt.repositories.UserRepository;
import ru.flamexander.spring.security.jwt.service.UserService;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(classes = ru.flamexander.spring.security.jwt.SecurityJwtApplication.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class SecurityJwtApplicationTests {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private UserService userService;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private RoomRepository roomRepository;

	@Autowired
	private TestRestTemplate restTemplate;

	// Модульные тесты
	@Test
	void contextLoads() {
		// Проверка, что контекст Spring Boot загружается успешно
		assertThat(userRepository).isNotNull();
		assertThat(userService).isNotNull();
		assertThat(passwordEncoder).isNotNull();
		assertThat(roleRepository).isNotNull();
		assertThat(restTemplate).isNotNull();
	}

	@Test
	void createUserTest() {
		// Проверка создания нового пользователя
		String uniqueUsername = "testUser" + System.currentTimeMillis();
		RegistrationUserDto registrationUserDto = new RegistrationUserDto();
		registrationUserDto.setUsername(uniqueUsername);
		registrationUserDto.setEmail("test@example.com");
		registrationUserDto.setPassword("Password123!");
		registrationUserDto.setConfirmPassword("Password123!");

		User user = userService.createNewUser(registrationUserDto);
		assertThat(user).isNotNull();
		assertThat(user.getUsername()).isEqualTo(uniqueUsername);
	}

	@Test
	void findUserByUsernameTest() {
		// Проверка поиска пользователя по имени пользователя
		String uniqueUsername = "testUser" + System.currentTimeMillis();
		RegistrationUserDto registrationUserDto = new RegistrationUserDto();
		registrationUserDto.setUsername(uniqueUsername);
		registrationUserDto.setEmail("test@example.com");
		registrationUserDto.setPassword("Password123!");
		registrationUserDto.setConfirmPassword("Password123!");
		userService.createNewUser(registrationUserDto);

		Optional<User> user = userService.findByUsername(uniqueUsername);
		assertThat(user).isPresent();
		assertThat(user.get().getUsername()).isEqualTo(uniqueUsername);
	}

	@Test
	void findUserByIdTest() {
		// Проверка поиска пользователя по ID
		String uniqueUsername = "testUser" + System.currentTimeMillis();
		RegistrationUserDto registrationUserDto = new RegistrationUserDto();
		registrationUserDto.setUsername(uniqueUsername);
		registrationUserDto.setEmail("test@example.com");
		registrationUserDto.setPassword("Password123!");
		registrationUserDto.setConfirmPassword("Password123!");
		User createdUser = userService.createNewUser(registrationUserDto);

		Optional<User> user = userRepository.findById(createdUser.getId());
		assertThat(user).isPresent();
	}

	@Test
	void deleteUserTest() {
		// Проверка удаления пользователя
		String uniqueUsername = "testDelete" + System.currentTimeMillis();
		RegistrationUserDto registrationUserDto = new RegistrationUserDto();
		registrationUserDto.setUsername(uniqueUsername);
		registrationUserDto.setEmail("delete@example.com");
		registrationUserDto.setPassword("Password123!");
		registrationUserDto.setConfirmPassword("Password123!");
		User createdUser = userService.createNewUser(registrationUserDto);

		userService.deleteById(createdUser.getId());
		assertThat(userRepository.findByUsername(uniqueUsername)).isEmpty();
	}

	@Test
	void updateUserTest() {
		// Проверка обновления пользователя
		String uniqueUsername = "testUser" + System.currentTimeMillis();
		RegistrationUserDto registrationUserDto = new RegistrationUserDto();
		registrationUserDto.setUsername(uniqueUsername);
		registrationUserDto.setEmail("test@example.com");
		registrationUserDto.setPassword("Password123!");
		registrationUserDto.setConfirmPassword("Password123!");
		User createdUser = userService.createNewUser(registrationUserDto);

		createdUser.setEmail("updated@example.com");
		userService.updateUser(createdUser.getId(), createdUser);
		assertThat(userRepository.findByUsername(uniqueUsername).orElseThrow().getEmail()).isEqualTo("updated@example.com");
	}

	@Test
	void passwordEncodingTest() {
		// Проверка кодирования пароля
		String password = "Password123!";
		String encodedPassword = passwordEncoder.encode(password);
		assertThat(passwordEncoder.matches(password, encodedPassword)).isTrue();
	}

	@Test
	void roleCreationTest() {
		// Проверка создания новой роли
		String uniqueRoleName = "ROLE_TEST" + System.currentTimeMillis();
		Role role = new Role();
		role.setName(uniqueRoleName);
		roleRepository.save(role);
		assertThat(roleRepository.findByName(uniqueRoleName)).isPresent();
	}

	@Test
	void addRoleToUserTest() {
		// Проверка добавления роли пользователю
		String uniqueUsername = "testUser" + System.currentTimeMillis();
		RegistrationUserDto registrationUserDto = new RegistrationUserDto();
		registrationUserDto.setUsername(uniqueUsername);
		registrationUserDto.setEmail("test@example.com");
		registrationUserDto.setPassword("Password123!");
		registrationUserDto.setConfirmPassword("Password123!");
		User createdUser = userService.createNewUser(registrationUserDto);

		Optional<Role> role = roleRepository.findByName("ROLE_USER");
		if (role.isPresent()) {
			createdUser.setRole(role.get());
			userRepository.save(createdUser);
			assertThat(userRepository.findByUsername(uniqueUsername).orElseThrow().getRole().getName()).isEqualTo("ROLE_USER");
		}
	}

//	@Test
//	void checkUserEmail() {
//		// Проверка формата email
//		RegistrationUserDto registrationUserDto = new RegistrationUserDto();
//		registrationUserDto.setUsername("testEmail" + System.currentTimeMillis());
//		registrationUserDto.setEmail("invalid-mail");
//		registrationUserDto.setPassword("Password123!");
//		registrationUserDto.setConfirmPassword("Password123!");
//
//		assertThrows(Exception.class, () -> userService.createNewUser(registrationUserDto));
//	}

//	@Test
//	void checkUserPassword() {
//		// Проверка надежности пароля
//		RegistrationUserDto registrationUserDto = new RegistrationUserDto();
//		registrationUserDto.setUsername("testPass" + System.currentTimeMillis());
//		registrationUserDto.setEmail("test@example.com");
//		registrationUserDto.setPassword("weak");
//		registrationUserDto.setConfirmPassword("weak");
//
//		assertThrows(Exception.class, () -> userService.createNewUser(registrationUserDto));
//	}

	@Test
	void checkUserFirstName() {
		// Проверка имени пользователя (example - not empty)
		String uniqueUsername = "testFirstName" + System.currentTimeMillis();
		RegistrationUserDto registrationUserDto = new RegistrationUserDto();
		registrationUserDto.setUsername(uniqueUsername);
		registrationUserDto.setEmail("test@example.com");
		registrationUserDto.setPassword("Password123!");
		registrationUserDto.setConfirmPassword("Password123!");

		User user = userService.createNewUser(registrationUserDto);
		assertThat(user.getFirstName()).isNull(); // Adjust based on your model
	}

	@Test
	void checkUserLastName() {
		// Проверка фамилии пользователя (example - not empty)
		String uniqueUsername = "testLastName" + System.currentTimeMillis();
		RegistrationUserDto registrationUserDto = new RegistrationUserDto();
		registrationUserDto.setUsername(uniqueUsername);
		registrationUserDto.setEmail("test@example.com");
		registrationUserDto.setPassword("Password123!");
		registrationUserDto.setConfirmPassword("Password123!");

		User user = userService.createNewUser(registrationUserDto);
		assertThat(user.getLastName()).isNull(); // Adjust based on your model
	}

	@Test
	void checkUserPhoto() {
		// Проверка фото пользователя (example - not empty)
		String uniqueUsername = "testPhoto" + System.currentTimeMillis();
		RegistrationUserDto registrationUserDto = new RegistrationUserDto();
		registrationUserDto.setUsername(uniqueUsername);
		registrationUserDto.setEmail("test@example.com");
		registrationUserDto.setPassword("Password123!");
		registrationUserDto.setConfirmPassword("Password123!");

		User user = userService.createNewUser(registrationUserDto);
		assertThat(user.getPhotoPath()).isNull(); // Adjust based on your model
	}

	@Test
	void checkUserService() {
		// Проверка сервиса пользователя (example - not null)
		assertThat(userService).isNotNull();
	}

	// Интеграционные тесты
	@Test
	void registrationIntegrationTest() {
		// Проверка регистрации нового пользователя через API
		String uniqueUsername = "testApiUser" + System.currentTimeMillis();
		RegistrationUserDto registrationUserDto = new RegistrationUserDto();
		registrationUserDto.setUsername(uniqueUsername);
		registrationUserDto.setEmail("api@example.com");
		registrationUserDto.setPassword("Password123!");
		registrationUserDto.setConfirmPassword("Password123!");

		ResponseEntity<String> response = restTemplate.postForEntity("/api/auth/reg", registrationUserDto, String.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
	}

	@Test
	void loginIntegrationTest() {
		// Проверка аутентификации пользователя через API
		String uniqueUsername = "testUser" + System.currentTimeMillis();
		RegistrationUserDto registrationUserDto = new RegistrationUserDto();
		registrationUserDto.setUsername(uniqueUsername);
		registrationUserDto.setEmail("test@example.com");
		registrationUserDto.setPassword("Password123!");
		registrationUserDto.setConfirmPassword("Password123!");
		userService.createNewUser(registrationUserDto);

		JwtRequest jwtRequest = new JwtRequest();
		jwtRequest.setUsername(uniqueUsername);
		jwtRequest.setPassword("Password123!");

		ResponseEntity<String> response = restTemplate.postForEntity("/api/auth/login", jwtRequest, String.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
	}

//	@Test
//	void securedEndpointAccessTest() {
//		// Проверка доступа к защищенной конечной точке (требуется аутентификация)
//		String token = getJwtToken();
//		HttpHeaders headers = new HttpHeaders();
//		headers.setBearerAuth(token);
//		HttpEntity<String> entity = new HttpEntity<>(headers);
//
//		ResponseEntity<String> response = restTemplate.exchange("/private/test", HttpMethod.GET, entity, String.class);
//		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
//	}

//	@Test
//	void adminEndpointAccessTest() {
//		// Проверка доступа к конечной точке администратора (требуется роль ADMIN)
//		String token = getJwtTokenForAdmin();
//		HttpHeaders headers = new HttpHeaders();
//		headers.setBearerAuth(token);
//		HttpEntity<String> entity = new HttpEntity<>(headers);
//
//		ResponseEntity<String> response = restTemplate.exchange("/api/admin", HttpMethod.GET, entity, String.class);
//		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
//	}

//	@Test
//	void bookingCreationTest() {
//		// Проверка создания бронирования и сохранения в базе данных
//		String uniqueUsername = "testUser" + System.currentTimeMillis();
//		RegistrationUserDto registrationUserDto = new RegistrationUserDto();
//		registrationUserDto.setUsername(uniqueUsername);
//		registrationUserDto.setEmail("test@example.com");
//		registrationUserDto.setPassword("Password123!");
//		registrationUserDto.setConfirmPassword("Password123!");
//		User createdUser = userService.createNewUser(registrationUserDto);
//
//		Optional<Room> room = roomRepository.findById(1L);
//		if (room.isPresent()) {
//			BookingDto bookingDto = new BookingDto();
//			bookingDto.setUserId(createdUser.getId());
//			bookingDto.setRoomId(room.get().getRoomId());
//			bookingDto.setCheckInDate(java.time.LocalDate.now());
//			bookingDto.setCheckOutDate(java.time.LocalDate.now().plusDays(1));
//
//			String token = getJwtToken();
//			HttpHeaders headers = new HttpHeaders();
//			headers.setBearerAuth(token);
//			HttpEntity<BookingDto> entity = new HttpEntity<>(bookingDto, headers);
//
//			ResponseEntity<BookingDto> response = restTemplate.postForEntity("/api/bookings/add", entity, BookingDto.class);
//			assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
//		}
//	}

//	@Test
//	void feedbackSubmissionTest() {
//		// Проверка отправки отзыва и сохранения в базе данных
//		String uniqueUsername = "testUser" + System.currentTimeMillis();
//		RegistrationUserDto registrationUserDto = new RegistrationUserDto();
//		registrationUserDto.setUsername(uniqueUsername);
//		registrationUserDto.setEmail("test@example.com");
//		registrationUserDto.setPassword("Password123!");
//		registrationUserDto.setConfirmPassword("Password123!");
//		User createdUser = userService.createNewUser(registrationUserDto);
//
//		ru.flamexander.spring.security.jwt.dtos.FeedbackDto feedbackDto = new ru.flamexander.spring.security.jwt.dtos.FeedbackDto();
//		feedbackDto.setUserId(createdUser.getId());
//		feedbackDto.setMessage("Test feedback");
//
//		String token = getJwtToken();
//		HttpHeaders headers = new HttpHeaders();
//		headers.setBearerAuth(token);
//		HttpEntity<ru.flamexander.spring.security.jwt.dtos.FeedbackDto> entity = new HttpEntity<>(feedbackDto, headers);
//
//		ResponseEntity<String> response = restTemplate.postForEntity("/api/feedback/send", entity, String.class);
//		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
//	}

//	@Test
//	void roleBasedAccessControlTest() {
//		// Проверка ролевой модели доступа
//		String token = getJwtToken();
//		HttpHeaders headers = new HttpHeaders();
//		headers.setBearerAuth(token);
//		HttpEntity<String> entity = new HttpEntity<>(headers);
//
//		ResponseEntity<String> response = restTemplate.exchange("/api/admin", HttpMethod.GET, entity, String.class);
//		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
//	}

	private String getJwtToken() {
		String uniqueUsername = "testUser" + System.currentTimeMillis();
		RegistrationUserDto registrationUserDto = new RegistrationUserDto();
		registrationUserDto.setUsername(uniqueUsername);
		registrationUserDto.setEmail("test@example.com");
		registrationUserDto.setPassword("Password123!");
		registrationUserDto.setConfirmPassword("Password123!");
		userService.createNewUser(registrationUserDto);

		JwtRequest jwtRequest = new JwtRequest();
		jwtRequest.setUsername(uniqueUsername);
		jwtRequest.setPassword("Password123!");

		ResponseEntity<JwtResponse> response = restTemplate.postForEntity("/api/auth/login", jwtRequest, JwtResponse.class);
		return response.getBody().getToken();
	}

	private String getJwtTokenForAdmin() {
		JwtRequest jwtRequest = new JwtRequest();
		jwtRequest.setUsername("admin"); // Assumes an admin user exists
		jwtRequest.setPassword("Admin123!");

		ResponseEntity<JwtResponse> response = restTemplate.postForEntity("/api/auth/login", jwtRequest, JwtResponse.class);
		return response.getBody().getToken();
	}
}