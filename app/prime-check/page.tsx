"use client";

import ProblemCard from "@/components/ProblemCard";

export default function PrimeCheck() {
  return (
    <ProblemCard
      title="质数判断"
      description="判断一个正整数是否是质数。"
      inputFields={[
        { key: "num", label: "输入正整数", placeholder: "请输入正整数" },
      ]}
      solve={({ num }) => {
        const n = Number(num);
        if (!Number.isInteger(n) || n <= 0) return "请输入一个有效的正整数";

        if (n === 1) return "1 不是质数";

        for (let i = 2; i * i <= n; i++) {
          if (n % i === 0) {
            const other = n / i;
            return `${n} 不是质数，例：${i} × ${other} = ${n}`;
          }
        }
        return `${n} 是质数 🎉`;
      }}
    />
  );
}
