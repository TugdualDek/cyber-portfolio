import { Progress } from "../ui/progress";

export function SkillCard({ skill }: { skill: { name: string; level: number } }) {
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>{skill.name}</span>
          <span>{skill.level}%</span>
        </div>
        <Progress value={skill.level} className="h-2" />
      </div>
    );
  }