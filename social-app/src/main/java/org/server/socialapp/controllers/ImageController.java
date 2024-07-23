package org.server.socialapp.controllers;

import org.server.socialapp.models.ImagesCollection;
import org.server.socialapp.services.ImageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class ImageController {

	private static final Logger logger = LoggerFactory.getLogger(ImageController.class);

	@Autowired
	private ImageService imageService;

	@PostMapping("/update/image/{userId}")
	public ResponseEntity<?> saveImages(@PathVariable String userId , @RequestBody ImagesCollection imagesCollection) {
		logger.info("Request received to save images for user with ID: {}" , userId);

		try {
			ImagesCollection savedImages = imageService.saveImage(userId , imagesCollection.getPostId() , imagesCollection.getImageUrls());
			return ResponseEntity.ok().body("Images saved successfully. Collection ID: " + savedImages.getId());
		} catch (Exception e) {
			logger.error("Failed to save images: {}" , e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save images.");
		}
	}

	@GetMapping("/test")
	public ResponseEntity<String> testEndpoint() {
		return ResponseEntity.ok("Test endpoint is working");
	}
}
