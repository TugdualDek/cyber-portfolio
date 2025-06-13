import React from "react";

interface CalloutProps {
  type?: "info" | "warning" | "tip" | "saviez-vous";
  title?: string;
  emoji?: string;
  children: React.ReactNode;
}

const typeStyles = {
  info: "bg-blue-900/20 border-blue-500/40 text-blue-200",
  warning: "bg-amber-900/20 border-amber-500/40 text-amber-200",
  tip: "bg-green-900/20 border-green-500/40 text-green-200",
  "saviez-vous": "bg-purple-900/20 border-purple-500/40 text-purple-200",
};

const typeEmojis = {
  info: "ℹ️",
  warning: "⚠️",
  tip: "💡",
  "saviez-vous": "🧠",
};

export function Callout({
  children,
  type = "info",
  title,
  emoji,
}: CalloutProps) {
  const typeStyle = typeStyles[type] || typeStyles.info;
  const defaultEmoji = typeEmojis[type] || typeEmojis.info;

  return (
    <div className={`my-4 rounded-md border ${typeStyle} p-2`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{emoji || defaultEmoji}</span>
        <p className="font-semibold">
          {title ||
            (type === "saviez-vous"
              ? "Le saviez-vous ?"
              : type.charAt(0).toUpperCase() + type.slice(1))}
        </p>
      </div>
      <div className="pl-6">{children}</div>
    </div>
  );
}
