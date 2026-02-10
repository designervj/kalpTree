import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/db/mongodb';

const COLLECTION_NAME = 'globalstyles';

export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const tenantId = searchParams.get('tenantId');

        if (!tenantId) {
            return NextResponse.json({ error: 'tenantId is required' }, { status: 400 });
        }

        const db = await getDatabase();
        const style = await db.collection(COLLECTION_NAME).findOne({ tenantId });

        return NextResponse.json({ data: style || null });
    } catch (error) {
        console.error('Error fetching global style:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { globalStyle, tenantId } = body;

        if (!globalStyle || !tenantId) {
            return NextResponse.json(
                { error: 'globalStyle and tenantId are required' },
                { status: 400 }
            );
        }

        const db = await getDatabase();

        const updateResult = await db.collection(COLLECTION_NAME).updateOne(
            { tenantId },
            {
                $set: {
                    globalStyle,
                    updatedAt: new Date(),
                    updatedBy: session.user.id,
                },
                $setOnInsert: {
                    tenantId,
                    createdAt: new Date(),
                }
            },
            { upsert: true }
        );

        const updatedDoc = await db.collection(COLLECTION_NAME).findOne({ tenantId });

        return NextResponse.json({
            success: true,
            data: updatedDoc,
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating/updating global style:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const db = await getDatabase();
        const result = await db.collection(COLLECTION_NAME).deleteOne({
            _id: new ObjectId(id),
        });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'Global style not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting global style:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
