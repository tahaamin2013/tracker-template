"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface Template {
  _id: string;
  itemNo: string;
  description: string;
  unit: string;
  unitPrice: number;
}

interface DescriptionSelectorProps {
  value: string;
  onChange: (value: string) => void;
  onSelectTemplate: (template: Template) => void;
}

export function DescriptionSelector({
  value,
  onChange,
  onSelectTemplate,
}: DescriptionSelectorProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/black-wo-temp");
      const result = await response.json();

      if (result.success) {
        setTemplates(result.data);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  if (!mounted) return null;

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <button type="button" className="relative w-full">
            <Input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Select or type description"
              className="bg-white/5 border-white/20 text-white placeholder:text-white/40 text-sm pr-10"
            />
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-yellow-500 pointer-events-none" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-56 bg-black border-yellow-500/30 max-h-60 overflow-y-auto"
        >
          {templates.length === 0 ? (
            <DropdownMenuItem className="text-gray-500" disabled>
              No templates available
            </DropdownMenuItem>
          ) : (
            templates.map((template) => (
              <DropdownMenuItem
                key={template._id}
                onClick={() => {
                  onChange(template.description);
                  onSelectTemplate(template);
                }}
                className="text-white hover:bg-yellow-500/10 cursor-pointer"
              >
                <div>
                  <p className="font-bold">{template.description}</p>
                  <p className="text-xs text-yellow-500">
                    {template.itemNo} | {template.unit} | ${template.unitPrice.toFixed(2)}
                  </p>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
