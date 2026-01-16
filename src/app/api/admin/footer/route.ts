import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/db/mongodb';

const COLLECTION_NAME = 'templates_footer';

export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const websiteId = searchParams.get('websiteId');
        const slug = searchParams.get('slug');
        const tenantId = searchParams.get('tenantId');
    const id=   searchParams.get('id');
        const db = await getDatabase();

        // Build filter based on query parameters
        const filter: any = {};
        // Keep as strings since database stores them as strings, not ObjectIds
        if (websiteId) filter.websiteId = websiteId;
        if (slug) filter.slug = slug;
        if (tenantId) filter.tenantId = tenantId;
        if (id) filter._id = typeof id === 'string' ? new ObjectId(id) : id;    
        console.log('Filter:', filter); // Debug log

        const footers = await db
            .collection(COLLECTION_NAME)
            .find(filter)
            .sort({ createdAt: -1 })
            .toArray();

        console.log('Found footers:', footers.length); // Debug log

        return NextResponse.json({ items: footers });
    } catch (error) {
        console.error('Error fetching footers:', error);
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

        // Validate required fields
        if (!body.websiteId || !body.tenantId || !body.category || !body.content) {
            return NextResponse.json(
                { error: 'websiteId, tenantId, category, and content are required' },
                { status: 400 }
            );
        }

        const db = await getDatabase();

        // Check if footer with the given websiteId already exists
        const existingFooter = await db.collection(COLLECTION_NAME).findOne({
            websiteId: body.websiteId,
        });

        if (existingFooter) {
            // Update only content and updatedAt
            const updateResult = await db.collection(COLLECTION_NAME).updateOne(
                { websiteId: body.websiteId },
                {
                    $set: {
                        content: body.content,
                        updatedAt: new Date(),
                    },
                }
            );

            // Fetch the updated document
            const updatedFooter = await db.collection(COLLECTION_NAME).findOne({
                websiteId: body.websiteId,
            });

            return NextResponse.json({
                success: true,
                data: updatedFooter,
                message: 'Footer updated successfully',
            }, { status: 200 });
        } else {
            // Create new footer
            const newFooter = {
                slug: body.slug,
                templateId: body.templateId,
                label: body.label,
                category: body.category,
                tenantId: body.tenantId,
                websiteId: body.websiteId,
                content: body.content || '',
                createdBy: session?.user?.id,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const result = await db.collection(COLLECTION_NAME).insertOne(newFooter);

            return NextResponse.json({
                success: true,
                data: { _id: result.insertedId, ...newFooter },
                message: 'Footer created successfully',
            }, { status: 201 });
        }
    } catch (error) {
        console.error('Error creating/updating footer:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        if (!body._id) {
            return NextResponse.json({ error: 'Footer ID is required' }, { status: 400 });
        }

        const db = await getDatabase();

        const updateData: any = {
            updatedAt: new Date(),
            updatedBy: session?.user?.id,
        };

      
        if (body.content !== undefined) updateData.content = body.content;
        if (body.websiteId) updateData.websiteId = body.websiteId;
        if (body.tenantId) updateData.tenantId = body.tenantId;

        const result = await db.collection(COLLECTION_NAME).updateOne(
            { _id: new ObjectId(body._id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'Footer not found' }, { status: 404 });
        }

        // Fetch and return the updated document
        const updatedFooter = await db.collection(COLLECTION_NAME).findOne({
            _id: new ObjectId(body._id),
        });

        return NextResponse.json({ success: true, data: updatedFooter });
    } catch (error) {
        console.error('Error updating footer:', error);
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
        const id = body.id;

        if (!id) {
            return NextResponse.json({ error: 'Footer ID is required' }, { status: 400 });
        }

        const db = await getDatabase();

        const result = await db.collection(COLLECTION_NAME).deleteOne({
            _id: new ObjectId(id),
        });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'Footer not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting footer:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
