"use client"
import { AppDispatch, RootState } from '@/store/store';
import { AlertCircle } from 'lucide-react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { PageItem } from './pages';
import { updateCurrentPage } from '@/hooks/slices/website/websitePageSlice';

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

type Props = {
  pages: PageItem;
  openSeoModal: () => void;
}
const SeoPill = ({ pages, openSeoModal }: Props) => {

  const { websitePages } = useSelector((state: RootState) => state.websitePage);
  const dispatch = useDispatch<AppDispatch>();
  const handleOpenSeoModal = () => {
    // currentPage
    const currentPage = websitePages.find((page: any) => page._id === pages.id);
    dispatch(updateCurrentPage(currentPage));
    openSeoModal()
  }
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full",
        "text-[12px] font-semibold",
        "bg-amber-50 text-amber-700 border border-amber-200",
        "dark:bg-amber-500/10 dark:text-amber-200 dark:border-amber-500/20",
      )}
      onClick={handleOpenSeoModal}
    >
      <AlertCircle className="w-4 h-4" />
      SEO
    </span>
  )
}

export default SeoPill