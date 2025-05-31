"use client";

import { useState, ChangeEvent } from "react"; // FormEvent removed as buttons now directly call handleSubmit
import { FaRulerCombined, FaVectorSquare, FaCalculator } from 'react-icons/fa';

// Helper function to format numbers
const formatNumber = (num: number | null | undefined, precision: number = 2): string => {
  if (num === null || num === undefined) return "";
  if (Object.is(num, -0)) return "0";
  const numValue = Number(num);
  if (isNaN(numValue)) return "";

  const fixed = numValue.toFixed(precision);
  if (fixed.includes('.')) {
    let floatVal = parseFloat(fixed);
    if (floatVal.toString() === fixed && precision === 0) return floatVal.toString();
    return floatVal.toString();
  }
  return fixed;
};

type ShapeType = "rectangle" | "square";
type CalculationType = "area" | "perimeter" | null;

const MAX_SHAPE_DIMENSION = 200; // Max width/height for the shape visualization in px on small screens
                                 // On larger screens, it might be constrained by its column width

export default function ShapeCalculator() {
  const [shapeType, setShapeType] = useState<ShapeType>("rectangle");
  const [length, setLength] = useState<string>("");
  const [width, setWidth] = useState<string>("");
  const [side, setSide] = useState<string>("");

  const [calculatedValue, setCalculatedValue] = useState<number | null>(null);
  const [calculationType, setCalculationType] = useState<CalculationType>(null);
  const [formula, setFormula] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);

  const [displayWidth, setDisplayWidth] = useState<number>(0);
  const [displayHeight, setDisplayHeight] = useState<number>(0);

  const handleShapeChange = (newShape: ShapeType) => {
    setShapeType(newShape);
    setLength(""); setWidth(""); setSide("");
    clearResultsAndError();
  };

  const clearResultsAndError = () => {
    setCalculatedValue(null); setCalculationType(null); setFormula("");
    setError(null); setShowResult(false);
    setDisplayWidth(0); setDisplayHeight(0);
  };

  const handleInputChange = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setter(value);
      clearResultsAndError();
    }
  };

  const handleSubmit = (calcType: "area" | "perimeter") => {
    setError(null);
    setShowResult(false); // Hide previous result before showing new one
    setCalculationType(calcType); // Set this early for animation indication

    let L_val = 0, W_val = 0, S_val = 0;
    let currentFormula = "";
    let result: number | null = null;
    let shapeError = false;
    let tempDisplayWidth = 0;
    let tempDisplayHeight = 0;

    if (shapeType === "rectangle") {
      L_val = parseFloat(length);
      W_val = parseFloat(width);
      if (isNaN(L_val) || L_val <= 0 || isNaN(W_val) || W_val <= 0) {
        setError("请输入有效的长和宽（必须大于0）。");
        shapeError = true;
      } else {
        if (calcType === "area") {
          result = L_val * W_val;
          currentFormula = `面积 = 长 × 宽 = ${formatNumber(L_val)} × ${formatNumber(W_val)}`;
        } else {
          result = 2 * (L_val + W_val);
          currentFormula = `周长 = 2 × (长 + 宽) = 2 × (${formatNumber(L_val)} + ${formatNumber(W_val)})`;
        }
        const ratio = L_val / W_val;
        if (L_val >= W_val) {
            tempDisplayWidth = MAX_SHAPE_DIMENSION;
            tempDisplayHeight = MAX_SHAPE_DIMENSION / ratio;
        } else {
            tempDisplayHeight = MAX_SHAPE_DIMENSION;
            tempDisplayWidth = MAX_SHAPE_DIMENSION * ratio;
        }
      }
    } else { // square
      S_val = parseFloat(side);
      if (isNaN(S_val) || S_val <= 0) {
        setError("请输入有效的边长（必须大于0）。");
        shapeError = true;
      } else {
        L_val = S_val; W_val = S_val; // For unified display logic
        if (calcType === "area") {
          result = S_val * S_val;
          currentFormula = `面积 = 边长 × 边长 = ${formatNumber(S_val)} × ${formatNumber(S_val)}`;
        } else {
          result = 4 * S_val;
          currentFormula = `周长 = 4 × 边长 = 4 × ${formatNumber(S_val)}`;
        }
        tempDisplayWidth = MAX_SHAPE_DIMENSION;
        tempDisplayHeight = MAX_SHAPE_DIMENSION;
      }
    }

    if (!shapeError && result !== null) {
      setCalculatedValue(result);
      setFormula(currentFormula);
      setDisplayWidth(tempDisplayWidth);
      setDisplayHeight(tempDisplayHeight);
      setShowResult(true); // Show result after all calculations are done
    } else {
      setDisplayWidth(0);
      setDisplayHeight(0);
      setCalculationType(null); // Reset if there was an error
    }
  };

  const isFormValid = () => {
    if (shapeType === "rectangle") {
      const l = parseFloat(length);
      const w = parseFloat(width);
      return length !== "" && width !== "" && !isNaN(l) && !isNaN(w) && l > 0 && w > 0;
    } else {
      const s = parseFloat(side);
      return side !== "" && !isNaN(s) && s > 0;
    }
  };

  return (
      <div className="relative bg-white max-w-5xl w-full p-6 sm:p-8 rounded-xl shadow-xl"> {/* Max width increased for side-by-side */}
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-indigo-700 pt-8 sm:pt-6 mb-8">
          长方形与正方形面积与周长计算器
        </h1>

        {/* Main content flex container */}
        <div className="flex flex-col md:flex-row md:gap-8">

          {/* Left Column: Inputs and Controls */}
          <div className="md:w-2/5 space-y-6 mb-8 md:mb-0">
            {/* Shape Type Selector */}
            <div className="flex justify-center gap-4">
              {(["rectangle", "square"] as ShapeType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => handleShapeChange(type)}
                  className={`w-full px-4 py-2 rounded-md text-lg font-medium transition-colors
                    ${shapeType === type
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  {type === "rectangle" ? "长方形" : "正方形"}
                </button>
              ))}
            </div>

            {/* Input Fields */}
            <div className="space-y-4">
              {shapeType === "rectangle" && (
                <>
                  <div>
                    <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-1">
                      长 (Length):
                    </label>
                    <input type="text" id="length" inputMode="decimal" value={length} onChange={(e) => handleInputChange(e.target.value, setLength)} placeholder="例如: 10"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                  </div>
                  <div>
                    <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-1">
                      宽 (Width):
                    </label>
                    <input type="text" id="width" inputMode="decimal" value={width} onChange={(e) => handleInputChange(e.target.value, setWidth)} placeholder="例如: 5"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                  </div>
                </>
              )}
              {shapeType === "square" && (
                <div>
                  <label htmlFor="side" className="block text-sm font-medium text-gray-700 mb-1">
                    边长 (Side):
                  </label>
                  <input type="text" id="side" inputMode="decimal" value={side} onChange={(e) => handleInputChange(e.target.value, setSide)} placeholder="例如: 7"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                </div>
              )}
            </div>

            {/* Calculation Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
              <button onClick={() => handleSubmit("area")} disabled={!isFormValid()}
                className={`w-full sm:w-auto flex-1 bg-indigo-500 text-white px-6 py-2.5 rounded-full text-lg transition-all duration-150 ease-in-out flex items-center justify-center gap-2
                            ${isFormValid() ? 'hover:bg-indigo-600 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}>
                <FaVectorSquare /> 计算面积
              </button>
              <button onClick={() => handleSubmit("perimeter")} disabled={!isFormValid()}
                className={`w-full sm:w-auto flex-1 bg-purple-500 text-white px-6 py-2.5 rounded-full text-lg transition-all duration-150 ease-in-out flex items-center justify-center gap-2
                            ${isFormValid() ? 'hover:bg-purple-600 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}>
                <FaRulerCombined /> 计算周长
              </button>
            </div>
          </div> {/* End of Left Column */}


          {/* Right Column: Results and Visualization */}
          <div className="md:w-3/5 md:border-l md:pl-8 border-gray-200"> {/* Added border and padding for large screens */}
            {error && (
              <div className="p-3 mb-6 bg-red-100 border border-red-400 text-red-700 rounded-md text-center">
                {error}
              </div>
            )}

            {!error && !showResult && (
                <div className="h-full flex flex-col justify-center items-center text-gray-400 p-8 border border-dashed rounded-lg">
                    <FaCalculator size={48} className="mb-4"/>
                    <p className="text-lg">请输入有效的维度并选择计算类型。</p>
                    <p className="text-sm">结果和图形将在此处显示。</p>
                </div>
            )}

            {showResult && calculatedValue !== null && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl sm:text-2xl font-semibold text-indigo-700 inline">
                    <FaCalculator className="inline mr-2 mb-1" />
                    {calculationType === "area" ? "面积" : "周长"}结果：
                  </h2>
                  <span className="text-3xl sm:text-4xl font-bold text-indigo-600 ml-2">
                    {formatNumber(calculatedValue, 2)}
                  </span>
                  {calculationType === "area" && <span className="text-xl text-indigo-600"> (平方单位)</span>}
                  {calculationType === "perimeter" && <span className="text-xl text-indigo-600"> (单位)</span>}
                </div>
                <p className="text-center text-sm text-gray-600">公式: {formula}</p>

                {/* Shape Visualization */}
                <div className="flex justify-center items-center min-h-[220px] md:min-h-[250px] py-4">
                  {displayWidth > 0 && displayHeight > 0 && (
                    <div
                      className={`relative border-2 transition-all duration-500 ease-out
                        ${calculationType === 'area' ? 'bg-indigo-100 border-indigo-500 animate-pulse-slow' : 'border-purple-500'}
                        ${calculationType === 'perimeter' ? 'border-4 animate-pulse-perimeter' : ''}
                      `}
                      style={{
                        width: `${displayWidth}px`,
                        height: `${displayHeight}px`,
                      }}
                    >
                      <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-700 bg-white px-1 rounded">
                        {shapeType === 'rectangle' ? `长: ${formatNumber(parseFloat(length))}` : `边: ${formatNumber(parseFloat(side))}`}
                      </span>
                      {shapeType === 'rectangle' && (
                        <span className="absolute -left-12 top-1/2 transform -translate-y-1/2 -rotate-90 text-xs text-gray-700 bg-white px-1 rounded">
                          宽: {formatNumber(parseFloat(width))}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div> {/* End of Right Column */}

        </div> {/* End of Main content flex container */}
      </div>
  );
}

// Remember to add custom animations to tailwind.config.js or a global CSS file:
/*
@layer utilities {
  @keyframes pulse-perimeter {
    0%, 100% { box-shadow: 0 0 0 0px rgba(168, 85, 247, 0.6); } // purple-500
    50% { box-shadow: 0 0 0 8px rgba(168, 85, 247, 0); }
  }
  .animate-pulse-perimeter {
    animation: pulse-perimeter 2s infinite;
  }

  @keyframes pulse-slower { // Custom slower pulse for area
    0%, 100% { opacity: 1; background-color: #e0e7ff; } // indigo-100
    50% { opacity: .6; background-color: #c7d2fe; } // indigo-200 (a bit darker for pulse)
  }
  .animate-pulse-slow {
     animation: pulse-slower 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
}
*/