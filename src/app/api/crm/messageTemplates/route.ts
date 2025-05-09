import { NextResponse } from "next/server";

import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prismadb";

// Create a new message template
export async function POST(request: Request) {
	try {
		const currentUser = await getCurrentUser();
		if (!currentUser?.id) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const body = await request.json();
		const { name, content, category, variables } = body;

		if (!name || !content) {
			return new NextResponse("Name and content are required", { status: 400 });
		}

		const template = await prisma.messageTemplate.create({
			data: {
				name,
				content,
				category,
				variables: variables || [],
				creator: {
					connect: {
						id: currentUser.id,
					},
				},
			},
		});

		return NextResponse.json(template);
	} catch (error) {
		console.error(error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

// Get all message templates for the current user
export async function GET(request: Request) {
	try {
		const currentUser = await getCurrentUser();
		if (!currentUser?.id) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const category = searchParams.get("category");

		const whereClause: any = {
			creatorId: currentUser.id,
		};

		if (category) {
			whereClause.category = category;
		}

		const templates = await prisma.messageTemplate.findMany({
			where: whereClause,
			orderBy: {
				usageCount: "desc",
			},
		});

		return NextResponse.json(templates);
	} catch (error) {
		console.error(error);
		return new NextResponse("Internal error", { status: 500 });
	}
}
