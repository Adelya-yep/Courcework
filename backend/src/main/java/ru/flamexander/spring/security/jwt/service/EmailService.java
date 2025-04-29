package ru.flamexander.spring.security.jwt.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.mail.util.ByteArrayDataSource;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendBookingTicketEmail(String toEmail, byte[] pdf) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(toEmail);
        helper.setSubject("Ваш билет на бронирование");
        helper.setText("Ваш билет на бронирование во вложении.");
        helper.addAttachment("booking_ticket.pdf", new ByteArrayDataSource(pdf, "application/pdf"));
        mailSender.send(message);
    }

    public void sendResetLink(String toEmail, String token) throws MessagingException {
        String resetLink = "http://localhost:5173/reset-password?token=" + token;
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");  // Поддержка UTF-8

        helper.setTo(toEmail);
        helper.setSubject("Сброс пароля");

        // HTML-письмо с кликабельной ссылкой
        String htmlMsg = """
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h2>Сброс пароля</h2>
            <p>Для сброса пароля нажмите на кнопку ниже:</p>
            <a href="%s" style="display: inline-block; padding: 10px 20px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
                Сбросить пароль
            </a>
            <p style="font-size: 12px; color: #777;">Ссылка действительна 10 минут.</p>
        </div>
        """.formatted(resetLink);

        helper.setText(htmlMsg, true);  // true = HTML-формат
        mailSender.send(message);
    }
}