package org.server.socialapp.services;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.List;

@Service
public class ImageUploaderService {

	public List<String> uploadImages(String bucketName , List<MultipartFile> files) throws Exception {
		String credentialsPath = "src/main/resources/project-id.json";

		Storage storage = StorageOptions.newBuilder()
				.setCredentials(GoogleCredentials.fromStream(new FileInputStream(credentialsPath)))
				.build()
				.getService();

		List<String> imageUrls = new ArrayList<>();

		for (MultipartFile file : files) {
			String objectName = file.getOriginalFilename();
			BlobId blobId = BlobId.of(bucketName , objectName);
			BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();
			storage.create(blobInfo , file.getBytes());

			String imageUrl = "https://storage.googleapis.com/" + bucketName + "/" + objectName;
			imageUrls.add(imageUrl);

			System.out.println("Image uploaded successfully to bucket " + bucketName + " as object " + objectName);
		}

		return imageUrls;
	}
}
