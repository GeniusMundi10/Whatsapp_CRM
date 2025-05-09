import { NextResponse } from "next/server";

import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prismadb";

interface IParams {
	templateId?: string;
}

// Get a specific message template
export async function GET(request: Request, { params }: { params: IParams }) {
	try {
		const { templateId } = params;
		if (!templateId) {
			return new NextResponse("Template ID is required", { status: 400 });
		}

		const currentUser = await getCurrentUser();
		if (!currentUser?.id) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const template = await prisma.messageTemplate.findUnique({
			where: {
				id: templateId,
				creatorId: currentUser.id,
			},
		});

		if (!template) {
			return new NextResponse("Template not found", { status: 404 });
		}

		return NextResponse.json(template);
	} catch (error) {
		console.error(error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

// Update a message template
export async function PATCH(request: Request, { params }: { params: IParams }) {
	try {
		const { templateId } = params;
		if (!templateId) {
			return new NextResponse("Template ID is required", { status: 400 });
		}

		const currentUser = await getCurrentUser();
		if (!currentUser?.id) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const body = await request.json();
		const { name, content, category, variables } = body;

		// Check if the template exists and belongs to the user
		const existingTemplate = await prisma.messageTemplate.findUnique({
			where: {
				id: templateId,
				creatorId: currentUser.id,
			},
		});

		if (!existingTemplate) {
			return new NextResponse("Template not found or not authorized", { status: 404 });
		}

		const updatedTemplate = await prisma.messageTemplate.update({
			where: {
				id: templateId,
			},
			data: {
				name: name ?? existingTemplate.name,
				content: content ?? existingTemplate.content,
				category: category !== undefined ? category : existingTemplate.category,
				variables: variables !== undefined ? variables : existingTemplate.variables,
			},
		});

		return NextResponse.json(updatedTemplate);
	} catch (error) {
		console.error(error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

// Delete a message template
export async function DELETE(request: Request, { params }: { params: IParams }) {
	try {
		const { templateId } = params;
		if (!templateId) {
			return new NextResponse("Template ID is required", { status: 400 });
		}

		const currentUser = await getCurrentUser();
		if (!currentUser?.id) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		// Check if the template exists and belongs to the user
		const existingTemplate = await prisma.messageTemplate.findUnique({
			where: {
				id: templateId,
				creatorId: currentUser.id,
			},
		});

		if (!existingTemplate) {
			return new NextResponse("Template not found or not authorized", { status: 404 });
		}

		await prisma.messageTemplate.delete({
			where: {
				id: templateId,
			},
		});

		return new NextResponse(null, { status: 204 });
	} catch (error) {
		console.error(error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

// API to increment template usage count
export async function PUT(request: Request, { params }: { params: IParams }) {
	try {
		const { templateId } = params;
		if (!templateId) {
			return new NextResponse("Template ID is required", { status: 400 });
		}

		const currentUser = await getCurrentUser();
		if (!currentUser?.id) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		// Check if the template exists and belongs to the user
		const existingTemplate = await prisma.messageTemplate.findUnique({
			where: {
				id: templateId,
				creatorId: currentUser.id,
			},
		});

		if (!existingTemplate) {
			return new NextResponse("Template not found or not authorized", { status: 404 });
		}

		// Increment the usage count
		const updatedTemplate = await prisma.messageTemplate.update({
			where: {
				id: templateId,
			},
			data: {
				usageCount: {
					increment: 1,
				},
			},
		});

		return NextResponse.json(updatedTemplate);
	} catch (error) {
		console.error(error);
		return new NextResponse("Internal error", { status: 500 });
	}
}
