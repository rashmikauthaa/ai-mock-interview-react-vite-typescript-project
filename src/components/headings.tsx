import { cn } from "@/lib/utils";

interface Headingrops {
    title: string;
    description?: string;
    isSubHeading?: boolean;
}

export const Headings = ({title, description, isSubHeading = false} : Headingrops) => {
  return (
    <div>
        <h2 className={cn("text-2xl md:text-3xl text-foreground font-semibold font-sans", isSubHeading && "text-lg md:text-xl")}>
            {title}
        </h2>
        {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
        )}
    </div>
  )
};