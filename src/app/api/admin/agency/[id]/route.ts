import { getCollection } from "@/app/api/tenants/[id]/route";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const param = await params;
  const id = new ObjectId(param.id);

  try {
    if (!id) {
      return NextResponse.json({
        success: false,
        message: "No ID Found",
      });
    }

    const tenantColls = await getCollection("tenants");

    const data = await tenantColls
      .aggregate([
        {
          $match: {
            _id: id,
          },
        },
        {
          $lookup: {
            from: "tenants",
            localField: "_id",
            foreignField: "tenantId",
            as: "result",
          },
        },
        {
          $lookup: {
            from: "websites",
            let: { tenantIds: "$result._id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: ["$tenantId", "$$tenantIds"],
                  },
                },
              },
            ],
            as: "websites",
          },
        },
        {
          $addFields: {
            result: {
              $map: {
                input: "$result",
                as: "r",
                in: {
                  $mergeObjects: [
                    "$$r",
                    {
                      websites: {
                        $filter: {
                          input: "$websites",
                          as: "w",
                          cond: { $eq: ["$$w.tenantId", "$$r._id"] },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
        {
          $project: {
            websites: 0,
          },
        },
      ])
      .toArray();

      return NextResponse.json({
        data: data[0],
        message: "SuccessFull",
        success:true
      })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error,
    });
  }
}
