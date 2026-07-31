interface BadgeProps {
  label: string;
  variant: 'blue' | 'green' | 'amber' | 'red' | 'gray' | 'orange' | 'purple';
  size?: 'sm' | 'md';
  dot?: boolean;
}

const variantStyles: Record<BadgeProps['variant'], string> = {
  blue: 'bg-blue-50 text-blue-700 border border-blue-200',
  green: 'bg-green-50 text-green-700 border border-green-200',
  amber: 'bg-amber-50 text-amber-700 border border-amber-200',
  red: 'bg-red-50 text-red-700 border border-red-200',
  gray: 'bg-gray-100 text-gray-600 border border-gray-200',
  orange: 'bg-orange-50 text-orange-700 border border-orange-200',
  purple: 'bg-purple-50 text-purple-700 border border-purple-200',
};

const dotStyles: Record<BadgeProps['variant'], string> = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
  gray: 'bg-gray-400',
  orange: 'bg-orange-500',
  purple: 'bg-purple-500',
};

export function StatusBadge({ label, variant, size = 'sm', dot = false }: BadgeProps) {
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${padding} ${variantStyles[variant]}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[variant]}`} />}
      {label}
    </span>
  );
}

// Helper functions to get badge variant from status strings
export function getUserStatusBadge(status: string): BadgeProps {
  if (status === 'active') return { label: 'Đang hoạt động', variant: 'green', dot: true };
  return { label: 'Tạm khóa', variant: 'red', dot: true };
}

export function getProfileStatusBadge(status: string): BadgeProps {
  const map: Record<string, BadgeProps> = {
    pending: { label: 'Chờ duyệt', variant: 'amber', dot: true },
    approved: { label: 'Đã duyệt', variant: 'green', dot: true },
    rejected: { label: 'Bị từ chối', variant: 'red', dot: true },
    locked: { label: 'Tạm khóa', variant: 'red', dot: true },
  };
  return map[status] || { label: status, variant: 'gray' };
}

export function getReviewStatusBadge(status: string): BadgeProps {
  const map: Record<string, BadgeProps> = {
    pending: { label: 'Chờ duyệt', variant: 'amber', dot: true },
    approved: { label: 'Đã duyệt', variant: 'green', dot: true },
    rejected: { label: 'Bị từ chối', variant: 'red', dot: true },
  };
  return map[status] || { label: status, variant: 'gray' };
}

export function getPublicationStatusBadge(status: string): BadgeProps {
  const map: Record<string, BadgeProps> = {
    unpublished: { label: 'Chưa công bố', variant: 'gray' },
    scheduled: { label: 'Chờ hiển thị', variant: 'blue', dot: true },
    selling: { label: 'Đang bán', variant: 'green', dot: true },
    hidden: { label: 'Tạm ẩn', variant: 'amber', dot: true },
    stopped: { label: 'Ngừng bán', variant: 'gray' },
    expired: { label: 'Hết hạn', variant: 'gray' },
    sold_out: { label: 'Hết số lượng', variant: 'orange' },
  };
  return map[status] || { label: status, variant: 'gray' };
}

export function getOrderStatusBadge(status: string): BadgeProps {
  const map: Record<string, BadgeProps> = {
    created: { label: 'Đã tạo', variant: 'gray' },
    pending_payment: { label: 'Chờ thanh toán', variant: 'amber', dot: true },
    paid: { label: 'Đã thanh toán', variant: 'green', dot: true },
    pending_refund: { label: 'Chờ hoàn tiền', variant: 'amber', dot: true },
    refunded: { label: 'Đã hoàn tiền', variant: 'blue' },
    cancelled: { label: 'Đã hủy', variant: 'red' },
    refund_rejected: { label: 'Từ chối hoàn tiền', variant: 'red' },
  };
  return map[status] || { label: status, variant: 'gray' };
}

export function getPaymentStatusBadge(status: string): BadgeProps {
  const map: Record<string, BadgeProps> = {
    pending: { label: 'Chờ thanh toán', variant: 'amber' },
    success: { label: 'Thành công', variant: 'green' },
    failed: { label: 'Thất bại', variant: 'red' },
    refunded_sim: { label: 'Hoàn tiền mô phỏng', variant: 'blue' },
  };
  return map[status] || { label: status, variant: 'gray' };
}

export function getVoucherCodeStatusBadge(status: string): BadgeProps {
  const map: Record<string, BadgeProps> = {
    not_issued: { label: 'Chưa phát hành', variant: 'gray' },
    issued: { label: 'Đã phát hành', variant: 'blue' },
    generation_error: { label: 'Lỗi sinh mã', variant: 'red', dot: true },
    unused: { label: 'Chưa sử dụng', variant: 'green' },
    used: { label: 'Đã sử dụng', variant: 'gray' },
    expired: { label: 'Hết hạn', variant: 'gray' },
    cancelled: { label: 'Bị hủy', variant: 'red' },
    disabled: { label: 'Vô hiệu hóa', variant: 'red' },
  };
  return map[status] || { label: status, variant: 'gray' };
}

export function getContentStatusBadge(status: string): BadgeProps {
  const map: Record<string, BadgeProps> = {
    visible: { label: 'Đang hiển thị', variant: 'green', dot: true },
    hidden: { label: 'Tạm ẩn', variant: 'amber', dot: true },
    stopped: { label: 'Ngừng hiển thị', variant: 'gray' },
  };
  return map[status] || { label: status, variant: 'gray' };
}

export function getLogResultBadge(result: string): BadgeProps {
  if (result === 'success') return { label: 'Thành công', variant: 'green' };
  return { label: 'Thất bại', variant: 'red' };
}
