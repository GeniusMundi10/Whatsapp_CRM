/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { NextResponse } from "next/server";

import getCurrentUser from "@/actions/getCurrentUser";
import { prisma } from "@/lib/prisma";

interface RequestBody {
	title: string;
	description: string;
	dueDate: Date;
	priority: string;
	status: string;
	isRecurring?: boolean;
	recurrencePattern?: string;
	conversationId: string;
}

// Create a new follow-up
export async function POST(request: Request): Promise<NextResponse> {
	try {
		const currentUser = await getCurrentUser();
		const body = (await request.json()) as RequestBody;
		const { title, description, dueDate, priority, status, isRecurring, recurrencePattern, conversationId } = body;

		if (!currentUser?.id) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const followUp = await prisma.followUp.create({
			data: {
				title,
				description,
				dueDate: new Date(dueDate),
				priority,
				status,
				isRecurring,
				recurrencePattern,
				conversation: {
					connect: { id: conversationId },
				},
				creator: {
					connect: { id: currentUser.id },
				},
			},
		});

		return NextResponse.json(followUp);
	} catch (error) {
		return new NextResponse("Internal Error", { status: 500 });
	}
}

// Get all follow-ups for the current user
export async function GET(request: Request): Promise<NextResponse> {
	try {
		const currentUser = await getCurrentUser();
		const { searchParams } = new URL(request.url);
		const conversationId = searchParams.get("conversationId");
		const status = searchParams.get("status");
		const dueDate = searchParams.get("dueDate");

		if (!currentUser?.id) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const followUps = await prisma.followUp.findMany({
			where: {
				conversationId: conversationId ?? undefined,
				status: status ?? undefined,
				dueDate: dueDate ? new Date(dueDate) : undefined,
			},
			include: {
				creator: true,
			},
			orderBy: {
				dueDate: "asc",
			},
		});

		return NextResponse.json(followUps);
	} catch (error) {
		return new NextResponse("Internal Error", { status: 500 });
	}
}
