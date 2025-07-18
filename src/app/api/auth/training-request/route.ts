// // src/app/api/auth/training-request/route.ts
// import { NextResponse } from "next/server";
// import { PrismaClient } from "@/generated/prisma";

// const prisma = new PrismaClient();

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     const {
//       requestDate,
//       department,
//       areaOfTraining,
//       targetGroup,
//       budget,
//       startDate,
//       endDate,
//       remarks,
//     } = body;

//     const newRequest = await prisma.trainingRequest.create({
//       data: {
//         requestDate: new Date(requestDate),
//         currentTime: new Date().toLocaleTimeString(), // ⬅️ add this here
//         department,
//         areaOfTraining,
//         targetGroup,
//         budget,
//         startDate: new Date(startDate),
//         endDate: new Date(endDate),
//         remarks,
//       },
//     });

//     return NextResponse.json(newRequest, { status: 201 });
//   } catch (error) {
//     console.error("Error creating training request:", error);
//     return NextResponse.json(
//       { message: "Failed to create training request", error },
//       { status: 500 }
//     );
//   }
// }


// export async function GET() {
//   try {
//     const allRequests = await prisma.trainingRequest.findMany({
//       orderBy: { createdAt: "desc" },
//     });

//     return NextResponse.json(allRequests, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching training requests:", error);
//     return NextResponse.json({ message: "Failed to fetch requests" }, { status: 500 });
//   }
// }



import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      requestDate,
      department,
      areaOfTraining,
      targetGroup,
      budget,
      startDate,
      endDate,
      remarks,
    } = body;

    const newRequest = await prisma.trainingRequest.create({
      data: {
        requestDate: new Date(requestDate),
        currentTime: new Date().toLocaleTimeString(),
        department,
        areaOfTraining,
        targetGroup,
        budget,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        remarks,
      },
    });

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    console.error("Error creating training request:", error);
    return NextResponse.json(
      { message: "Failed to create training request", error },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const allRequests = await prisma.trainingRequest.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(allRequests, { status: 200 });
  } catch (error) {
    console.error("Error fetching training requests:", error);
    return NextResponse.json({ message: "Failed to fetch requests" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const {
      id,
      status,
      finalApprover, // Optional
      trainer,        // Optional
      requestDate,
      requestTime,
      department,
      areaOfTraining,
      targetGroup,
      budget,
      startDate,
      endDate,
      remarks,
    } = body;

    // Prepare dynamic update data
    const updateData: any = {
      status,
      requestDate: new Date(requestDate),
      currentTime: requestTime,
      department,
      areaOfTraining,
      targetGroup,
      budget,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      remarks,
    };

    // Conditionally add finalApprover or trainer
    if (finalApprover) {
      updateData.finalApprover = finalApprover;
    }

    if (trainer) {
      updateData.trainer = trainer;
    }

    const updated = await prisma.trainingRequest.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error updating training request:", error);
    return NextResponse.json(
      { message: "Failed to update training request", error },
      { status: 500 }
    );
  }
}
