package com.taskpilot.todolistservice.repository;

import com.taskpilot.todolistservice.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByUserId(Long userId);

    Optional<Category> findByIdAndUserId(Long categoryId, Long userId);
}
