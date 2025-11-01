# 🔥 FIRE OS - Field Service Management Dashboard
<img width="1920" height="1080" alt="Screenshot 2025-11-01 160242" src="https://github.com/user-attachments/assets/cc58a4f0-e94b-4e3b-99e8-2552fdc0012e" />


![GitHub last commit](https://img.shields.io/github/last-commit/amkbitshift/FIRE-OS?style=flat-square)
![GitHub repo size](https://img.shields.io/github/repo-size/amkbitshift/FIRE-OS?style=flat-square)

**URL:** `https://amkbitshift.github.io/FIRE-OS/`

A modern, responsive Field Service Management (FSM) application built with React and Tailwind CSS, designed specifically for Fire Safety and Inspection services.

## ✨ Features

FIRE OS provides technicians and management with a centralized view for scheduling, client management, invoicing, and AI-powered report generation.

### Core Modules

* **Dashboard:** High-level overview of total jobs, pending tasks, active clients, invoices, and recent reports.
* **Schedule:** A Kanban-style board to track jobs across statuses: `Incomplete`, `In Progress`, and `Completed`. Allows quick status cycling.
* **Clients:** Dedicated space for managing client information, including contact details and job site addresses.
* **Invoices:** Tool for generating and managing invoices with line-item tracking, subtotal/tax calculations, and status tracking (`Draft`, `Sent`, `Paid`, `Overdue`).
* **AI Reports:** An advanced module that takes raw inspection data (findings, actions taken) and uses a simulated Large Language Model (LLM) to generate comprehensive, professional service reports with pros, cons, and recommendations.

### Technology Stack

* **Frontend Framework:** React
* **Styling:** Tailwind CSS (for utility-first, modern UI)
* **Data Fetching/State:** `@tanstack/react-query`
* **Routing:** `react-router-dom`
* **UI Components:** Built using standard, reusable components (simulating Shadcn UI structure).
* **Backend:** Simulated via a mock `base44Client` for demonstration purposes.
* **AI:** Simulated API invocation for report generation.

## 🚀 Getting Started

Follow these instructions to set up the project locally for development and viewing.

### Prerequisites

* Node.js (LTS recommended)
* npm or yarn

### Installation

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/amkbitshift/FIRE-OS.git](https://github.com/amkbitshift/FIRE-OS.git)
    cd FIRE-OS
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the Application:**
    The project uses a standard React development script.
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The application should open automatically in your browser at `http://localhost:5173` (or similar port).

## 📁 File Structure

The core application files follow a clear, component-based structure:
