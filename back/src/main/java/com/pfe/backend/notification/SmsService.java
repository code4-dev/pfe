package com.pfe.backend.notification;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class SmsService {
  @Value("${twilio.account-sid:}")
  private String accountSid;

  @Value("${twilio.auth-token:}")
  private String authToken;

  @Value("${twilio.phone-number:}")
  private String fromPhoneNumber;

  private boolean twilioConfigured;

  @PostConstruct
  void init() {
    twilioConfigured = !isBlank(accountSid) && !isBlank(authToken) && !isBlank(fromPhoneNumber);
    if (twilioConfigured) {
      Twilio.init(accountSid, authToken);
      log.info("Twilio initialise pour les notifications SMS");
    } else {
      log.warn("Twilio non configure: les envois SMS echoueront tant que les credentials seront vides");
    }
  }

  public void envoyerNotificationRetard(String numeroTelephone, String nomProjet, int delaiJours) {
    if (!twilioConfigured) {
      throw new IllegalStateException("Twilio n'est pas configure");
    }
    if (isBlank(numeroTelephone)) {
      throw new IllegalArgumentException("Numero de telephone destinataire absent");
    }

    String contenu = "Alerte suivi: aucun suivi du projet %s depuis %d jours. Merci de le soumettre rapidement."
      .formatted(nomProjet, delaiJours);

    Message.creator(
      new PhoneNumber(numeroTelephone),
      new PhoneNumber(fromPhoneNumber),
      contenu
    ).create();

    log.info("SMS de retard envoye a {}", numeroTelephone);
  }

  private boolean isBlank(String value) {
    return value == null || value.isBlank();
  }
}
