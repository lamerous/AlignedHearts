package com.alignedhearts.ah_spring;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @Value("${spring.application.name}")
    private String appName;

    @GetMapping("/")
    public String sayHello() {
        return "Hey, this is my first SpringBoot backend";
    }

    @GetMapping("/greeting")
    public String greet(@RequestParam(value = "name", defaultValue = "Мир") String name) {
        return String.format("Привет %s!", name);
    }

    @GetMapping("/info")
    public String info() {
        return String.format("Имя приложения %s", appName);
    }
}
