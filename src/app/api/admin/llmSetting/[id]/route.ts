import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/db/mongodb';

const COLLECTION_NAME = 'setting_llm';

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
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const db = await getDatabase();

        const llmSetting = await db
            .collection(COLLECTION_NAME)
            .findOne({ _id: new ObjectId(id) });

        if (!llmSetting) {
            return NextResponse.json({ error: 'LLM setting not found' }, { status: 404 });
        }

        return NextResponse.json({ data: llmSetting });
    } catch (error) {
        console.error('Error fetching LLM setting by ID:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
