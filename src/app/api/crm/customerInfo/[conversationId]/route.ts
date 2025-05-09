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
	conversationId?: string;
}

interface RequestBody {
	company: string;
	position: string;
	notes: string;
	address: string;
	website: string;
	priority: string;
	status: string;
	source: string;
	tagIds: string[];
}

// Get customer info for a specific conversation
export async function GET(request: Request, { params }: { params: IParams }) {
	try {
		const { conversationId } = params;
		if (!conversationId) {
			return new NextResponse("Conversation ID is required", { status: 400 });
		}

		const currentUser = await getCurrentUser();
		if (!currentUser?.id) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		// Check if the user is part of the conversation
		const conversation = await prisma.conversation.findFirst({
			where: {
				id: conversationId,
				users: {
					some: {
						id: currentUser.id,
					},
				},
			},
			include: {
				customerInfo: {
					include: {
						tags: true,
					},
				},
				users: true,
			},
		});

		if (!conversation) {
			return new NextResponse("Conversation not found or access denied", { status: 404 });
		}

		return NextResponse.json(conversation.customerInfo);
	} catch (error) {
		console.error(error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

// Update customer info for a specific conversation
export async function PATCH(request: Request, { params }: { params: IParams }): Promise<NextResponse> {
	try {
		const currentUser = await getCurrentUser();
		const body = (await request.json()) as RequestBody;
		const { company, position, notes, address, website, priority, status, source, tagIds } = body;
		const { conversationId } = params;

		if (!currentUser?.id) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		if (!conversationId) {
			return new NextResponse("Conversation ID is required", { status: 400 });
		}

		const customerInfo = await prisma.customerInfo.update({
			where: {
				conversationId,
			},
			data: {
				company,
				position,
				notes,
				address,
				website,
				priority,
				status,
				source,
				tags: {
					set: tagIds.map((id) => ({ id })),
				},
			},
			include: {
				tags: true,
			},
		});

		return NextResponse.json(customerInfo);
	} catch (error) {
		return new NextResponse("Internal Error", { status: 500 });
	}
}

// Delete customer info for a specific conversation
export async function DELETE(_: Request, { params }: { params: IParams }): Promise<NextResponse> {
	try {
		const currentUser = await getCurrentUser();
		const { conversationId } = params;

		if (!currentUser?.id) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		if (!conversationId) {
			return new NextResponse("Conversation ID is required", { status: 400 });
		}

		const customerInfo = await prisma.customerInfo.delete({
			where: {
				conversationId,
			},
		});

		return NextResponse.json(customerInfo);
	} catch (error) {
		return new NextResponse("Internal Error", { status: 500 });
	}
}
