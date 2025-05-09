/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Avatar from "react-avatar";
import { BiTrash } from "react-icons/bi";
import { BsArrowLeft, BsFillCameraVideoFill, BsThreeDotsVertical } from "react-icons/bs";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { MdCall, MdContactPage } from "react-icons/md";
import { RiUserSettingsFill } from "react-icons/ri";
import { PulseLoader } from "react-spinners";
import { useRecoilState } from "recoil";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useActiveList from "@/hooks/useActiveList";
import { FullConversationType } from "@/lib/types";
import { formatMessageDate } from "@/lib/utils";

import { callState } from "../atoms/CallState";
import { conversationState } from "../atoms/conversationState";
import { messageSearch } from "../atoms/messageSearch";
import AvatarGroup from "../AvatarGroup";
import CRMPanel from "../CRM/CRMPanel";

export default function ChatHeader({
	conversation,
	email,
}: {
	conversation?: FullConversationType | null;
	email: string;
}): React.JSX.Element {
	const { members } = useActiveList();
	const otherUser = React.useMemo(() => {
		if (!conversation) {
			return null;
		}
		return conversation.users.filter((user) => user.email !== email)[0];
	}, [conversation, email]);
	const setCallState = useRecoilState(callState)[1];
	const [MessageSearch, setMessageSearch] = useRecoilState(messageSearch);
	const setConversationState = useRecoilState(conversationState)[1];
	const [modalOpen, setModalOpen] = React.useState(false);
	const [loading, setLoading] = React.useState(false);
	const [crmPanelOpen, setCrmPanelOpen] = React.useState(false);

	const handleDelete = (): void => {
		if (!conversation) return;
		if (loading) return;
		setLoading(true);
		void axios
			.delete(`api/conversations/${conversation.id}`)
			.then(() => {
				setConversationState("");
				setModalOpen(false);
				setLoading(false);
			})
			.finally(() => {
				setModalOpen(false);
				setLoading(false);
			});
	};

	const toggleCRMPanel = () => {
		setCrmPanelOpen(prev => !prev);
	};

	return (
		<>
			<div
				className={`z-20 flex h-16 w-full items-center justify-between ${
					// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
					!MessageSearch && "lg:rounded-tr-lg"
				} bg-[#f0f2f5] px-4 py-4 dark:bg-[#222e35]`}>
				<div className="flex items-center space-x-4">
					<BsArrowLeft
						onClick={(): void => {
							setMessageSearch(false);
							setConversationState("");
							setModalOpen(false);
							setLoading(false);
							setCrmPanelOpen(false);
						}}
						className="h-5 w-5 cursor-pointer"
					/>
					{conversation?.isGroup ? (
						<AvatarGroup conversation={conversation} users={conversation.users} />
					) : otherUser?.image ? (
						<Image
							src={otherUser.image || "/user.png"}
							alt="Profile"
							width={40}
							height={40}
							className="h-10 w-10 cursor-pointer rounded-full object-contain"
						/>
					) : (
						<Avatar
							name={otherUser?.name ?? ""}
							size="40"
							className="h-7 w-7 cursor-pointer rounded-full object-contain p-0"
						/>
					)}
					<div className="flex flex-col">
						<span className="text-sm font-semibold text-[#1d2129] dark:text-[#e4e6eb]">
							{conversation?.name || otherUser?.name}
						</span>
						<span className="line-clamp-1 text-xs font-normal text-[#54656f] dark:text-[#aebac1]">
							{conversation?.isGroup
								? conversation.users.map((user) => user.name).join(", ")
								: members.includes(otherUser?.email ?? "")
								? "Online"
								: // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
								otherUser?.lastSeen
								? `Last seen ${formatMessageDate(otherUser.lastSeen)}`
								: "Offline"}
						</span>
					</div>
				</div>
				<div className="flex items-center space-x-6 text-[#54656f] dark:text-[#aebac1]">
					{!conversation?.isGroup && (
						<>
							<MdCall
								onClick={(): void =>
									setCallState({
										voiceCall: { user: otherUser, outgoing: true, roomID: Date.now(), type: "voice" },
									})
								}
								className="h-5 w-5 cursor-pointer"
							/>
							<BsFillCameraVideoFill
								onClick={(): void =>
									setCallState({
										videoCall: { user: otherUser, outgoing: true, roomID: Date.now(), type: "video" },
									})
								}
								className="h-5 w-5 cursor-pointer"
							/>
						</>
					)}
					<FaMagnifyingGlass
						onClick={(): void => setMessageSearch((prev) => !prev)}
						className="h-5 w-5 cursor-pointer"
					/>
					<div className="relative group">
						<button 
						onClick={toggleCRMPanel}
							className={`flex items-center justify-center px-2 py-1 rounded-md ${crmPanelOpen ? 'bg-blue-600 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
						title="Customer Relationship Management"
						>
							<MdContactPage className={`h-5 w-5 cursor-pointer mr-1`} />
							<span className="text-xs font-medium">CRM</span>
						</button>
						<div className="absolute hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2 right-0 bottom-full mb-2 w-auto whitespace-nowrap">
							Customer Relationship Management
							<svg className="absolute text-black h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"></polygon></svg>
						</div>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger className="border-0 outline-none focus:outline-none">
							<BsThreeDotsVertical className="h-5 w-5 cursor-pointer" />
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="end"
							className="mt-2 w-56 border-[#e9edef] bg-[#f0f2f5] dark:border-[#313d45] dark:bg-[#222e35]">
							<DropdownMenuLabel className="text-center">Chat</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem className="cursor-normal focus:bg-normal flex w-full flex-col items-center justify-center">
								{conversation?.isGroup ? (
									<AvatarGroup conversation={conversation} users={conversation.users} />
								) : otherUser?.image ? (
									<Image
										src={otherUser.image || "/user.png"}
										alt="Profile"
										width={40}
										height={40}
										className="h-10 w-10 cursor-pointer rounded-full object-contain"
									/>
								) : (
									<Avatar
										name={otherUser?.name ?? ""}
										size="40"
										className="h-7 w-7 cursor-pointer rounded-full object-contain p-0"
									/>
								)}
								<span className="mt-2 text-sm font-semibold text-[#1d2129] dark:text-[#e4e6eb]">
									<Link href={`mailto:${otherUser?.email ?? ""}`}>
										{conversation?.name || otherUser?.name}
									</Link>
									{!conversation?.isGroup && (
										<span className="text-xs font-normal text-[#54656f] dark:text-[#aebac1]">
											{otherUser?.email ?? ""}
										</span>
									)}
								</span>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={toggleCRMPanel}
								className="cursor-pointer flex items-center px-3 py-2 dark:focus:bg-[#313d45]">
								<MdContactPage className="mr-2 h-4 w-4" />
								<span>Open CRM Panel</span>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={(): void => setModalOpen(true)}
								className="cursor-pointer flex items-center px-3 py-2 text-red-500 focus:bg-red-50 focus:text-red-500 dark:focus:bg-red-900 dark:focus:text-red-500">
								<BiTrash className="mr-2 h-4 w-4" />
								<span>Delete Chat</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
			<AlertDialog open={modalOpen} onOpenChange={setModalOpen}>
				<AlertDialogContent className="border-[#e9edef] bg-[#f0f2f5] dark:border-[#313d45] dark:bg-[#222e35]">
					<AlertDialogHeader>
						<AlertDialogTitle className="text-[#1d2129] dark:text-[#e4e6eb]">Delete Chat</AlertDialogTitle>
						<AlertDialogDescription className="text-[#54656f] dark:text-[#aebac1]">
							This action cannot be undone. This will permanently delete the conversation.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel
							onClick={(): void => setModalOpen(false)}
							className="border-[#e9edef] bg-[#f0f2f5] text-[#1d2129] hover:border-[#e9edef] hover:bg-[#f0f2f5] hover:text-[#1d2129] dark:border-[#313d45] dark:bg-[#222e35] dark:text-[#e4e6eb] dark:hover:bg-[#313d45]">
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							className="bg-red-500 text-white hover:bg-red-500 dark:text-white dark:hover:bg-red-600"
							onClick={handleDelete}>
							{loading ? <PulseLoader size={5} color="#fff" /> : "Delete"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			{conversation && crmPanelOpen && (
				<CRMPanel conversationId={conversation.id} isOpen={crmPanelOpen} onClose={() => setCrmPanelOpen(false)} />
			)}
		</>
	);
}
