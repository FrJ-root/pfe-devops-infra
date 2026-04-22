package org.SmartShop.service.impl;

import org.SmartShop.entity.enums.CustomerTier;
import org.springframework.stereotype.Service;
import org.SmartShop.service.LoyaltyService;
import org.SmartShop.entity.Client;
import java.math.RoundingMode;
import java.math.BigDecimal;

@Service
public class LoyaltyServiceImpl implements LoyaltyService {

    private static final int CMD_THRESHOLD_PLATINUM = 20;
    private static final BigDecimal AMOUNT_THRESHOLD_PLATINUM = BigDecimal.valueOf(15000);

    private static final int CMD_THRESHOLD_GOLD = 10;
    private static final BigDecimal AMOUNT_THRESHOLD_GOLD = BigDecimal.valueOf(5000);

    private static final int CMD_THRESHOLD_SILVER = 3;
    private static final BigDecimal AMOUNT_THRESHOLD_SILVER = BigDecimal.valueOf(1000);

    private static final BigDecimal MIN_ORDER_PLATINUM = BigDecimal.valueOf(1200);
    private static final BigDecimal MIN_ORDER_GOLD = BigDecimal.valueOf(800);
    private static final BigDecimal MIN_ORDER_SILVER = BigDecimal.valueOf(500);

    private static final BigDecimal RATE_PLATINUM = new BigDecimal("0.15");
    private static final BigDecimal RATE_GOLD = new BigDecimal("0.10");
    private static final BigDecimal RATE_SILVER = new BigDecimal("0.05");

    @Override
    public BigDecimal calculateLoyaltyDiscount(Client client, BigDecimal subTotal) {
        CustomerTier tier = client.getTier();

        if (tier == null || tier == CustomerTier.BASIC) {
            return BigDecimal.ZERO;
        }

        BigDecimal discountRate = BigDecimal.ZERO;

        switch (tier) {
            case PLATINUM:
                if (subTotal.compareTo(MIN_ORDER_PLATINUM) >= 0) {
                    discountRate = RATE_PLATINUM;
                }
                break;
            case GOLD:
                if (subTotal.compareTo(MIN_ORDER_GOLD) >= 0) {
                    discountRate = RATE_GOLD;
                }
                break;
            case SILVER:
                if (subTotal.compareTo(MIN_ORDER_SILVER) >= 0) {
                    discountRate = RATE_SILVER;
                }
                break;
            default:
                break;
        }

        return subTotal.multiply(discountRate).setScale(2, RoundingMode.HALF_UP);
    }

    @Override
    public void updateClientTier(Client client) {
        int totalOrders = client.getTotalOrders();
        BigDecimal totalSpent = client.getTotalSpent() != null ? client.getTotalSpent() : BigDecimal.ZERO;

        if (totalOrders >= CMD_THRESHOLD_PLATINUM || totalSpent.compareTo(AMOUNT_THRESHOLD_PLATINUM) >= 0) {
            client.setTier(CustomerTier.PLATINUM);
        }
        else if (totalOrders >= CMD_THRESHOLD_GOLD || totalSpent.compareTo(AMOUNT_THRESHOLD_GOLD) >= 0) {
            client.setTier(CustomerTier.GOLD);
        }
        else if (totalOrders >= CMD_THRESHOLD_SILVER || totalSpent.compareTo(AMOUNT_THRESHOLD_SILVER) >= 0) {
            client.setTier(CustomerTier.SILVER);
        }
        else {
            client.setTier(CustomerTier.BASIC);
        }
    }

}