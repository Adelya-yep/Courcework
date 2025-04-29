package ru.flamexander.spring.security.jwt.service;

import com.itextpdf.io.font.PdfEncodings;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import org.springframework.stereotype.Service;
import ru.flamexander.spring.security.jwt.entities.BookingTicket;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class PdfService {

    public byte[] generatePdf(BookingTicket ticket) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // Загрузка шрифта с поддержкой кириллицы (например, Arial)
        PdfFont font = PdfFontFactory.createFont("fonts/arial.ttf", PdfEncodings.IDENTITY_H, PdfFontFactory.EmbeddingStrategy.FORCE_EMBEDDED);
        document.setFont(font);

        // Добавление заголовка
        document.add(new Paragraph("Билет на бронирование").setFont(font));

        // Обработка null значений
        String userFullName = (ticket.getUserFullName() != null && !ticket.getUserFullName().isEmpty())
                ? ticket.getUserFullName() : "Не указано";
        String roomName = (ticket.getRoomName() != null && !ticket.getRoomName().isEmpty())
                ? ticket.getRoomName() : "Не указано";

        // Добавление данных с метками
        document.add(new Paragraph("Пансионат: " + ticket.getBoardingHouseName()).setFont(font));
        document.add(new Paragraph("ФИО: " + userFullName).setFont(font));
        document.add(new Paragraph("Комната: " + roomName).setFont(font));
        document.add(new Paragraph("Дата заезда: " + ticket.getCheckInDate()).setFont(font));
        document.add(new Paragraph("Дата выезда: " + ticket.getCheckOutDate()).setFont(font));
        document.add(new Paragraph("Цена: " + ticket.getPrice() + " руб.").setFont(font));

        document.close();
        return baos.toByteArray();
    }
}