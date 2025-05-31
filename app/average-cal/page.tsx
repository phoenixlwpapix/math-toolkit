"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { FaPlus, FaTrash, FaCalculator } from 'react-icons/fa';

// Helper function to format numbers
const formatNumber = (num: number | null | undefined, precision: number = 2): string => {
  if (num === null || num === undefined) return "";
  if (Object.is(num, -0)) return "0";
  const numValue = Number(num);
  if (isNaN(numValue)) return "";

  const fixed = numValue.toFixed(precision);
  if (fixed.includes('.')) {
    // Remove trailing zeros after decimal, but keep if it's like X.0
    let floatVal = parseFloat(fixed);
    if (floatVal.toString() === fixed && precision === 0) return floatVal.toString(); // e.g. 10.0 with precision 0 should be 10
    return floatVal.toString();
  }
  return fixed;
};


interface DataPoint {
  id: string;
  value: string;
}

export default function AverageCalculatorVisualizer() {
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([
    { id: crypto.randomUUID(), value: "" },
    { id: crypto.randomUUID(), value: "" },
  ]);
  const [average, setAverage] = useState<number | null>(null);
  const [sum, setSum] = useState<number | null>(null);
  const [count, setCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);

  const MAX_BAR_HEIGHT = 180; // px, Max height for visualization bars
  const Y_AXIS_WIDTH = 45;    // px, space for Y-axis labels and ticks
  const X_AXIS_LABEL_AREA_HEIGHT = 30; // px, space below X-axis line for labels

  const handleInputChange = (id: string, inputValue: string) => {
    if (inputValue === "" || /^\d*\.?\d*$/.test(inputValue)) {
      setDataPoints(
        dataPoints.map((dp) =>
          dp.id === id ? { ...dp, value: inputValue } : dp
        )
      );
      setAverage(null); setSum(null); setCount(0); setError(null); setShowResults(false);
    }
  };

  const addDataPoint = () => {
    if (dataPoints.length < 10) {
      setDataPoints([...dataPoints, { id: crypto.randomUUID(), value: "" }]);
    } else {
      setError("最多只能添加10个数据点。");
    }
  };

  const removeDataPoint = (id: string) => {
    if (dataPoints.length > 1) {
      setDataPoints(dataPoints.filter((dp) => dp.id !== id));
      setAverage(null); setSum(null); setCount(0); setError(null); setShowResults(false);
    } else {
      setError("至少需要一个数据点。");
    }
  };

  const calculateAverage = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const validNumbers = dataPoints
      .map(dp => parseFloat(dp.value))
      .filter(num => !isNaN(num));

    if (validNumbers.length === 0) {
      setError("请输入至少一个有效的数字。");
      setAverage(null); setSum(null); setCount(0); setShowResults(false);
      return;
    }

    const currentSum = validNumbers.reduce((acc, curr) => acc + curr, 0);
    const currentCount = validNumbers.length;
    const currentAverage = currentSum / currentCount;

    setSum(currentSum);
    setCount(currentCount);
    setAverage(currentAverage);
    setShowResults(true);
  };

  const handleClear = () => {
    setDataPoints([
      { id: crypto.randomUUID(), value: "" },
      { id: crypto.randomUUID(), value: "" },
    ]);
    setAverage(null); setSum(null); setCount(0); setError(null); setShowResults(false);
  };

  const numbersForCalculation = dataPoints
    .map(dp => parseFloat(dp.value))
    .filter(num => !isNaN(num));
  const isFormValid = numbersForCalculation.length > 0;

  // Determine yAxisMax for scaling
  const currentMaxValue = numbersForCalculation.length > 0 ? Math.max(...numbersForCalculation, 0) : 0;
  let yAxisMax = 10;
  if (currentMaxValue > 0) {
    const niceNumberMagnitude = Math.pow(10, Math.floor(Math.log10(currentMaxValue)));
    yAxisMax = Math.ceil(currentMaxValue / niceNumberMagnitude) * niceNumberMagnitude;
    if (currentMaxValue > yAxisMax * 0.95) { // If max value is too close to the top, increase yAxisMax
        yAxisMax = Math.ceil((currentMaxValue * 1.1) / niceNumberMagnitude) * niceNumberMagnitude;
    }
    if (yAxisMax === 0 && currentMaxValue > 0) yAxisMax = currentMaxValue * 1.2; // Handle edge if currentMax is small
    if (yAxisMax < 5 && currentMaxValue > 0) yAxisMax = 5; // Ensure a minimum sensible yAxisMax
    else if (yAxisMax < 10 && currentMaxValue > 5) yAxisMax = 10;

  }
  if (yAxisMax === 0 && numbersForCalculation.length > 0 && numbersForCalculation.every(n => n === 0)) {
      yAxisMax = 1; // If all numbers are 0, set a small yAxisMax to show the 0 line
  }


  // Generate Y-axis ticks
  const numTicks = 5;
  const yAxisTicks = [];
  if (yAxisMax > 0) {
      for (let i = 0; i <= numTicks; i++) {
          const value = (yAxisMax / numTicks) * i;
          yAxisTicks.push({
            value: value,
            // Position from bottom of the MAX_BAR_HEIGHT area
            position: (value / yAxisMax) * MAX_BAR_HEIGHT,
          });
      }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 flex justify-center items-start p-4 sm:p-8">
      <div className="relative bg-white max-w-3xl w-full p-6 sm:p-8 rounded-xl shadow-xl space-y-8">

        <h1 className="text-2xl sm:text-3xl font-bold text-center text-blue-700 pt-8 sm:pt-6">
          平均数计算与可视化
        </h1>

        <form onSubmit={calculateAverage} className="space-y-6">
          <div>
            <label className="block text-md font-medium text-blue-700 mb-3">
              输入数据点 (数字):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
              {dataPoints.map((dp, index) => (
                <div key={dp.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={dp.value}
                    onChange={(e) => handleInputChange(dp.id, e.target.value)}
                    placeholder={`数据 ${index + 1}`}
                    className="flex-grow px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {dataPoints.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDataPoint(dp.id)}
                      className="p-2 text-red-500 hover:text-red-700"
                      aria-label="移除此数据点"
                    >
                      <FaTrash size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-start mt-3">
            <button
              type="button"
              onClick={addDataPoint}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 py-1 px-2 border border-blue-500 rounded hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={dataPoints.length >= 10}
            >
              <FaPlus size={14} /> 添加数据点
            </button>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full sm:w-auto bg-blue-600 text-white px-8 py-2.5 rounded-full text-lg transition-all duration-150 ease-in-out
                          ${isFormValid ? 'hover:bg-blue-700 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
            >
              计算平均数 <span role="img" aria-label="chart increasing">📊</span>
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="w-full sm:w-auto bg-gray-300 text-gray-700 px-8 py-2.5 rounded-full text-lg hover:bg-gray-400 transition-colors"
            >
              清空
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-center">
            {error}
          </div>
        )}

        {showResults && average !== null && (
            <div className="mt-8 pt-6 border-t-2 border-blue-200">
              {/* MODIFIED Results Display */}
              <div className="text-center mb-6"> {/* Centered container for title and result */}
                <h2 className="text-xl sm:text-2xl font-semibold text-blue-700 inline"> {/* Title inline */}
                  <FaCalculator className="inline mr-2 mb-1" /> 计算结果：
                </h2>
                <span className="text-3xl sm:text-4xl font-bold text-blue-600 ml-2"> {/* Result inline and larger */}
                  {formatNumber(average, 2)}
                </span>
              </div>

            {/* Visualization */}
            <div className="mt-8 bg-gray-50 p-4 rounded-lg overflow-x-auto">
              <h3 className="font-semibold text-md text-blue-900 mb-4 text-center">
                数据可视化
              </h3>
              {/* Chart Container: Y-axis + Bars Area + X-axis Label Area */}
              <div className="flex" style={{ height: `${MAX_BAR_HEIGHT + X_AXIS_LABEL_AREA_HEIGHT}px` }}>
                {/* Y-axis Area */}
                <div
                  className="relative flex flex-col justify-between items-end"
                  style={{ width: `${Y_AXIS_WIDTH}px`, height: `${MAX_BAR_HEIGHT}px`, paddingRight: '5px' }}
                >
                  {yAxisTicks.slice().reverse().map(tick => ( // Render from top to bottom (value-wise)
                    <div
                      key={`tick-${tick.value}`}
                      className="text-xs text-gray-500 flex items-center"
                      style={{ height: '1px' }} // For positioning text relative to this point
                    >
                      <span className="transform -translate-y-1/2">{formatNumber(tick.value, tick.value % 1 !== 0 ? 1 : 0)}</span>
                      <div className="w-1.5 h-px bg-gray-400 ml-1"></div>
                    </div>
                  ))}
                </div>

                {/* Bars and X-axis labels Area */}
                <div className="flex-grow flex flex-col">
                    {/* Bars Area (this is where bars are drawn, height is MAX_BAR_HEIGHT) */}
                    <div
                        className="relative flex justify-around items-end border-l border-b-2 border-blue-300"
                        style={{ height: `${MAX_BAR_HEIGHT}px` }}
                    >
                        {numbersForCalculation.map((num, index) => {
                        const barHeight = yAxisMax > 0 ? (num / yAxisMax) * MAX_BAR_HEIGHT : 0;
                        return (
                            <div
                                key={index}
                                className="bg-blue-500 w-8 sm:w-10 rounded-t-md transition-all duration-300 ease-out hover:bg-blue-600"
                                style={{ height: `${Math.max(barHeight, 0)}px` }} // Ensure non-negative height
                                title={formatNumber(num)}
                            >
                                {/* Bar itself */}
                            </div>
                        );
                        })}
                        {/* Average Line */}
                        {average !== null && numbersForCalculation.length > 0 && yAxisMax > 0 && (
                        <>
                            <div
                            className="absolute left-0 w-full border-t-2 border-dashed border-red-500"
                            style={{
                                bottom: `${(average / yAxisMax) * MAX_BAR_HEIGHT}px`,
                                zIndex: 10,
                            }}
                            ></div>
                            <span
                            className="absolute right-0 text-red-600 text-xs font-semibold whitespace-nowrap px-1 bg-gray-50 bg-opacity-80 rounded"
                            style={{
                                bottom: `${Math.max(((average / yAxisMax) * MAX_BAR_HEIGHT) - 6, -2)}px`,
                                transform: 'translateY(50%)', // Vertically center relative to the line
                                zIndex: 11,
                            }}
                            >
                            平均: {formatNumber(average)}
                            </span>
                        </>
                        )}
                    </div>
                    {/* X-axis Labels Area (below the bars area) */}
                    <div
                        className="flex justify-around items-start border-l border-transparent" // transparent border for alignment
                        style={{ height: `${X_AXIS_LABEL_AREA_HEIGHT}px`, paddingTop: '4px' }}
                    >
                        {numbersForCalculation.map((num, index) => (
                        <div
                            key={`label-${index}`}
                            className="w-8 sm:w-10 text-center text-xs text-blue-700"
                        >
                            {formatNumber(num)}
                        </div>
                        ))}
                    </div>
                </div>

              </div>
            </div>
            {/* End of Visualization */}
          </div>
        )}
      </div>
    </div>
  );
}