package com.hatechno;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication(scanBasePackages = "com.hatechno") // Quét tất cả các package
public class HatechNoApplication {

	public static void main(String[] args) {
		SpringApplication.run(HatechNoApplication.class, args);
	}

}
