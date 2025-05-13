package ru.flamexander.spring.security.jwt.entities;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "services")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Services {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long serviceId;

    @Column(name = "name")
    private String serviceName;

    @Column(name = "price")
    private Double servicePrice;

    @Column(name = "image_url")
    private String imageUrl;

    // Добавлен геттер для servicePrice
    public Double getServicePrice() {
        return servicePrice;
    }
}