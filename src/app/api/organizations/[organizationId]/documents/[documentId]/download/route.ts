import { NextRequest, NextResponse } from 'next/server';
import { DocumentService } from '@/services/documents';
import { getServerSession } from 'next-auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { organizationId: string; documentId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const url = await DocumentService.getDocumentUrl(
      parseInt(params.documentId),
      session.user.id
    );

    return NextResponse.json({
      success: true,
      data: { url },
    });
  } catch (error) {
    console.error('Error generating download URL:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate download URL',
      },
      { status: 500 }
    );
  }
} 