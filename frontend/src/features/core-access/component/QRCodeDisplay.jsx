/**
 * FILE: frontend/src/features/core-access/components/QrCodeDisplay.jsx
 * PURPOSE: Component sinh mã QR Code THẬT từ chuỗi voucher_code bằng thư viện `qrcode`.
 *
 * Tính năng:
 * - Render Canvas QR code độ sắc nét cao theo chuẩn ISO/IEC 18004.
 * - Hỗ trợ nút tải ảnh QR (.png) về máy.
 * - Hỗ trợ nút sao chép mã code nhanh vào clipboard.
 */

import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Download, Copy, Check, QrCode as QrIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function QrCodeDisplay({
  value,
  size = 200,
  title,
  subtitle,
  showDownload = true,
  className = '',
}) {
  const { t } = useTranslation();
  const canvasRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  const displayTitle = title || t('Mã QR Voucher');
  const displaySubtitle = subtitle || t('Đưa mã này cho nhân viên tại quầy để sử dụng');

  useEffect(() => {
    if (!value || !canvasRef.current) return;

    QRCode.toCanvas(
      canvasRef.current,
      value,
      {
        width: size,
        margin: 2,
        color: {
          dark: '#0f172a', // Slate 900
          light: '#ffffff',
        },
        errorCorrectionLevel: 'M',
      },
      (err) => {
        if (err) {
          console.error('[QrCodeDisplay] Lỗi sinh mã QR:', err);
          setError(t('Không thể tạo mã QR'));
        } else {
          setError(null);
        }
      }
    );
  }, [value, size, t]);

  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `QR_${value || 'voucher'}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  if (!value) return null;

  return (
    <div className={`flex flex-col items-center p-5 bg-white rounded-2xl border border-slate-200 shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-2 text-slate-800 font-semibold text-sm">
        <QrIcon className="w-4 h-4 text-emerald-600" />
        <span>{t(displayTitle)}</span>
      </div>

      {displaySubtitle && (
        <p className="text-xs text-slate-500 mb-3 text-center">{t(displaySubtitle)}</p>
      )}

      {/* Canvas QR Code Thật */}
      <div className="p-2 bg-white rounded-xl border border-slate-100 shadow-inner flex items-center justify-center">
        {error ? (
          <div className="w-48 h-48 flex items-center justify-center text-rose-500 text-xs font-medium">
            {error}
          </div>
        ) : (
          <canvas ref={canvasRef} className="rounded-lg max-w-full" />
        )}
      </div>

      {/* Code Text & Copy */}
      <div className="mt-3 w-full flex items-center justify-between gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono">
        <span className="font-bold text-slate-800 tracking-wider truncate">{value}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="p-1 text-slate-500 hover:text-emerald-600 transition-colors"
          title={t("Sao chép mã")}
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Actions */}
      {showDownload && (
        <button
          type="button"
          onClick={handleDownload}
          className="mt-3 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{t("Tải ảnh QR (.png)")}</span>
        </button>
      )}
    </div>
  );
}
