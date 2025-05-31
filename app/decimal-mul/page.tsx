// app/decimal-mul/page.tsx
"use client";

import ProblemCard from "@/components/ProblemCard";

export default function DecimalMultiplicationPage() {
  return (
    <ProblemCard
      title="小数乘法"
      description="输入两个小数，计算它们的乘积。"
      inputFields={[
        { label: "第一个小数", key: "a", placeholder: "例如：2.5" },
        { label: "第二个小数", key: "b", placeholder: "例如：0.4" },
      ]}
      solve={({ a, b }) => {
        const numA = parseFloat(a);
        const numB = parseFloat(b);

        if (isNaN(numA) || isNaN(numB)) {
          return "请输入两个有效的小数。";
        }

        const result = numA * numB;
        return `${numA} × ${numB} = ${result}`;
      }}
    />
  );
}
