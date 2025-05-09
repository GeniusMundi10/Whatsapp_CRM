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
	noteId?: string;
}

interface RequestBody {
	content: string;
}

// Get a specific note
export async function GET(request: Request, { params }: { params: IParams }) {
	try {
		const { noteId } = params;
		if (!noteId) {
			return new NextResponse("Note ID is required", { status: 400 });
		}

		const currentUser = await getCurrentUser();
		if (!currentUser?.id) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const note = await prisma.contactNote.findFirst({
			where: {
				id: noteId,
				conversation: {
					users: {
						some: {
							id: currentUser.id,
						},
					},
				},
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
		});

		if (!note) {
			return new NextResponse("Note not found or access denied", { status: 404 });
		}

		return NextResponse.json(note);
	} catch (error) {
		console.error(error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

// Update a note
export async function PATCH(request: Request, { params }: { params: IParams }): Promise<NextResponse> {
	try {
		const currentUser = await getCurrentUser();
		const body = (await request.json()) as RequestBody;
		const { content } = body;
		const { noteId } = params;

		if (!currentUser?.id) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		if (!noteId) {
			return new NextResponse("Note ID is required", { status: 400 });
		}

		const note = await prisma.contactNote.update({
			where: {
				id: noteId,
			},
			data: {
				content,
			},
		});

		return NextResponse.json(note);
	} catch (error) {
		return new NextResponse("Internal Error", { status: 500 });
	}
}

// Delete a note
export async function DELETE(_: Request, { params }: { params: IParams }): Promise<NextResponse> {
	try {
		const currentUser = await getCurrentUser();
		const { noteId } = params;

		if (!currentUser?.id) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		if (!noteId) {
			return new NextResponse("Note ID is required", { status: 400 });
		}

		const note = await prisma.contactNote.delete({
			where: {
				id: noteId,
			},
		});

		return NextResponse.json(note);
	} catch (error) {
		return new NextResponse("Internal Error", { status: 500 });
	}
}
