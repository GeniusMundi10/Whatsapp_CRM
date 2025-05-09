import { NextResponse } from "next/server";

import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prismadb";

// Create a new contact note
export async function POST(request: Request) {
	try {
		const currentUser = await getCurrentUser();
		if (!currentUser?.id) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const body = await request.json();
		const { content, conversationId } = body;

		if (!content || !conversationId) {
			return new NextResponse("Content and conversation ID are required", { status: 400 });
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

		const note = await prisma.contactNote.create({
			data: {
				content,
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
			},
		});

		return NextResponse.json(note);
	} catch (error) {
		console.error(error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

// Get all notes for a conversation
export async function GET(request: Request) {
	try {
		const currentUser = await getCurrentUser();
		if (!currentUser?.id) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const conversationId = searchParams.get("conversationId");

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

		const notes = await prisma.contactNote.findMany({
			where: {
				conversationId,
			},
			include: {
				creator: {
					select: {
						id: true,
						name: true,
						image: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return NextResponse.json(notes);
	} catch (error) {
		console.error(error);
		return new NextResponse("Internal error", { status: 500 });
	}
}
