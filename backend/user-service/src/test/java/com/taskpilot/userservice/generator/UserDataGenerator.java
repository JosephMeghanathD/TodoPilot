package com.taskpilot.userservice.generator;

import com.github.javafaker.Faker;
import com.taskpilot.userservice.model.User;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class UserDataGenerator {

    private static final Faker faker = new Faker(new Random());

    public static List<User> generateUsers(int count, PasswordEncoder passwordEncoder) {
        List<User> users = new ArrayList<>();
        User user = new User();
        user.setFirstName("admin");
        user.setLastName("admin");
        user.setEmail("admin@taskpilot-test.com");
        user.setPassword(passwordEncoder.encode("admin"));
        users.add(user);
        for (int i = 0; i < count; i++) {
            String firstName = faker.name().firstName();
            String lastName = faker.name().lastName();
            String email = String.format("%s.%s%d@taskpilot-test.com", firstName.toLowerCase(), lastName.toLowerCase(), i);

            user = new User();
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode("password123"));
            users.add(user);
        }
        return users;
    }
}