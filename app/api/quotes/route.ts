import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, companyName, vehicleInfo, partsList, notes } = body;

    if (!name || !email || !phone || !partsList) {
      return NextResponse.json(
        { error: "Please provide Name, Email, Phone, and Parts List." },
        { status: 400 }
      );
    }

    const quote = await db.quoteRequest.create({
      data: {
        name,
        email,
        phone,
        companyName: companyName || null,
        vehicleInfo: vehicleInfo || null,
        partsList,
        notes: notes || null,
        status: "PENDING",
      },
    });

    return NextResponse.json(quote, { status: 201 });
  } catch (error) {
    console.error("Quote creation error:", error);
    return NextResponse.json(
      { error: "Failed to submit quote request." },
      { status: 500 }
    );
  }
}
