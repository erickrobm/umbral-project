<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Umbral Finanzas

**Plataforma Web Full-Stack para la Gestión de Cartera de Ahorro e Inversión y Asistencia Financiera con IA.**

## Ficha del Proyecto Académico

*   **Autor:** Erick Eduardo Robledo Montes
*   **Programa:** Diplomado en Inteligencia Artificial y Tecnologías Avanzadas
*   **Institución:** Universidad Autónoma de San Luis Potosí
*   **Fecha de Finalización:** Enero 2026

## Vinculación con Módulos del Diplomado

Este proyecto se fundamenta y articula directamente con los contenidos de los siguientes módulos centrales del plan de estudios:

### 1. Módulo: Desarrollo de Software
*   **Enfoque del Módulo:** Diseño de arquitecturas web full-stack, APIS y calidad de software.
*   **Implementación y Justificación:** La aplicación materializa este módulo mediante una arquitectura separada de cliente-servidor. El frontend (React + TypeScript) consume servicios externos, demostrando la capacidad de construir interfaces complejas y seguras. El uso de **GitHub** para el control de versiones y **TypeScript** para el tipado estático evidencia la aplicación de prácticas profesionales de ingeniería de software.

### 2. Módulo: Computación en la Nube
*   **Enfoque del Módulo:** Despliegue de aplicaciones, gestión de infraestructura e instancias en la nube.
*   **Implementación y Justificación:** El proyecto valida las competencias de este módulo al operar 100% en un entorno cloud. Se gestionan recursos críticos (Base de Datos, Autenticación) mediante servicios en la nube (**Supabase**) y se realizó el despliegue productivo en **Hostinger**, asegurando que la aplicación sea accesible públicamente, escalable y segura (manejo correcto de variables de entorno y secretos).

## Evolución del Proyecto: De la Propuesta a la Implementación

Este proyecto cumple con el propósito original planteado en la propuesta de diciembre de 2025: *"ofrecer una alternativa estructurada y confiable para la administración de información financiera personal"*.

Sin embargo, durante el desarrollo, la arquitectura evolucionó para adoptar tecnologías más modernas ("Bleeding Edge") y eficientes, superando el alcance funcional inicial en varias áreas clave.

### 1. Backend y Persistencia: De IaaS a PaaS/Serverless
*   **Propuesta Original:** Desarrollo de APIs REST manuales (Python/Node.js) y configuración de servidor Linux (IaaS) en DigitalOcean.
*   **Implementación Final:** **Supabase (Backend-as-a-Service)**.
*   **Justificación:** Se optó por sustituir la construcción manual de APIs y la administración de servidores Linux por una arquitectura **Serverless**. Supabase provee una base de datos **PostgreSQL** completa (cumpliendo el requisito de base de datos relacional), autenticación segura y APIs instantáneas. Esto permitió:
    *   Mayor seguridad mediante **Row Level Security (RLS)** en lugar de validaciones manuales en código.
    *   Reducción de overhead de mantenimiento de infraestructura (actualizaciones de SO, parches de seguridad).
    *   Enfoque total en la lógica de negocio y la experiencia de usuario.

### 2. Integración de Inteligencia Artificial: De "Opcional" a Núcleo
*   **Propuesta Original:** Extensión opcional con "técnicas básicas de análisis estadístico" usando Python.
*   **Implementación Final:** Integración profunda de **IA Generativa (Google Gemini 2.0)**.
*   **Justificación:** En lugar de limitarse a proyecciones estadísticas simples (regresiones lineales), se implementó un asistente financiero cognitivo. Esta IA no solo analiza datos numéricos, sino que entiende el contexto del usuario, ofreciendo consejos cualitativos y proyecciones complejas que una simple fórmula estadística no podría lograr.

### 3. Frontend y Despliegue: Modernización del Stack
*   **Propuesta Original:** React básico y despliegue manual.
*   **Implementación Final:** **React 19 + TypeScript + Vite + TailwindCSS**, desplegado en **Hostinger**.
*   **Justificación:** Se elevó el estándar de calidad de software utilizando **TypeScript** para robustez (tipado estático para datos financieros) y **TailwindCSS** para una UI/UX "Premium" que supera las interfaces administrativas estándar. El despliegue en Hostinger asegura una entrega de contenido global optimizada.

## Alcance Funcional Logrado vs Propuesto

| Característica | Propuesta (Dic 2025) | Implementación Final (Ene 2026) | Estado |
| :--- | :--- | :--- | :--- |
| **Gestión de Cartera** | Registro y consulta de instrumentos. | Sistema completo de "Sobres" y "Activos". | ✅ Cumplido |
| **Datos Económicos** | Ingesta de APIs externas. | Servicio de mercado en tiempo real integrado. | ✅ Cumplido |
| **Visualización** | Gráficos de evolución. | Dashboards interactivos con Recharts. | ✅ Cumplido |
| **Base de Datos** | Relacional (Postgres/MySQL). | PostgreSQL (vía Supabase). | ✅ Cumplido |
| **Análisis** | Proyecciones estadísticas simples. | **Análisis Financiero con IA Generativa**. | 🚀 Superado |

## Tecnologías Utilizadas (Stack Final)

*   **Frontend:** React 19, TypeScript, Vite, TailwindCSS.
*   **Backend & Base de Datos:** Supabase (PostgreSQL, Auth, Edge Functions).
*   **Inteligencia Artificial:** Google Gemini API.
*   **Control de Versiones:** Git & GitHub.
*   **Infraestructura de Despliegue:** Hostinger.

## Ejecución Local

Descarga el código o clona el repositorio desde GitHub para comenzar.

**Prerrequisitos:** Node.js

1. Instalar dependencias:
   `npm install`

2. Configurar las variables de entorno:
   - Crea un archivo `.env` utilizando `.env.example` como base.
   - Configura las claves de API necesarias.

3. Ejecutar la aplicación:
   `npm run dev`
