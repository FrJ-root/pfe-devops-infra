# SmartShop - B2B Hardware Distribution API 🚀

**SmartShop** is a robust REST API designed for **MicroTech Maroc**, a B2B computer hardware distributor. The system manages a portfolio of clients with an automated loyalty system, complex order processing with multi-method split payments, and strict financial tracking.

## 📋 Project Context
* **Type:** Backend REST API (Spring Boot)
* **Context:** B2B E-commerce & Stock Management
* **Architecture:** Layered Architecture (Controller, Service, Repository, Entity, DTO)
* **Security:** Manual HTTP Session Authentication (No Spring Security/JWT)

---

## 🛠️ Tech Stack

* **Java 17** - Core Language
* **Spring Boot 3.2** - Framework (Web, Data JPA)
* **PostgreSQL 15** - Database
* **Docker & Compose** - Containerization
* **Lombok** - Boilerplate reduction
* **MapStruct** - DTO <-> Entity Mapping
* **JUnit 5 & Mockito** - Unit Testing
* **JaCoCo** - Code Coverage Reports

---

## ✨ Key Features

### 1. 👥 Client Management & Fidelity
* **User Roles:** ADMIN (Manager) and CLIENT (B2B Customer).
* **Automated Statistics:** Tracks total orders and total spent in real-time.
* **Dynamic Tier System:**
    * **BASIC:** Default level.
    * **SILVER:** >3 Orders OR >1,000 DH spent (5% discount > 500 DH).
    * **GOLD:** >10 Orders OR >5,000 DH spent (10% discount > 800 DH).
    * **PLATINUM:** >20 Orders OR >15,000 DH spent (15% discount > 1,200 DH).

### 2. 📦 Product Inventory
* **Stock Management:** Automatic decrement upon order confirmation.
* **Soft Delete:** Products used in old orders are marked `deleted=true` instead of being removed from DB, preserving history while hiding them from new orders.
* **Filtering:** Pagination and search functionality.

### 3. 🛒 Order Processing
* **Complex Calculations:**
    * `SubTotal` -> `Loyalty Discount` + `Promo Code` -> `Tax (20%)` -> `Total TTC`.
* **Validation Rules:**
    * Orders are `PENDING` by default.
    * Auto-rejection if Stock is insufficient (`REJECTED`).
    * **Strict Rule:** An order can ONLY be `CONFIRMED` by Admin if the **Remaining Amount is 0**.

### 4. 💳 Multi-Method Payments
* **Split Payments:** Supports paying one order via multiple transactions (e.g., 50% Cash, 50% Check).
* **Payment Methods:**
    * **CASH (Espèces):** Limit of 20,000 DH (Art. 193 CGI). Immediate encashment.
    * **CHECK (Chèque):** Requires Bank, Reference, Due Date.
    * **TRANSFER (Virement):** Requires Reference.

---

## 🚀 How to Run

### Prerequisites
* Docker & Docker Compose
* (Optional) Java 17 & Maven for local dev

### Option 1: Quick Start (Docker)
The easiest way to run the full stack (App + DB + PgAdmin).

1.  **Build and Start:**
    ```bash
    docker-compose up --build -d
    ```
2.  **Access:**
    * **API:** `http://localhost:8080`
    * **Swagger UI:** `http://localhost:8080/swagger-ui/index.html`
    * **PgAdmin:** `http://localhost:5050` (Email: `admin@smartshop.com`, Pass: `admin`)

### Option 2: Local Run (Maven)
If you prefer running the JAR locally:

1.  **Start Database:** `docker-compose up smartshop-db -d`
2.  **Run App:**
    ```bash
    mvn spring-boot:run
    ```

---

## 🔐 Authentication & Seeding

**Data Seeder:** On startup, the application creates default users if they don't exist.

| Role | Username | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin` | `admin123` | Full CRUD, Validate Orders, Payments |
| **CLIENT** | `techsolutions` | `client123` | View Profile, History, Create Order |

> **Note:** Authentication uses **HTTP Session**. When testing in Postman, ensure you send the `POST /api/auth/login` request first. Postman will automatically store the `JSESSIONID` cookie for subsequent requests.

---

## 🧪 Testing & Quality

The project includes Unit Tests for the Service Layer (Business Logic) and Controller Layer (Web).

### Run Tests
```bash
mvn test