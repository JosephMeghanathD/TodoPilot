package com.taskpilot.todolistservice.repository;

import com.taskpilot.todolistservice.model.SubTask;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubTaskRepository extends JpaRepository<SubTask, Long> {
}