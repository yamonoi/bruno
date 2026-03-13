"use client";

import Image from "next/image";
import HomeSvg from "@/icons/home.svg";
import BarChartSvg from "@/icons/bar.svg";
import LayersSvg from "@/icons/layers.svg";
import CheckDoneSvg from "@/icons/check-done.svg";
import PieSvg from "@/icons/pie.svg";
import SettingsSvg from "@/icons/settings.svg";

export default function Sidebar() {
  const navItems = [
    { label: "Home", icon: HomeSvg, active: false },
    { label: "Analytics", icon: BarChartSvg, active: false },
    { label: "Documents", icon: LayersSvg, active: false },
    {
      label: "CheckDone",
      icon: CheckDoneSvg,
      active: false,
    },
    { label: "Pie", icon: PieSvg, active: false },
  ];

  return (
    <div
      className="flex flex-col items-center shrink-0 py-4"
      style={{
        width: 64,
        background: "#ffffff",
        borderRight: "1px solid #e5e7eb",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Logo */}
      <div className="mb-8 mt-2">
        <div
          className="flex items-center justify-center rounded-xl"
          style={{ width: 36, height: 36 }}
        >
          <Image src="/icons/logo.svg" width={36} height={36} alt="Bruno" />
        </div>
      </div>

      {/* Nav icons */}
      <nav className="flex flex-col items-center gap-4 flex-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            title={item.label}
            className="flex items-center justify-center rounded-xl transition-colors"
            style={{
              width: 40,
              height: 40,
              background: item.active ? "#eff6ff" : "transparent",
              cursor: "pointer",
              border: "none",
            }}
          >
            <item.icon
              width={24}
              height={24}
              style={{ color: item.active ? "#2563eb" : "#6b7280" }}
              stroke={item.active ? "#2563eb" : "#6b7280"}
            />
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div className="flex flex-col items-center gap-2 mb-2">
        <button
          title="Settings"
          className="flex items-center justify-center rounded-xl transition-colors hover:bg-[#f3f4f6]"
          style={{
            width: 40,
            height: 40,
            background: "#F2F4F7",
            cursor: "pointer",
            border: "none",
          }}
        >
          <SettingsSvg width={24} height={24} />
        </button>
        <div
          className="flex items-center justify-center rounded-full text-xs font-semibold"
          style={{
            width: 32,
            height: 32,
            background: "#F2F4F7",
            color: "#475467",
          }}
        >
          UK
        </div>
      </div>
    </div>
  );
}
