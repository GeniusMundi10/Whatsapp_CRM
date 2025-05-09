"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { FiEdit2, FiPlus, FiTrash } from "react-icons/fi";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  category: string;
  variables: string[];
  usageCount: number;
}

const MessageTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/crm/messageTemplates");
      setTemplates(response.data);
    } catch (error) {
      console.error("Error fetching templates:", error);
      toast.error("Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async (data: any) => {
    try {
      // Extract variables from content - look for {{variable}} pattern
      const variableRegex = /\{\{([^}]+)\}\}/g;
      const matches = [...data.content.matchAll(variableRegex)];
      const variables = matches.map(match => match[1]);

      const response = await axios.post("/api/crm/messageTemplates", {
        ...data,
        variables
      });
      
      setTemplates(prev => [...prev, response.data]);
      reset();
      setIsDialogOpen(false);
      toast.success("Template created");
    } catch (error) {
      console.error("Error creating template:", error);
      toast.error("Failed to create template");
    }
  };

  const handleUpdateTemplate = async (data: any) => {
    if (!editingTemplate) return;

    try {
      // Extract variables from content - look for {{variable}} pattern
      const variableRegex = /\{\{([^}]+)\}\}/g;
      const matches = [...data.content.matchAll(variableRegex)];
      const variables = matches.map(match => match[1]);

      const response = await axios.patch(`/api/crm/messageTemplates/${editingTemplate.id}`, {
        ...data,
        variables
      });
      
      setTemplates(prev => 
        prev.map(template => 
          template.id === editingTemplate.id ? response.data : template
        )
      );
      
      reset();
      setEditingTemplate(null);
      setIsDialogOpen(false);
      toast.success("Template updated");
    } catch (error) {
      console.error("Error updating template:", error);
      toast.error("Failed to update template");
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return;
    
    try {
      await axios.delete(`/api/crm/messageTemplates/${templateId}`);
      setTemplates(prev => prev.filter(template => template.id !== templateId));
      toast.success("Template deleted");
    } catch (error) {
      console.error("Error deleting template:", error);
      toast.error("Failed to delete template");
    }
  };

  const openCreateDialog = () => {
    setEditingTemplate(null);
    reset({
      name: "",
      category: "",
      content: ""
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (template: MessageTemplate) => {
    setEditingTemplate(template);
    reset({
      name: template.name,
      category: template.category,
      content: template.content
    });
    setIsDialogOpen(true);
  };

  const insertTemplate = (templateId: string, conversationId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;
    
    // Implementation depends on how your messaging system works
    // This is a placeholder for the actual implementation
    console.log(`Inserting template ${templateId} into conversation ${conversationId}`);
    
    // You'd typically increment the usage count
    axios.put(`/api/crm/messageTemplates/${templateId}`)
      .then(() => {
        // Update local state to reflect the increased usage count
        setTemplates(prev => 
          prev.map(t => 
            t.id === templateId ? { ...t, usageCount: t.usageCount + 1 } : t
          )
        );
      })
      .catch(error => {
        console.error("Error updating template usage:", error);
      });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Message Templates</h2>
        <Button onClick={openCreateDialog}>
          <FiPlus className="mr-2 h-4 w-4" />
          New Template
        </Button>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? "Edit Template" : "Create Template"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(editingTemplate ? handleUpdateTemplate : handleCreateTemplate)} className="space-y-4">
            <div>
              <Label htmlFor="name">Template Name</Label>
              <Input 
                id="name" 
                {...register("name", { required: true })} 
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">Name is required</p>}
            </div>
            
            <div>
              <Label htmlFor="category">Category (optional)</Label>
              <Input id="category" {...register("category")} />
            </div>
            
            <div>
              <Label htmlFor="content">Content</Label>
              <p className="text-xs text-gray-500 mb-1">
                Use {{variable}} for variables like {{name}}, {{company}}, etc.
              </p>
              <Textarea 
                id="content" 
                {...register("content", { required: true })} 
                rows={6}
                className={errors.content ? "border-red-500" : ""}
              />
              {errors.content && <p className="text-red-500 text-xs mt-1">Content is required</p>}
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingTemplate ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {loading ? (
        <div className="text-center py-4">Loading templates...</div>
      ) : templates.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No templates yet</p>
          <Button onClick={openCreateDialog}>Create Your First Template</Button>
        </div>
      ) : (
        <ScrollArea className="h-[500px]">
          <div className="space-y-4">
            {templates.map((template) => (
              <div 
                key={template.id} 
                className="border border-gray-200 rounded-lg p-4 dark:border-gray-800"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{template.name}</h3>
                    {template.category && (
                      <p className="text-xs text-gray-500">
                        Category: {template.category}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => openEditDialog(template)}
                    >
                      <FiEdit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <FiTrash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded p-2 text-sm whitespace-pre-wrap dark:bg-gray-900">
                  {template.content}
                </div>
                
                {template.variables.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Variables:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.variables.map((variable, index) => (
                        <span 
                          key={index}
                          className="inline-block px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        >
                          {variable}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-3 flex justify-between items-center">
                  <p className="text-xs text-gray-500">
                    Used {template.usageCount} times
                  </p>
                  <Button size="sm">
                    Use Template
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default MessageTemplates; 