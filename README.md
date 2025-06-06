# Noviga Assignment - React Frontend Developer

This is the solution for the **Noviga React Frontend Developer Assignment**.  
The project implements an interactive React application focused on **industrial machine monitoring** and **process visualization** using charts and graphs.

## 📹 Demo

A video recording has been provided that includes:

- Project architecture overview
- Code walkthrough
- Features demonstration

---

## 📁 Project Structure

The project has **two main pages**:

1. **Scatter Data Visualization**
2. **Tree Visualization (Process Flow Diagram)**

Navigation is handled via a **collapsible sidebar**.

---

## 🛠 Tech Stack

- **React.js** - Core Framework
- **React Router DOM** - Page navigation
- **Redux Toolkit** - State management
- **Highcharts** - High Performance Data Visualization (with zoom and pan capabilities)
- **React-Flow** - Tree Visualization
- **MaterialUI** - UI component library
- **SCSS** - Styling
- **Axios** - API simulation
- **Date-fns** - Date manipulation

---

## ✨ Features

### 1️⃣ Scatter Data Visualization Page

#### Graph 1: Distance vs Time Scatter Plot

- Interactive Scatter Plot with Zoom & Pan
- Able to handle upto 10,000 data points
- X-axis: Epoch Timestamps → DateTime
- Y-axis: Distance Values
- Dot Colors:
  - 🟢 Green → `anomaly: false`
  - 🔴 Red → `anomaly: true`
  - ⚫ Black → `anomaly: null`
- Threshold line → Red line for each selected Tool Sequence
- UI Controls:
  - Machine selection dropdown
  - Date range & time pickers
  - Tool sequence selector with tooltips (Option only populates when machine and date range are selected)
  - Search button to apply filters and load data
- Interactivity:
  - Clicking on any dot triggers Graph 2
  - Hover tooltips for cycle details
  - Mouse wheel scroll up/down with zoom in/out respectively

#### Graph 2: Time Series Analysis (Interactive)

- Triggered by clicking on scatter plot dot
- Time Series Line Chart:
  - Actual Signal → Blue
  - Ideal Signal → Light Blue
- Pan & Zoom supported (Hold Shift to pan X-axis & mouse wheel scroll to zoom)
- Dynamic axis scaling
- Time alignment between actual & ideal signal

---

### 2️⃣ Tree Visualization Page

- Interactive Process Flow Diagram:
  - Nodes connected via edges
  - Node info displayed on hover
  - Click node → Edit Modal (Rename, Station Number, Color Category)
  - Real-time diagram update after edit
- Color Coding:
  - 🔴 Red → `not_allowed_list`
  - 🔵 Blue → `bypass_list`
  - ⚪ White → Normal

---

## ⚙️ Approach

### Architecture

- Pages are structured via **React Router**.
- UI is built from reusable React components and MaterialUI.
- Used **Redux Toolkit** for managing shared states.
- API simulation is done by serving **static JSON files** locally and mimicking REST API responses using axios.
- Charts are built using **Highcharts** for consistent zooming and pan experience.
- Tree visualization uses **React-Flow** for modularity and flexibility.

### Data Layer & API Simulation

- APIs are simulated using **Mirage JS**, which acts as a mock backend:
  - The Mirage server is configured to serve:
    - ChangeLog API
    - Prediction Data API
    - Cycle Data API
    - Graph Visualization API
- Mirage serves responses from the provided **static JSON files**, allowing the frontend to interact with a realistic REST API layer without needing an actual backend.
- Axios is used to make requests to the Mirage JS API endpoints.
- Json files are placed in public folder and fetched dynamically.

### Data Flow

- Components fetch static JSON simulating:
  - ChangeLog API
  - Prediction Data API
  - Cycle Data API
  - Graph Data API
- Data is processed and transformed locally which are component specific and are not shared.
- Shared Data are passed as props as only one level of prop passing is required.
- Shared State is managed centrally to allow **smooth interactivity** between Components and Graphs.
- Component specific states are managed locally.

### Key Algorithms

- Formatting prediction api data to be able to segragate cycles data with respect to anomaly to be able to plot the data points in scatter graph.
- Extracting threshold data from changelogs.
- Extracting ideal signals from changelogs.
- Find the clicked node data from formatted predictions data.
- Fetch timeseries data and extract actual signals and time range.
- Dynamic scaling of axes based on min/max values.
- Efficient rendering to handle large data points.
- Fetching production machine map data from api and structure it as nodes and edges to implement in flow chart using dagre tree layout.

---

## 📝 Assumptions

Data timeframe: March 1 to May 27, 2025

Machine Count: 2 machines → Machine1-SSP0173, Machine2-SSP0167

Tool Sequences: Dynamically fetched from changelog api

Real-time updates simulated using static data.

Browser Support: Modern browsers → Chrome, Firefox, Safari, Edge.

Screen Resolution: Optimized for 1920x1080 and above.

Designed to handle up to 10,000 data points efficiently.

## 📂 Folder Structure

```
public/
├── data/
│   ├── changelog.json
│   ├── prediction.json
│   ├── timeseries.json
│   ├── treevisual.json

src/
├── backend/
│   ├── controllers/
│   └── server.ts            # Mirage JS server config
├── components/              # Reusable UI components
├── pages/                   # Scatter Page, Tree Visualization Page
├── reducers/                # Redux Toolkit reducers (slices)
├── routes/                  # App routes
├── services/                # API services (Axios)
├── store/                   # Redux store setup
├── styles/                  # SCSS
├── types/                   # TypeScript types
├── utils/                   # Helper utilities
├── App.tsx                  # Main App component
├── main.tsx                 # Entry point


```

## 🚀 How to Run

```bash
# Clone the repo
git clone https://github.com/JowelTisso/noviga-assignment.git

# Install dependencies
npm install

# Start development server
npm run dev

# The app will be running at:
http://localhost:5173
```

## ✅ Summary

This project meets all core requirements and features including:

✅ Pan & Zoom on Scatter Chart and Time Series chart

✅ Dynamic Threshold Line

✅ Real-time Editable Tree with React-Flow + Dagre

✅ Efficient State Management with Redux Toolkit

✅ Mock backend with Mirage JS for realistic API simulation

✅ Responsive Design

✅ Clean and intuitive UI
