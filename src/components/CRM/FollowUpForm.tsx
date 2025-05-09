"use client";

import React, { useState } from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-toastify";
import { format } from "date-fns";

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

interface FollowUpFormProps {
  conversationId: string;
  followUp: FollowUp | null;
  onSave: (followUp: FollowUp) => void;
  onCancel: () => void;
}

const FollowUpForm: React.FC<FollowUpFormProps> = ({
  conversationId,
  followUp,
  onSave,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecurring, setIsRecurring] = useState(followUp?.isRecurring || false);

  // Format date for input field (YYYY-MM-DD)
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return format(date, "yyyy-MM-dd");
  };

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      title: followUp?.title || "",
      description: followUp?.description || "",
      dueDate: followUp ? formatDateForInput(followUp.dueDate) : formatDateForInput(new Date().toString()),
      priority: followUp?.priority || "Medium",
      status: followUp?.status || "Pending",
      isRecurring: followUp?.isRecurring || false,
      recurrencePattern: followUp?.recurrencePattern || "Weekly",
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      let response;
      
      if (followUp) {
        // Update existing follow-up
        response = await axios.patch(`/api/crm/followUps/${followUp.id}`, {
          ...data,
          dueDate: new Date(data.dueDate),
        });
        toast.success("Follow-up updated");
      } else {
        // Create new follow-up
        response = await axios.post("/api/crm/followUps", {
          ...data,
          dueDate: new Date(data.dueDate),
          conversationId,
        });
        toast.success("Follow-up created");
      }
      
      onSave(response.data);
    } catch (error) {
      console.error("Error saving follow-up:", error);
      toast.error("Failed to save follow-up");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 border border-gray-200 rounded-md p-4 mb-4 dark:border-gray-800">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input 
          id="title" 
          {...register("title", { required: true })} 
          placeholder="Follow-up title"
          className={errors.title ? "border-red-500" : ""}
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">Title is required</p>}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          {...register("description")} 
          placeholder="Optional details about this follow-up"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dueDate">Due Date</Label>
          <Input 
            id="dueDate" 
            type="date" 
            {...register("dueDate", { required: true })} 
            className={errors.dueDate ? "border-red-500" : ""}
          />
          {errors.dueDate && <p className="text-red-500 text-xs mt-1">Due date is required</p>}
        </div>

        <div>
          <Label htmlFor="priority">Priority</Label>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="status">Status</Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        
        <div className="flex items-center space-x-2 pt-8">
          <Controller
            name="isRecurring"
            control={control}
            render={({ field }) => (
              <Checkbox 
                id="isRecurring" 
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  setIsRecurring(!!checked);
                }}
              />
            )}
          />
          <Label htmlFor="isRecurring" className="cursor-pointer">Recurring Follow-up</Label>
        </div>
      </div>

      {isRecurring && (
        <div>
          <Label htmlFor="recurrencePattern">Recurrence Pattern</Label>
          <Controller
            name="recurrencePattern"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select pattern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : followUp ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
};

export default FollowUpForm; 