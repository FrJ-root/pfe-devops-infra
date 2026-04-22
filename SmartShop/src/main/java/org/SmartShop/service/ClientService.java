package org.SmartShop.service;

import org.SmartShop.dto.client.ClientOrderHistoryDTO;
import org.SmartShop.dto.client.ClientResponseDTO;
import org.SmartShop.dto.client.ClientRequestDTO;
import java.util.List;

public interface ClientService {

    ClientResponseDTO updateClient(Long id, ClientRequestDTO dto);

    List<ClientOrderHistoryDTO> getClientOrderHistory(Long id);

    ClientResponseDTO createClient(ClientRequestDTO dto);

    ClientResponseDTO getClientById(Long id);

    void deleteClient(Long id);

    long getClientCount();

    List<ClientResponseDTO> getAllClients();

    void blockClient(Long id);

    void unblockClient(Long id);
}