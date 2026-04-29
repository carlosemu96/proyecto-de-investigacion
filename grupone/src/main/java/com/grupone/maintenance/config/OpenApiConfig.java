package com.grupone.maintenance.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    OpenAPI maintenanceOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("Grupo NE Maintenance API")
                        .description("API backend para mantenimiento automotriz con enfoque predictivo")
                        .version("v1")
                        .contact(new Contact().name("Grupo NE"))
                        .license(new License().name("Proprietary")));
    }
}
