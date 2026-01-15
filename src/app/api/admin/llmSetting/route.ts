import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/db/mongodb';

const COLLECTION_NAME = 'setting_llm';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

     const searchParams = request.nextUrl.searchParams;
     const tenantId = searchParams.get('tenantId');

     console.log("teannat id ",tenantId)
    const db = await getDatabase();
    
    const llmSettings = await db
      .collection(COLLECTION_NAME)
      .find({ tenantId:tenantId })
      .toArray();

    return NextResponse.json({ data: llmSettings });
  } catch (error) {
    console.error('Error fetching LLM settings:', error);
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
    if (!body.name || !body.secreteKey) {
      return NextResponse.json(
        { error: 'Model name and secret key are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    
    const newLLMSetting = {
      name: body.name,
       model:body.model,
      secreteKey: body.secreteKey,
      tenantId:body.tenantId, 
      createdBy: session?.user?.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection(COLLECTION_NAME).insertOne(newLLMSetting);

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...newLLMSetting },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating LLM setting:', error);
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
    const tenantId = body.tenantId;

    if (!body._id) {
      return NextResponse.json({ error: 'LLM setting ID is required' }, { status: 400 });
    }

    const db = await getDatabase();
    
    const updateData: any = {
      updatedAt: new Date(),
      updatedBy: session?.user?.id,
    };

    if (body.name) updateData.name = body.name;
    if (body.secreteKey) updateData.secreteKey = body.secreteKey;

    const result = await db.collection(COLLECTION_NAME).updateOne(
      { _id: new ObjectId(body._id), tenantId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'LLM setting not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { _id: body._id, ...updateData } });
  } catch (error) {
    console.error('Error updating LLM setting:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

   const body= await request.json();
   const id= body.id;

    if (!id) {
      return NextResponse.json({ error: 'LLM setting ID is required' }, { status: 400 });
    }

    const db = await getDatabase();
    
    const result = await db.collection(COLLECTION_NAME).deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'LLM setting not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting LLM setting:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
