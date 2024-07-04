package org.server.socialapp.services;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileInputStream;

@Service
public class ImageUploaderService {

	public void uploadImage(String bucketName , String objectName , MultipartFile file) throws Exception {
		String credentialsPath = "src/main/resources/inbound-rune-422808-u5-2ed72c3b4a3d.json";

		Storage storage = StorageOptions.newBuilder()
				.setCredentials(GoogleCredentials.fromStream(new FileInputStream(credentialsPath)))
				.build()
				.getService();

		BlobId blobId = BlobId.of(bucketName , objectName);
		BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();
		storage.create(blobInfo , file.getBytes());

		System.out.println("Image uploaded successfully to bucket " + bucketName + " as object " + objectName);
	}
}
