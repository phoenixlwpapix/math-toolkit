"use client";

import ProblemCard from "@/components/ProblemCard";

export default function GreatestCommonDivisor() {
  return (
    <ProblemCard
      title="最大公约数"
      description="输入两个数，求最大公约数。"
      inputFields={[
        { label: "数字1", key: "a", placeholder: "请输入第一个正整数" },
        { label: "数字2", key: "b", placeholder: "请输入第二个正整数" },
      ]}
      solve={({ a, b }) => {
        const x = Number(a);
        const y = Number(b);

        if (!Number.isInteger(x) || x <= 0 || !Number.isInteger(y) || y <= 0) {
          return "请输入两个有效的正整数";
        }

        function gcd(m: number, n: number): number {
          while (n !== 0) {
            const temp = n;
            n = m % n;
            m = temp;
          }
          return m;
        }

        const result = gcd(x, y);
        return `最大公约数是 ${result}`;
      }}
    />
  );
}
