package com.fogbank.springsecurity;

import com.fogbank.springsecurity.Repository.UserRepository;
import com.fogbank.springsecurity.entities.Role;
import com.fogbank.springsecurity.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@SpringBootApplication
public class SpringsecurityApplication implements CommandLineRunner {
@Autowired
private UserRepository userRepository  ;

	public static void main(String[] args) {
		SpringApplication.run(SpringsecurityApplication.class, args);
	}
public  void run(String ... args)
{
	User adminAccount = userRepository.findByRole(Role.ADMIN);
	if(null == adminAccount)
	{
		User user  =  new User()  ;
		user.setEmail("admin@admin.com");
		user.setFirstname("admin");
		user.setLastname("admin");
		try {
			Path path = Paths.get("src/main/resources/static/images/admin.jpg");
			byte[] imageBytes = Files.readAllBytes(path);
			user.setPhoto(imageBytes);
		} catch (IOException e) {
			// Handle file read error
			// Log the error or throw a custom exception
			e.printStackTrace();
		}
		user.setRole(Role.ADMIN);
		user.setPassword(new BCryptPasswordEncoder().encode("admin"));
		userRepository.save(user)  ;
	}
}
}
