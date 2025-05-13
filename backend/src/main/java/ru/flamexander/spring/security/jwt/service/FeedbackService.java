package ru.flamexander.spring.security.jwt.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.flamexander.spring.security.jwt.dtos.FeedbackDto;
import ru.flamexander.spring.security.jwt.entities.Feedback;
import ru.flamexander.spring.security.jwt.entities.User;
import ru.flamexander.spring.security.jwt.exceptions.ResourceNotFoundException;
import ru.flamexander.spring.security.jwt.repositories.FeedbackRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeedbackService {
    private final FeedbackRepository feedbackRepository;
    private final UserService userService;

    @Autowired
    public FeedbackService(FeedbackRepository feedbackRepository, UserService userService) {
        this.feedbackRepository = feedbackRepository;
        this.userService = userService;
    }

    public Feedback createFeedback(FeedbackDto feedbackDto) {
        User user = userService.findById(feedbackDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь не найден"));

        Feedback feedback = new Feedback();
        feedback.setUser(user);
        feedback.setMessage(feedbackDto.getMessage());
        feedback.setStatus("В ожидании");
        feedback.setCreatedAt(LocalDateTime.now());

        return feedbackRepository.save(feedback);
    }

    public List<FeedbackDto> getAllFeedbacks() {
        List<Feedback> feedbacks = feedbackRepository.findAllSortedByStatusAndDate();
        return feedbacks.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public Feedback updateFeedbackStatus(Long id, String status) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Заявка не найдена"));
        feedback.setStatus(status);
        return feedbackRepository.save(feedback);
    }

    private FeedbackDto convertToDto(Feedback feedback) {
        FeedbackDto dto = new FeedbackDto();
        dto.setId(feedback.getId());
        dto.setUsername(feedback.getUser().getUsername()); // Добавляем username пользователя
        dto.setUserId(feedback.getUser().getId());
        dto.setMessage(feedback.getMessage());
        dto.setStatus(feedback.getStatus());
        dto.setCreatedAt(feedback.getCreatedAt().toString());
        return dto;
    }
}