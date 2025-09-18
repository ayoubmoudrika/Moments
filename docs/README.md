# Moments Application Documentation

This folder contains UML diagrams documenting the Moments application architecture and flows.

## 📋 Documentation Files

### 🏗️ Architecture Overview
- **File**: `architecture.puml`
- **Description**: High-level system architecture showing frontend, API, database layers and their interactions
- **Components**: Next.js frontend, API routes, Prisma ORM, SQLite database, email service

### 👤 User Flow
- **File**: `user-flow.puml` 
- **Description**: Complete user journey for adding a new activity
- **Covers**: UI interactions, form validation, database operations, notifications

### 🔄 API Sequence
- **File**: `api-sequence.puml`
- **Description**: Detailed sequence diagram of API calls when adding an activity
- **Shows**: Frontend-backend communication, database operations, email notifications

### 🗄️ Database Schema
- **File**: `database-schema.puml`
- **Description**: Database structure and relationships
- **Details**: Activities table schema, constraints, indexes, future enhancements

## 🛠️ How to View Diagrams

### Online Viewers
1. **PlantUML Online**: http://www.plantuml.com/plantuml/uml/
2. **PlantText**: https://www.planttext.com/

### VS Code Extension
Install the "PlantUML" extension to view diagrams directly in VS Code.

### Command Line
```bash
# Install PlantUML
npm install -g node-plantuml

# Generate PNG from PUML
puml generate architecture.puml
```

## 🎨 Theme
All diagrams use a galaxy-themed color scheme matching the application:
- Background: Dark space blue (#1b2735)
- Components: Purple gradients (#667eea, #764ba2)
- Text: White for visibility

## 🚀 Application Features Documented

- ✨ Galaxy-themed UI with floating planets
- 🫧 Colorful bubble components for activities
- 🔮 Purple bubble buttons and controls
- 📅 Future/Past activity separation
- 🏷️ Label-based filtering system
- ⭐ Rating system (1-10 scale)
- 💌 Email notifications
- 🎭 Cute random notifications
- 📱 Responsive design