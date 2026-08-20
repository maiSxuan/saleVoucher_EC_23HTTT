import React from "react";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function SiteFooter() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-slate-800 bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-6 px-4 py-6 sm:px-6 md:grid-cols-12 lg:px-8">
        <div className="space-y-2 md:col-span-4">
          <Link to="/" className="inline-flex items-center gap-2" aria-label="Snow Voucher - về trang chủ">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-sky-400 to-blue-500 text-sm text-white">
              ❄️
            </span>
            <span className="text-lg font-extrabold tracking-tight text-white">Snow Voucher</span>
          </Link>
          <p className="max-w-xs text-[11px] leading-snug text-slate-400">
            {t("footer.slogan", "Sàn e-voucher hàng đầu Việt Nam. Cam kết 100% voucher chính hãng & đổi quà trực tiếp.")}
          </p>
        </div>

        <address className="space-y-1.5 text-xs not-italic text-slate-300 md:col-span-5">
          <a href="mailto:nkngan23@clc.fitus.edu.vn" className="flex items-center gap-2 transition-colors hover:text-white">
            <Mail size={13} className="shrink-0 text-sky-400" aria-hidden="true" />
            <span><strong className="text-slate-200">Email:</strong> nkngan23@clc.fitus.edu.vn</span>
          </a>
          <a href="tel:0967456832" className="flex items-center gap-2 transition-colors hover:text-white">
            <Phone size={13} className="shrink-0 text-sky-400" aria-hidden="true" />
            <span><strong className="text-slate-200">{t("footer.phone", "SĐT:")}</strong> 0967456832</span>
          </a>
          <div className="flex items-start gap-2">
            <MapPin size={13} className="mt-0.5 shrink-0 text-sky-400" aria-hidden="true" />
            <span><strong className="text-slate-200">{t("footer.address", "Địa chỉ:")}</strong> {t("footer.addressDetail", "227 Nguyễn Văn Cừ, Chợ Quán, TP. Hồ Chí Minh")}</span>
          </div>
        </address>

        <div className="flex flex-col justify-center space-y-1 md:col-span-3 md:items-end">
          <Link
            to="/policy"
            className="inline-flex items-center gap-1.5 py-1 text-xs font-bold text-sky-400 underline decoration-sky-500/40 transition-colors hover:text-sky-300"
          >
            <ArrowRight size={14} aria-hidden="true" />
            <span>{t("footer.policyLink", "Điều khoản & Chính sách sàn")}</span>
          </Link>
        </div>
      </div>

      <div className="border-t border-slate-800/80 px-4 py-2.5 text-center text-[11px] text-slate-500">
        © 2026 Snow Voucher. All rights reserved. EC07-23HTTT-HCMUS.
      </div>
    </footer>
  );
}
