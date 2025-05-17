package ru.flamexander.spring.security.jwt.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ru.flamexander.spring.security.jwt.dtos.ServiceDto;
import ru.flamexander.spring.security.jwt.entities.Services;
import ru.flamexander.spring.security.jwt.exceptions.ResourceNotFoundException;
import ru.flamexander.spring.security.jwt.repositories.ServiceRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServiceService {
    private final ServiceRepository serviceRepository;

    @Autowired
    public ServiceService(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    public Page<ServiceDto> findAll(Pageable pageable) {
        Page<Services> servicesPage = serviceRepository.findAll(pageable);
        return servicesPage.map(this::convertToDto); // Теперь вызывает публичный метод
    }

    public List<ServiceDto> findAll() {
        return serviceRepository.findAll().stream().map(this::convertToDto).collect(Collectors.toList());  // Теперь вызывает публичный метод
    }

    public ServiceDto findById(Long id) {
        Services service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service with id " + id + " not found"));
        return convertToDto(service); // Теперь вызывает публичный метод
    }

    public ServiceDto save(ServiceDto serviceDto) {
        Services service = new Services();
        service.setServiceName(serviceDto.getServiceName());
        service.setServicePrice(serviceDto.getServicePrice());
        service.setImageUrl(serviceDto.getImageUrl());
        service.setPricePerPerson(serviceDto.isPricePerPerson());
        service = serviceRepository.save(service);
        return convertToDto(service); // Теперь вызывает публичный метод
    }

    public ServiceDto updateService(ServiceDto serviceDto) {
        Services service = serviceRepository.findById(serviceDto.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service with id " + serviceDto.getServiceId() + " not found"));
        service.setServiceName(serviceDto.getServiceName());
        service.setServicePrice(serviceDto.getServicePrice());
        service.setImageUrl(serviceDto.getImageUrl());
        service.setPricePerPerson(serviceDto.isPricePerPerson());
        service = serviceRepository.save(service);
        return convertToDto(service); // Теперь вызывает публичный метод
    }

    public void deleteById(Long id) {
        if (!serviceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Service with id " + id + " not found for deletion");
        }
        serviceRepository.deleteById(id);
    }

    public List<ServiceDto> searchByName(String name) {
        return serviceRepository.findByServiceNameContainingIgnoreCase(name)
                .stream().map(this::convertToDto).collect(Collectors.toList()); // Теперь вызывает публичный метод
    }

    // Сделаем этот метод публичным, чтобы его мог использовать BookingService
    public ServiceDto convertToDto(Services service) {
        if (service == null) {
            return null;
        }
        ServiceDto dto = new ServiceDto();
        dto.setServiceId(service.getServiceId());
        dto.setServiceName(service.getServiceName());
        dto.setServicePrice(service.getServicePrice());
        dto.setImageUrl(service.getImageUrl());
        dto.setPricePerPerson(service.isPricePerPerson());
        return dto;
    }
}