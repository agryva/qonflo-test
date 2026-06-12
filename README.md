# Mini Task Manager

## How to Run

**Backend**
```bash
cd backend && npm install && npm run dev
# http://localhost:3001
```

**Frontend**
```bash
cd app && bun install && bun dev
# http://localhost:4442
```

**Both at once**
```bash
./dev.sh
```

---

## Architecture

- **Frontend** — Next.js 16 + React 19 + TypeScript. Services layer (`services/`) for API calls via Axios. Toast notifications via Sonner.
- **Backend** — Express 5 + TypeScript. SQLite (better-sqlite3) with WAL mode. Status updates and audit log writes happen in a single transaction to guarantee consistency.

**API endpoints:**
```
GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/:id/status
DELETE /api/tasks/:id
GET    /api/tasks/:id/audit-logs
GET    /api/audit-logs
```

---

## Assumptions

- Actor is hardcoded to `john.doe` — the requirement allows hardcoding, and without an auth layer a dropdown wouldn't add meaningful traceability.
- Status can move both forward and backward. The requirement defines a fixed order but doesn't explicitly prohibit reverting — treated as a deliberate decision to handle input mistakes.

## Trade-offs

- SQLite for simplicity. Not suitable for multi-instance deployments — would need PostgreSQL at scale.
- No ORM for full query control, but schema migrations are more manual.
- Full refresh after every mutation — simple and predictable, but not real-time.

## If I Had More Time

- Actor selector per session (no login, just pick a name on first visit)
- Optimistic UI updates
- Pagination for tasks and logs
- Migrate to PostgreSQL + Kysely

---

## Q&A

**How do you ensure audit logs cannot be modified?**
There are no `UPDATE` or `DELETE` endpoints for audit logs. The only write operation is `INSERT`, triggered inside a transaction on every status change.

**What part is most at risk under high user load?**
SQLite — only one concurrent writer. Many simultaneous status updates will queue up. The fix is migrating to PostgreSQL with connection pooling.

**What would you refactor first if the system grows?**
The persistence layer. SQLite with raw SQL becomes hard to maintain as the schema evolves. Moving to PostgreSQL with a query builder (e.g. Kysely) would add proper migrations, type safety, and horizontal scaling support.

---

## AI Usage

Claude was used to design the UI layout — component structure, spacing, and visual hierarchy. For other parts, AI was consulted to evaluate dependency choices and to decide between Bun and npm. All output was reviewed and manually tested.
