package com.example.report.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import jakarta.mail.internet.MimeMessage;
import java.io.File;
import java.util.List;
import java.util.Map;

/**
 * Notification service for alert events and scheduled report delivery.
 * Supports email and webhook channels.
 */
@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final JavaMailSender mailSender;
    private final WebClient webClient;

    @Value("${report.notification.from:noreply@report-service.local}")
    private String fromAddress;

    public NotificationService(JavaMailSender mailSender, WebClient.Builder webClientBuilder) {
        this.mailSender = mailSender;
        this.webClient = webClientBuilder.build();
    }

    /**
     * Send an alert notification email.
     */
    public void sendAlertEmail(String recipient, String reportKey, String field,
                               String condition, Object currentValue, Object threshold) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromAddress);
            message.setTo(recipient);
            message.setSubject(String.format("Alert: %s %s %s — %s", field, condition, threshold, reportKey));
            message.setText(String.format(
                    "Rapor: %s\nAlan: %s\nKoşul: %s %s\nMevcut değer: %s\n\nBu otomatik bir bildirimdir.",
                    reportKey, field, condition, threshold, currentValue
            ));
            mailSender.send(message);
            log.info("Alert email sent to {} for report={} field={}", recipient, reportKey, field);
        } catch (Exception e) {
            log.warn("Failed to send alert email to {}: {}", recipient, e.getMessage());
        }
    }

    /**
     * Send a scheduled report delivery email with file attachment.
     */
    public void sendScheduleEmail(String recipient, String reportKey, String filePath) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setFrom(fromAddress);
            helper.setTo(recipient);
            helper.setSubject(String.format("Zamanlanmış Rapor: %s", reportKey));
            helper.setText(String.format(
                    "Merhaba,\n\n%s raporunuz ektedir.\n\nBu otomatik bir bildirimdir.",
                    reportKey
            ));

            File file = new File(filePath);
            if (file.exists()) {
                helper.addAttachment(file.getName(), file);
            }

            mailSender.send(mimeMessage);
            log.info("Schedule email sent to {} for report={}", recipient, reportKey);
        } catch (Exception e) {
            log.warn("Failed to send schedule email to {}: {}", recipient, e.getMessage());
        }
    }

    /**
     * Send a webhook notification (for alert channels with type=webhook).
     */
    public void sendWebhook(String webhookUrl, Map<String, Object> payload) {
        try {
            webClient.post()
                    .uri(webhookUrl)
                    .bodyValue(payload)
                    .retrieve()
                    .toBodilessEntity()
                    .block();
            log.info("Webhook sent to {}", webhookUrl);
        } catch (Exception e) {
            log.warn("Failed to send webhook to {}: {}", webhookUrl, e.getMessage());
        }
    }
}
