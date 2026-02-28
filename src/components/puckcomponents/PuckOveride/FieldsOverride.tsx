import { Plus } from "lucide-react";
import { useRef, useState, useEffect, ReactNode } from "react";

interface FieldOverideProps {
  children: ReactNode;
  isLoading: boolean;
  itemSelector?: any;
}
export function FieldsOveride({
  children,
  isLoading,
  itemSelector,
}: FieldOverideProps) {

  return <div>{children}</div>;
}
