package com.taskpilot.todolistservice.controller;

import com.taskpilot.todolistservice.dto.CategoryDto;
import com.taskpilot.todolistservice.dto.CategoryRequestDto;
import com.taskpilot.todolistservice.security.JwtUtil;
import com.taskpilot.todolistservice.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@CrossOrigin(origins = "*")
public class CategoryController {

    private final CategoryService categoryService;
    private final JwtUtil jwtUtil;

    @Autowired
    public CategoryController(CategoryService categoryService, JwtUtil jwtUtil) {
        this.categoryService = categoryService;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Extracts the user ID from the JWT token stored in the Authentication object.
     * This relies on the JwtAuthenticationFilter correctly placing the token in the 'credentials'.
     *
     * @param authentication The security context's authentication object.
     * @return The user's ID (Long).
     */
    private Long getUserIdFromAuthentication(Authentication authentication) {
        String token = (String) authentication.getCredentials();
        return jwtUtil.getClaimFromToken(token, claims -> claims.get("userId", Long.class));
    }

    @PostMapping
    public ResponseEntity<CategoryDto> createCategory(@Valid @RequestBody CategoryRequestDto requestDto, Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        CategoryDto newCategory = categoryService.createCategory(requestDto, userId);
        return new ResponseEntity<>(newCategory, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<CategoryDto>> getAllCategories(Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        List<CategoryDto> categories = categoryService.getAllCategoriesForUser(userId);
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryDto> getCategoryById(@PathVariable Long id, Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        CategoryDto category = categoryService.getCategoryById(id, userId);
        return ResponseEntity.ok(category);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryDto> updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryRequestDto requestDto, Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        CategoryDto updatedCategory = categoryService.updateCategory(id, requestDto, userId);
        return ResponseEntity.ok(updatedCategory);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id, Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        categoryService.deleteCategory(id, userId);
        return ResponseEntity.noContent().build();
    }
}