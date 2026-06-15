
1.WHY USE MONGODB INSTEAD OF RELATIONAL DB?

I chose MongoDB because the AI code reviewer deals with highly dynamic and semi-structured data such as AI-generated review outputs, nested comments, repository metadata, and evolving schemas. MongoDB’s document-based model allows flexible storage of JSON-like data without frequent schema migrations.

Since the project is built using the MERN stack, MongoDB also integrates naturally with JavaScript objects across the frontend and backend, which speeds up development.

A relational database like PostgreSQL would be better for highly transactional systems or complex relational analytics, but for rapid development and flexible AI-driven data handling, MongoDB was a better fit for this project.


2.WHY USE GITHUB OAUTH INSTEAD OF EMAIL PASS BASED AUTH?

I used GitHub OAuth because the project is fundamentally a GitHub-integrated developer tool. The application needs access to repositories, pull requests, commits, and code metadata, so GitHub OAuth provides both authentication and authorization in a single flow.

It also improves user experience because developers can sign in instantly without creating separate credentials. Additionally, it reduces backend security complexity since password management, MFA, and account security are handled by GitHub itself.

Compared to traditional email/password authentication, GitHub OAuth aligns better with the project’s architecture and real-world developer workflows.


3. IS JWT NEEDED?

GitHub OAuth and JWT serve different purposes and are commonly used together. GitHub OAuth is used to authenticate the user through GitHub and obtain permission to access GitHub resources such as repositories and pull requests.

After successful OAuth authentication, the backend typically generates its own JWT for application-level session management. The JWT is then used by the frontend to access protected backend APIs without repeatedly relying on GitHub authentication.

In this architecture, the GitHub access token is used for communicating with GitHub APIs, while the JWT is used for maintaining authentication within the application itself.



# Repository Explorer & Import Architecture

## Objective

The Repository Explorer is responsible for allowing users to browse GitHub repositories before importing them into the AI processing pipeline.

This layer acts as a bridge between:

* GitHub OAuth Authentication
* AI Repository Import Pipeline

and provides functionality similar to GitHub's file browser.

---

# Architecture Overview

```text
User Login
    ↓
Fetch Repositories
    ↓
Display Repository List
    ↓
User Selects Repository
    ↓
Fetch Repository Tree
    ↓
Display Folder Structure
    ↓
User Selects File
    ↓
Fetch File Content
    ↓
Display Code (Monaco Editor)
```

---

# Two Different Workflows

Although both workflows use the Git Trees API, they serve different purposes.

## Workflow A — Repository Explorer

Purpose:

Allow users to navigate repository files and view source code.

Output:

```text
Folders + Files
```

Example:

```text
src
├── App.jsx
├── main.jsx
└── components
    ├── Navbar.jsx
    └── Sidebar.jsx
```

No filtering is performed.

The frontend receives the complete repository structure.

---

## Workflow B — Repository Import Pipeline

Purpose:

Prepare repository code for AI analysis.

Output:

```text
Code Files Only
```

Example:

```text
src/App.jsx
src/main.jsx
backend/server.js
```

Folders are discarded because they contain no code.

This workflow is used later for:

* Chunking
* Embeddings
* Vector Database Storage
* AI Code Review

---

# GitHub APIs Used

## 1. Fetch Repository Metadata

Endpoint:

```http
GET /repos/{owner}/{repo}
```

Purpose:

Retrieve repository information.

Important field:

```json
{
  "default_branch": "main"
}
```

Reason:

Branch names are not always "main".

Examples:

```text
main
master
develop
production
```

The default branch should always be fetched dynamically.

---

## 2. Fetch Repository Tree

Endpoint:

```http
GET /repos/{owner}/{repo}/git/trees/{branch}?recursive=1
```

Example:

```http
GET /repos/yash/MindMapper/git/trees/main?recursive=1
```

Purpose:

Retrieve the entire repository structure.

Example response:

```json
[
  {
    "path": "src",
    "type": "tree"
  },
  {
    "path": "src/App.jsx",
    "type": "blob"
  }
]
```

---

# Understanding Git Object Types

Git stores repositories using different object types.

## Tree

Represents a folder.

Example:

```json
{
  "path": "src",
  "type": "tree"
}
```

Meaning:

```text
src/
```

---

## Blob

Represents a file.

Example:

```json
{
  "path": "src/App.jsx",
  "type": "blob"
}
```

Meaning:

```text
src/App.jsx
```

---

# Repository Explorer Endpoint

Backend Route:

```http
GET /api/repos/:owner/:repo/tree
```

Purpose:

Return the complete repository structure.

Response:

```json
[
  {
    "path": "src",
    "type": "tree"
  },
  {
    "path": "src/App.jsx",
    "type": "blob"
  }
]
```

Important:

Do NOT filter anything.

The frontend requires both:

```text
tree (folders)
blob (files)
```

to render a complete file explorer.

---

# File Content Endpoint

Backend Route:

```http
GET /api/repos/:owner/:repo/file
```

Query Parameters:

```http
?path=src/App.jsx
```

GitHub Endpoint:

```http
GET /repos/{owner}/{repo}/contents/{path}
```

Purpose:

Retrieve actual file content.

GitHub returns:

```json
{
  "content": "YmFzZTY0..."
}
```

The content must be decoded:

```javascript
Buffer.from(content, "base64")
  .toString("utf-8");
```

Output:

```javascript
import React from "react";
```

---

# Frontend Flow

Repository List Page

```text
MindMapper
AI Resume Analyzer
Mood Music App
```

User clicks:

```text
MindMapper
```

Frontend calls:

```http
GET /api/repos/yash/MindMapper/tree
```

Response:

```json
[
  {
    "path": "src",
    "type": "tree"
  },
  {
    "path": "src/App.jsx",
    "type": "blob"
  }
]
```

Frontend renders:

```text
📁 src
📄 App.jsx
```

User clicks:

```text
App.jsx
```

Frontend calls:

```http
GET /api/repos/yash/MindMapper/file?path=src/App.jsx
```

Backend returns decoded source code.

The code is displayed inside Monaco Editor.

---

# Future Import Pipeline

This workflow starts when the user clicks:

```text
Import Repository
```

Pipeline:

```text
Fetch Repository Tree
        ↓
Filter Files
        ↓
Fetch File Contents
        ↓
Chunk Code
        ↓
Generate Embeddings
        ↓
Store in Vector Database
        ↓
Repository Ready For AI Review
```

---

# File Filtering Strategy

During repository import:

Keep:

```text
.js
.jsx
.ts
.tsx
.py
.java
.go
.cpp
.c
.cs
```

Ignore:

```text
node_modules/
dist/
build/
coverage/
.git/
```

Ignore assets:

```text
.png
.jpg
.jpeg
.gif
.svg
.ico
```

Reason:

These files do not provide meaningful information for code review.

---

# Current Development Milestone

Level 2 — Repository Explorer

Goals:

✓ Fetch Repository Tree

✓ Display Folder Structure

✓ Display Files

✓ Fetch File Content

✓ Render Code In Monaco Editor

After completing this milestone, the GitHub browsing layer of the AI Code Reviewer will be complete and ready for repository import and AI processing.


