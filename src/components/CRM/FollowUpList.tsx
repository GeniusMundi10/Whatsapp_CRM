"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { format, isPast, isToday } from "date-fns";
import { FiAlertCircle, FiCalendar, FiCheck, FiPlus } from "react-icons/fi";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import FollowUpForm from "./FollowUpForm";

interface FollowUp {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  status: string;
  isRecurring: boolean;
  recurrencePattern: string;
  createdAt: string;
}

interface FollowUpListProps {
  conversationId: string;
}

const FollowUpList: React.FC<FollowUpListProps> = ({ conversationId }) => {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedFollowUp, setSelectedFollowUp] = useState<FollowUp | null>(null);

  useEffect(() => {
    if (!conversationId) return;
    
    const fetchFollowUps = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/crm/followUps?conversationId=${conversationId}`);
        setFollowUps(response.data);
      } catch (error) {
        console.error("Error fetching follow-ups:", error);
        toast.error("Failed to load follow-ups");
      } finally {
        setLoading(false);
      }
    };
    
    fetchFollowUps();
  }, [conversationId]);

  const handleAddFollowUp = () => {
    setSelectedFollowUp(null);
    setShowForm(true);
  };

  const handleEditFollowUp = (followUp: FollowUp) => {
    setSelectedFollowUp(followUp);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedFollowUp(null);
  };

  const handleFormSave = (newFollowUp: FollowUp) => {
    if (selectedFollowUp) {
      // Update existing follow-up
      setFollowUps(prev => 
        prev.map(item => item.id === newFollowUp.id ? newFollowUp : item)
      );
    } else {
      // Add new follow-up
      setFollowUps(prev => [...prev, newFollowUp]);
    }
    setShowForm(false);
    setSelectedFollowUp(null);
  };

  const handleMarkComplete = async (followUpId: string) => {
    try {
      await axios.patch(`/api/crm/followUps/${followUpId}`, {
        status: "Completed"
      });
      
      setFollowUps(prev => 
        prev.map(item => 
          item.id === followUpId ? { ...item, status: "Completed" } : item
        )
      );
      
      toast.success("Follow-up marked as completed");
    } catch (error) {
      console.error("Error updating follow-up:", error);
      toast.error("Failed to update follow-up");
    }
  };

  const handleDeleteFollowUp = async (followUpId: string) => {
    if (!confirm("Are you sure you want to delete this follow-up?")) return;
    
    try {
      await axios.delete(`/api/crm/followUps/${followUpId}`);
      setFollowUps(prev => prev.filter(item => item.id !== followUpId));
      toast.success("Follow-up deleted");
    } catch (error) {
      console.error("Error deleting follow-up:", error);
      toast.error("Failed to delete follow-up");
    }
  };

  const getStatusBadgeClasses = (status: string, dueDate: string) => {
    const isPastDue = isPast(new Date(dueDate)) && !isToday(new Date(dueDate));
    
    if (status === "Completed") {
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    } else if (isPastDue && status === "Pending") {
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    } else if (isToday(new Date(dueDate)) && status === "Pending") {
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    } else {
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-600 dark:text-red-400";
      case "Medium":
        return "text-yellow-600 dark:text-yellow-400";
      case "Low":
        return "text-green-600 dark:text-green-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h3 className="font-medium">Follow-ups</h3>
        <Button 
          size="sm" 
          onClick={handleAddFollowUp}
        >
          <FiPlus className="mr-2 h-4 w-4" />
          New Follow-up
        </Button>
      </div>

      {showForm && (
        <FollowUpForm
          conversationId={conversationId}
          followUp={selectedFollowUp}
          onSave={handleFormSave}
          onCancel={handleFormClose}
        />
      )}

      <div>
        <h4 className="text-sm font-medium mb-2">Upcoming Tasks</h4>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : followUps.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No follow-ups scheduled</p>
        ) : (
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="space-y-3">
              {followUps
                .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                .map((followUp) => (
                  <div 
                    key={followUp.id} 
                    className="rounded-md border border-gray-200 p-3 dark:border-gray-800"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="font-medium">{followUp.title}</h5>
                        <div className="flex items-center mt-1 space-x-2">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusBadgeClasses(followUp.status, followUp.dueDate)}`}>
                            {followUp.status}
                          </span>
                          <span className={`inline-flex items-center text-xs font-medium ${getPriorityColor(followUp.priority)}`}>
                            {followUp.priority} Priority
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {followUp.status !== "Completed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMarkComplete(followUp.id)}
                            className="h-8 w-8 p-0"
                          >
                            <FiCheck className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditFollowUp(followUp)}
                          className="h-8 w-8 p-0"
                        >
                          <FiCalendar className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteFollowUp(followUp.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <FiAlertCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {followUp.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{followUp.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <FiCalendar className="mr-1 h-3 w-3" />
                        <span>
                          Due: {format(new Date(followUp.dueDate), "PPP")}
                        </span>
                      </div>
                      {followUp.isRecurring && (
                        <span className="italic">
                          Recurring: {followUp.recurrencePattern}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default FollowUpList; 