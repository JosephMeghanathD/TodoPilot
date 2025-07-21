package com.taskpilot.todolistservice.mappers;

import com.taskpilot.todolistservice.dto.CategoryDto;
import com.taskpilot.todolistservice.model.Category;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {

    public CategoryDto toDto(Category category) {
        if (category == null) {
            return null;
        }
        return new CategoryDto(category.getId(), category.getName());
    }
}