"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  IconPlus,
  IconChevronLeft,
  IconChevronRight,
  IconSearch,
  IconCheck,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Batch } from "../types";

interface BatchTabsProps {
  batches: Batch[];
  activeBatchId: string | null;
  totalSubmissions: number;
  onBatchChange: (batchId: string | null) => void;
  onAddBatch: () => void;
}

interface TabItemProps {
  isActive: boolean;
  onClick: () => void;
  label: string;
  count: number;
}

const TabItem = ({ isActive, onClick, label, count }: TabItemProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative shrink-0 px-4 py-2.5 text-sm transition-colors ${
      isActive
        ? "font-semibold text-foreground"
        : "font-medium text-muted-foreground hover:text-foreground"
    }`}
  >
    <span className="flex items-center gap-1.5 whitespace-nowrap">
      {label}
      <span
        className={`tabular-nums ${
          isActive ? "text-muted-foreground" : "text-muted-foreground/70"
        }`}
      >
        {count}
      </span>
    </span>
    {isActive && (
      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
    )}
  </button>
);

export const BatchTabs = ({
  batches,
  activeBatchId,
  totalSubmissions,
  onBatchChange,
  onAddBatch,
}: BatchTabsProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", checkScroll);
    const resizeObserver = new ResizeObserver(checkScroll);
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener("scroll", checkScroll);
      resizeObserver.disconnect();
    };
  }, [checkScroll, batches]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = 200;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleSearchSelect = (value: string) => {
    onBatchChange(value === "all" ? null : value);
    setSearchOpen(false);
  };

  const allItems = [
    { id: "all", name: "All", count: totalSubmissions },
    ...batches.map((b) => ({ id: b.id, name: b.name, count: b.submissionCount })),
  ];

  return (
    <div className="flex items-center gap-1 border-b">
      {canScrollLeft && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => scroll("left")}
          className="h-8 w-8 shrink-0 p-0 text-muted-foreground"
          aria-label="Scroll tabs left"
        >
          <IconChevronLeft className="size-4" />
        </Button>
      )}

      <div
        ref={scrollRef}
        className="flex flex-1 items-center overflow-x-auto scrollbar-none"
      >
        <TabItem
          isActive={activeBatchId === null}
          onClick={() => onBatchChange(null)}
          label="All"
          count={totalSubmissions}
        />
        {batches.map((batch) => (
          <TabItem
            key={batch.id}
            isActive={activeBatchId === batch.id}
            onClick={() => onBatchChange(batch.id)}
            label={batch.name}
            count={batch.submissionCount}
          />
        ))}
      </div>

      {canScrollRight && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => scroll("right")}
          className="h-8 w-8 shrink-0 p-0 text-muted-foreground"
          aria-label="Scroll tabs right"
        >
          <IconChevronRight className="size-4" />
        </Button>
      )}

      <Popover open={searchOpen} onOpenChange={setSearchOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 shrink-0 p-0 text-muted-foreground hover:text-foreground"
            aria-label="Search batches"
          >
            <IconSearch className="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[220px] p-0" align="end">
          <Command>
            <CommandInput placeholder="Search batches..." />
            <CommandList>
              <CommandEmpty>No batch found.</CommandEmpty>
              <CommandGroup>
                {allItems.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.name}
                    onSelect={() => handleSearchSelect(item.id)}
                  >
                    <IconCheck
                      className={`mr-2 size-4 ${
                        (item.id === "all" && activeBatchId === null) ||
                        item.id === activeBatchId
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    />
                    <span className="flex-1">{item.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.count}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Button
        variant="ghost"
        size="sm"
        onClick={onAddBatch}
        className="h-8 w-8 shrink-0 p-0 text-muted-foreground hover:text-foreground"
        aria-label="Add new batch"
      >
        <IconPlus className="size-4" />
      </Button>
    </div>
  );
};
