"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type Group = { id: string; name: string };

export default function GroupMultiSelect({
  groups,
  value,
  onChange,
}: {
  groups: Group[];
  value: string[];
  onChange: (ids: string[]) => void;
}) {
  const [open, setOpen] = useState(false);

  const toggle = (id: string) =>
    onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id]);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {value.map((id) => {
          const g = groups.find((gr) => gr.id === id);
          if (!g) return null;
          return (
            <Badge key={id} variant="secondary" className="cursor-pointer" onClick={() => toggle(id)}>
              {g.name} ✕
            </Badge>
          );
        })}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm"><Plus className="mr-2 h-4 w-4" /> Add Groups</Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-64">
          <Command>
            <CommandList>
              <CommandGroup>
                {groups.map((g) => (
                  <CommandItem
                    key={g.id}
                    onSelect={() => toggle(g.id)}
                  >
                    <Check className={cn("mr-2 h-4 w-4", value.includes(g.id) ? "opacity-100" : "opacity-0")} />
                    {g.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
