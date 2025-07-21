package com.taskpilot.todolistservice.repository;

import com.taskpilot.todolistservice.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserIdOrderByPriorityDescDueDateAsc(Long userId);
    Optional<Task> findByIdAndUserId(Long id, Long userId);
    List<Task> findByCategoryIdAndUserId(Long categoryId, Long userId);

    long countByCategoryIdAndUserId(Long categoryId, Long userId);
}