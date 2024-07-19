package org.server.socialapp.services;

import org.server.socialapp.exceptions.InternalServerErrorException;
import org.server.socialapp.models.ImagesCollection;
import org.server.socialapp.repositories.ImageRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ImageService {
	private static final Logger logger = LoggerFactory.getLogger(ImageService.class);

	@Autowired
	private ImageRepository imageRepository;

	public ImagesCollection saveImage(String userId , String postId , List<String> imageUrls) {
		ImagesCollection imageCollection = new ImagesCollection(userId , postId , imageUrls);
		try {
			ImagesCollection savedCollection = imageRepository.save(imageCollection);
			logger.info("ImagesCollection saved successfully for the post with ID: {}" , postId);
			return savedCollection;
		} catch (Exception e) {
			logger.error("Failed to save ImagesCollection: {}" , e.getMessage());
			throw new InternalServerErrorException("Failed to save ImagesCollection");
		}
	}
}
