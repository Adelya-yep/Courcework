package ru.flamexander.spring.security.jwt.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

    @Column(name = "price_per_person")
    private boolean pricePerPerson; // Новое поле для настраиваемости

    public Double getServicePrice() {
        return servicePrice;
    }
}