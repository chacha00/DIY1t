import { NextRequest, NextResponse } from "next/server";
import { getOpenAI } from "@/lib/openai";

const SYSTEM_PROMPT = `You are the friendly DIY1T support assistant. DIY1T is a platform where users upload a photo of any product and get a complete AI-generated DIY guide — materials, costs, step-by-step instructions, pattern pieces, and a printable shopping list.

Key facts about DIY1T:
- FREE tier: 3 projects per month, basic PDF export
- Maker Pro ($9.99/month or $79/year): unlimited projects, SVG pattern downloads, batch generation, Etsy listing helper, affiliate program, priority support
- Users upload a photo → AI analyzes it → generates a full professional DIY pattern with size charts, cost tiers, and safety guidance
- Supports sewing, knitting, crocheting, woodworking, leatherworking, and more
- Pattern pieces are scaled and printable
- Projects can be exported as a PDF or SVG

Common questions you handle:
- How to upload a photo and generate a project
- What's included in free vs Maker Pro
- How to download patterns or PDFs
- How billing/subscriptions work (monthly or annual)
- How to cancel or manage their subscription
- Affiliate program: Maker Pro users get a referral link; earn 20-30% commission on conversions
- Batch generation: generate multiple projects at once (Maker Pro)
- Etsy listing helper: generates product titles, descriptions, tags for selling (Maker Pro)

Tone: warm, helpful, concise. If you don't know something specific, say so and suggest they email support@diy1t.com. Never make up features that don't exist. Keep responses under 150 words unless the user asks a complex question.`;

// Simple in-memory rate limit: 20 requests per IP per minute
const rateLimitMap = new Map<string, { count: number; reset: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.reset) {
    rateLimitMap.set(ip, { count: 1, reset: now + 60_000 });
    return true;
  }
  if (entry.count >= 20) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let messages: { role: "user" | "assistant"; content: string }[];
  try {
    const body = await req.json();
    messages = body.messages;
    if (!Array.isArray(messages) || messages.length === 0) throw new Error();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Cap conversation history to last 10 turns to control cost
  const trimmed = messages.slice(-10);

  try {
    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...trimmed],
      max_tokens: 300,
      temperature: 0.5,
    });

    const reply = completion.choices[0]?.message?.content ?? "Sorry, I couldn't generate a response. Please try again.";
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[support/chat]", err);
    return NextResponse.json({ error: "AI error" }, { status: 500 });
  }
}
