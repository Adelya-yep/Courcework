package ru.flamexander.spring.security.jwt.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.flamexander.spring.security.jwt.dtos.FeedbackDto;
import ru.flamexander.spring.security.jwt.entities.Feedback;
import ru.flamexander.spring.security.jwt.service.FeedbackService;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class FeedbackController {
    private final FeedbackService feedbackService;

    @PostMapping("/send")
    public ResponseEntity<Feedback> createFeedback(@RequestBody FeedbackDto feedbackDto) {
        try {
            Feedback feedback = feedbackService.createFeedback(feedbackDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(feedback);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<FeedbackDto>> getAllFeedbacks() {
        List<FeedbackDto> feedbacks = feedbackService.getAllFeedbacks();
        return ResponseEntity.ok(feedbacks);
    }

    @PutMapping("/update-status/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Feedback> updateFeedbackStatus(@PathVariable Long id, @RequestBody String status) {
        Feedback updatedFeedback = feedbackService.updateFeedbackStatus(id, status);
        return ResponseEntity.ok(updatedFeedback);
    }
}