import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/db/mongodb';

const COLLECTION_NAME = 'templates_header';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = params;

        if (!id || !ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid header ID' }, { status: 400 });
        }

        const db = await getDatabase();

        const header = await db.collection(COLLECTION_NAME).findOne({
            _id: new ObjectId(id),
        });

        if (!header) {
            return NextResponse.json({ error: 'Header not found' }, { status: 404 });
        }

        return NextResponse.json({ data: header });
    } catch (error) {
        console.error('Error fetching header by ID:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
