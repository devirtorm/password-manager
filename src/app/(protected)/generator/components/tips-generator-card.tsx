import { Card, CardContent } from "@/components/ui/card";
import { OctagonX, ShieldCheck, RefreshCcw } from "lucide-react";
import React from "react";

export default function TipsGeneratorCard() {
  const cardTips = [
    {
      title: "Security",
      description:
        "Use a mix of letters, numbers, and symbols to create strong passwords.",
      icon: <ShieldCheck className="h-6 w-6 text-neutral-300" />,
    },
    {
      title: "Renewal",
      description: "Regularly update your passwords to enhance security.",
      icon: <RefreshCcw className="h-6 w-6 text-neutral-300" />,
    },
    {
      title: "Uniqueness",
      description: "Never reuse the same password across multiple accounts.",
      icon: <OctagonX className="h-6 w-6 text-neutral-300" />,
    },
  ];

  return (
    <>
      {cardTips.map((tip) => (
        <Card
          key={tip.title}
          className="bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700"
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-3">{tip.icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-neutral-800 dark:text-neutral-200">
              {tip.title}
            </h3>
            <p className="text-sm text-muted-foreground">{tip.description}</p>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
