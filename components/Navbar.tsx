import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-800">
          数理化工具箱
        </Link>
        <nav className="space-x-6">
          <Link href="/" className="text-gray-700 hover:text-green-700">
            首页
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-green-700">
            关于
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-green-700">
            联系我们
          </Link>
        </nav>
      </div>
    </header>
  );
}
