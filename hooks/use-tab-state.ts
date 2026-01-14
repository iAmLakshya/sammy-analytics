"use client";

import { DEFAULT_TAB, isValidTab, type TabId } from "@/lib/constants";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export const useTabState = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const tabParam = searchParams.get("tab");
  const activeTab: TabId = isValidTab(tabParam) ? tabParam : DEFAULT_TAB;

  const setActiveTab = useCallback(
    (tab: TabId) => {
      const params = new URLSearchParams(searchParams.toString());

      if (tab === DEFAULT_TAB) {
        params.delete("tab");
      } else {
        params.set("tab", tab);
      }

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

      router.push(newUrl, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  return { activeTab, setActiveTab };
};
