package org.server.socialapp.controllers;

import org.server.socialapp.services.ImageUploaderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class ImageUploadController {

	private final ImageUploaderService imageUploaderService;

	@Value("${bucketName}")
	private String bucketName;

	@Autowired
	public ImageUploadController(ImageUploaderService imageUploaderService) {
		this.imageUploaderService = imageUploaderService;
	}

	@PostMapping("/api/images/upload")
	public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
		if (file == null || file.isEmpty()) {
			return ResponseEntity.status(400).body("File is missing");
		}

		try {
			String objectName = file.getOriginalFilename();
			imageUploaderService.uploadImage(bucketName , objectName , file);
			String imageUrl = "https://storage.googleapis.com/" + bucketName + "/" + objectName;
			return ResponseEntity.ok().body("Image uploaded successfully. URL: " + imageUrl);
		} catch (Exception e) {
			return ResponseEntity.status(500).body("Image upload failed: " + e.getMessage());
		}
	}
}
