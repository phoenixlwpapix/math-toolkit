"use client";

import { useState, ChangeEvent } from "react";
import Link from "next/link";

// Helper function to format numbers, especially for complex numbers
const formatNumber = (num: number, precision: number = 4): string => {
  // Avoid -0
  if (Object.is(num, -0)) {
    return "0";
  }
  // Trim trailing zeros for decimals, but keep at least one if it's like X.0
  const fixed = num.toFixed(precision);
  if (fixed.includes(".")) {
    return parseFloat(fixed).toString();
  }
  return fixed;
};

export default function QuadraticEquationSolver() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [d, setD] = useState("");

  const [steps, setSteps] = useState<string[]>([]);
  const [solutions, setSolutions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      // Allow numbers, decimal point, and negative sign at the beginning
      const value = e.target.value;
      if (value === "" || value === "-" || /^-?\d*\.?\d*$/.test(value)) {
        setter(value);
      }
      setError(null); // Clear error on input change
      setSolutions([]);
      setSteps([]);
    };

  const handleCalculate = () => {
    setSteps([]);
    setSolutions([]);
    setError(null);

    const numA = parseFloat(a);
    const numB = parseFloat(b);
    const numC = parseFloat(c);
    const numD = parseFloat(d);

    if (isNaN(numA) || isNaN(numB) || isNaN(numC) || isNaN(numD)) {
      setError("请输入有效的数字作为系数 a, b, c 和常数 d。");
      return;
    }

    const currentSteps: string[] = [];
    currentSteps.push(
      `原始方程: ${formatNumber(numA)}x² + ${formatNumber(
        numB
      )}x + ${formatNumber(numC)} = ${formatNumber(numD)}`
    );

    // 转换为标准形式 Ax² + Bx + C = 0
    const A_val = numA;
    const B_val = numB;
    const C_val = numC - numD;
    currentSteps.push(`转换为标准形式 Ax² + Bx + C = 0:`);
    currentSteps.push(`A = ${formatNumber(A_val)}`);
    currentSteps.push(`B = ${formatNumber(B_val)}`);
    currentSteps.push(
      `C = c - d = ${formatNumber(numC)} - ${formatNumber(
        numD
      )} = ${formatNumber(C_val)}`
    );
    currentSteps.push(
      `标准方程: ${formatNumber(A_val)}x² + ${formatNumber(
        B_val
      )}x + ${formatNumber(C_val)} = 0`
    );

    if (A_val === 0) {
      // 方程为一元一次方程 Bx + C = 0
      currentSteps.push("由于 A = 0, 方程退化为一元一次方程 Bx + C = 0。");
      if (B_val === 0) {
        if (C_val === 0) {
          currentSteps.push("由于 B = 0 且 C = 0, 方程为 0 = 0。");
          setSolutions(["方程有无穷多解 (恒等式)。"]);
        } else {
          currentSteps.push(
            `由于 B = 0 且 C = ${formatNumber(
              C_val
            )} ≠ 0, 方程为 ${formatNumber(C_val)} = 0。`
          );
          setSolutions(["方程无解 (矛盾式)。"]);
        }
      } else {
        const x = -C_val / B_val;
        currentSteps.push(
          `x = -C / B = -(${formatNumber(C_val)}) / ${formatNumber(
            B_val
          )} = ${formatNumber(x)}`
        );
        setSolutions([`x = ${formatNumber(x)}`]);
      }
    } else {
      // 标准一元二次方程 Ax² + Bx + C = 0
      const discriminant = B_val * B_val - 4 * A_val * C_val;
      currentSteps.push(`计算判别式 Δ = B² - 4AC:`);
      currentSteps.push(
        `Δ = (${formatNumber(B_val)})² - 4 * (${formatNumber(
          A_val
        )}) * (${formatNumber(C_val)})`
      );
      currentSteps.push(
        `Δ = ${formatNumber(B_val * B_val)} - ${formatNumber(
          4 * A_val * C_val
        )} = ${formatNumber(discriminant)}`
      );

      if (discriminant > 0) {
        currentSteps.push("Δ > 0, 方程有两个不相等的实数根。");
        const x1 = (-B_val + Math.sqrt(discriminant)) / (2 * A_val);
        const x2 = (-B_val - Math.sqrt(discriminant)) / (2 * A_val);
        currentSteps.push(
          `x₁ = (-B + √Δ) / (2A) = (-(${formatNumber(B_val)}) + √${formatNumber(
            discriminant
          )}) / (2 * ${formatNumber(A_val)}) = ${formatNumber(x1)}`
        );
        currentSteps.push(
          `x₂ = (-B - √Δ) / (2A) = (-(${formatNumber(B_val)}) - √${formatNumber(
            discriminant
          )}) / (2 * ${formatNumber(A_val)}) = ${formatNumber(x2)}`
        );
        setSolutions([`x₁ = ${formatNumber(x1)}`, `x₂ = ${formatNumber(x2)}`]);
      } else if (discriminant === 0) {
        currentSteps.push("Δ = 0, 方程有两个相等的实数根。");
        const x = -B_val / (2 * A_val);
        currentSteps.push(
          `x₁ = x₂ = -B / (2A) = -(${formatNumber(
            B_val
          )}) / (2 * ${formatNumber(A_val)}) = ${formatNumber(x)}`
        );
        setSolutions([`x₁ = x₂ = ${formatNumber(x)}`]);
      } else {
        // discriminant < 0
        currentSteps.push("Δ < 0, 方程有两个共轭复数根。");
        const realPart = -B_val / (2 * A_val);
        const imaginaryPart = Math.sqrt(-discriminant) / (2 * A_val);
        currentSteps.push(`x = (-B ± i√(-Δ)) / (2A)`);
        currentSteps.push(
          `实部 = -B / (2A) = -(${formatNumber(B_val)}) / (2 * ${formatNumber(
            A_val
          )}) = ${formatNumber(realPart)}`
        );
        currentSteps.push(
          `虚部 = ±√(-Δ) / (2A) = ±√(${formatNumber(
            -discriminant
          )}) / (2 * ${formatNumber(A_val)}) = ±${formatNumber(imaginaryPart)}`
        );
        setSolutions([
          `x₁ = ${formatNumber(realPart)} + ${formatNumber(imaginaryPart)}i`,
          `x₂ = ${formatNumber(realPart)} - ${formatNumber(imaginaryPart)}i`,
        ]);
      }
    }
    setSteps(currentSteps);
  };

  const handleClear = () => {
    setA("");
    setB("");
    setC("");
    setD("");
    setSteps([]);
    setSolutions([]);
    setError(null);
  };

  const isFormValid =
    a !== "" &&
    b !== "" &&
    c !== "" &&
    d !== "" &&
    !isNaN(parseFloat(a)) &&
    !isNaN(parseFloat(b)) &&
    !isNaN(parseFloat(c)) &&
    !isNaN(parseFloat(d));

  return (
    <div className="min-h-screen flex justify-center items-start p-4 sm:p-8">
      <div className="relative bg-white max-w-2xl w-full p-6 sm:p-8 rounded-xl shadow-xl space-y-6">
        <Link href="/" legacyBehavior>
          <a className="absolute top-4 left-4 text-white bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded-md text-sm sm:text-base transition-colors duration-150 z-20">
            返回首页
          </a>
        </Link>

        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-700 pt-8 sm:pt-6 mb-6">
          一元二次方程求解器
        </h1>
        <p className="text-center text-gray-600 -mt-4 mb-6">
          求解: ax² + bx + c = d
        </p>

        {/* Input Fields */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-end">
          {[
            {
              label: "a (x²系数)",
              value: a,
              setter: setA,
              placeholder: "例如: 2",
            },
            {
              label: "b (x系数)",
              value: b,
              setter: setB,
              placeholder: "例如: -3",
            },
            {
              label: "c (常数项)",
              value: c,
              setter: setC,
              placeholder: "例如: 1",
            },
            {
              label: "d (等号右边)",
              value: d,
              setter: setD,
              placeholder: "例如: 5",
            },
          ].map((item, index) => (
            <div key={index} className="flex flex-col">
              <label
                htmlFor={`coeff-${item.label.charAt(0)}`}
                className="mb-1 text-sm font-medium text-gray-700"
              >
                {item.label}
              </label>
              <input
                id={`coeff-${item.label.charAt(0)}`}
                type="text" // Use text for better control with regex
                inputMode="decimal" // Hint for numeric keyboard with decimals
                value={item.value}
                onChange={handleInputChange(item.setter)}
                placeholder={item.placeholder}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-center"
              />
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
          <button
            onClick={handleCalculate}
            disabled={!isFormValid}
            className={`w-full sm:w-auto bg-blue-500 text-white px-8 py-2.5 rounded-md text-lg transition-all duration-150 ease-in-out
                        ${
                          isFormValid
                            ? "hover:bg-blue-600 cursor-pointer"
                            : "opacity-50 cursor-not-allowed"
                        }`}
          >
            计算{" "}
            <span role="img" aria-label="brain">
              🧠
            </span>
          </button>
          <button
            onClick={handleClear}
            className="w-full sm:w-auto bg-gray-300 text-gray-700 px-8 py-2.5 rounded-md text-lg hover:bg-gray-400 transition-colors"
          >
            清空
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-center">
            {error}
          </div>
        )}

        {/* Solutions Display */}
        {solutions.length > 0 && (
          <div className="mt-6 bg-blue-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-blue-800 mb-2 text-center">
              方程的解:
            </h2>
            <div className="text-center text-lg text-blue-700 space-y-1">
              {solutions.map((sol, i) => (
                <p
                  key={i}
                  dangerouslySetInnerHTML={{
                    __html: sol
                      .replace(/x₁/g, "<b>x₁</b>")
                      .replace(/x₂/g, "<b>x₂</b>")
                      .replace(/x/g, "<b>x</b>"),
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Steps Display */}
        {steps.length > 0 && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg text-gray-700 space-y-2 text-sm sm:text-base">
            <h2 className="font-semibold text-md text-gray-800 mb-3 sticky top-0 bg-gray-50 pt-2 pb-1 z-10 border-b border-gray-200">
              计算步骤：
            </h2>
            <div className="max-h-72 overflow-y-auto pr-2 space-y-1">
              {steps.map((s, i) => (
                <p key={i} className="leading-relaxed break-words">
                  <span className="font-mono mr-1.5 text-cyan-700">
                    {i + 1}.
                  </span>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: s
                        .replace(/Δ/g, "<b>Δ</b>")
                        .replace(/√/g, "<b>√</b>"),
                    }}
                  />
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
