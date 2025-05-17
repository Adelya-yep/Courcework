package ru.flamexander.spring.security.jwt.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ru.flamexander.spring.security.jwt.entities.Feedback;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    @Query("SELECT f FROM Feedback f ORDER BY CASE WHEN f.status = 'Решена' THEN 1 ELSE 0 END, f.createdAt DESC")
    List<Feedback> findAllSortedByStatusAndDate();

    List<Feedback> findByUserId(Long userId);
}