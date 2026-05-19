package com.shopease.authservice.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI shopEaseOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("ShopEase Auth & Payments API")
                        .description("Interactive API documentation for authentication, profile, memberships, and payment flows.")
                        .version("v1")
                        .contact(new Contact().name("ShopEase Team").email("support@shopease.local"))
                        .license(new License().name("Internal Use")))
                .servers(List.of(
                        new Server().url("http://localhost:8082").description("Local"),
                        new Server().url("http://localhost:8082/api/auth").description("Auth Base URL")
                ));
    }
}
