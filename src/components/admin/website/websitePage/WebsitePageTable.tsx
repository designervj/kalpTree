"use client"
import { AppDispatch, RootState } from '@/store/store'
import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DataTableExt } from '../../DataTableExt'

import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { deleteWebsitePage, updateCurrentPage } from '@/hooks/slices/website/websitePageSlice';
import { WebsitePageModel } from './WebsitePageType'

const WebsitePageTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const { currentWebsite } = useSelector((state: RootState) => state.websites);
  const { websitePages } = useSelector((state: RootState) => state.websitePage);
  const { toast } = useToast();
  const router = useRouter();

  const filteredPages = useMemo(() => {
    if (
      currentWebsite &&
      currentWebsite._id &&
      websitePages &&
      websitePages.length > 0
    ) {
      const list = websitePages.filter(
        (item) => item.tenantId === currentWebsite._id
      );
      return list.length > 0 ? list : websitePages;
    }
    return [];
  }, [currentWebsite, websitePages]);

  const handleDelete = async (row: any) => {
    const id = row?._id ?? row?.id;
    console.log("iiiiiii", id)
    if (!id) {
      toast({ title: 'Delete failed', description: 'Missing id' });
      return;
    }
    const ok = confirm(`Delete page "${row?.title ?? id}"?`);
    if (!ok) return;

    dispatch(deleteWebsitePage(id));
    // try {
    //   const res = await fetch(`/api/pages/websites/id=${id}`, {
    //     method: 'DELETE',
    //   });
    //   if (!res.ok) {
    //     const body = await res.json().catch(() => ({}));
    //     throw new Error(body?.error || `HTTP ${res.status}`);
    //   }
    //   dispatch(deleteWebsitePage(id));
    //   toast({
    //     title: 'Deleted',
    //     description: `Page ${row?.title ?? id} removed`,
    //   });
    // } catch (err: any) {
    //   console.error('Failed to delete page', err);
    //   toast({
    //     title: 'Delete failed',
    //     description: String(err?.message || err),
    //   });
    // }
  };

  const handleView = (row: WebsitePageModel) => {
    const id = row?._id ;
    if (!id) return;
    dispatch(updateCurrentPage(row))
    router.push(`/admin/pages/${id}`);
  };

  const initialColumns = [
    { key: '_id', label: 'ID', hidden: true },
    { key: 'id', label: 'ID', hidden: true },
    { key: 'slug', label: 'Slug' },
    { key: 'title', label: 'Title' },
    { key: 'status', label: 'Status' },
    { key: 'publishedAt', label: 'Published' },
    { key: 'createdAt', label: 'Created' },
  ];


  const handleViewTab = (row: WebsitePageModel) => {
    const currentSubdomain = Array.isArray(currentWebsite?.primaryDomain)
      ? currentWebsite?.primaryDomain[0]
      : currentWebsite?.primaryDomain;
    const localsub = typeof currentSubdomain === 'string' ? currentSubdomain.split('.')[0] : '';
    const isLocalHost = window.location.hostname.includes("localhost");
    if (isLocalHost) {
      
      const url = `http://${localsub}.localhost:55803/${row.slug}`;
   
      window.open(url, '_blank');
    } else {
      const url = `https://${currentSubdomain}/${row.slug}`;
      window.open(url, '_blank');
    }
  }

  return (
    <div>
      <DataTableExt
        title="Pages"
        data={filteredPages}
        createHref="/admin/website/pages/create"
        initialColumns={initialColumns} 
        onDelete={handleDelete}
        onView={handleView}
        opentab={handleViewTab}
      />
    </div>
  );
};

export default WebsitePageTable;