import type { CourseKPI } from "@/types";

interface Props {
  name: string;
  score: number;
  max?: number;
}

export function TopCourseRow({ name, score, max = 5 }: Props) {
  const percentage = (score / max) * 100;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="font-bold text-zinc-700 dark:text-zinc-300">{name}</span>
        <span className="font-black text-zinc-900 dark:text-zinc-100">{score}</span>
      </div>
      <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden shadow-inner">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-1000"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
