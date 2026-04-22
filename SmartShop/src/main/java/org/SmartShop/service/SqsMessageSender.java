package org.SmartShop.service;

import io.awspring.cloud.sqs.operations.SqsTemplate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class SqsMessageSender {

    private final SqsTemplate sqsTemplate;

    @Value("${SQS_QUEUE_URL}")
    private String sqsQueueUrl;

    public void sendMessage(String message) {
        log.info("Sending message to SQS queue {}: {}", sqsQueueUrl, message);
        sqsTemplate.send(sqsQueueUrl, message);
        log.info("Message sent successfully!");
    }
}
