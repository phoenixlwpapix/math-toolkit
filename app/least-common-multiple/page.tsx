"use client";

import ProblemCard from "@/components/ProblemCard";

export default function LcmPage() {
  return (
    <ProblemCard
      title="最小公倍数"
      description="输入两个正整数，计算它们的最小公倍数。"
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

        const gcdValue = gcd(x, y);
        const lcmValue = (x * y) / gcdValue;

        return `最小公倍数是 ${lcmValue}`;
      }}
    />
  );
}
