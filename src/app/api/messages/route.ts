import { NextResponse } from "next/server";

import getCurrentUser from "@/actions/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

export async function POST(request: Request): Promise<NextResponse> {
	try {
		const currentUser = await getCurrentUser();
		const body = (await request.json()) as {
			message: string;
			image: string;
			conversationId: string;
			audio: string;
			templateId?: string;
		};
		const { message, image, conversationId, audio, templateId } = body;
		if (!currentUser?.id || !currentUser.email) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const messageData: any = {
			body: message,
			image: image,
			audio: audio,
			conversation: {
				connect: { id: conversationId },
			},
			sender: {
				connect: { id: currentUser.id },
			},
			seen: {
				connect: {
					id: currentUser.id,
				},
			},
		};

		if (templateId) {
			messageData.fromTemplate = true;
			messageData.messageTemplate = {
				connect: { id: templateId },
			};

			await prisma.messageTemplate.update({
				where: { id: templateId },
				data: { usageCount: { increment: 1 } },
			});
		}

		const newMessage = await prisma.message.create({
			include: {
				seen: {
					select: {
						id: true,
						email: true,
						image: true,
						name: true,
						createdAt: true,
						updatedAt: true,
						lastSeen: true,
						conversationIds: false,
						seenMessageIds: false,
					},
				},
				sender: {
					select: {
						id: true,
						email: true,
						image: true,
						name: true,
						createdAt: true,
						updatedAt: true,
						lastSeen: true,
						conversationIds: false,
						seenMessageIds: false,
					},
				},
				messageTemplate: true,
			},
			data: messageData,
		});
		const updateConversation = await prisma.conversation.update({
			where: {
				id: conversationId,
			},
			data: {
				lastMessageAt: new Date(),
				messages: {
					connect: {
						id: newMessage.id,
					},
				},
			},
			include: {
				users: {
					select: {
						id: true,
						email: true,
						image: true,
						name: true,
						createdAt: true,
						updatedAt: true,
						lastSeen: true,
						conversationIds: false,
						seenMessageIds: false,
					},
				},
				messages: {
					include: {
						sender: {
							select: {
								id: true,
								email: true,
								image: true,
								name: true,
								createdAt: true,
								updatedAt: true,
								lastSeen: true,
								conversationIds: false,
								seenMessageIds: false,
							},
						},
						seen: {
							select: {
								id: true,
								email: true,
								image: true,
								name: true,
								createdAt: true,
								updatedAt: true,
								lastSeen: true,
								conversationIds: false,
								seenMessageIds: false,
							},
						},
						messageTemplate: true,
					},
				},
			},
		});
		updateConversation.users.map(async (user): Promise<void> => {
			await pusherServer.trigger(String(user.email), "conversation:update", {
				id: conversationId,
				messages: [newMessage],
			});
		});
		await pusherServer.trigger(conversationId, "messages:new", newMessage);
		return NextResponse.json(newMessage);
	} catch (error) {
		console.log(error, "ERROR_MESSAGES");
		return new NextResponse("Error", { status: 500 });
	}
}
