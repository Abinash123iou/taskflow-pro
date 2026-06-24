# Database Design

## Database

MySQL

---

## Table: tasks

| Column | Type | Constraints |
|----------|----------|----------|
| id | INT | PK AUTO_INCREMENT |
| title | VARCHAR(255) | NOT NULL |
| description | TEXT | NOT NULL |
| status | ENUM | Pending, In Progress, Completed |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | AUTO UPDATE |

---

## Indexes

PRIMARY KEY(id)

Optional:
INDEX(status)