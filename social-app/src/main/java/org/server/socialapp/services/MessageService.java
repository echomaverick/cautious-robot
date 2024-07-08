package org.server.socialapp.services;

import org.server.socialapp.models.Conversation;
import org.server.socialapp.models.Message;
import org.server.socialapp.repositories.ConversationRepository;
import org.server.socialapp.repositories.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
public class MessageService {

	@Autowired
	private MessageRepository messageRepository;

	@Autowired
	private ConversationRepository conversationRepository;

	public Message saveMessage(String senderId , String receiverId , String content) {
		LocalDateTime timeStamp = LocalDateTime.now();
		String firstUserId = senderId.compareTo(receiverId) < 0 ? senderId : receiverId;
		String secondUserId = senderId.compareTo(receiverId) < 0 ? receiverId : senderId;
		Conversation conversation = conversationRepository.findByParticipants(Arrays.asList(firstUserId , secondUserId));

		if (conversation != null) {
			conversation.getMessages().add(new Message(senderId , receiverId , content , timeStamp));
		} else {
			conversation = new Conversation(Arrays.asList(firstUserId , secondUserId) ,
					List.of(new Message(senderId , receiverId , content , timeStamp)));
		}
		conversationRepository.save(conversation);

		return new Message(senderId , receiverId , content , timeStamp);
	}
}
