package com.taskpilot.userservice;

import com.taskpilot.userservice.generator.UserDataGenerator;
import com.taskpilot.userservice.model.User;
import com.taskpilot.userservice.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@SpringBootApplication
public class GenerateUserData implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(GenerateUserData.class);
    private static final int NO_OF_USERS = 10;
    private static final boolean RESET = true;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public static void main(String[] args) {
        SpringApplication.run(GenerateUserData.class, args);
    }

    @Override
    @Transactional
    public void run(String... args) throws InterruptedException {
        if (RESET) {
            userRepository.deleteAll();
            userRepository.flush();
        }

        log.info("Generating {} users...", NO_OF_USERS);
        List<User> users = UserDataGenerator.generateUsers(NO_OF_USERS, passwordEncoder);

        for (User user : users) {
            userRepository.save(user);
            log.info("Saved user: {}", user.getEmail());
        }
        userRepository.flush();
        log.info("User data generation complete.");
    }
}