import { PageCommentModal } from "@/components/admin/website/websitePage/WebsitePageType";
import { getDatabase } from "@/lib/db/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

// add page comment
export async function POST(req: Request) {
    try {
        const db = await getDatabase();
        const collection = db.collection("pages");
        const body: PageCommentModal = await req.json();

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Page ID is required" }, { status: 400 });
        }

        const existingPage = await collection.findOne({ _id: new ObjectId(id) });
        if (!existingPage) {
            return NextResponse.json({ error: "Page not found" }, { status: 404 });
        }

        // Generate a new ObjectId for the comment if it doesn't have one
        const newComment: PageCommentModal = {
            ...body,
            _id: new ObjectId(),
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        // Push the new comment into the pageComments array
        const updateResult = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $push: { pageComments: newComment } as any }
        );

        if (updateResult.matchedCount === 0) {
            return NextResponse.json({ error: "Page not found" }, { status: 404 });
        }

        const updated = await collection.findOne({ _id: new ObjectId(id) });
        return NextResponse.json(updated);

    } catch (err: any) {
        return NextResponse.json(
            { error: err.message || "Failed to add comment" },
            { status: 500 }
        );
    }
}


// update comment
export async function PUT(req: Request) {
    try {
        const db = await getDatabase();
        const collection = db.collection("pages");
        const body: PageCommentModal = await req.json();

        const { searchParams } = new URL(req.url);
        const pageId = searchParams.get("pageId");
        const commentId = body?._id?.toString();

        if (!pageId) {
            return NextResponse.json({ error: "Page ID is required" }, { status: 400 });
        }
        if (!commentId) {
            return NextResponse.json({ error: "Comment ID is required" }, { status: 400 });
        }

        const existingPage = await collection.findOne({ _id: new ObjectId(pageId) });

        if (!existingPage) {
            return NextResponse.json({ error: "Page not found" }, { status: 404 });
        }

        const pageComments: PageCommentModal[] = existingPage.pageComments || [];

        const commentExists = pageComments.some(
            (comment: PageCommentModal) => comment._id?.toString() === commentId
        );

        if (!commentExists) {
            return NextResponse.json({ error: "Comment not found" }, { status: 404 });
        }

        // Replace the matching comment with the updated body
        const updatedComments = pageComments.map((comment: PageCommentModal) => {
            if (comment._id?.toString() === commentId) {
                return {
                    ...comment,
                    ...body,
                    updatedAt: new Date(),
                };
            }
            return comment;
        });

        // Update the page with the new comments array
        const updateResult = await collection.updateOne(
            { _id: new ObjectId(pageId) },
            { $set: { pageComments: updatedComments } }
        );

        if (updateResult.matchedCount === 0) {
            return NextResponse.json({ error: "Page not found" }, { status: 404 });
        }

        const updated = await collection.findOne({ _id: new ObjectId(pageId) });
        return NextResponse.json(updated);

    } catch (err: any) {
        return NextResponse.json(
            { error: err.message || "Failed to update comment" },
            { status: 500 }
        );
    }
}

// delete comment
export async function DELETE(req: Request) {
    try {
        const db = await getDatabase();
        const collection = db.collection("pages");

        const { searchParams } = new URL(req.url);
        const pageId = searchParams.get("pageId");
        const commentId = searchParams.get("commentId");

        if (!pageId) {
            return NextResponse.json({ error: "Page ID is required" }, { status: 400 });
        }
        if (!commentId) {
            return NextResponse.json({ error: "Comment ID is required" }, { status: 400 });
        }

        const existingPage = await collection.findOne({ _id: new ObjectId(pageId) });
        if (!existingPage) {
            return NextResponse.json({ error: "Page not found" }, { status: 404 });
        }

        // Pull the comment from the pageComments array
        const updateResult = await collection.updateOne(
            { _id: new ObjectId(pageId) },
            { $pull: { pageComments: { _id: new ObjectId(commentId) } } as any }
        );

        if (updateResult.matchedCount === 0) {
            return NextResponse.json({ error: "Page not found" }, { status: 404 });
        }

        const updated = await collection.findOne({ _id: new ObjectId(pageId) });
        return NextResponse.json(updated);

    } catch (err: any) {
        return NextResponse.json(
            { error: err.message || "Failed to delete comment" },
            { status: 500 }
        );
    }
}