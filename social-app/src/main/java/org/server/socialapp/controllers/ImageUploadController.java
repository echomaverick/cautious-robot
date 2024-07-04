package org.server.socialapp.controllers;

import org.server.socialapp.services.ImageUploaderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/images")
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
            List<String> imageUrls = imageUploaderService.uploadImages(bucketName, files);
            return ResponseEntity.ok().body("Images uploaded successfully. URLs: " + imageUrls);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to upload images: " + e.getMessage());
        } catch (Exception e) {
	        throw new RuntimeException(e);
        }
    }
}
