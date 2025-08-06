# 🌱 CarbonSense: IoT-Driven Emission and Energy Monitoring Platform

## 📌 Overview

*CarbonSense* is a robust full-stack web application for the chemical and petrochemical industries, enabling real-time monitoring and management of *carbon emissions, energy consumption, water usage, and sustainability KPIs*.  
It seamlessly integrates *IoT sensor data via MQTT, features interactive dashboards, predictive maintenance, and generates automated compliance reports to help industry teams progress toward **carbon neutrality*.

---

## 🏗 Architecture Diagram

```text
┌──────────────────────────────────────────────────────────────────────────┐
│                           CarbonSense System                             │
├────────────┬─────────────────────────────┬───────────────────────────────┤
│ IoT/Field  │        Backend (API)        │          Frontend (SSR)       │
│  Devices   │      Node.js + Express      │         JSX Views             │
│ (ESP32,    │        + MQTT Client        │   (Server-Side Rendering)     │
│  sensors)  │                             │                               │
├────────────┼─────────────────────────────┼───────────────────────────────┤
│            │                             │                               │
│ ┌───────┐  │   ┌────────────────────┐    │   ┌──────────────┐            │
│ │Sensor │──┼──►│   MQTT Broker      │◄───┼──►│Dashboard UI  │            │
│ │Device │  │   │   (HiveMQ Cloud)   │    │   └────▲─────────┘            │
│ └───────┘  │   └─────────┬──────────┘    │        │                      │
│            │             │               │    Charts,Tables,Forms        │
│ ┌───────┐  │      MQTT   │               │         (JSX)                 │
│ │Sensor │──┼──────────────┘               │                              │
│ └───────┘  │                             │                               │
│            │       ┌─────────────────────────────┐                       │
│            │       │   Express REST API          │                       │
│            │       │ /api/users, /api/plants,    │                       │
│            │       │ /api/equipment, etc         │                       │
│            │       └─────────▲───────────────────┘                       │
│            │                 │                                           │
│            │         ┌───────┴──────┐                                    │
│            │         │   MongoDB    │                                    │
│            │         │ (Atlas/Local)│                                    │
│            │         └──────────────┘                                    │
└────────────┴─────────────────────────────────────────────────────────────┘
```
- IoT devices send data via MQTT to the backend.
- Backend listens for MQTT and REST API requests, stores all data in MongoDB.
- Server-side JSX views provide dashboards, KPIs, CRUD, and reports.
- All authentication, reporting, and maintenance handled by backend controllers.
---

## 🚀 Features

- 🔐 **Secure Authentication**: JWT-based user login with role-based access (Engineer, Manager, Admin)
- 🌍 **Plant Management**: Add, edit, and track multiple industrial plants and their equipment
- ⚡ **Real-Time Data Ingestion (MQTT)**: Automatically collect environmental readings from IoT sensors (energy, emissions, water usage)
- 📊 **Interactive Dashboard**: Visualize sustainability metrics in charts and graphs
- 🔧 **Predictive Maintenance Logs**: Record and track equipment maintenance to optimize energy efficiency
- 📑 **Automated Reports**: Export sustainability data as PDF or CSV for audits and regulatory compliance
- 🌱 **Carbon Neutrality Insights**: Monitor carbon footprint and identify opportunities for emission reduction

---

## 🏗️ Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Frontend Views:** JSX (server-side rendering)
- **Authentication:** JSON Web Tokens (JWT) with bcrypt password hashing
- **Real-Time Data:** MQTT integration (HiveMQ broker)
- **Styling:** CSS, responsive design for desktop and mobile
- **Testing:** Jest, Supertest, MongoDB Memory Server
- **Deployment:** Railway or Vercel (Cloud-hosted)
- **Documentation:** Trello board, Route Table, README
- **Chart.js:** To show real-time metrics data on dashboard

---

## 🌐 Route Table

