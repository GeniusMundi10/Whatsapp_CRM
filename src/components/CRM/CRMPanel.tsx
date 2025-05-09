"use client";

import { format } from "date-fns";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BsCalendarEvent, BsTag } from "react-icons/bs";
import { FiEdit, FiInfo, FiStar } from "react-icons/fi";
import { HiOutlineDocumentText } from "react-icons/hi";

import { CustomerInfo } from "@prisma/client";
import axios from "axios";
import { User } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomerInfoForm from "./CustomerInfoForm";
import TagDisplay from "./TagDisplay";
import ContactNotes from "./ContactNotes";
import FollowUpList from "./FollowUpList";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ContactWithInfo {
  id: string;
  customerInfo: CustomerInfo & {
    tags: { id: string; name: string; color: string }[];
  } | null;
  users: User[];
}

interface CRMPanelProps {
  conversationId: string;
  isOpen: boolean;
  onClose: () => void;
}

const CRMPanel: React.FC<CRMPanelProps> = ({ conversationId, isOpen, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [contactData, setContactData] = useState<ContactWithInfo | null>(null);
  const [activeTab, setActiveTab] = useState("info");
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!conversationId) return;
    
    setLoading(true);
    
    const fetchContactData = async () => {
      try {
        const response = await axios.get(`/api/crm/customerInfo/${conversationId}`);
        setContactData(response.data);
      } catch (error) {
        console.error("Error fetching customer info:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchContactData();
  }, [conversationId]);

  if (!isOpen) return null;

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInfoSaved = async () => {
    setIsEditing(false);
    // Refresh data
    try {
      const response = await axios.get(`/api/crm/customerInfo/${conversationId}`);
      setContactData(response.data);
    } catch (error) {
      console.error("Error refreshing customer info:", error);
    }
  };

  // Extract the contact name from the users array (excluding the current user)
  const getContactName = () => {
    if (!contactData || !contactData.users || contactData.users.length === 0) {
      return "Contact";
    }
    
    // Return the name of the first user in the conversation
    return contactData.users[0]?.name || "Contact";
  };

  return (
    <div className="fixed right-0 top-16 h-[calc(100vh-80px)] w-80 border-l border-l-gray-200 bg-white dark:border-l-gray-800 dark:bg-gray-900 z-10">
      <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
        <h2 className="text-lg font-semibold">Contact Details</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="p-4">
        <div className="mb-4 text-center">
          <div className="mb-2 h-16 w-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center dark:bg-blue-900">
            <span className="text-2xl font-semibold text-blue-600 dark:text-blue-300">
              {getContactName().charAt(0)}
            </span>
          </div>
          <h3 className="font-medium text-lg">{getContactName()}</h3>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info">
              <FiInfo className="mr-1" />
              <span className="hidden sm:inline">Info</span>
            </TabsTrigger>
            <TabsTrigger value="notes">
              <HiOutlineDocumentText className="mr-1" />
              <span className="hidden sm:inline">Notes</span>
            </TabsTrigger>
            <TabsTrigger value="followups">
              <BsCalendarEvent className="mr-1" />
              <span className="hidden sm:inline">Follow-ups</span>
            </TabsTrigger>
            <TabsTrigger value="stats">
              <FiStar className="mr-1" />
              <span className="hidden sm:inline">Stats</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-4">
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : isEditing ? (
              <CustomerInfoForm 
                conversationId={conversationId} 
                initialData={contactData?.customerInfo || undefined} 
                onSave={handleInfoSaved}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <div>
                <div className="flex justify-between mb-4">
                  <h3 className="font-medium">Customer Information</h3>
                  <Button 
                    onClick={handleEditToggle} 
                    size="sm" 
                    variant="outline"
                  >
                    <FiEdit className="mr-1 h-4 w-4" />
                    Edit
                  </Button>
                </div>

                {!contactData?.customerInfo ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500 mb-2">No customer information added yet</p>
                    <Button onClick={handleEditToggle} size="sm">
                      Add Information
                    </Button>
                  </div>
                ) : (
                  <ScrollArea className="h-[calc(100vh-300px)]">
                    <div className="space-y-4">
                      {contactData.customerInfo.company && (
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Company</p>
                          <p>{contactData.customerInfo.company}</p>
                        </div>
                      )}
                      
                      {contactData.customerInfo.position && (
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Position</p>
                          <p>{contactData.customerInfo.position}</p>
                        </div>
                      )}
                      
                      {contactData.customerInfo.priority && (
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Priority</p>
                          <p>{contactData.customerInfo.priority}</p>
                        </div>
                      )}
                      
                      {contactData.customerInfo.status && (
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                          <p>{contactData.customerInfo.status}</p>
                        </div>
                      )}
                      
                      {contactData.customerInfo.source && (
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Source</p>
                          <p>{contactData.customerInfo.source}</p>
                        </div>
                      )}
                      
                      {contactData.customerInfo.website && (
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Website</p>
                          <p>
                            <a 
                              href={contactData.customerInfo.website.startsWith('http') 
                                ? contactData.customerInfo.website 
                                : `https://${contactData.customerInfo.website}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline dark:text-blue-400"
                            >
                              {contactData.customerInfo.website}
                            </a>
                          </p>
                        </div>
                      )}
                      
                      {contactData.customerInfo.address && (
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</p>
                          <p>{contactData.customerInfo.address}</p>
                        </div>
                      )}
                      
                      {contactData.customerInfo.notes && (
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Notes</p>
                          <p className="whitespace-pre-wrap">{contactData.customerInfo.notes}</p>
                        </div>
                      )}
                      
                      {contactData.customerInfo.tags && contactData.customerInfo.tags.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tags</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {contactData.customerInfo.tags.map(tag => (
                              <TagDisplay key={tag.id} tag={tag} />
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Added on</p>
                        <p>{format(new Date(contactData.customerInfo.createdAt), 'PPP')}</p>
                      </div>
                    </div>
                  </ScrollArea>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="notes" className="mt-4">
            <ContactNotes conversationId={conversationId} />
          </TabsContent>

          <TabsContent value="followups" className="mt-4">
            <FollowUpList conversationId={conversationId} />
          </TabsContent>

          <TabsContent value="stats" className="mt-4">
            <div className="space-y-4">
              <h3 className="font-medium">Interaction Statistics</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Messages</p>
                  <p className="text-2xl font-bold">38</p>
                </div>
                
                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Response</p>
                  <p className="text-2xl font-bold">2h 14m</p>
                </div>
                
                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">First Contact</p>
                  <p className="text-2xl font-bold">23d ago</p>
                </div>
                
                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Activity</p>
                  <p className="text-2xl font-bold">2d ago</p>
                </div>
              </div>
              
              <div className="pt-4">
                <h4 className="text-sm font-medium mb-2">Activity Timeline</h4>
                <div className="space-y-3">
                  <div className="flex">
                    <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                      <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                    </div>
                    <div>
                      <p className="text-sm">Message sent</p>
                      <p className="text-xs text-gray-500">2 days ago</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                      <span className="h-2 w-2 rounded-full bg-green-600"></span>
                    </div>
                    <div>
                      <p className="text-sm">Follow-up completed</p>
                      <p className="text-xs text-gray-500">5 days ago</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                      <span className="h-2 w-2 rounded-full bg-purple-600"></span>
                    </div>
                    <div>
                      <p className="text-sm">Status changed to "Customer"</p>
                      <p className="text-xs text-gray-500">1 week ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CRMPanel; 