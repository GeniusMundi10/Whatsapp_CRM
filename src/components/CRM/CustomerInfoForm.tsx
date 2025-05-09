"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { CustomerInfo } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { toast } from "react-toastify";

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface CustomerInfoFormProps {
  conversationId: string;
  initialData?: CustomerInfo & {
    tags: Tag[];
  };
  onSave: () => void;
  onCancel: () => void;
}

const CustomerInfoForm: React.FC<CustomerInfoFormProps> = ({
  conversationId,
  initialData,
  onSave,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    initialData?.tags?.map(tag => tag.id) || []
  );

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      company: initialData?.company || "",
      position: initialData?.position || "",
      notes: initialData?.notes || "",
      address: initialData?.address || "",
      website: initialData?.website || "",
      priority: initialData?.priority || "Medium",
      status: initialData?.status || "Lead",
      source: initialData?.source || "",
    },
  });

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get("/api/crm/contactTags");
        setTags(response.data);
      } catch (error) {
        console.error("Error fetching tags:", error);
        toast.error("Failed to load tags");
      }
    };

    fetchTags();
  }, []);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await axios.post("/api/crm/customerInfo", {
        ...data,
        conversationId,
        tagIds: selectedTagIds,
      });
      
      toast.success("Customer information saved");
      onSave();
    } catch (error) {
      console.error("Error saving customer info:", error);
      toast.error("Failed to save customer information");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTagChange = (value: string[]) => {
    setSelectedTagIds(value);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="company">Company</Label>
        <Input id="company" {...register("company")} />
      </div>

      <div>
        <Label htmlFor="position">Position/Title</Label>
        <Input id="position" {...register("position")} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <Select 
                value={field.value} 
                onValueChange={field.onChange}
              >
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

        <div>
          <Label htmlFor="status">Status</Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select 
                value={field.value} 
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lead">Lead</SelectItem>
                  <SelectItem value="Prospect">Prospect</SelectItem>
                  <SelectItem value="Customer">Customer</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="source">Source</Label>
        <Input id="source" {...register("source")} placeholder="Where did this contact come from?" />
      </div>

      <div>
        <Label htmlFor="website">Website</Label>
        <Input id="website" {...register("website")} placeholder="https://example.com" />
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Input id="address" {...register("address")} />
      </div>

      <div>
        <Label htmlFor="tags">Tags</Label>
        <MultiSelect
          options={tags.map(tag => ({
            label: tag.name,
            value: tag.id,
            color: tag.color,
          }))}
          selected={selectedTagIds}
          onChange={handleTagChange}
          placeholder="Select tags"
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" {...register("notes")} rows={4} />
      </div>

      <div className="flex items-center justify-end space-x-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
};

export default CustomerInfoForm; 