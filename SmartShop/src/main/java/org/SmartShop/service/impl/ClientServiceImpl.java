package org.SmartShop.service.impl;

import lombok.RequiredArgsConstructor;
import org.SmartShop.dto.client.ClientOrderHistoryDTO;
import org.SmartShop.dto.client.ClientResponseDTO;
import org.SmartShop.dto.client.ClientRequestDTO;
import org.SmartShop.entity.Client;
import org.SmartShop.entity.enums.ClientStatus;
import org.SmartShop.mapper.ClientMapper;
import org.SmartShop.repository.ClientRepository;
import org.SmartShop.repository.OrderRepository;
import org.SmartShop.service.ClientService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository;
    private final OrderRepository orderRepository;
    private final ClientMapper clientMapper;

    @Override
    public ClientResponseDTO updateClient(Long id, ClientRequestDTO dto) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        client.setName(dto.getName());
        client.setEmail(dto.getEmail());

        return clientMapper.toDto(clientRepository.save(client));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClientOrderHistoryDTO> getClientOrderHistory(Long id) {
        return orderRepository.findByClientId(id).stream()
                .map(clientMapper::toHistoryDto)
                .collect(Collectors.toList());
    }

    @Override
    public ClientResponseDTO createClient(ClientRequestDTO dto) {
        Client client = clientMapper.toEntity(dto);
        return clientMapper.toDto(clientRepository.save(client));
    }

    @Override
    @Transactional(readOnly = true)
    public ClientResponseDTO getClientById(Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        return clientMapper.toDto(client);
    }

    @Override
    public void deleteClient(Long id) {
        try {
            Client client = clientRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Client not found"));
            // Soft delete - set deleted flag to true
            client.setDeleted(true);
            clientRepository.save(client);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete client: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public long getClientCount() {
        return clientRepository.count();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClientResponseDTO> getAllClients() {
        return clientRepository.findAll()
                .stream()
                .filter(client -> !Boolean.TRUE.equals(client.getDeleted()))
                .map(clientMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public void blockClient(Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        client.setStatus(ClientStatus.BLOCKED);
        clientRepository.save(client);
    }

    @Override
    public void unblockClient(Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        client.setStatus(ClientStatus.ACTIVE);
        clientRepository.save(client);
    }
}
