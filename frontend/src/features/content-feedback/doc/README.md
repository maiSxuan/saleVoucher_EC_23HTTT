# Content Feedback Module - Frontend Documentation

## 1. Purpose
This module handles two main functional areas:
- **Admin (BR-ADM-05):** Management of content items (Categories, Banners, Posts, Popups, Policies).
- **Customer (BR-CUS-08):** Management of reviews and feedback/complaints.

## 2. Structure
- `api/`: API service definitions using `fetch`.
- `components/`: UI-only components (`ContentTable`, `ReviewForm`, etc.).
- `hooks/`: Business logic/data management hooks (`useContent`, `useReview`, `useFeedback`).
- `pages/`: Page containers integrating hooks and components.
- `doc/`: Documentation.

## 3. API Examples
The frontend communicates with the following backend endpoints:

### Content (Admin)
- `GET /content`: Fetch all content.
- `POST /content`: Create new content.
- `PUT /content/:id`: Update content.
- `DELETE /content/:id`: Delete content.

### Reviews (Customer)
- `GET /review`: Fetch all reviews.
- `POST /review`: Create a new review.

### Feedback (Customer)
- `GET /feedback`: Fetch all feedback/complaints.
- `POST /feedback`: Create a new feedback/complaint.

## 4. Notes
- **Tech Stack:** React 18, Native Fetch API, Custom Hooks (`useState`, `useEffect`), Tailwind CSS.
- **State Management:** Custom hooks are used to manage API data, loading states, and errors.
- **Backend:** Node.js (Express) + Supabase (PostgreSQL).
