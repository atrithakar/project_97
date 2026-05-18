# Project 97
A minimalist, open-source gallery and spatial search engine for raw Grand Theft Auto V Snapmatic captures.

## The Architecture
When a photo is taken in-game, GTA V stores the image and its metadata in a proprietary, undocumented binary file format (PGTA/PRKF). Traditionally, exporting these requires relying on Rockstar Social Club or localized third-party CLI tools.

Project 97 bypasses the Rockstar ecosystem entirely. It utilizes a custom reverse-engineered extraction pipeline to parse the raw binary buffers, extract the hidden metadata (including in-game coordinates, time, and radio station), and convert the payload into a standard JPEG. It then pipes this data into a fully interactive, spatially-aware web platform.

## Key Features
- Raw Binary Extraction: Direct upload and server-side parsing of raw PGTA files.

- Geospatial Search Engine: Filter images by their exact in-game location using an interactive Leaflet map featuring a custom reverse Affine Transformation coordinate system.

- Dynamic Metadata Indexing: Filter feeds by title, owner, radio station, and in-game time of day.

- High-Fidelity Viewer: Dedicated UI to inspect high-res image outputs alongside their geographic confidence intervals.

- Algorithmic-Free Feed: A strictly randomized, chronologically agnostic global feed.

## Upcoming Milestones
- User Profile Management (View, Search, and Manage).

- Authenticated Actions (Favorites/Bookmarking system).

- Direct Image Downloading.

- Clipboard integration for raw map coordinates.

- Direct shareable routing links.

## Out of Scope (Anti-Features)
To maintain performance and adhere to a minimalist philosophy, the following features will not be implemented:

- Follower/Following systems.

- Targeted recommendation algorithms.

- Direct messaging or chat systems.