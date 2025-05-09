import { NextResponse } from "next/server";

import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prismadb";

interface IParams {
	tagId?: string;
}

// Get a specific tag
export async function GET(request: Request, { params }: { params: IParams }) {
	try {
		const { tagId } = params;
		if (!tagId) {
			return new NextResponse("Tag ID is required", { status: 400 });
		}

		const currentUser = await getCurrentUser();
		if (!currentUser?.id) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const tag = await prisma.contactTag.findUnique({
			where: {
				id: tagId,
				creatorId: currentUser.id,
			},
		});

		if (!tag) {
			return new NextResponse("Tag not found", { status: 404 });
		}

		return NextResponse.json(tag);
	} catch (error) {
		console.error(error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

// Update an existing tag
export async function PATCH(request: Request, { params }: { params: IParams }) {
	try {
		const { tagId } = params;
		if (!tagId) {
			return new NextResponse("Tag ID is required", { status: 400 });
		}

		const currentUser = await getCurrentUser();
		if (!currentUser?.id) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const body = await request.json();
		const { name, color } = body;

		if (!name && !color) {
			return new NextResponse("At least one field to update is required", { status: 400 });
		}

		const existingTag = await prisma.contactTag.findUnique({
			where: {
				id: tagId,
				creatorId: currentUser.id,
			},
		});

		if (!existingTag) {
			return new NextResponse("Tag not found or not authorized", { status: 404 });
		}

		const updatedTag = await prisma.contactTag.update({
			where: {
				id: tagId,
			},
			data: {
				name: name ?? existingTag.name,
				color: color ?? existingTag.color,
			},
		});

		return NextResponse.json(updatedTag);
	} catch (error) {
		console.error(error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

// Delete a tag
export async function DELETE(request: Request, { params }: { params: IParams }) {
	try {
		const { tagId } = params;
		if (!tagId) {
			return new NextResponse("Tag ID is required", { status: 400 });
		}

		const currentUser = await getCurrentUser();
		if (!currentUser?.id) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const existingTag = await prisma.contactTag.findUnique({
			where: {
				id: tagId,
				creatorId: currentUser.id,
			},
		});

		if (!existingTag) {
			return new NextResponse("Tag not found or not authorized", { status: 404 });
		}

		await prisma.contactTag.delete({
			where: {
				id: tagId,
			},
		});

		return new NextResponse(null, { status: 204 });
	} catch (error) {
		console.error(error);
		return new NextResponse("Internal error", { status: 500 });
	}
}
