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
	name: string;
	color: string;
}

// Create a new contact tag
export async function POST(request: Request): Promise<NextResponse> {
	try {
		const currentUser = await getCurrentUser();
		const body = (await request.json()) as RequestBody;
		const { name, color } = body;

		if (!currentUser?.id) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const tag = await prisma.contactTag.create({
			data: {
				name,
				color,
				creator: {
					connect: { id: currentUser.id },
				},
			},
		});

		return NextResponse.json(tag);
	} catch (error) {
		return new NextResponse("Internal Error", { status: 500 });
	}
}

// Get all contact tags for the current user
export async function GET(request: Request): Promise<NextResponse> {
	try {
		const currentUser = await getCurrentUser();

		if (!currentUser?.id) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const tags = await prisma.contactTag.findMany({
			include: {
				creator: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return NextResponse.json(tags);
	} catch (error) {
		return new NextResponse("Internal Error", { status: 500 });
	}
}
