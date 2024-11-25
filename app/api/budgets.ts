import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/dbConfig";
import { Budgets } from "@/utils/schema";
import { eq } from "drizzle-orm";


// Handle GET request to fetch the budgets
export async function GET(req: NextRequest): Promise<NextResponse> {
  const userEmail = req.headers.get("user"); // Ensure the user email is passed

  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const budgets = await db
      .select()
      .from(Budgets)
      .where(eq(Budgets.createdBy, userEmail)); // Ensure the field matches the schema

    return NextResponse.json(budgets);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Handle POST request to create a new budget
export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.json();

  // Validate the request body
  if (!body.name || !body.amount || !body.icon || !body.createdBy) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  try {
    // Use the schema-defined types for database insertion
    const result = await db
      .insert(Budgets)
      .values({
        name: body.name,
        amount: body.amount,
        icon: body.icon,
        createdBy: body.createdBy,
      })
      .returning();

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
