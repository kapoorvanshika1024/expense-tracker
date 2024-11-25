import { pgTable, serial, varchar, numeric, integer } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Define the Budgets table
export const Budgets = pgTable("budgets", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  amount: varchar("amount", { length: 255 }).notNull(),
  icon: varchar("icon", { length: 255 }),
  createdBy: varchar("createdBy", { length: 255 }).notNull(),
});

// Define the Expenses table
export const Expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  budgetId: integer("budgetId").references(() => Budgets.id),
  createdBy: varchar("createdBy", { length: 255 }).notNull(), 
  createdAt: varchar("createdAt", { length: 255 }).notNull(),
});


// TypeScript models for tables using the new types
export type Budget = typeof Budgets.$inferSelect; // For querying data
export type NewBudget = typeof Budgets.$inferInsert; // For inserting data

export type Expense = typeof Expenses.$inferSelect; // For querying data
export type NewExpense = typeof Expenses.$inferInsert; // For inserting data
