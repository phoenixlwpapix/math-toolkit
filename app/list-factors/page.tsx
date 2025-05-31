// app/factors-multiples/page.tsx
"use client";

import ProblemCard from "@/components/ProblemCard";

export default function ListFactorsPage() {
  return (
    <ProblemCard
      title="列出因数"
      description="输入一个正整数，列出它的所有因数。"
      inputFields={[
        { label: "请输入一个正整数", key: "num", placeholder: "例如：12" },
      ]}
      solve={({ num }) => {
        const n = parseInt(num);
        if (isNaN(n) || n <= 0) return "请输入一个有效的正整数";

        const factors: number[] = [];
        for (let i = 1; i <= n; i++) {
          if (n % i === 0) {
            factors.push(i);
          }
        }

        return `${n} 的因数有：${factors.join("，")}`;
      }}
    />
  );
}
