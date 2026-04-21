package com.pfe.backend.notification;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
  private final JavaMailSender mailSender;

  @Value("${spring.mail.username}")
  private String fromEmail;

  public void envoyerNotificationRetard(String destinataire,
                                        String nomChefProjet,
                                        String nomProjet,
                                        int delaiJours) {
    try {
      MimeMessage mimeMessage = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, false, "UTF-8");
      helper.setFrom(fromEmail);
      helper.setTo(destinataire);
      helper.setSubject("[Action requise] Fiche de suivi en retard - " + nomProjet);
      helper.setText(buildEmailBody(nomChefProjet, nomProjet, delaiJours), true);
      mailSender.send(mimeMessage);
      log.info("Email de retard envoye a {}", destinataire);
    } catch (MessagingException ex) {
      throw new IllegalStateException("Echec envoi email", ex);
    }
  }

  private String buildEmailBody(String nomChefProjet, String nomProjet, int delaiJours) {
    return """
      <html>
        <body style="font-family:Arial,sans-serif;background:#f8fafc;padding:20px;">
          <div style="max-width:620px;margin:auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:24px;">
            <h2 style="margin:0 0 12px 0;color:#b91c1c;">Fiche de suivi en retard</h2>
            <p style="margin:0 0 12px 0;color:#1e293b;">Bonjour <strong>%s</strong>,</p>
            <p style="margin:0 0 12px 0;color:#334155;">
              Aucun suivi n'a ete saisi pour le projet <strong>%s</strong> depuis plus de <strong>%d jours</strong>.
            </p>
            <p style="margin:0 0 16px 0;color:#334155;">
              Merci de soumettre une fiche de suivi des que possible pour maintenir un suivi projet a jour.
            </p>
            <div style="background:#fef2f2;border-left:4px solid #dc2626;padding:12px;color:#7f1d1d;">
              Notification automatique de suivi qualite.
            </div>
          </div>
        </body>
      </html>
      """.formatted(nomChefProjet, nomProjet, delaiJours);
  }
}
