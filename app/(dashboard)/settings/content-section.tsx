import { Separator } from "@/components/ui/separator";

interface ContentSectionProps {
  title: string;
  desc: string;
  children: React.ReactNode;
}

export function ContentSection({ title, desc, children }: ContentSectionProps) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-none">
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
      <Separator className="my-4 flex-none" />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
