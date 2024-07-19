package org.server.socialapp.handlers;

import org.server.socialapp.exceptions.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(ApiException.class)
	public ResponseEntity<Object> handleApiException(ApiException ex) {
		return new ResponseEntity<>(new ErrorResponse(ex.getMessage() , ex.getStatusCode()) , HttpStatus.valueOf(ex.getStatusCode()));
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<Object> handleGenericException(Exception ex) {
		return new ResponseEntity<>(new ErrorResponse("Internal Server Error" , HttpStatus.INTERNAL_SERVER_ERROR.value()) , HttpStatus.INTERNAL_SERVER_ERROR);
	}

	public static class ErrorResponse {
		private final String message;
		private final int statusCode;

		public ErrorResponse(String message , int statusCode) {
			this.message = message;
			this.statusCode = statusCode;
		}

		public String getMessage() {
			return message;
		}

		public int getStatusCode() {
			return statusCode;
		}
	}
}
