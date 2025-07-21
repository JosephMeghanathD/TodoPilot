package com.taskpilot.todolistservice.service;

import com.taskpilot.todolistservice.dto.CategoryDto;
import com.taskpilot.todolistservice.dto.CategoryRequestDto;
import com.taskpilot.todolistservice.exception.ResourceNotFoundException;
import com.taskpilot.todolistservice.mappers.CategoryMapper;
import com.taskpilot.todolistservice.model.Category;
import com.taskpilot.todolistservice.repository.CategoryRepository;
import com.taskpilot.todolistservice.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private TaskRepository taskRepository; 

    @Autowired
    private CategoryMapper categoryMapper; 

    @Transactional
    public CategoryDto createCategory(CategoryRequestDto requestDto, Long userId) {
        Category category = new Category();
        category.setName(requestDto.getName());
        category.setUserId(userId);

        Category savedCategory = categoryRepository.save(category);
        return categoryMapper.toDto(savedCategory);
    }

    @Transactional(readOnly = true)
    public List<CategoryDto> getAllCategoriesForUser(Long userId) {
        return categoryRepository.findByUserId(userId).stream()
                .map(categoryMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CategoryDto getCategoryById(Long categoryId, Long userId) {
        Category category = findCategoryByIdAndUserId(categoryId, userId);
        return categoryMapper.toDto(category);
    }

    @Transactional
    public CategoryDto updateCategory(Long categoryId, CategoryRequestDto requestDto, Long userId) {
        Category categoryToUpdate = findCategoryByIdAndUserId(categoryId, userId);
        categoryToUpdate.setName(requestDto.getName());
        Category updatedCategory = categoryRepository.save(categoryToUpdate);
        return categoryMapper.toDto(updatedCategory);
    }

    @Transactional
    public void deleteCategory(Long categoryId, Long userId) {
        
        Category categoryToDelete = findCategoryByIdAndUserId(categoryId, userId);

        
        long taskCount = taskRepository.countByCategoryIdAndUserId(categoryId, userId);
        if (taskCount > 0) {
            throw new IllegalStateException("Cannot delete category: it is currently assigned to " + taskCount + " task(s).");
        }

        categoryRepository.delete(categoryToDelete);
    }

    
    public Category findCategoryByIdAndUserId(Long categoryId, Long userId) {
        return categoryRepository.findByIdAndUserId(categoryId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));
    }
}