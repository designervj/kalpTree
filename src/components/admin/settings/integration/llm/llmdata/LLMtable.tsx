"use client";

import React, { useState, useEffect, useMemo } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import {  setCurrentLLMSetting } from '@/hooks/slices/setting/llmSetting/LLMSettingSlice';
import { deleteLLMSetting } from '@/hooks/slices/setting/llmSetting/LLMSettingThunk';

const LLMtable = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<LLMModel | undefined>(undefined);
  //const [llmModels, setLlmModels] = useState<LLMModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  const {listLLMSettings, hasFetched} = useSelector((state: RootState) => state.llmSetting);
  const router= useRouter();
   const dispatch = useDispatch<AppDispatch>();
  const llmModels= useMemo(()=>{
    return listLLMSettings;
  },[listLLMSettings])


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



  const handleAddNew = () => {
       router.push('/admin/settings/integrations/llm/create');
  };

  const handleEdit = (model: LLMModel) => {
    dispatch(setCurrentLLMSetting(model))
    router.push(`/admin/settings/integrations/llm/${model._id}`);
    // setEditingModel(model);
    // setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this LLM model?')) {
      return;
    }
    await dispatch(deleteLLMSetting(id)).unwrap();
 
  
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
          {!hasFetched ? (
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

    </>
  );
};

export default LLMtable;