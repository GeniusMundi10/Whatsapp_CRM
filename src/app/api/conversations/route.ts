/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { NextResponse } from "next/server";

import getCurrentUser from "@/actions/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

interface RequestBody {
	userId: string;
	isGroup?: boolean;
	members?: string[];
	name?: string;
}

export async function POST(request: Request): Promise<NextResponse> {
	try {
		const currentUser = await getCurrentUser();
		const body = (await request.json()) as RequestBody;
		const { userId, isGroup, members, name } = body;

		if (!currentUser?.id || !currentUser?.email) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		if (isGroup && (!members || members.length < 2 || !name)) {
			return new NextResponse("Invalid data", { status: 400 });
		}

		if (isGroup) {
			const newConversation = await prisma.conversation.create({
				data: {
					name,
					isGroup,
					users: {
						connect: [
							...members!.map((member: string) => ({
								id: member,
							})),
							{
								id: currentUser.id,
							},
						],
					},
				},
				include: {
					users: true,
				},
			});

			// Update all connections with new conversation
			newConversation.users.forEach((user) => {
				if (user.email) {
					pusherServer.trigger(user.email, "conversation:new", newConversation);
				}
			});

			return NextResponse.json(newConversation);
		}

		const existingConversations = await prisma.conversation.findMany({
			where: {
				OR: [
					{
						users: {
							some: {
								id: currentUser.id,
							},
						},
					},
					{
						users: {
							some: {
								id: userId,
							},
						},
					},
				],
			},
		});

		const singleConversation = existingConversations[0];

		if (singleConversation) {
			return NextResponse.json(singleConversation);
		}

		const newConversation = await prisma.conversation.create({
			data: {
				users: {
					connect: [
						{
							id: currentUser.id,
						},
						{
							id: userId,
						},
					],
				},
			},
			include: {
				users: true,
			},
		});

		// Update all connections with new conversation
		newConversation.users.map((user) => {
			if (user.email) {
				pusherServer.trigger(user.email, "conversation:new", newConversation);
			}
		});

		return NextResponse.json(newConversation);
	} catch (error) {
		return new NextResponse("Internal Error", { status: 500 });
	}
}
