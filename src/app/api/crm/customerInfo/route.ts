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
	company: string;
	position: string;
	notes: string;
	address: string;
	website: string;
	priority: string;
	status: string;
	source: string;
	conversationId: string;
	tagIds: string[];
}

// Create or update customer information for a conversation
export async function POST(request: Request): Promise<NextResponse> {
	try {
		const currentUser = await getCurrentUser();
		const body = (await request.json()) as RequestBody;
		const { company, position, notes, address, website, priority, status, source, conversationId, tagIds } = body;

		if (!currentUser?.id) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		if (!conversationId) {
			return new NextResponse("Conversation ID is required", { status: 400 });
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
		});

		if (!conversation) {
			return new NextResponse("Conversation not found or access denied", { status: 404 });
		}

		// Check if customer info already exists for this conversation
		const existingInfo = await prisma.customerInfo.findUnique({
			where: {
				conversationId,
			},
		});

		let customerInfo;

		if (existingInfo) {
			// Update existing info
			customerInfo = await prisma.customerInfo.update({
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
					tags: tagIds
						? {
								connect: tagIds.map((id: string) => ({ id })),
						  }
						: undefined,
				},
				include: {
					tags: true,
				},
			});
		} else {
			// Create new info
			customerInfo = await prisma.customerInfo.create({
				data: {
					company,
					position,
					notes,
					address,
					website,
					priority,
					status,
					source,
					conversation: {
						connect: {
							id: conversationId,
						},
					},
					creator: {
						connect: {
							id: currentUser.id,
						},
					},
					tags: tagIds
						? {
								connect: tagIds.map((id: string) => ({ id })),
						  }
						: undefined,
				},
				include: {
					tags: true,
				},
			});
		}

		return NextResponse.json(customerInfo);
	} catch (error) {
		console.error(error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

// Get all customer info for the current user
export async function GET(request: Request): Promise<NextResponse> {
	try {
		const currentUser = await getCurrentUser();
		const { searchParams } = new URL(request.url);
		const conversationId = searchParams.get("conversationId");

		if (!currentUser?.id) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		// Fetch all conversations where the user is a participant and include the customer info
		const conversations = await prisma.conversation.findMany({
			where: {
				users: {
					some: {
						id: currentUser.id,
					},
				},
				customerInfo: {
					isNot: null,
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

		return NextResponse.json(conversations);
	} catch (error) {
		console.error(error);
		return new NextResponse("Internal error", { status: 500 });
	}
}
