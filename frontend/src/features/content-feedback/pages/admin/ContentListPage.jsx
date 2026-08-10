import { useState } from "react";
import { Plus, LayoutGrid } from "lucide-react";
import { toast } from "sonner";
import { useContent } from "../../hooks/useContent";
import ContentTable from "../../components/ContentTable";
import ContentForm from "../../components/ContentForm";
import { ConfirmModal } from "../../components/ui/ConfirmModal"; // Giả định path này

const CONTENT_TYPES = ['banner', 'bai_viet', 'popup', 'chinh_sach'];
const contentTypeLabels = {
  banner: 'Banner',
  bai_viet: 'Bài viết',
  popup: 'Popup',
  chinh_sach: 'Chính sách'
};

const typeColorMap = {
  banner: 'bg-purple-50 text-purple-700 border border-purple-200',
  bai_viet: 'bg-green-50 text-green-700 border border-green-200',
  popup: 'bg-amber-50 text-amber-700 border border-amber-200',
  chinh_sach: 'bg-gray-100 text-gray-700 border border-gray-200',
};

export default function ContentListPage() {
  const [activeType, setActiveType] = useState('banner');
  const { data: items, loading, isUpdating, error, create, update, remove } = useContent();
  const [selectedItem, setSelectedItem] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Modals state
  const [hideModal, setHideModal] = useState(null);
  const [stopModal, setStopModal] = useState(null);
  const [showModal, setShowModal] = useState(null);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  const filtered = items ? items.filter(i => i.type === activeType) : [];

  const counts = CONTENT_TYPES.reduce((acc, t) => {
    const typeItems = items ? items.filter(i => i.type === t) : [];
    acc[t] = {
      total: typeItems.length,
      visible: typeItems.filter(i => i.status === 'visible').length,
      hidden: typeItems.filter(i => i.status === 'hidden').length,
      stopped: typeItems.filter(i => i.status === 'stopped').length,
    };
    return acc;
  }, {});

  const handleStatusChange = async (item, newStatus) => {
    await update(item.id, { ...item, trang_thai: newStatus });
    toast.success(`Đã cập nhật trạng thái thành công.`);
  };

  const handleCreate = async (formData) => {
    await create({ 
      loai: activeType, 
      tieu_de: formData.title, 
      noi_dung: formData.content, 
      trang_thai: 'Dang hien thi', 
      matk_admin: 'UUID_ADMIN_EXAMPLE' 
    });
    setIsFormOpen(false);
    toast.success('Đã tạo nội dung mới thành công.');
  };

  const handleUpdate = async (formData) => {
    await update(selectedItem.id, { 
      ...selectedItem, 
      tieu_de: formData.title, 
      noi_dung: formData.content 
    });
    setSelectedItem(null);
    setIsFormOpen(false);
    toast.success('Đã cập nhật nội dung.');
  };
  const doHide = async () => {
    if (!hideModal) return;
    await update(hideModal.id, { status: 'hidden' });
    setHideModal(null);
    toast.success('Đã tạm ẩn nội dung.');
  };

  const doStop = async () => {
    if (!stopModal) return;
    await update(stopModal.id, { status: 'stopped' });
    setStopModal(null);
    toast.success('Đã ngừng hiển thị nội dung.');
  };

  const doShow = async () => {
    if (!showModal) return;
    await update(showModal.id, { status: 'visible' });
    setShowModal(null);
    toast.success('Đã công bố nội dung.');
  };

  return (
    <div className="min-h-screen bg-white text-gray-900"> {/* THÊM DÒNG NÀY */}
      <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý nội dung</h1>
        </div>
        {isUpdating && <div className="text-sm text-blue-600 animate-pulse">Đang cập nhật...</div>}
      </div>


      {/* Summary Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-5">
        {CONTENT_TYPES.map(type => (
          <button key={type} onClick={() => setActiveType(type)} className={`p-4 border rounded-xl transition-all ${activeType === type ? 'border-blue-500 shadow-md bg-blue-50/30' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeColorMap[type]}`}>{contentTypeLabels[type]}</span>
            <div className="text-2xl font-bold mt-2 text-gray-900">{counts[type]?.total || 0}</div>
            <div className="mt-3 text-[11px] text-gray-500 space-y-1">
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500"></span>Hiển thị: {counts[type]?.visible || 0}</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span>Tạm ẩn: {counts[type]?.hidden || 0}</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"></span>Ngừng: {counts[type]?.stopped || 0}</div>
            </div>
          </button>
        ))}
      </div>


        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex justify-between px-5 py-3 border-b">
            <h3 className="font-semibold">{contentTypeLabels[activeType]}</h3>
            <button onClick={() => { setSelectedItem(null); setIsFormOpen(true); }} className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm flex items-center gap-1">
              <Plus size={14} /> Tạo mới
            </button>
          </div>
          <ContentTable 
            items={filtered} 
            onEdit={(item) => { setSelectedItem(item); setIsFormOpen(true); }}
            onHide={(item) => setHideModal(item)}
            onShow={(item) => setShowModal(item)}
            onStop={(item) => setStopModal(item)}
          />
        </div>

        {/* Form Modal/Drawer */}
        {isFormOpen && (
          <ContentForm 
            initialData={selectedItem} 
            onSubmit={selectedItem ? handleUpdate : handleCreate} 
            onCancel={() => setIsFormOpen(false)}
          />
        )}

        {/* Confirm Modals */}
        <ConfirmModal
          open={!!hideModal}
          onClose={() => setHideModal(null)}
          onConfirm={doHide}
          title="Tạm ẩn nội dung"
          description={`Bạn có chắc chắn muốn tạm ẩn "${hideModal?.title}"?`}
          confirmLabel="Xác nhận"
        />
        <ConfirmModal
          open={!!showModal}
          onClose={() => setShowModal(null)}
          onConfirm={doShow}
          title="Công bố nội dung"
          description={`Bạn có chắc chắn muốn công bố "${showModal?.title}"?`}
          confirmLabel="Xác nhận"
        />
        <ConfirmModal
          open={!!stopModal}
          onClose={() => setStopModal(null)}
          onConfirm={doStop}
          title="Ngừng hiển thị"
          description={`Bạn có chắc chắn muốn ngừng hiển thị "${stopModal?.title}"?`}
          confirmLabel="Xác nhận"
          confirmVariant="danger"
        />
      </div>
    </div>
  );
}