| **URL**                               | **HTTP Verb** | **Action**   | **Used For**                                                       | **Mongoose Method**                                                   | **View**                 |
|--------------------------------------|---------------|---------------|---------------------------------------------------------------------|-----------------------------------------------------------------------|--------------------------|
| `/plants/`                           | GET           | index         | Display a list of all plants                                        | `Plant.find()`                                                        | `Plants/Index.jsx`       |
| `/plants/new`                        | GET           | new           | Display HTML form for creating a new plant                         | none                                                                  | `Plants/New.jsx`         |
| `/plants/:id`                        | GET           | show          | Display details for a specific plant                                | `Plant.findById()`                                                     | `Plants/Show.jsx`        |
| `/plants`                            | POST          | create        | Create a new plant                                                  | `Plant.create()`                                                       | none                     |
| `/plants/:id/edit`                   | GET           | edit          | Display HTML form for editing a specific plant                     | `Plant.findById()`                                                     | `Plants/Edit.jsx`        |
| `/plants/:id`                        | PATCH/PUT     | update        | Update a specific plant                                             | `Plant.findByIdAndUpdate()` or `Plant.findOneAndUpdate()`              | none                     |
| `/plants/:id`                        | DELETE        | destroy       | Delete a specific plant                                             | `Plant.findByIdAndDelete()` or `Plant.findByIdAndRemove()`             | none                     |
| `/equipment/`                        | GET           | index         | Display a list of all equipment                                     | `Equipment.find()`                                                     | `Equipment/Index.jsx`    |
| `/equipment/new`                     | GET           | new           | Display HTML form for creating new equipment                        | none                                                                  | `Equipment/New.jsx`      |
| `/equipment/:id`                     | GET           | show          | Display details for a specific equipment                            | `Equipment.findById()`                                                 | `Equipment/Show.jsx`     |
| `/equipment`                         | POST          | create        | Create a new equipment entry                                        | `Equipment.create()`                                                   | none                     |
| `/equipment/:id/edit`                | GET           | edit          | Display HTML form for editing specific equipment                    | `Equipment.findById()`                                                 | `Equipment/Edit.jsx`     |
| `/equipment/:id`                     | PATCH/PUT     | update        | Update specific equipment                                           | `Equipment.findByIdAndUpdate()` or `Equipment.findOneAndUpdate()`      | none                     |
| `/equipment/:id`                     | DELETE        | destroy       | Delete a specific equipment                                         | `Equipment.findByIdAndDelete()` or `Equipment.findByIdAndRemove()`     | none                     |
| `/equipment/:id/readings`            | GET           | index         | Display readings for specific equipment                             | `Reading.find({ equipmentId: req.params.id })`                         | `Readings/Index.jsx`     |
| `/equipment/:id/readings/new`        | GET           | new           | Display form to add new environmental reading                       | none                                                                  | `Readings/New.jsx`       |
| `/equipment/:id/readings`            | POST          | create        | Add a new reading (manual entry or MQTT injection)                  | `Reading.create()`                                                     | none                     |
| `/equipment/:id/maintenance`         | GET           | index         | Display maintenance logs for specific equipment                     | `MaintenanceLog.find({ equipmentId: req.params.id })`                  | `Maintenance/Index.jsx`  |
| `/equipment/:id/maintenance/new`     | GET           | new           | Display form to add maintenance log                                 | none                                                                  | `Maintenance/New.jsx`    |
| `/equipment/:id/maintenance`         | POST          | create        | Add new maintenance log                                             | `MaintenanceLog.create()`                                              | none                     |
| `/reports/sustainability`            | GET           | index         | Generate sustainability report (PDF/CSV)                           | Aggregation on `Readings` and `Equipment`                              | `Reports/Report.jsx`     |
| `/mqtt/simulate`                     | POST          | create        | Simulate incoming IoT sensor data via MQTT                          | `Reading.create()`                                                     | none                     |

## Links

- **Trello:** https://trello.com/invite/b/688b0a4870f777d23ce4fe57/ATTI946ff27c6f6a4afff60b9881ef3f3a69E93AD323/carbonsense
