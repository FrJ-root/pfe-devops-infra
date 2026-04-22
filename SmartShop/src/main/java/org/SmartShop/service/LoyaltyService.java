package org.SmartShop.service;

import org.SmartShop.entity.Client;
import java.math.BigDecimal;

public interface LoyaltyService {
    BigDecimal calculateLoyaltyDiscount(Client client, BigDecimal orderSubTotal);
    void updateClientTier(Client client);
}