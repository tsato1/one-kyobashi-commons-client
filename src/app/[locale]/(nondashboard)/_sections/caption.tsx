"use client";

interface CaptionProps {
  label: string;
}

export const Caption = ({
  label
}: CaptionProps) => {
  return (
    <div className="w-full text-xl sm:text-3xl font-semibold mb-4">
      {label}
    </div>
  )
}