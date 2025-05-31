"use client";

import { useState } from "react";
import Link from 'next/link'; // 1. 导入 Next.js 的 Link 组件

// 工具函数
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
const lcm = (a: number, b: number): number => {
  if (a === 0 || b === 0) return 0; // LCM with 0 is 0 or undefined, handle as 0 for practical purposes
  return Math.abs(a * b) / gcd(Math.abs(a), Math.abs(b));
};

// 外部组件定义：FractionBox
const FractionBox = ({
  numerator,
  denominator,
  onChangeNum,
  onChangeDen,
  idPrefix // 为确保label和input关联，增加一个id前缀
}: {
  numerator: string;
  denominator: string;
  onChangeNum: (val: string) => void;
  onChangeDen: (val: string) => void;
  idPrefix: string;
}) => {
  const handleInputChange = (
    value: string,
    setter: (val: string) => void
  ) => {
    // 只允许空字符串或纯数字
    if (value === "" || /^[0-9]+$/.test(value)) {
      setter(value);
    }
  };

  return (
    
    <div className="inline-block text-center mx-2">
      {/* 添加隐藏的label以提高可访问性 */}
      <label htmlFor={`${idPrefix}-numerator`} className="sr-only">分子</label>
      <input
        id={`${idPrefix}-numerator`}
        value={numerator}
        onChange={(e) => handleInputChange(e.target.value, onChangeNum)}
        // type="text" 更能配合 inputMode 和我们的自定义校验
        // 如果保留 type="number"，浏览器可能会自行添加上下箭头或阻止某些非数字输入，
        // 但我们的自定义校验会更严格。这里选择 "text" 以便完全控制。
        type="text"
        inputMode="numeric" // 依然提示数字键盘
        pattern="[0-9]*"    // 辅助移动端校验
        className="w-14 text-center appearance-none focus:outline-none focus:border-blue-800"
        placeholder="分子"
      />
      <div className="w-full my-1" aria-hidden="true" />
      <label htmlFor={`${idPrefix}-denominator`} className="sr-only">分母</label>
      <input
        id={`${idPrefix}-denominator`}
        value={denominator}
        onChange={(e) => handleInputChange(e.target.value, onChangeDen)}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        className="w-14 text-center border-t-2 border-blue-600 appearance-none focus:outline-none focus:border-blue-800"
        placeholder="分母"
      />
    </div>
  );
};

// 外部组件定义：ResultFraction
const ResultFraction = ({ num, den }: { num: number; den: number }) => (
  <div className="inline-block text-center mx-2 font-bold text-blue-900 text-xl">
    {den === 0 ? (
      <span className="text-red-600">错误(除数0)</span>
    ) : den === 1 ? (
      <span>{num}</span>
    ) : (
      <>
        <div>{num}</div>
        <div className="border-t border-black w-full my-1" />
        <div>{den}</div>
      </>
    )}
  </div>
);

