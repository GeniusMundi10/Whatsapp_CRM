/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { NextResponse } from "next/server";

import getCurrentUser from "@/actions/getCurrentUser";
import { prisma } from "@/lib/prisma";

interface IParams {
	followUpId?: string;
}

interface RequestBody {
	title: string;
	description: string;
	dueDate: Date;
	priority: string;
	status: string;
	isRecurring?: boolean;
	recurrencePattern?: string;
}

// Get a specific follow-up
export async function GET(request: Request, { params }: { params: IParams }) {
	try {
		const { followUpId } = params;
		if (!followUpId) {
			return new NextResponse("Follow-up ID is required", { status: 400 });
		}

		const currentUser = await getCurrentUser();
		if (!currentUser?.id) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const followUp = await prisma.followUp.findUnique({
			where: {
				id: followUpId,
				creatorId: currentUser.id,
			},
			include: {
				conversation: {
					include: {
						users: true,
					},
				},
			},
		});

		if (!followUp) {
			return new NextResponse("Follow-up not found", { status: 404 });
		}

		return NextResponse.json(followUp);
	} catch (error) {
		console.error(error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

// Update a follow-up
export async function PATCH(request: Request, { params }: { params: IParams }): Promise<NextResponse> {
	try {
		const currentUser = await getCurrentUser();
		const body = (await request.json()) as RequestBody;
		const { title, description, dueDate, priority, status, isRecurring, recurrencePattern } = body;
		const { followUpId } = params;

		if (!currentUser?.id) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		if (!followUpId) {
			return new NextResponse("Follow-up ID is required", { status: 400 });
		}

		const followUp = await prisma.followUp.update({
			where: {
				id: followUpId,
			},
			data: {
				title,
				description,
				dueDate: new Date(dueDate),
				priority,
				status,
				isRecurring,
				recurrencePattern,
			},
		});

		return NextResponse.json(followUp);
	} catch (error) {
		return new NextResponse("Internal Error", { status: 500 });
	}
}

// Delete a follow-up
export async function DELETE(_: Request, { params }: { params: IParams }): Promise<NextResponse> {
	try {
		const currentUser = await getCurrentUser();
		const { followUpId } = params;

		if (!currentUser?.id) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		if (!followUpId) {
			return new NextResponse("Follow-up ID is required", { status: 400 });
		}

		const followUp = await prisma.followUp.delete({
			where: {
				id: followUpId,
			},
		});

		return NextResponse.json(followUp);
	} catch (error) {
		return new NextResponse("Internal Error", { status: 500 });
	}
}
