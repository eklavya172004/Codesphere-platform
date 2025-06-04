// components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import classNames from "classnames";

const links = [
  { name: "LeetCode", href: "/dashboard/leetcode" },
  { name: "Codeforces", href: "/dashboard/Codeforces" },
  { name: "Codechefs", href: "/dashboard/Codechefs" },
  {name:"Github",href:"/dashboard/Github"}
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64  relative h-full   p-4">
      <h2 className="text-xl font-bold mb-6 text-black dark:text-white">Dashboard</h2>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={classNames(
              "block px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700 text-black dark:text-white",
              {
                "bg-gray-300 dark:bg-gray-700 font-bold": pathname === link.href,
              }
            )}
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
