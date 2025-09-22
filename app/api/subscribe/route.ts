import { NextResponse } from "next/server";

const EMAIL_REGEX = /^(?:[a-zA-Z0-9_'^&/+-])+(?:\.(?:[a-zA-Z0-9_'^&/+-])+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as Record<string, string | undefined> | null;

  if (!body) {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const company = (body.company ?? "").trim();
  const launchDate = (body.launchDate ?? "").trim();
  const message = (body.message ?? "").trim();

  if (name.length < 2) {
    return NextResponse.json({ message: "Please provide your full name." }, { status: 400 });
  }

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ message: "Please provide a valid work email." }, { status: 400 });
  }

  if (message.length < 10) {
    return NextResponse.json({ message: "Share a bit more about your launch so we can prepare." }, { status: 400 });
  }

  if (launchDate.length > 0 && launchDate.length > 60) {
    return NextResponse.json({ message: "Launch timing looks a bit long—keep it under 60 characters." }, { status: 400 });
  }

  // In production we would forward to a CRM or email provider.
  console.info("New hype audit request", {
    name,
    email,
    company,
    launchDate,
    message: message.slice(0, 500)
  });

  return NextResponse.json({ message: "Thanks! A producer will reach out within one business day." });
}
