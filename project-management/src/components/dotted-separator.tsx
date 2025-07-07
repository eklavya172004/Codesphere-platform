import { cn } from "@/lib/utils";

interface DottedSeparatorProps {
   className?: string;
    color?: string;
    height?: string;
    dotSize?: string;
    gapSize?: string;
    direction?: "horizontal" | "vertical";
}

export function DottedSeparator({
    className,
    color = "#6B7280",
    height = "2px",
    dotSize = "2px",
    gapSize = "6px",
    direction = "horizontal"
}: DottedSeparatorProps) {
    const isHorizontal = direction === "horizontal";
    return (
        <div
            className={cn(
                isHorizontal ? "w-full flex items-center " : "h-full flex flex-col items-center ",
                className,
            )}
        >
            <div
                className={isHorizontal ? "flex-grow" : "flex-grow-0"}
                style={{
                    width: isHorizontal ? "100%" : dotSize,
                    height: isHorizontal ? dotSize : "100%",
                    backgroundImage: `radial-gradient(circle,${color} 25%,transparent 25%)`,
                    backgroundSize: isHorizontal ? `${parseInt(gapSize) + parseInt(dotSize)}px ${height}` : `${height} ${parseInt(dotSize)}px + ${parseInt(gapSize)}px`,
                    backgroundRepeat: isHorizontal?'repeat-x':'repeat-y',
                    backgroundPosition: 'center',
                }}
            />
        </div>
    );
}