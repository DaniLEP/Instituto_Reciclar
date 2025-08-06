# Kitchen Management System  
**Instituto Reciclar**

[![Tech Stack](https://img.shields.io/badge/tech-Firebase%2C_React%2C_TailwindCSS-blue)](https://firebase.google.com/)  <br> </br>
[![Status](https://img.shields.io/badge/status-Production-green)](plataforma-reciclar.vercel.app/)   <br> </br>

---

## 1. Introduction

### 1.1 Overview  
This system was developed to streamline and automate the control of food inflow and outflow in the kitchen of *Instituto Reciclar*. It provides a modern, secure, and user-friendly interface designed for internal staff, promoting operational efficiency, time savings, and accuracy in day-to-day food management.

### 1.2 Target Users  
The platform is intended for internal use by authorized staff, with access levels defined by user roles:

- **Administrator**  
- **Nutritionist**  
- **Kitchen Staff**

Access to system features is restricted and managed according to these user roles.

---

## 2. Technologies Used

| Technology       | Description                                                                 |
|------------------|-----------------------------------------------------------------------------|
| **React**        | Frontend framework used for building interactive user interfaces.          |
| **Vite**         | Lightning-fast development and build tool for modern web projects.         |
| **TailwindCSS**  | Utility-first CSS framework for responsive, customizable styling.          |
| **ShadCN UI**    | Accessible and elegant UI components library.                              |
| **Firebase**     | Backend infrastructure used for Authentication, Firestore, and Storage.    |
| **Node.js**      | Runtime environment used for server-side logic and APIs.                   |
| **GitHub**       | Version control and collaborative source code hosting.                     |
| **Google Drive** | Used for storing documentation in PDF format, restricted to internal users. |

---

## 3. System Architecture & Functional Modules

### 3.1 Authentication Module

- **Login**: Email/password or Google login restricted to *@reciclar.org.br* domain users.  
- **Password Recovery**: Password reset via email link.  

### 3.2 Home Dashboard  
Role-based dashboard with access to authorized functionalities.

### 3.3 Nutrition Module

- **Technical Sheet**: Recipe creation with image upload, viewing, and scaling for servings.  
- **Menus**: Create (Breakfast, Lunch, Afternoon Snack), approval workflow, editing, and export.  
- **Meals**: Daily meal registrations with real-time calculation and data export.  

### 3.4 Product & Inventory Management

- **Product Registration**: SKU generation and supplier linking.  
- **Product Entry**: Logging stock inflows with batch and expiry data.  
- **Suppliers**: Create and manage supplier data with auto-address filling.

### 3.5 Inventory Control

- Real-time stock status: Normal, Low, Expired.  
- Filters, quick expiry editing, inventory input, and export.

### 3.6 Product Withdrawal

- Withdrawal interface with alerts and product search.  
- Complete withdrawal history with detailed logs and export.

### 3.7 Dashboards & Analytics

- Interactive real-time statistics on consumption, inventory, and operations.

### 3.8 Additional Features

- Documentation access via Google Drive restricted to institutional domain.  
- User management with role assignment and activity monitoring.  
- User profile page.  
- Maintenance checklists for kitchen operational standards.

---

## 4. Getting Started

### Prerequisites

- Node.js (v14 or higher)  
- Firebase account with configured project  
- Access credentials for institutional Google domain  

### Installation

```bash
git clone https://github.com/DaniLEP/Instituto_Reciclar.git

cd kitchen-management-system

npm install

npm run dev
