package com.taskpilot.todolistservice.config;

import com.google.genai.Client;
import com.google.genai.Models;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;

@Configuration
public class GeminiConfig {
    private static final Logger logger = LoggerFactory.getLogger(GeminiConfig.class);


    @Value("${gemini.project.id}")
    private String projectId;

    @Value("${gemini.location}")
    private String location;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Bean
    public Models genAiClient() throws IOException {
        return Client.builder().apiKey(apiKey).build().models;
    }
}