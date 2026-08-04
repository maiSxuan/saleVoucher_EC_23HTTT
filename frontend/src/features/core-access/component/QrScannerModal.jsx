/**
 * FILE: frontend/src/features/core-access/components/QrScannerModal.jsx
 * PURPOSE: Modal quét mã QR THẬT trực tiếp qua Camera thiết bị (Webcam/Camera điện thoại) bằng thư viện `html5-qrcode`.
 *
 * Tính năng nổi bật:
 * 1. Gọi trực tiếp Camera thiết bị (Webcam laptop hoặc Camera điện thoại) qua Web MediaDevices API.
 * 2. Tự động nhận diện mã QR trong luồng video thời gian thực (Realtime Stream).
 * 3. Hỗ trợ chuyển đổi Camera (Camera trước / Camera sau).
 * 4. Hỗ trợ quét từ file ảnh chứa mã QR tải lên từ máy tính/điện thoại.
 * 5. Hiệu ứng quét sống động (Scanner laser line, âm thanh bíp thành công).
 */

import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, X, RefreshCw, Upload, AlertCircle, CheckCircle2, Zap } from 'lucide-react';

export default function QrScannerModal({ isOpen, onClose, onScanSuccess }) {
  const [activeTab, setActiveTab] = useState('camera'); // 'camera' | 'file'
  const [cameras, setCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [fileScanError, setFileScanError] = useState(null);
  const [scanSuccessText, setScanSuccessText] = useState(null);

  const scannerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Khởi tạo và quản lý Camera Scanner
  useEffect(() => {
    if (!isOpen || activeTab !== 'camera') {
      stopCameraScanner();
      return;
    }

    let isMounted = true;

    async function initCamera() {
      setCameraError(null);
      setScanSuccessText(null);

      try {
        // Lấy danh sách camera khả dụng trên thiết bị
        const devices = await Html5Qrcode.getCameras();
        if (!isMounted) return;

        if (!devices || devices.length === 0) {
          setCameraError('Không tìm thấy thiết bị camera nào trên máy của bạn.');
          return;
        }

        setCameras(devices);
        // Mặc định chọn camera sau nếu có, hoặc camera đầu tiên
        const defaultCam = devices.find(d => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('sau')) || devices[0];
        const camId = selectedCameraId || defaultCam.id;
        setSelectedCameraId(camId);

        startCameraScanner(camId);
      } catch (err) {
        if (!isMounted) return;
        console.error('[QrScannerModal] Lỗi khởi tạo camera:', err);
        setCameraError('Không thể truy cập camera. Vui lòng cấp quyền truy cập camera cho trình duyệt trong cài đặt.');
      }
    }

    // Delay nhỏ để đảm bảo element #qr-reader-box đã mount vào DOM
    const timer = setTimeout(() => {
      initCamera();
    }, 200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      stopCameraScanner();
    };
  }, [isOpen, activeTab, selectedCameraId]);

  // Bắt đầu luồng quét camera
  const startCameraScanner = async (cameraId) => {
    if (scannerRef.current) {
      await stopCameraScanner();
    }

    const readerElement = document.getElementById('qr-reader-box');
    if (!readerElement) return;

    try {
      const html5QrCode = new Html5Qrcode('qr-reader-box');
      scannerRef.current = html5QrCode;

      const config = {
        fps: 15,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };

      await html5QrCode.start(
        cameraId,
        config,
        (decodedText) => {
          handleSuccessScan(decodedText);
        },
        () => {
          // Lỗi frame quét (bỏ qua khi camera đang tìm mã)
        }
      );

      setIsScanning(true);
      setCameraError(null);
    } catch (err) {
      console.error('[QrScannerModal] Lỗi khi start scanner:', err);
      setIsScanning(false);
      setCameraError('Không thể kích hoạt luồng camera: ' + (err.message || 'Lỗi không xác định'));
    }
  };

  // Dừng luồng quét camera an toàn
  const stopCameraScanner = async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
      } catch (err) {
        console.warn('[QrScannerModal] Lỗi khi stop scanner:', err);
      }
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  // Xử lý khi quét thành công mã QR
  const handleSuccessScan = (rawText) => {
    if (!rawText) return;

    // Chuẩn hóa mã: Nếu chuỗi dạng "ECQR:EC26-FOOD-A1B2" -> trích xuất "EC26-FOOD-A1B2"
    let cleanCode = rawText.trim();
    if (cleanCode.startsWith('ECQR:')) {
      cleanCode = cleanCode.replace('ECQR:', '').trim();
    } else if (cleanCode.startsWith('VOUCHER:')) {
      cleanCode = cleanCode.replace('VOUCHER:', '').trim();
    }

    // Hiển thị trạng thái thành công
    setScanSuccessText(cleanCode);

    // Âm thanh bíp phản hồi nhanh
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // Nốt La cao (880Hz)
      osc.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {
      // Audio không khả dụng
    }

    // Đóng scanner và truyền mã ra ngoài sau 400ms
    setTimeout(() => {
      stopCameraScanner();
      onScanSuccess(cleanCode);
      onClose();
    }, 450);
  };

  // Quét từ file ảnh tải lên
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileScanError(null);
    try {
      const html5QrCode = new Html5Qrcode('qr-file-dummy');
      const decodedText = await html5QrCode.scanFile(file, true);
      html5QrCode.clear();
      handleSuccessScan(decodedText);
    } catch (err) {
      console.error('[QrScannerModal] Lỗi quét ảnh:', err);
      setFileScanError('Không tìm thấy mã QR trong ảnh vừa tải lên. Vui lòng chọn ảnh rõ nét hơn.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Quét mã QR Voucher</h3>
              <p className="text-xs text-slate-500">Camera thời gian thực & tải ảnh</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              stopCameraScanner();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-100 px-6 pt-3 bg-white">
          <button
            type="button"
            onClick={() => setActiveTab('camera')}
            className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'camera'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Camera trực tiếp</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('file')}
            className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'file'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Tải ảnh QR từ máy</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex-1 flex flex-col items-center justify-center bg-slate-950 min-h-[380px]">
          {activeTab === 'camera' ? (
            <div className="w-full flex flex-col items-center">
              {/* Camera Controls */}
              {cameras.length > 1 && (
                <div className="w-full flex items-center justify-between mb-3 text-xs text-slate-300">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Chọn Camera:</span>
                  </span>
                  <select
                    value={selectedCameraId || ''}
                    onChange={(e) => setSelectedCameraId(e.target.value)}
                    className="bg-slate-800 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 text-xs focus:outline-none focus:border-emerald-500"
                  >
                    {cameras.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label || `Camera ${c.id.slice(0, 5)}...`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Viewport Khung Camera */}
              <div className="relative w-full max-w-sm aspect-square bg-slate-900 rounded-2xl overflow-hidden border-2 border-emerald-500/50 shadow-inner flex items-center justify-center">
                {/* Div mount html5-qrcode */}
                <div id="qr-reader-box" className="w-full h-full" />

                {/* Laser animation line */}
                {isScanning && !scanSuccessText && (
                  <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#10b981] animate-pulse pointer-events-none" />
                )}

                {/* Success Overlay */}
                {scanSuccessText && (
                  <div className="absolute inset-0 bg-emerald-950/90 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-90 duration-150">
                    <CheckCircle2 className="w-16 h-16 text-emerald-400 mb-2 animate-bounce" />
                    <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Đã quét thành công</span>
                    <span className="font-mono text-lg font-bold text-white mt-1 break-all">{scanSuccessText}</span>
                  </div>
                )}

                {/* Error overlay */}
                {cameraError && (
                  <div className="absolute inset-0 bg-slate-900/95 flex flex-col items-center justify-center p-6 text-center">
                    <AlertCircle className="w-12 h-12 text-rose-400 mb-2" />
                    <p className="text-xs text-rose-200 mb-4">{cameraError}</p>
                    <button
                      type="button"
                      onClick={() => selectedCameraId && startCameraScanner(selectedCameraId)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Thử lại Camera</span>
                    </button>
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-400 mt-4 text-center">
                Hướng camera vào mã QR voucher. Hệ thống sẽ tự động nhận diện và tra cứu.
              </p>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center justify-center py-6">
              {/* Dummy element for file scan */}
              <div id="qr-file-dummy" className="hidden" />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full max-w-sm aspect-video border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl bg-slate-900/50 hover:bg-slate-900 transition-all flex flex-col items-center justify-center cursor-pointer p-6 text-center group"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-800 group-hover:bg-emerald-600/20 text-slate-400 group-hover:text-emerald-400 flex items-center justify-center mb-3 transition-colors">
                  <Upload className="w-7 h-7" />
                </div>
                <span className="text-sm font-semibold text-slate-200 group-hover:text-white">
                  Nhấp để tải ảnh mã QR
                </span>
                <span className="text-xs text-slate-500 mt-1">Hỗ trợ PNG, JPG, WEBP</span>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {fileScanError && (
                <div className="mt-4 flex items-center gap-2 text-xs text-rose-400 bg-rose-950/50 border border-rose-900/60 px-4 py-2.5 rounded-xl max-w-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{fileScanError}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-white border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Chuẩn ISO/IEC 18004</span>
          <button
            type="button"
            onClick={() => {
              stopCameraScanner();
              onClose();
            }}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
