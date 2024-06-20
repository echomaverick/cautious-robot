package org.server.socialapp.services;

import org.server.socialapp.models.User;
import org.server.socialapp.repositories.UserRepository;
import org.server.socialapp.util.JwtTokenUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class LoginService {

	private static final Logger logger = LoggerFactory.getLogger(LoginService.class);

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	public String login(String username, String password) {
		logger.info("Attempting to login with username {} and password {}", username, password);
		User user = userRepository.findByUsername(username);
		if(user!=null && passwordEncoder.matches(password, user.getPassword())) {
			String token = jwtTokenUtil.generateToken(username, user.getId());
			logger.info("Successfully logged in {}", username);
			return token;
		}else{
			logger.error("Username {} does not exist", username);
			throw new IllegalArgumentException("Invalid username or password");
		}
	}
}
