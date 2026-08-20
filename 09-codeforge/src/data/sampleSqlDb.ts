import type { SampleDatabasePreset } from '../types/sql';

export const SAMPLE_DATABASES: SampleDatabasePreset[] = [
  {
    id: 'ecommerce',
    name: 'E-Commerce Marketplace',
    description: 'Relational schema for customer accounts, catalog products, orders, and item line records.',
    icon: '🛍️',
    tablesCount: 4,
    seedSql: `
-- E-Commerce Schema
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  country TEXT DEFAULT 'US',
  created_at TEXT
);

CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  price REAL NOT NULL,
  stock_quantity INTEGER DEFAULT 0
);

CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  status TEXT CHECK(status IN ('pending', 'processing', 'completed', 'cancelled')),
  total_amount REAL NOT NULL,
  order_date TEXT,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE order_items (
  id INTEGER PRIMARY KEY,
  order_id INTEGER,
  product_id INTEGER,
  quantity INTEGER DEFAULT 1,
  unit_price REAL,
  FOREIGN KEY(order_id) REFERENCES orders(id),
  FOREIGN KEY(product_id) REFERENCES products(id)
);

-- Seed Data
INSERT INTO users VALUES
  (1, 'Alice Chen', 'alice@example.com', 'US', '2025-01-15'),
  (2, 'Marcus Brody', 'marcus.b@dev.io', 'UK', '2025-02-10'),
  (3, 'Sophia Rodriguez', 'sophia@techlabs.es', 'ES', '2025-02-28'),
  (4, 'Liam Nakamura', 'liam.n@tokyo.jp', 'JP', '2025-03-01'),
  (5, 'Emma Watson', 'emma.w@oxford.uk', 'UK', '2025-03-14');

INSERT INTO products VALUES
  (101, 'Mechanical Keyboard RGB', 'Electronics', 149.99, 45),
  (102, '4K Ultra-Wide Monitor 34"', 'Electronics', 599.00, 18),
  (103, 'Ergonomic Mesh Chair', 'Furniture', 329.50, 12),
  (104, 'Noise-Cancelling Headphones', 'Audio', 249.00, 30),
  (105, 'Anodized Aluminum Desk Mat', 'Accessories', 45.00, 120),
  (106, 'Smart LED Desk Lamp', 'Lighting', 79.99, 50);

INSERT INTO orders VALUES
  (1001, 1, 'completed', 748.99, '2025-03-10'),
  (1002, 2, 'completed', 329.50, '2025-03-11'),
  (1003, 3, 'processing', 249.00, '2025-03-12'),
  (1004, 1, 'completed', 45.00, '2025-03-15'),
  (1005, 4, 'pending', 678.99, '2025-03-16');

INSERT INTO order_items VALUES
  (1, 1001, 101, 1, 149.99),
  (2, 1001, 102, 1, 599.00),
  (3, 1002, 103, 1, 329.50),
  (4, 1003, 104, 1, 249.00),
  (5, 1004, 105, 1, 45.00),
  (6, 1005, 102, 1, 599.00),
  (7, 1005, 106, 1, 79.99);
`,
    starterQuery: `SELECT 
  u.name AS customer_name,
  u.country,
  COUNT(o.id) AS total_orders,
  ROUND(SUM(o.total_amount), 2) AS lifetime_spend
FROM users u
JOIN orders o ON u.id = o.user_id
GROUP BY u.id
ORDER BY lifetime_spend DESC;`
  },
  {
    id: 'tech_hr',
    name: 'Tech HR & Engineering Roster',
    description: 'Company organization hierarchy, departmental payroll, and project allocations.',
    icon: '👥',
    tablesCount: 3,
    seedSql: `
CREATE TABLE departments (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  budget REAL,
  location TEXT
);

CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  department_id INTEGER,
  title TEXT,
  salary REAL,
  hire_date TEXT,
  FOREIGN KEY(department_id) REFERENCES departments(id)
);

CREATE TABLE projects (
  id INTEGER PRIMARY KEY,
  title TEXT,
  lead_employee_id INTEGER,
  status TEXT,
  FOREIGN KEY(lead_employee_id) REFERENCES employees(id)
);

INSERT INTO departments VALUES
  (1, 'Engineering', 1200000.0, 'San Francisco, CA'),
  (2, 'Product & Design', 450000.0, 'New York, NY'),
  (3, 'Infrastructure & SRE', 600000.0, 'Remote'),
  (4, 'Data Analytics', 380000.0, 'Austin, TX');

INSERT INTO employees VALUES
  (101, 'David', 'Kim', 1, 'Staff Software Engineer', 185000.0, '2021-04-12'),
  (102, 'Sarah', 'Connor', 1, 'Senior Backend Engineer', 160000.0, '2022-08-01'),
  (103, 'Alex', 'Vance', 3, 'Principal SRE Lead', 195000.0, '2020-01-15'),
  (104, 'Elena', 'Rostova', 2, 'Lead UI/UX Designer', 145000.0, '2023-03-20'),
  (105, 'Tariq', 'Al-Mansoor', 4, 'Senior Data Scientist', 155000.0, '2022-11-10'),
  (106, 'Maya', 'Lin', 1, 'Frontend Engineer', 130000.0, '2024-02-01');

INSERT INTO projects VALUES
  (201, 'Quantum Core Migration', 103, 'in_progress'),
  (202, 'Design System 3.0', 104, 'completed'),
  (203, 'Real-Time Streaming Engine', 101, 'in_progress');
`,
    starterQuery: `SELECT 
  d.name AS department,
  COUNT(e.id) AS headcount,
  ROUND(AVG(e.salary), 2) AS avg_salary,
  ROUND(SUM(e.salary), 2) AS total_payroll,
  d.budget AS total_budget,
  ROUND(d.budget - SUM(e.salary), 2) AS remaining_budget
FROM departments d
LEFT JOIN employees e ON d.id = e.department_id
GROUP BY d.id
ORDER BY total_payroll DESC;`
  }
];
