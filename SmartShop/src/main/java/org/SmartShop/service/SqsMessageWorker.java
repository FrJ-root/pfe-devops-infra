package org.SmartShop.service;

import io.awspring.cloud.sqs.annotation.SqsListener;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class SqsMessageWorker {

    @SqsListener("${SQS_QUEUE_URL}")
    public void processMessage(String message) {
        log.info("=================================================");
        log.info("WORKER TRIGGERED: SQS Message Received!");
        log.info("Processing Message Content: {}", message);
        
        // Simulating some long running background processing
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        log.info("Message processed successfully.");
        log.info("=================================================");
    }
}
