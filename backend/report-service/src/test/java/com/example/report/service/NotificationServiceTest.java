package com.example.report.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.reactive.function.client.WebClient;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock JavaMailSender mailSender;
    @Mock WebClient.Builder webClientBuilder;
    @Mock WebClient webClient;

    NotificationService service;

    @BeforeEach
    void setUp() {
        when(webClientBuilder.build()).thenReturn(webClient);
        service = new NotificationService(mailSender, webClientBuilder);
    }

    @Test
    void sendAlertEmailSendsMessage() {
        service.sendAlertEmail("user@test.com", "hr-report", "salary", "gt", 5000, 3000);

        ArgumentCaptor<SimpleMailMessage> captor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender).send(captor.capture());

        SimpleMailMessage msg = captor.getValue();
        assertNotNull(msg.getTo());
        assertEquals("user@test.com", msg.getTo()[0]);
        assertTrue(msg.getSubject().contains("salary"));
        assertTrue(msg.getSubject().contains("gt"));
        assertTrue(msg.getText().contains("hr-report"));
    }

    @Test
    void sendAlertEmailHandlesExceptionGracefully() {
        doThrow(new RuntimeException("SMTP down")).when(mailSender).send(any(SimpleMailMessage.class));

        // Should not throw
        assertDoesNotThrow(() ->
                service.sendAlertEmail("user@test.com", "report", "field", "gt", 100, 50));
    }

    @Test
    void sendScheduleEmailHandlesMissingFile() {
        when(mailSender.createMimeMessage()).thenReturn(mock(jakarta.mail.internet.MimeMessage.class));

        // File doesn't exist — should still try to send (without attachment)
        assertDoesNotThrow(() ->
                service.sendScheduleEmail("user@test.com", "report", "/nonexistent/path.xlsx"));
    }
}
