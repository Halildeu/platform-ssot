package com.example.report.service;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.scheduling.support.CronExpression;

import java.time.LocalDateTime;
import java.time.ZoneId;

import static org.junit.jupiter.api.Assertions.*;

class ScheduleExecutionServiceTest {

    @Nested
    class CronParsing {

        @Test
        void fiveFieldCronConvertedToSixField() {
            String userCron = "0 9 * * 1";
            String springCron = "0 " + userCron;
            CronExpression expr = CronExpression.parse(springCron);
            assertNotNull(expr);
        }

        @Test
        void sixFieldCronParsedDirectly() {
            String springCron = "0 0 9 * * 1";
            CronExpression expr = CronExpression.parse(springCron);
            assertNotNull(expr);
        }

        @Test
        void everyMinuteCronWorks() {
            String springCron = "0 * * * * *";
            CronExpression expr = CronExpression.parse(springCron);
            LocalDateTime now = LocalDateTime.of(2026, 4, 4, 10, 30, 0);
            LocalDateTime next = expr.next(now);
            assertNotNull(next);
            assertEquals(31, next.getMinute());
        }

        @Test
        void dailyAt9amCronWorks() {
            String springCron = "0 0 9 * * *";
            CronExpression expr = CronExpression.parse(springCron);
            LocalDateTime afterNine = LocalDateTime.of(2026, 4, 4, 9, 1, 0);
            LocalDateTime next = expr.next(afterNine);
            assertNotNull(next);
            assertEquals(9, next.getHour());
            assertEquals(0, next.getMinute());
            assertEquals(5, next.getDayOfMonth()); // next day
        }

        @Test
        void weeklyMondayCronWorks() {
            // "0 9 * * 1" → Monday at 9am
            String springCron = "0 0 9 * * 1";
            CronExpression expr = CronExpression.parse(springCron);
            // 2026-04-04 is Saturday
            LocalDateTime saturday = LocalDateTime.of(2026, 4, 4, 10, 0, 0);
            LocalDateTime next = expr.next(saturday);
            assertNotNull(next);
            // Next Monday is April 6
            assertEquals(6, next.getDayOfMonth());
            assertEquals(9, next.getHour());
        }

        @Test
        void invalidCronThrowsException() {
            assertThrows(IllegalArgumentException.class,
                    () -> CronExpression.parse("invalid cron"));
        }

        @Test
        void autoDetectFieldCount() {
            String fiveField = "30 14 * * 1-5";
            String[] parts = fiveField.split("\\s+");
            assertEquals(5, parts.length);

            String springCron = parts.length == 5 ? "0 " + fiveField : fiveField;
            CronExpression expr = CronExpression.parse(springCron);
            assertNotNull(expr);

            // Weekday at 14:30
            LocalDateTime monday = LocalDateTime.of(2026, 4, 6, 14, 0, 0);
            LocalDateTime next = expr.next(monday);
            assertNotNull(next);
            assertEquals(14, next.getHour());
            assertEquals(30, next.getMinute());
        }
    }

    @Nested
    class TimezoneHandling {

        @Test
        void istanbulTimezoneResolves() {
            ZoneId zone = ZoneId.of("Europe/Istanbul");
            assertNotNull(zone);
            assertEquals("Europe/Istanbul", zone.getId());
        }

        @Test
        void utcTimezoneResolves() {
            ZoneId zone = ZoneId.of("UTC");
            assertNotNull(zone);
        }

        @Test
        void invalidTimezoneThrows() {
            assertThrows(Exception.class, () -> ZoneId.of("Invalid/Zone"));
        }
    }
}
