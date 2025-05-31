"use client";

import Link from "next/link";
import { useState } from "react";

// ... (problems, categories, levels arrays)
const problems = [
  {
    title: "鸡兔同笼问题",
    path: "chicken-rabbit",
    description: "根据头数和脚数计算鸡和兔的数量。",
    category: "数学",
    level: "简单",
  },
  {
    title: "小数乘法",
    path: "decimal-mul",
    description: "输入两个小数，计算它们的乘积。",
    category: "数学",
    level: "简单",
  },
  {
    title: "小数除法",
    path: "decimal-div",
    description: "输入两个小数，计算它们的商。",
    category: "数学",
    level: "简单",
  },
  {
    title: "简易方程",
    path: "simple-eq",
    description: "求解一元一次方程 ax + b = c。",
    category: "数学",
    level: "中等",
  },
  {
    title: "列出因数",
    path: "list-factors",
    description: "列出一个数的所有因数。",
    category: "数学",
    level: "中等",
  },
  {
    title: "分数运算",
    path: "fraction-cal",
    description: "分数四则运算。",
    category: "数学",
    level: "中等",
  },
  {
    title: "平均数计算",
    path: "average-cal",
    description: "可视化平均数计算。",
    category: "数学",
    level: "中等",
  },
  {
    title: "质数判断",
    path: "prime-check",
    description: "判断一个正整数是否是质数。",
    category: "数学",
    level: "中等",
  },
  {
    title: "最大公约数",
    path: "greatest-common-divisor",
    description: "输入两个数，求最大公约数。",
    category: "数学",
    level: "困难",
  },
  {
    title: "最小公倍数",
    path: "least-common-multiple",
    description: "输入两个数，求最小公倍数",
    category: "数学",
    level: "困难",
  },
  {
    title: "长方形周长面积",
    path: "rectangle-cal",
    description: "计算长方形和正方形的边长或面积",
    category: "数学",
    level: "中等",
  },
  {
    title: "杠杆平衡计算",
    path: "lever-balance",
    description: "根据力与距离计算杠杆是否平衡。",
    category: "物理",
    level: "中等",
  },
  {
    title: "酸碱中和反应",
    path: "acid-base",
    description: "判断酸碱中和产物。",
    category: "化学",
    level: "困难",
  },
];

const categories = ["数学", "物理", "化学"];
const levels = ["简单", "中等", "困难"];

const FIXED_CARD_HEIGHT_NUM = 190; // px
const CARD_GAP_NUM = 24; // px, for gap-6 (1.5rem)

// --- CONFIGURABLE VALUES ---
// These need to be accurate based on your actual Navbar, Footer, and main padding.
// Use browser dev tools to measure them if unsure.
const NAVBAR_HEIGHT_PX = 64; // Example: if your Navbar is 64px tall
const FOOTER_HEIGHT_PX = 48; // Example: if your Footer is 48px tall
const MAIN_VERTICAL_PADDING_PX = 32 * 2; // Example: if main has py-8 (2rem * 16px/rem * 2 for top and bottom)
const SIDEBAR_TOP_MARGIN_PX = 16; // Desired space between Navbar and sticky sidebar

// --- CALCULATED VALUES ---
const STICKY_SIDEBAR_TOP_OFFSET_CSS = `${
  NAVBAR_HEIGHT_PX + SIDEBAR_TOP_MARGIN_PX
}px`;

// This is the crucial offset for the bottom part of the sticky sidebar's maxHeight.
// It represents space below the "active" content area of the page.
const STICKY_SIDEBAR_BOTTOM_PAGE_OFFSET_CSS = `${
  FOOTER_HEIGHT_PX + MAIN_VERTICAL_PADDING_PX / 2 + 16
}px`; // Footer + main-padding-bottom + some buffer

// Target minimum height for the right content section (e.g., for 2 rows of cards)
const RIGHT_SECTION_TARGET_MIN_CONTENT_HEIGHT =
  FIXED_CARD_HEIGHT_NUM * 2 + CARD_GAP_NUM;

