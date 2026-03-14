"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ContentSection } from "../content-section";

const displayItems = [
  { id: "recents", label: "Recents", description: "Show recent items on the dashboard" },
  { id: "suggestions", label: "Suggestions", description: "Show suggestions based on your activity" },
  { id: "compact", label: "Compact Mode", description: "Use a more compact display layout" },
  { id: "animations", label: "Animations", description: "Enable interface animations" },
];

export default function SettingsDisplayPage() {
  const [selected, setSelected] = useState<string[]>(["recents", "animations"]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <ContentSection
      title="Display"
      desc="Turn items on or off to control what's displayed in the app."
    >
      <div className="space-y-6">
        {displayItems.map((item) => (
          <div key={item.id} className="flex items-start space-x-3">
            <Checkbox
              id={item.id}
              checked={selected.includes(item.id)}
              onCheckedChange={() => toggle(item.id)}
            />
            <div className="space-y-0.5 leading-none">
              <label htmlFor={item.id} className="text-sm font-medium cursor-pointer">
                {item.label}
              </label>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          </div>
        ))}
        <Button onClick={() => toast.success("Display settings saved")}>
          Save preferences
        </Button>
      </div>
    </ContentSection>
  );
}
