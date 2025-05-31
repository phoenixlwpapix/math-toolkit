// components/ProblemCard.tsx
"use client";

import { useState } from "react";

type InputField = {
  label: string;
  placeholder?: string;
  key: string;
};

type Props = {
  title: string;
  description?: string;
  inputFields: InputField[];
  solve: (values: Record<string, string>) => string; // 假设 solve 函数返回一个字符串
};

export default function ProblemCard({ title, description, inputFields, solve }: Props) {
  const [inputs, setInputs] = useState<Record<string, string>>(
    inputFields.reduce((acc, field) => ({ ...acc, [field.key]: "" }), {}) // Initialize inputs
  );
  const [result, setResult] = useState<string>(""); // Explicitly type if solve returns string
  const [error, setError] = useState<string>(""); // For input validation errors

  const handleChange = (key: string, value: string) => {
    // Basic validation: allow only numbers or empty string for type="number"
    // More robust validation might be needed depending on the problem type
    if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [key]: value }));
      setError(""); // Clear error on valid change
    } else {
      setError(`"${inputFields.find(f => f.key === key)?.label || key}" 字段请输入有效数字。`);
    }
    setResult(""); // Clear previous result on input change
  };

  const handleSolve = () => {
    // Check if all required fields are filled and valid numbers
    for (const field of inputFields) {
      const value = inputs[field.key];
      if (value === undefined || value.trim() === "") {
        setError(`"${field.label}" 字段不能为空。`);
        setResult("");
        return;
      }
      if (isNaN(parseFloat(value))) {
          setError(`"${field.label}" 字段请输入有效数字。`);
          setResult("");
          return;
      }
    }
    setError(""); // Clear any previous errors
    try {
      const solution = solve(inputs);
      setResult(solution);
    } catch (e: any) {
      setError(e.message || "计算时发生错误。");
      setResult("");
    }
  };

  const allInputsFilled = inputFields.every(field => inputs[field.key] && inputs[field.key].trim() !== "" && !isNaN(parseFloat(inputs[field.key])));


  // The outermost element is now the card itself.
  // Background, min-h-screen, padding for the page are handled by layout.tsx
  return (
    <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-6 sm:p-8 min-w-[320px] sm:min-w-[450px] md:min-w-[500px]">
      {/* 1. Added min-w-[value] classes. Adjust as needed. */}
      {/*    Using sm: and md: prefixes for responsiveness if desired. */}
      {/*    Example: min-w-[320px] for very small screens, sm:min-w-[450px] for small, md:min-w-[500px] for medium. */}

      <h1 className="text-2xl font-bold text-center text-blue-800 mt-8 mb-4">{title}</h1> {/* Added mt-8 to give space for absolute positioned link */}
      {description && (
        <p className="text-gray-700 text-center mb-6">{description}</p>
      )}

      <div className="space-y-4">
        {inputFields.map((field) => (
          <div key={field.key}>
            <label htmlFor={field.key} className="block mb-1 font-medium text-gray-700">
              {field.label}
            </label>
            <input
              id={field.key}
              type="text" // Changed to text to allow our custom validation and inputMode
              inputMode="decimal" // Suggests numeric keyboard with decimal for mobile
              value={inputs[field.key] || ""}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              placeholder={field.placeholder || "请输入数字"}
            />
          </div>
        ))}

        {error && (
          <p className="text-sm text-red-600 text-center mt-2">{error}</p>
        )}

        <button
          onClick={handleSolve}
          disabled={!allInputsFilled || !!error} // Disable if not all inputs filled or if there's an error
          className={`w-full bg-blue-500 text-white text-lg font-semibold py-3 rounded-xl transition
                      ${(!allInputsFilled || !!error) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
        >
          求解 🧠
        </button>

        {result && !error && ( // Only show result if no error
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <p className="text-center text-lg font-semibold text-green-700">
              答案：<span className="text-xl text-purple-700">{result}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}