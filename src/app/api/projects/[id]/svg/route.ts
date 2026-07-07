import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generatePatternSvg } from "@/lib/svg/patternSvg";
import type { Project } from "@/types/database";

/**
 * GET /api/projects/[id]/svg?piece=0
 * Returns a single printable SVG pattern piece file.
 * piece defaults to 0 (first piece). Set piece=-1 to get a combined multi-piece SVG.
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const pieceIndex = parseInt(searchParams.get("piece") ?? "0", 10);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .or(`user_id.eq.${user.id},is_public.eq.true`)
    .maybeSingle<Project>();

  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  const pieces = project.pattern_pieces ?? [];

  if (pieces.length === 0) {
    return NextResponse.json({ error: "This project has no pattern pieces (knit or crochet projects use written instructions instead)" }, { status: 404 });
  }

  // Combined SVG: stack all pieces vertically with spacing
  if (pieceIndex === -1) {
    const svgs = pieces.map((piece, i) => generatePatternSvg(piece, i));
    const safeTitle = project.title.replace(/[^a-z0-9]/gi, "-").toLowerCase();
    return new NextResponse(svgs.join("\n\n<!-- ========== NEXT PIECE ========== -->\n\n"), {
      headers: {
        "Content-Type": "image/svg+xml",
        "Content-Disposition": `attachment; filename="${safeTitle}-all-patterns.svg"`,
        "Cache-Control": "private, max-age=3600",
      },
    });
  }

  if (pieceIndex < 0 || pieceIndex >= pieces.length) {
    return NextResponse.json({ error: `Piece index out of range (0–${pieces.length - 1})` }, { status: 400 });
  }

  const piece = pieces[pieceIndex];
  const svg = generatePatternSvg(piece, pieceIndex);
  const safeTitle = project.title.replace(/[^a-z0-9]/gi, "-").toLowerCase();
  const safePiece = piece.name.replace(/[^a-z0-9]/gi, "-").toLowerCase();

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Content-Disposition": `attachment; filename="${safeTitle}-${safePiece}.svg"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
