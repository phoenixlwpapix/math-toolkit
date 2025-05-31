"use client";

import ProblemCard from "@/components/ProblemCard";

export default function ChickenRabbitPage() {
  return (
    <ProblemCard
      title="鸡兔同笼问题"
      description="请输入头和脚的总数，计算鸡和兔的数量。"
      inputFields={[
        { key: "heads", label: "头的总数", placeholder: "例如：10" },
        { key: "legs", label: "脚的总数", placeholder: "例如：28" },
      ]}
      solve={({ heads, legs }) => {
        const h = parseInt(heads);
        const l = parseInt(legs);
        if (isNaN(h) || isNaN(l)) return "请输入合法的数字。";

        const rabbits = (l - 2 * h) / 2;
        const chickens = h - rabbits;

        if (rabbits < 0 || chickens < 0 || !Number.isInteger(rabbits)) {
          return "无解，请检查输入是否合理。";
        }

        return `🐔 鸡有 ${chickens} 只，🐰 兔有 ${rabbits} 只。`;
      }}
    />
  );
}
