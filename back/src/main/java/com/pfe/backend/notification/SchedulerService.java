package com.pfe.backend.notification;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SchedulerService {
  private final NotificationService notificationService;

  @Scheduled(cron = "0 0 8 * * MON-FRI")
  public void verifierRetardsAutomatiquement() {
    List<Notification> notifications = notificationService.verifierEtNotifierRetards(null, false);
    log.info("Verification automatique terminee: {} notification(s) generee(s)", notifications.size());
  }
}
