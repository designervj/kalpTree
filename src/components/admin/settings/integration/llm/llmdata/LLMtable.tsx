"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import LLmForm from '../form/LLmForm';
import { LLMModel } from '../type/LLMModel';

const LLMtable = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<LLMModel | undefined>(undefined);
  const [llmModels, setLlmModels] = useState<LLMModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Fetch LLM models on component mount
  useEffect(() => {
    fetchLLMModels();
  }, []);

  const fetchLLMModels = async () => {
    try {
      setIsFetching(true);
      const response = await fetch('/api/admin/llmSetting');
      
      if (!response.ok) {
        throw new Error('Failed to fetch LLM settings');
      }

      const result = await response.json();
      setLlmModels(result.data || []);
    } catch (error) {
      console.error('Error fetching LLM models:', error);
      toast({
        title: 'Error',
        description: 'Failed to load LLM models',
        variant: 'destructive',
      });
    } finally {
      setIsFetching(false);
    }
  };

  const handleAddNew = () => {
    setEditingModel(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (model: LLMModel) => {
    setEditingModel(model);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this LLM model?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/llmSetting?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete LLM setting');
      }

      toast({
        title: 'Success',
        description: 'LLM model deleted successfully',
      });

      // Remove from local state
      setLlmModels(llmModels.filter(model => model._id !== id));
    } catch (error) {
      console.error('Error deleting LLM model:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete LLM model',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (data: LLMModel) => {
    try {
      setIsLoading(true);

      if (editingModel?._id) {
        // Update existing model
        const response = await fetch('/api/admin/llmSetting', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            _id: editingModel._id,
            name: data.name,
            secreteKey: data.secreteKey,
            isActive: data.isActive,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update LLM setting');
        }

        const result = await response.json();
        
        // Update local state
        setLlmModels(llmModels.map(model => 
          model._id === editingModel._id ? { ...model, ...data } : model
        ));

        toast({
          title: 'Success',
          description: 'LLM model updated successfully',
        });
      } else {
        // Create new model
        const response = await fetch('/api/admin/llmSetting', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            
            name: data.name,
            model:data.model,
            websiteId:data.websiteId,
            secreteKey: data.secreteKey,
            isActive: data.isActive,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create LLM setting');
        }

        const result = await response.json();
        
        // Add to local state
        setLlmModels([...llmModels, result.data]);

        toast({
          title: 'Success',
          description: 'LLM model added successfully',
        });
      }

      setIsDialogOpen(false);
      setEditingModel(undefined);
    } catch (error) {
      console.error('Error saving LLM model:', error);
      toast({
        title: 'Error',
        description: editingModel?._id ? 'Failed to update LLM model' : 'Failed to create LLM model',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>LLM Models</CardTitle>
             
            </div>
            <Button onClick={handleAddNew} className="gap-2">
              <Plus className="h-4 w-4" />
              Add New Model
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isFetching ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading LLM models...
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Model Type</TableHead>
                  <TableHead>API Key</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {llmModels.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No LLM models configured. Click "Add New Model" to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  llmModels.map((model) => (
                    <TableRow key={String(model._id)}>
                      <TableCell className="font-medium">{model.name}</TableCell>
                      <TableCell className="font-mono text-sm">
                        <div className="flex items-center gap-2">
                          <span>
                            {visibleKeys.has(String(model._id))
                              ? model.secreteKey || 'Not set'
                              : '••••••••••••'}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => toggleKeyVisibility(String(model._id))}
                          >
                            {visibleKeys.has(String(model._id)) ? (
                              <EyeOff className="h-3 w-3" />
                            ) : (
                              <Eye className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={model.isActive !== false ? "default" : "secondary"}
                          className={model.isActive !== false ? "bg-green-600" : "bg-gray-500"}
                        >
                          {model.isActive !== false ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(model)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(model._id as string)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingModel ? 'Edit LLM Model' : 'Add New LLM Model'}
            </DialogTitle>
            <DialogDescription>
              Configure your language model integration settings
            </DialogDescription>
          </DialogHeader>
          <LLmForm
            initialData={editingModel}
            onSubmit={handleSubmit}
            onCancel={() => setIsDialogOpen(false)}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LLMtable;