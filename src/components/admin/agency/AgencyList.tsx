"use client";
import { RootState } from '@/store/store';
import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@/store/store';
import { IUser } from '@/models/user';
import { DataTableExt } from '@/components/admin/DataTableExt';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useToast } from '@/hooks/use-toast';
import { deleteAgency } from '@/hooks/slices/user/agencySlice';

const AgencyList = () => {

const {user} = useSelector((state:RootState)=>state.user)
  const { agencies, isAgencyLoading } = useSelector((state: RootState) => state.agency);
   const router= useRouter()
  const dispatch = useDispatch<AppDispatch>();
     const { toast } = useToast();
  const columns = [
    { key: '_id', label: 'ID', hidden: true },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Status' },
        { key: 'passwordHash', label: 'password Hash' , hidden:true},
    { key: 'createdAt', label: 'Created', render: (value: any) => value ? new Date(value).toLocaleString() : '-' },
  ];

  // Memoize data for table
  const data = useMemo(() => agencies || [], [agencies]);


  const handleAdd=()=>{
     if(user?.role==="superadmin"){
          router.push("/admin/agencies/createnew")
     }else{
       // toast("Your are unable to add agency")
     }
   
  }

   const handleDelete = async (row: IUser) => {
      let id = row?._id;
      if (!id) {
        toast({ title: 'Delete failed', description: 'Missing id' });
        return;
      }
      // Convert ObjectId to string if needed
      if (typeof id !== 'string') {
        id = id.toString();
      }
      const ok = confirm(`Delete attribute "${row?.name ?? id}"?`);
      if (!ok) return;
      try {
        const response = await dispatch(deleteAgency(id));
        toast({ title: 'Deleted', description: `Attribute ${row?.name ?? id} removed` });
      } catch (err: any) {
        console.error('Failed to delete attribute', err);
        toast({ title: 'Delete failed', description: String(err?.message || err) });
      }
    };
  
    const handleBusiness=()=>{
      
    }
  return (
    <div>
      <DataTableExt
        title="Agencies"
        data={data}
         onCreate={handleAdd}
        initialColumns={columns}
          opentab={() => handleBusiness}
           onDelete={(row) => handleDelete(row)}
        // loading={isAgencyLoading}
        // Add onView, onDelete, onCreate handlers as needed
      />
    </div>
  );
};

export default AgencyList;
