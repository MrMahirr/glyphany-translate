"use client";

import { useState, useEffect } from "react";
import type { TranslationListItem } from "@/entities/translation-page/translationPageDomains";
import { apiClient } from "@/lib/http";
import { TranslationApiMethod } from "@/constant/MethodNames";
import { toast } from "react-hot-toast";

export function useTranslationList() {
  const [data, setData] = useState<TranslationListItem[]>([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchTranslations = async () => {
    setIsLoading(true);
    try {
      // The backend GET /translations returns { items, totalCount, page, totalPages }
      const response = await apiClient.get<{ items: TranslationListItem[], totalCount: number }>(TranslationApiMethod.LIST);
      const items = response.data.items || [];
      setData(items);
      setTotalCount(response.data.totalCount || 0);
      setIsEmpty(items.length === 0);
    } catch (error) {
      console.error("Failed to fetch translations", error);
      toast.error("Failed to load translations.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTranslations();
  }, []);

  const toggleEmptyState = () => setIsEmpty(!isEmpty);

  return {
    data: isEmpty ? [] : data,
    isEmpty,
    toggleEmptyState,
    totalCount: isEmpty ? 0 : totalCount,
    storageUsedMb: 0, // Not implemented in backend yet
    storageTotalMb: 1024,
    isLoading
  };
}
