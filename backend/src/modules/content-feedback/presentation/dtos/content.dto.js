function buildContentDto(item) {
  if (!item) return null;
  
  const statusMap = {
    'Dang hien thi': 'visible',
    'Tam an': 'hidden',
    'Ngung hien thi': 'stopped'
  };

  return {
    id: item.ma_nd,
    type: item.loai,
    title: item.tieu_de,
    content: item.noi_dung,
    status: statusMap[item.trang_thai] || item.trang_thai,
    createdAt: item.ngay_tao,
    updatedAt: item.ngay_cap_nhat,
  };
}

module.exports = { buildContentDto };
