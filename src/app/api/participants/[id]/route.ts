import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.participant.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Participante deletado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao deletar participante:", error);
    return NextResponse.json(
      { error: "Erro ao deletar participante" },
      { status: 500 }
    );
  }
}
