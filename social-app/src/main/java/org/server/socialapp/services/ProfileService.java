package org.server.socialapp.services;

import org.server.socialapp.models.User;
import org.server.socialapp.repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProfileService {

	private static final Logger logger = LoggerFactory.getLogger(ProfileService.class);

	@Autowired
	private UserRepository userRepository;

	public User updateProfile(String username , User updatedUser) {
		User user = userRepository.findByUsername(username);
		if (user == null) {
			throw new IllegalArgumentException("User not found with username: " + username);
		}

		if (updatedUser.getBio() != null) {
			user.setBio(updatedUser.getBio());
		}
		if (updatedUser.getRole() != null) {
			user.setRole(updatedUser.getRole());
		} else {
			user.setRole("simple_account");
		}
		if (updatedUser.getTitle() != null) {
			user.setTitle(updatedUser.getTitle());
		}
		if (updatedUser.getLinks() != null && !updatedUser.getLinks().isEmpty()) {
			List<String> updatedLinks = updatedUser.getLinks();
			List<String> uniqueLinks = updatedLinks.stream()
					.distinct()
					.filter(link -> !user.getLinks().contains(link))
					.collect(Collectors.toList());
			user.getLinks().addAll(uniqueLinks);
		}


		logger.info("User updated: {}" , user.getUsername());
		return userRepository.save(user);
	}
}
