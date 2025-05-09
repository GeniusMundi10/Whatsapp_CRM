"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { FiEdit2, FiPlus, FiTrash } from "react-icons/fi";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

interface Note {
  id: string;
  content: string;
  createdAt: string;
  creator: {
    id: string;
    name: string;
    image: string;
  };
}

interface ContactNotesProps {
  conversationId: string;
}

const ContactNotes: React.FC<ContactNotesProps> = ({ conversationId }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    if (!conversationId) return;
    
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/crm/contactNotes?conversationId=${conversationId}`);
        setNotes(response.data);
      } catch (error) {
        console.error("Error fetching notes:", error);
        toast.error("Failed to load notes");
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotes();
  }, [conversationId]);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/crm/contactNotes", {
        content: newNote,
        conversationId,
      });
      
      setNotes(prev => [response.data, ...prev]);
      setNewNote("");
      toast.success("Note added");
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error("Failed to add note");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (note: Note) => {
    setEditingNote(note.id);
    setEditContent(note.content);
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setEditContent("");
  };

  const handleUpdateNote = async (noteId: string) => {
    if (!editContent.trim()) return;
    
    setIsSubmitting(true);
    try {
      const response = await axios.patch(`/api/crm/contactNotes/${noteId}`, {
        content: editContent,
      });
      
      setNotes(prev => prev.map(note => 
        note.id === noteId ? { ...note, content: editContent } : note
      ));
      setEditingNote(null);
      toast.success("Note updated");
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Failed to update note");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return;
    
    try {
      await axios.delete(`/api/crm/contactNotes/${noteId}`);
      setNotes(prev => prev.filter(note => note.id !== noteId));
      toast.success("Note deleted");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h3 className="font-medium">Contact Notes</h3>
      </div>

      <div className="space-y-2">
        <Textarea
          placeholder="Add a new note..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="min-h-[100px] resize-none"
        />
        <Button 
          onClick={handleAddNote} 
          disabled={!newNote.trim() || isSubmitting}
          size="sm"
        >
          <FiPlus className="mr-2 h-4 w-4" />
          Add Note
        </Button>
      </div>

      <div className="pt-4">
        <h4 className="text-sm font-medium mb-2">Notes History</h4>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : notes.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No notes added yet</p>
        ) : (
          <ScrollArea className="h-[calc(100vh-420px)]">
            <div className="space-y-4">
              {notes.map((note) => (
                <div key={note.id} className="rounded-md border border-gray-200 p-3 dark:border-gray-800">
                  {editingNote === note.id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="min-h-[80px] resize-none"
                      />
                      <div className="flex justify-end space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={handleCancelEdit}
                          disabled={isSubmitting}
                        >
                          Cancel
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleUpdateNote(note.id)}
                          disabled={!editContent.trim() || isSubmitting}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center mr-2 dark:bg-gray-700">
                            {note.creator?.image ? (
                              <img 
                                src={note.creator.image} 
                                alt={note.creator.name || "User"} 
                                className="h-6 w-6 rounded-full"
                              />
                            ) : (
                              <span className="text-xs">{(note.creator?.name || "U").charAt(0)}</span>
                            )}
                          </div>
                          <span className="text-sm font-medium">{note.creator?.name || "User"}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleStartEdit(note)}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                          >
                            <FiEdit2 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteNote(note.id)}
                            className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                          >
                            <FiTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="whitespace-pre-wrap text-sm">{note.content}</p>
                      <p className="mt-2 text-xs text-gray-500">
                        {format(new Date(note.createdAt), "PPp")}
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default ContactNotes; 