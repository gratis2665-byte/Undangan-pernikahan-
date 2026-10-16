import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_WEDDING_DATA, WeddingData } from '@/lib/wedding-data';

// Persistent in-memory global state across requests on the same server instance
declare global {
  var __GLOBAL_WEDDING_DATA__: WeddingData | undefined;
}

export async function GET() {
  try {
    const data = globalThis.__GLOBAL_WEDDING_DATA__ || DEFAULT_WEDDING_DATA;
    return NextResponse.json({
      success: true,
      hasCustomData: Boolean(globalThis.__GLOBAL_WEDDING_DATA__),
      data,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid payload' },
        { status: 400 }
      );
    }

    // Update global state
    globalThis.__GLOBAL_WEDDING_DATA__ = {
      ...DEFAULT_WEDDING_DATA,
      ...body,
      groom: {
        ...DEFAULT_WEDDING_DATA.groom,
        ...(body.groom || {}),
      },
      bride: {
        ...DEFAULT_WEDDING_DATA.bride,
        ...(body.bride || {}),
      },
      akad: {
        ...DEFAULT_WEDDING_DATA.akad,
        ...(body.akad || {}),
      },
      resepsi: {
        ...DEFAULT_WEDDING_DATA.resepsi,
        ...(body.resepsi || {}),
      },
      verse: {
        ...DEFAULT_WEDDING_DATA.verse,
        ...(body.verse || {}),
      },
      bankAccounts: {
        ...DEFAULT_WEDDING_DATA.bankAccounts,
        ...(body.bankAccounts || {}),
      },
    };

    return NextResponse.json({
      success: true,
      message: 'Data pernikahan berhasil diperbarui di server',
      data: globalThis.__GLOBAL_WEDDING_DATA__,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
