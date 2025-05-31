// app/decimal-div/page.tsx
"use client";

import ProblemCard from "@/components/ProblemCard";

export default function DecimalDivisionPage() {
  return (
    <ProblemCard
      title="小数除法"
      description="输入两个小数，计算它们的商。"
      inputFields={[
        { label: "被除数", key: "a", placeholder: "例如：2.4" },
        { label: "除数", key: "b", placeholder: "例如：0.6" },
      ]}
      solve={({ a, b }) => {
        const numA = parseFloat(a);
        const numB = parseFloat(b);

        if (isNaN(numA) || isNaN(numB)) {
          return "请输入两个有效的小数。";
        }

        if (numB === 0) {
          return "除数不能为 0。";
        }

        const result = numA / numB;
        return `${numA} ÷ ${numB} = ${result}`;
      }}
    />
  );
}
