package org.server.socialapp.controllers;

import org.server.socialapp.exceptions.InternalServerErrorException;
import org.server.socialapp.services.ImageUploaderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/images")
public class ImageUploadController {

	private final ImageUploaderService imageUploaderService;

	@Value("${bucketName}")
	private String bucketName;

	@Autowired
	public ImageUploadController(ImageUploaderService imageUploaderService) {
		this.imageUploaderService = imageUploaderService;
	}

	@PostMapping("/upload")
	public ResponseEntity<?> uploadImages(@RequestParam("files") List<MultipartFile> files) {
		if (files.isEmpty()) {
			return ResponseEntity.badRequest().body("No files uploaded");
		}

		try {
			List<String> imageUrls = imageUploaderService.uploadImages(bucketName , files);
			return ResponseEntity.ok().body("Images uploaded successfully. URLs: " + imageUrls);
		} catch (Exception e) {
			e.printStackTrace();
			throw new InternalServerErrorException("Something went wrong while uploading images");
		}
	}
}