export default function FractionEquationInline() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [d, setD] = useState("");
  const [op, setOp] = useState("+");
  const [steps, setSteps] = useState<string[]>([]);
  const [result, setResult] = useState<{ num: number; den: number } | null>(
    null
  );

  const handleCalc = () => {
    setSteps([]); // 清空之前的步骤
    setResult(null); // 清空之前的结果

    if ([a, b, c, d].some(val => val === "")) {
        setSteps(["错误：所有输入框都必须填写数字。"]);
        return;
    }

    const a1 = parseInt(a);
    const b1 = parseInt(b);
    const a2 = parseInt(c);
    const b2 = parseInt(d);

    if ([b1, b2].includes(0) && op === "÷" && a2 === 0) {
        setSteps(["错误：除数的分母和分子不能同时为0。"]);
        return;
    }
    if (b1 === 0 || b2 === 0) {
      setSteps(["错误：分母不能为0。"]);
      return;
    }
    if (op === "÷" && a2 === 0) {
      // 如果是除法，且除数的分子是0 (c/d = 0/d)
      setSteps(["错误：除数不能为0 (即分子不能为0，除非分母也为0，但那已被上面捕获)。"]);
      return;
    }
    if ([a1, b1, a2, b2].some(isNaN)) {
        setSteps(["错误：请输入有效的数字。"]); // 理论上我们的输入控制会阻止这个，但作为保险
        return;
    }


    let num = 0,
      den = 1;
    const logs: string[] = [];

    logs.push(`原始算式：(${a1}/${b1}) ${op} (${a2}/${b2})`);

    if (op === "+" || op === "-") {
      const commonDen = lcm(b1, b2);
      if (commonDen === 0 && (b1 !== 0 || b2 !== 0)) { // lcm(x,0) is tricky, if b1 or b2 is 0, it should have been caught
        setSteps(["计算错误：无法找到公分母 (可能因为某个分母是0)。"]);
        return;
      }
      const n1 = a1 * (commonDen / b1);
      const n2 = a2 * (commonDen / b2);
      logs.push(
        `通分：${a1}/${b1} → ${n1}/${commonDen}，  ${a2}/${b2} → ${n2}/${commonDen}`
      );
      num = op === "+" ? n1 + n2 : n1 - n2;
      den = commonDen;
    } else if (op === "×") {
      num = a1 * a2;
      den = b1 * b2;
      logs.push(`分子相乘：${a1} × ${a2} = ${num}`);
      logs.push(`分母相乘：${b1} × ${b2} = ${den}`);
      logs.push(`结果：${num}/${den}`);
    } else if (op === "÷") {
      if (a2 === 0) { // 除数为0 (c/d where c is 0)
        setSteps(["错误：除数不能为零 (即 ${a2}/${b2} 不能为0)。"]);
        setResult(null);
        return;
      }
      num = a1 * b2;
      den = b1 * a2;
      logs.push(
        `除法转乘法：(${a1}/${b1}) × (${b2}/${a2})`
      );
      logs.push(`计算：(${a1}×${b2}) / (${b1}×${a2}) = ${num}/${den}`);
    }

    // 处理结果为 0/0 或 x/0 的情况
    if (den === 0) {
        logs.push("最终结果的分母为0，这是一个无效分数或表示无穷大。");
        setResult({ num, den }); // 特殊显示
        setSteps(logs);
        return;
    }
    if (num === 0) { // 如果分子是0，结果就是0 (0/den = 0)
        logs.push("分子为0，结果为0。");
        setResult({ num: 0, den: 1 });
        setSteps(logs);
        return;
    }


    const commonDivisor = gcd(Math.abs(num), Math.abs(den));
    logs.push(`约分：分子分母的最大公约数 = ${commonDivisor}`);
    num = num / commonDivisor;
    den = den / commonDivisor;

    // 处理负号，优先放在分子上，如果分母为负且分子为正，则都变号
    if (den < 0) {
        num = -num;
        den = -den;
        logs.push(`整理负号：将负号移至分子或消除，得到 ${num}/${den}`);
    }

    setResult({ num, den });
    setSteps(logs);
  };

  const isFormValid = a !== "" && b !== "" && c !== "" && d !== "" &&
                      !([b,d].includes("0") && (op === "÷" && c === "0")) && // 除法时，除数不能是0/0
                      !(b === "0" || d === "0") && // 分母不能是0
                      !(op === "÷" && c === "0"); // 除法时，除数的分子不能是0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex justify-center items-start p-4 sm:p-8">
      {/* 2. 给卡片容器添加 'relative' */}
      <div className="relative bg-white max-w-3xl w-full p-4 sm:p-6 rounded-xl shadow-lg space-y-6">
        {/* 3. 添加返回按钮 */}
        <Link href="/" legacyBehavior>
          <a className="absolute top-4 left-4 text-white bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded-md text-sm sm:text-base transition-colors duration-150 z-20">
            返回首页
          </a>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-blue-700 mb-6">
          分数四则运算器
        </h1>

        <div className="flex justify-center items-center flex-wrap gap-2 text-xl sm:text-2xl">
          <FractionBox
            numerator={a}
            denominator={b}
            onChangeNum={setA}
            onChangeDen={setB}
            idPrefix="fraction1"
          />

          <select
            value={op}
            onChange={(e) => {
              setOp(e.target.value);
              setResult(null); // 改变操作符时清空结果和步骤
              setSteps([]);
            }}
            className="text-xl sm:text-2xl border rounded px-2 py-1 bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="选择运算符"
          >
            <option value="+">＋</option>
            <option value="-">－</option>
            <option value="×">×</option>
            <option value="÷">÷</option>
          </select>

          <FractionBox
            numerator={c}
            denominator={d}
            onChangeNum={setC}
            onChangeDen={setD}
            idPrefix="fraction2"
          />

          <span className="mx-1 sm:mx-2">=</span>
          {result ? (
            <ResultFraction num={result.num} den={result.den} />
          ) : (
            <div className="inline-block text-center mx-2 text-xl sm:text-2xl text-gray-400">?</div>
          )}
        </div>

        <div className="text-center">
          <button
            onClick={handleCalc}
            disabled={!isFormValid}
            className={`bg-blue-600 text-white px-6 py-2.5 rounded-full text-lg sm:text-xl transition-all duration-150 ease-in-out
                        ${isFormValid ? 'hover:bg-blue-700 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
          >
            计算 <span role="img" aria-label="brain">🧠</span>
          </button>
        </div>

        {steps.length > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg text-blue-800 space-y-2 text-sm sm:text-base">
            <h2 className="font-semibold text-md text-blue-900">计算步骤：</h2>
            {steps.map((s, i) => (
              <p key={i} className="leading-relaxed">
                <span className="font-mono mr-1">{i+1}.</span> {s}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}