export default function Home() {
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);

  function toggleSelection(
    current: string[],
    setCurrent: (v: string[]) => void,
    value: string
  ) {
    if (current.includes(value)) {
      setCurrent(current.filter((v) => v !== value));
    } else {
      setCurrent([...current, value]);
    }
  }

  const filtered = problems.filter((p) => {
    const matchText = `${p.title}${p.path}${p.description}`
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(p.category);
    const matchLevel =
      selectedLevels.length === 0 || selectedLevels.includes(p.level);
    return matchText && matchCategory && matchLevel;
  });

  return (
    <>
      {/* Main content: Ensure py-8 or similar is applied here as assumed in calculations */}
      <main className="flex flex-col lg:flex-row lg:gap-x-8 max-w-7xl w-full mx-auto px-4 py-8 min-h-screen">
        <aside
          className={`w-full lg:w-72 lg:flex-shrink-0 lg:sticky self-start 
              p-4 rounded-lg shadow-md bg-white mb-6 lg:mb-0
              lg:overflow-y-auto`}
          style={{
            top: STICKY_SIDEBAR_TOP_OFFSET_CSS,
            maxHeight: `calc(100vh - ${STICKY_SIDEBAR_TOP_OFFSET_CSS} - ${STICKY_SIDEBAR_BOTTOM_PAGE_OFFSET_CSS})`,
          }}
        >
          {/* ... (aside content) ... */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="搜索问题..."
              className="w-full p-3 rounded-xl border-2 border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <div className="font-semibold mb-2 text-gray-700">分类</div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() =>
                    toggleSelection(
                      selectedCategories,
                      setSelectedCategories,
                      cat
                    )
                  }
                  className={`px-3 py-1.5 rounded-full border text-sm cursor-pointer transition shadow-sm ${
                    selectedCategories.includes(cat)
                      ? "bg-blue-500 text-white border-blue-600 hover:bg-blue-600"
                      : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-blue-100 hover:border-blue-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="font-semibold mb-2 text-gray-700">难度</div>
            <div className="flex flex-wrap gap-2">
              {levels.map((lev) => (
                <button
                  key={lev}
                  onClick={() =>
                    toggleSelection(selectedLevels, setSelectedLevels, lev)
                  }
                  className={`px-3 py-1.5 rounded-full border text-sm cursor-pointer transition shadow-sm ${
                    selectedLevels.includes(lev)
                      ? "bg-amber-500 text-white border-amber-500 hover:bg-amber-600"
                      : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-amber-100 hover:border-amber-300"
                  }`}
                >
                  {lev}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 flex-1"
          style={{
            minHeight: `${FIXED_CARD_HEIGHT_NUM * 3 + CARD_GAP_NUM * 2}px`,
          }} // 3行卡片
        >
          {filtered.length === 0 ? (
            <div
              className="col-span-full text-center text-gray-500 py-10 flex flex-col justify-center items-center"
              style={{
                minHeight: `${FIXED_CARD_HEIGHT_NUM * 3 + CARD_GAP_NUM * 2}px`,
              }}
            >
              <p className="text-xl mb-2">😅</p>
              没有找到匹配的问题。
              <p className="text-sm mt-2">请尝试调整筛选条件或搜索关键词。</p>
            </div>
          ) : (
            filtered.map((p) => {
              const categoryColors: Record<string, string> = {
                /* ... */
              };
              const levelColors: Record<string, string> = {
                /* ... */
              };
              categoryColors["数学"] = "bg-sky-100 text-sky-700 border-sky-300";
              categoryColors["物理"] =
                "bg-indigo-100 text-indigo-700 border-indigo-300";
              categoryColors["化学"] =
                "bg-pink-100 text-pink-700 border-pink-300";
              levelColors["简单"] =
                "bg-green-100 text-green-700 border-green-300";
              levelColors["中等"] =
                "bg-orange-100 text-orange-700 border-orange-300";
              levelColors["困难"] = "bg-red-100 text-red-700 border-red-300";
              return (
                <Link
                  key={p.path}
                  href={`/${p.path}`}
                  className="flex flex-col bg-white border border-gray-200 p-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 overflow-hidden"
                  style={{ height: `${FIXED_CARD_HEIGHT_NUM}px` }}
                >
                  <h3 className="text-lg font-bold text-blue-700 mb-1 pb-1 flex-shrink-0">
                    {p.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 flex-grow overflow-hidden">
                    {p.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto pt-2 border-t border-gray-100 flex-shrink-0">
                    <span
                      className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full select-none border ${
                        categoryColors[p.category] ||
                        "bg-gray-100 text-gray-700 border-gray-300"
                      }`}
                    >
                      {p.category}
                    </span>
                    <span
                      className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full select-none border ${
                        levelColors[p.level] ||
                        "bg-gray-100 text-gray-700 border-gray-300"
                      }`}
                    >
                      {p.level}
                    </span>
                  </div>
                </Link>
              );
            })
          )}
        </section>
      </main>
    </>
  );
}
