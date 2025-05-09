import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main(): Promise<void> {
	try {
		// Create users with different profiles and states
		const user1 = await prisma.user.upsert({
			where: { email: "john@example.com" },
			update: {},
			create: {
				name: "John Doe",
				email: "john@example.com",
				hashedPassword: await bcrypt.hash("password123", 12),
				image: "https://res.cloudinary.com/demo/image/upload/v1/sample.jpg",
				about: "Sales Manager at TechCorp. Always available for business inquiries!",
			},
		});

		const user2 = await prisma.user.upsert({
			where: { email: "jane@example.com" },
			update: {},
			create: {
				name: "Jane Smith",
				email: "jane@example.com",
				hashedPassword: await bcrypt.hash("password123", 12),
				image: "https://res.cloudinary.com/demo/image/upload/v1/cld-sample-5.jpg",
				about: "Marketing Director at Acme Inc.",
			},
		});

		const user3 = await prisma.user.upsert({
			where: { email: "bob@example.com" },
			update: {},
			create: {
				name: "Bob Johnson",
				email: "bob@example.com",
				hashedPassword: await bcrypt.hash("password123", 12),
				image: "https://res.cloudinary.com/demo/image/upload/v1/cld-sample.jpg",
				about: "Tech entrepreneur and startup advisor",
			},
		});

		const user4 = await prisma.user.upsert({
			where: { email: "sarah@example.com" },
			update: {},
			create: {
				name: "Sarah Williams",
				email: "sarah@example.com",
				hashedPassword: await bcrypt.hash("password123", 12),
				image: "https://res.cloudinary.com/demo/image/upload/v1/cld-sample-2.jpg",
				about: "Senior Developer at CodeNest",
			},
		});

		const user5 = await prisma.user.upsert({
			where: { email: "michael@example.com" },
			update: {},
			create: {
				name: "Michael Brown",
				email: "michael@example.com",
				hashedPassword: await bcrypt.hash("password123", 12),
				image: "https://res.cloudinary.com/demo/image/upload/v1/cld-sample-3.jpg",
				about: "Financial Advisor at MoneyMatters",
			},
		});

		// Create one-on-one conversations
		const conversation1 = await prisma.conversation.create({
			data: {
				users: {
					connect: [{ id: user1.id }, { id: user2.id }],
				},
			},
		});

		const conversation2 = await prisma.conversation.create({
			data: {
				users: {
					connect: [{ id: user1.id }, { id: user3.id }],
				},
			},
		});

		const conversation3 = await prisma.conversation.create({
			data: {
				users: {
					connect: [{ id: user1.id }, { id: user4.id }],
				},
			},
		});

		const conversation4 = await prisma.conversation.create({
			data: {
				users: {
					connect: [{ id: user1.id }, { id: user5.id }],
				},
			},
		});

		// Creating a conversation between Jane and Bob
		const conversation5 = await prisma.conversation.create({
			data: {
				users: {
					connect: [{ id: user2.id }, { id: user3.id }],
				},
			},
		});

		// Add a message to this conversation to make it visible
		await prisma.message.create({
			data: {
				body: "Hi Bob, Jane here from marketing. Do you have time to discuss collaboration?",
				conversation: {
					connect: { id: conversation5.id },
				},
				sender: {
					connect: { id: user2.id },
				},
				seen: {
					connect: [{ id: user2.id }],
				},
			},
		});

		// Create group conversations
		const groupConversation1 = await prisma.conversation.create({
			data: {
				name: "Project Team",
				isGroup: true,
				logo: "https://res.cloudinary.com/demo/image/upload/v1/cld-sample-4.jpg",
				users: {
					connect: [{ id: user1.id }, { id: user2.id }, { id: user3.id }],
				},
			},
		});

		const groupConversation2 = await prisma.conversation.create({
			data: {
				name: "Marketing Strategies",
				isGroup: true,
				logo: "https://res.cloudinary.com/demo/image/upload/v1/cld-sample-5.jpg",
				users: {
					connect: [{ id: user1.id }, { id: user2.id }, { id: user4.id }, { id: user5.id }],
				},
			},
		});

		const groupConversation3 = await prisma.conversation.create({
			data: {
				name: "Tech Discussion",
				isGroup: true,
				logo: "https://res.cloudinary.com/demo/image/upload/v1/cld-sample-6.jpg",
				users: {
					connect: [{ id: user3.id }, { id: user4.id }, { id: user5.id }],
				},
			},
		});

		// Add a message to Tech Discussion group to make it visible
		await prisma.message.create({
			data: {
				body: "Welcome to the Tech Discussion group! Let's share ideas and collaborate.",
				conversation: {
					connect: { id: groupConversation3.id },
				},
				sender: {
					connect: { id: user3.id },
				},
				seen: {
					connect: [{ id: user3.id }],
				},
			},
		});

		// Create messages for conversation1 (John and Jane)
		await prisma.message.create({
			data: {
				body: "Hey Jane, how are you?",
				conversation: {
					connect: { id: conversation1.id },
				},
				sender: {
					connect: { id: user1.id },
				},
				seen: {
					connect: [{ id: user1.id }, { id: user2.id }],
				},
			},
		});

		await prisma.message.create({
			data: {
				body: "I'm good, thanks for asking! How about you?",
				conversation: {
					connect: { id: conversation1.id },
				},
				sender: {
					connect: { id: user2.id },
				},
				seen: {
					connect: [{ id: user1.id }, { id: user2.id }],
				},
			},
		});

		await prisma.message.create({
			data: {
				body: "Doing well! I wanted to discuss our upcoming marketing campaign.",
				conversation: {
					connect: { id: conversation1.id },
				},
				sender: {
					connect: { id: user1.id },
				},
				seen: {
					connect: [{ id: user1.id }, { id: user2.id }],
				},
			},
		});

		await prisma.message.create({
			data: {
				body: "Sure, I've been working on some ideas. Let me send you the presentation.",
				conversation: {
					connect: { id: conversation1.id },
				},
				sender: {
					connect: { id: user2.id },
				},
				seen: {
					connect: [{ id: user1.id }, { id: user2.id }],
				},
			},
		});

		await prisma.message.create({
			data: {
				body: "Here's the presentation",
				image: "https://res.cloudinary.com/demo/image/upload/v1/samples/ecommerce/accessories-bag.jpg",
				type: "image",
				conversation: {
					connect: { id: conversation1.id },
				},
				sender: {
					connect: { id: user2.id },
				},
				seen: {
					connect: [{ id: user1.id }, { id: user2.id }],
				},
			},
		});

		await prisma.message.create({
			data: {
				body: "This looks great! I especially like the social media strategy.",
				conversation: {
					connect: { id: conversation1.id },
				},
				sender: {
					connect: { id: user1.id },
				},
				seen: {
					connect: [{ id: user1.id }, { id: user2.id }],
				},
			},
		});

		// Create messages for conversation2 (John and Bob)
		await prisma.message.create({
			data: {
				body: "Hey Bob, do you have time to discuss the project?",
				conversation: {
					connect: { id: conversation2.id },
				},
				sender: {
					connect: { id: user1.id },
				},
				seen: {
					connect: [{ id: user1.id }],
				},
			},
		});

		await prisma.message.create({
			data: {
				body: "Sure, I'm free now. What's on your mind?",
				conversation: {
					connect: { id: conversation2.id },
				},
				sender: {
					connect: { id: user3.id },
				},
				seen: {
					connect: [{ id: user1.id }, { id: user3.id }],
				},
			},
		});

		await prisma.message.create({
			data: {
				body: "I'm thinking about integrating a CRM system into our platform. Your startup experience would be valuable.",
				conversation: {
					connect: { id: conversation2.id },
				},
				sender: {
					connect: { id: user1.id },
				},
				seen: {
					connect: [{ id: user1.id }, { id: user3.id }],
				},
			},
		});

		await prisma.message.create({
			data: {
				body: "That's a great idea. I've worked with several CRM systems. Here's a comparison chart I created.",
				conversation: {
					connect: { id: conversation2.id },
				},
				sender: {
					connect: { id: user3.id },
				},
				seen: {
					connect: [{ id: user1.id }, { id: user3.id }],
				},
			},
		});

		await prisma.message.create({
			data: {
				body: "CRM Comparison",
				image: "https://res.cloudinary.com/demo/image/upload/v1/samples/food/spices.jpg",
				type: "image",
				conversation: {
					connect: { id: conversation2.id },
				},
				sender: {
					connect: { id: user3.id },
				},
				seen: {
					connect: [{ id: user1.id }, { id: user3.id }],
				},
			},
		});

		// Create messages for group conversation
		await prisma.message.create({
			data: {
				body: "Hello everyone! Let's discuss the project timeline.",
				conversation: {
					connect: { id: groupConversation1.id },
				},
				sender: {
					connect: { id: user1.id },
				},
				seen: {
					connect: [{ id: user1.id }],
				},
			},
		});

		await prisma.message.create({
			data: {
				body: "I've prepared a Gantt chart for the next quarter.",
				conversation: {
					connect: { id: groupConversation1.id },
				},
				sender: {
					connect: { id: user2.id },
				},
				seen: {
					connect: [{ id: user1.id }, { id: user2.id }],
				},
			},
		});

		await prisma.message.create({
			data: {
				body: "Project Timeline",
				image: "https://res.cloudinary.com/demo/image/upload/v1/samples/landscapes/beach-boat.jpg",
				type: "image",
				conversation: {
					connect: { id: groupConversation1.id },
				},
				sender: {
					connect: { id: user2.id },
				},
				seen: {
					connect: [{ id: user1.id }, { id: user2.id }],
				},
			},
		});

		await prisma.message.create({
			data: {
				body: "This looks good, but I think we need to allocate more time for testing.",
				conversation: {
					connect: { id: groupConversation1.id },
				},
				sender: {
					connect: { id: user3.id },
				},
				seen: {
					connect: [{ id: user1.id }, { id: user2.id }, { id: user3.id }],
				},
			},
		});

		// Create messages for the marketing group
		await prisma.message.create({
			data: {
				body: "Welcome to the Marketing Strategies group!",
				conversation: {
					connect: { id: groupConversation2.id },
				},
				sender: {
					connect: { id: user2.id },
				},
				seen: {
					connect: [{ id: user2.id }],
				},
			},
		});

		await prisma.message.create({
			data: {
				body: "Thanks for creating this group, Jane. Looking forward to our collaboration.",
				conversation: {
					connect: { id: groupConversation2.id },
				},
				sender: {
					connect: { id: user1.id },
				},
				seen: {
					connect: [{ id: user1.id }, { id: user2.id }],
				},
			},
		});

		await prisma.message.create({
			data: {
				body: "I have some ideas for our social media strategy. Let's discuss tomorrow?",
				conversation: {
					connect: { id: groupConversation2.id },
				},
				sender: {
					connect: { id: user4.id },
				},
				seen: {
					connect: [{ id: user1.id }, { id: user2.id }, { id: user4.id }],
				},
			},
		});

		// Create CRM entities

		// Contact Tags with more variety
		const tag1 = await prisma.contactTag.create({
			data: {
				name: "Client",
				color: "#FF6B6B",
				creator: {
					connect: { id: user1.id },
				},
			},
		});

		const tag2 = await prisma.contactTag.create({
			data: {
				name: "Lead",
				color: "#4ECDC4",
				creator: {
					connect: { id: user1.id },
				},
			},
		});

		const tag3 = await prisma.contactTag.create({
			data: {
				name: "VIP",
				color: "#FFD166",
				creator: {
					connect: { id: user1.id },
				},
			},
		});

		const tag4 = await prisma.contactTag.create({
			data: {
				name: "Prospect",
				color: "#6A0572",
				creator: {
					connect: { id: user1.id },
				},
			},
		});

		const tag5 = await prisma.contactTag.create({
			data: {
				name: "Partner",
				color: "#1E3A8A",
				creator: {
					connect: { id: user1.id },
				},
			},
		});

		const tag6 = await prisma.contactTag.create({
			data: {
				name: "Inactive",
				color: "#9CA3AF",
				creator: {
					connect: { id: user1.id },
				},
			},
		});

		// Customer Info for various contacts
		// Customer Info for Jane
		await prisma.customerInfo.create({
			data: {
				company: "Acme Inc",
				position: "Marketing Director",
				notes: "Important client with a big budget. Looking for long-term partnership opportunities.",
				address: "123 Main St, New York, NY",
				website: "https://acme.com",
				priority: "High",
				status: "Customer",
				source: "Referral",
				conversation: {
					connect: { id: conversation1.id },
				},
				creator: {
					connect: { id: user1.id },
				},
				tags: {
					connect: [{ id: tag1.id }, { id: tag3.id }],
				},
			},
		});

		// Customer Info for Bob
		await prisma.customerInfo.create({
			data: {
				company: "TechStart",
				position: "CEO",
				notes: "Promising startup with innovative ideas. Looking for investment opportunities.",
				address: "456 Innovation Dr, San Francisco, CA",
				website: "https://techstart.io",
				priority: "Medium",
				status: "Lead",
				source: "Website",
				conversation: {
					connect: { id: conversation2.id },
				},
				creator: {
					connect: { id: user1.id },
				},
				tags: {
					connect: [{ id: tag2.id }, { id: tag4.id }],
				},
			},
		});

		// Customer Info for Sarah
		await prisma.customerInfo.create({
			data: {
				company: "CodeNest",
				position: "Senior Developer",
				notes: "Technical expert, potential for partnership on development projects.",
				address: "789 Tech Ave, Seattle, WA",
				website: "https://codenest.dev",
				priority: "Medium",
				status: "Partner",
				source: "Conference",
				conversation: {
					connect: { id: conversation3.id },
				},
				creator: {
					connect: { id: user1.id },
				},
				tags: {
					connect: [{ id: tag5.id }],
				},
			},
		});

		// Customer Info for Michael
		await prisma.customerInfo.create({
			data: {
				company: "MoneyMatters",
				position: "Financial Advisor",
				notes: "Interested in our premium services. Has a large network of potential clients.",
				address: "101 Finance Blvd, Chicago, IL",
				website: "https://moneymatters.com",
				priority: "High",
				status: "Prospect",
				source: "LinkedIn",
				conversation: {
					connect: { id: conversation4.id },
				},
				creator: {
					connect: { id: user1.id },
				},
				tags: {
					connect: [{ id: tag4.id }],
				},
			},
		});

		// Customer info with the Inactive tag
		await prisma.customerInfo.create({
			data: {
				company: "Old Client Ltd",
				position: "Former Customer",
				notes: "Previous customer who hasn't engaged in 6 months. May need re-engagement campaign.",
				address: "222 Past Ave, Miami, FL",
				website: "https://oldclient.com",
				priority: "Low",
				status: "Inactive",
				source: "Previous Database",
				conversation: {
					connect: { id: conversation5.id },
				},
				creator: {
					connect: { id: user2.id },
				},
				tags: {
					connect: [{ id: tag6.id }],
				},
			},
		});

		// Follow-ups with various due dates and statuses
		// Follow-ups for Jane
		await prisma.followUp.create({
			data: {
				title: "Product demo with Jane",
				description: "Show the new CRM features and discuss integration options with Acme's existing systems.",
				dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
				priority: "High",
				status: "Pending",
				conversation: {
					connect: { id: conversation1.id },
				},
				creator: {
					connect: { id: user1.id },
				},
			},
		});

		await prisma.followUp.create({
			data: {
				title: "Annual contract renewal discussion",
				description: "Review current terms and propose enhanced package",
				dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
				priority: "High",
				status: "Pending",
				isRecurring: true,
				recurrencePattern: "Yearly",
				conversation: {
					connect: { id: conversation1.id },
				},
				creator: {
					connect: { id: user1.id },
				},
			},
		});

		// Follow-ups for Bob
		await prisma.followUp.create({
			data: {
				title: "Send proposal to Bob",
				description: "Prepare and send detailed pricing proposal for TechStart integration",
				dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
				priority: "Medium",
				status: "Pending",
				conversation: {
					connect: { id: conversation2.id },
				},
				creator: {
					connect: { id: user1.id },
				},
			},
		});

		await prisma.followUp.create({
			data: {
				title: "Follow up on proposal",
				description: "Check if Bob has any questions about our proposal",
				dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
				priority: "Medium",
				status: "Pending",
				conversation: {
					connect: { id: conversation2.id },
				},
				creator: {
					connect: { id: user1.id },
				},
			},
		});

		// Follow-ups for Sarah
		await prisma.followUp.create({
			data: {
				title: "Discuss technical partnership",
				description: "Explore potential for joint development projects",
				dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
				priority: "Medium",
				status: "Pending",
				conversation: {
					connect: { id: conversation3.id },
				},
				creator: {
					connect: { id: user1.id },
				},
			},
		});

		// Follow-ups for Michael
		await prisma.followUp.create({
			data: {
				title: "Investment options presentation",
				description: "Present our portfolio management solutions",
				dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
				priority: "High",
				status: "Pending",
				conversation: {
					connect: { id: conversation4.id },
				},
				creator: {
					connect: { id: user1.id },
				},
			},
		});

		// Completed follow-up
		await prisma.followUp.create({
			data: {
				title: "Initial consultation",
				description: "Introductory meeting to understand needs",
				dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
				priority: "Medium",
				status: "Completed",
				conversation: {
					connect: { id: conversation4.id },
				},
				creator: {
					connect: { id: user1.id },
				},
			},
		});

		// Overdue follow-up
		await prisma.followUp.create({
			data: {
				title: "Quarterly review",
				description: "Review performance and discuss next steps",
				dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
				priority: "Medium",
				status: "Overdue",
				conversation: {
					connect: { id: conversation1.id },
				},
				creator: {
					connect: { id: user1.id },
				},
			},
		});

		// Message Templates with various categories
		await prisma.messageTemplate.create({
			data: {
				name: "Follow-up",
				content:
					"Hi {{name}}, just following up on our previous conversation about {{topic}}. Do you have any questions?",
				category: "Sales",
				variables: ["name", "topic"],
				creator: {
					connect: { id: user1.id },
				},
			},
		});

		await prisma.messageTemplate.create({
			data: {
				name: "Meeting Request",
				content:
					"Hello {{name}}, I would like to schedule a meeting to discuss {{topic}}. Are you available {{day}} at {{time}}?",
				category: "Business",
				variables: ["name", "topic", "day", "time"],
				creator: {
					connect: { id: user1.id },
				},
			},
		});

		await prisma.messageTemplate.create({
			data: {
				name: "Proposal Introduction",
				content:
					"Dear {{name}}, I'm pleased to present our proposal for {{project}}. The total investment would be {{amount}}, with implementation scheduled for {{timeline}}.",
				category: "Sales",
				variables: ["name", "project", "amount", "timeline"],
				creator: {
					connect: { id: user1.id },
				},
			},
		});

		await prisma.messageTemplate.create({
			data: {
				name: "Thank You",
				content:
					"Thank you, {{name}}, for taking the time to meet with us about {{topic}}. We're excited about the possibility of working together.",
				category: "Customer Service",
				variables: ["name", "topic"],
				creator: {
					connect: { id: user1.id },
				},
			},
		});

		await prisma.messageTemplate.create({
			data: {
				name: "Product Update",
				content:
					"Hello {{name}}, I wanted to let you know that we've released a new version of {{product}} with {{feature}} that I think would benefit your team.",
				category: "Product",
				variables: ["name", "product", "feature"],
				creator: {
					connect: { id: user1.id },
				},
			},
		});

		// Contact Notes with timestamps to show history
		await prisma.contactNote.create({
			data: {
				content:
					"Jane mentioned she's interested in our premium plan. Her company is planning to expand their marketing team.",
				conversation: {
					connect: { id: conversation1.id },
				},
				creator: {
					connect: { id: user1.id },
				},
			},
		});

		await prisma.contactNote.create({
			data: {
				content: "Discussed budget constraints - they have $50K allocated for Q3.",
				conversation: {
					connect: { id: conversation1.id },
				},
				creator: {
					connect: { id: user1.id },
				},
			},
		});

		await prisma.contactNote.create({
			data: {
				content: "Jane mentioned they're also evaluating Competitor X. Need to emphasize our unique features.",
				conversation: {
					connect: { id: conversation1.id },
				},
				creator: {
					connect: { id: user1.id },
				},
			},
		});

		await prisma.contactNote.create({
			data: {
				content:
					"Bob needs more information about integration options. Specifically interested in API documentation.",
				conversation: {
					connect: { id: conversation2.id },
				},
				creator: {
					connect: { id: user1.id },
				},
			},
		});

		await prisma.contactNote.create({
			data: {
				content: "Bob mentioned they're using Postgres for their backend. Our system will integrate smoothly.",
				conversation: {
					connect: { id: conversation2.id },
				},
				creator: {
					connect: { id: user1.id },
				},
			},
		});

		await prisma.contactNote.create({
			data: {
				content: "Initial call with Sarah went well. She has experience with our technology stack.",
				conversation: {
					connect: { id: conversation3.id },
				},
				creator: {
					connect: { id: user1.id },
				},
			},
		});

		await prisma.contactNote.create({
			data: {
				content:
					"Michael manages portfolios for high-net-worth individuals. Good opportunity for premium services.",
				conversation: {
					connect: { id: conversation4.id },
				},
				creator: {
					connect: { id: user1.id },
				},
			},
		});

		console.log("Database seeded successfully with comprehensive test data");
	} catch (error) {
		console.error("Error seeding database:", error);
	} finally {
		await prisma.$disconnect();
	}
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
