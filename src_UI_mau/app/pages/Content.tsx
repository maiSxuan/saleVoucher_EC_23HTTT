import { useState } from "react";
import { FileText, Eye, EyeOff, StopCircle, Plus, X, Edit2, LayoutGrid } from "lucide-react";
import { toast } from "sonner";
import { mockContent, contentTypeLabels, type ContentItem, type ContentType, type ContentStatus } from "../data/mockData";
import { StatusBadge, getContentStatusBadge } from "../components/ui/StatusBadge";
import { ConfirmModal } from "../components/ui/ConfirmModal";

const CONTENT_TYPES: ContentType[] = ['category', 'banner', 'article', 'popup', 'policy'];

export default function Content() {
  const [items, setItems] = useState<ContentItem[]>(mockContent);
  const [activeType, setActiveType] = useState<ContentType>('category');
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const [hideModal, setHideModal] = useState<ContentItem | null>(null);
  const [stopModal, setStopModal] = useState<ContentItem | null>(null);
  const [showModal, setShowModal] = useState<ContentItem | null>(null);
  const [createModal, setCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [confirmCreate, setConfirmCreate] = useState(false);
  const [confirmUpdate, setConfirmUpdate] = useState(false);

  const filtered = items.filter(i => i.type === activeType);

  const counts = CONTENT_TYPES.reduce((acc, t) => {
    const typeItems = items.filter(i => i.type === t);
    acc[t] = {
      total: typeItems.length,
      visible: typeItems.filter(i => i.status === 'visible').length,
      hidden: typeItems.filter(i => i.status === 'hidden').length,
      stopped: typeItems.filter(i => i.status === 'stopped').length,
    };
    return acc;
  }, {} as Record<ContentType, { total: number; visible: number; hidden: number; stopped: number }>);

  const updateStatus = (id: string, status: ContentStatus, action: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status, updatedAt: new Date().toLocaleString('vi-VN'), updatedBy: 'Admin Hệ thống' } : i));
    if (selectedItem?.id === id) setSelectedItem(prev => prev ? { ...prev, status } : null);
  };

  const doHide = () => {
    if (!hideModal) return;
    updateStatus(hideModal.id, 'hidden', 'Tạm ẩn');
    setHideModal(null);
    toast.success('Đã tạm ẩn nội dung.', { description: 'Nội dung không còn hiển thị với người dùng nhưng dữ liệu được giữ nguyên.' });
  };

  const doStop = () => {
    if (!stopModal) return;
    updateStatus(stopModal.id, 'stopped', 'Ngừng hiển thị');
    setStopModal(null);
    toast.success('Đã ngừng hiển thị nội dung.');
  };

  const doShow = () => {
    if (!showModal) return;
    updateStatus(showModal.id, 'visible', 'Công bố');
    setShowModal(null);
    toast.success('Đã công bố nội dung. Hiển thị trên giao diện người dùng.');
  };

  const doCreate = () => {
    if (!newTitle.trim()) return;
    const newItem: ContentItem = {
      id: `CT${Date.now()}`,
      type: activeType,
      title: newTitle.trim(),
      status: 'visible',
      updatedAt: new Date().toLocaleString('vi-VN'),
      updatedBy: 'Admin Hệ thống',
    };
    setItems(prev => [...prev, newItem]);
    setConfirmCreate(false);
    setCreateModal(false);
    setNewTitle('');
    toast.success('Đã tạo và công bố nội dung mới.');
  };

  const doUpdate = () => {
    if (!selectedItem) return;
    setItems(prev => prev.map(i => i.id === selectedItem.id ? { ...i, title: editTitle, content: editContent, updatedAt: new Date().toLocaleString('vi-VN'), updatedBy: 'Admin Hệ thống' } : i));
    setSelectedItem(prev => prev ? { ...prev, title: editTitle, content: editContent } : null);
    setConfirmUpdate(false);
    setEditMode(false);
    toast.success('Đã cập nhật và công bố nội dung.');
  };

  const typeColorMap: Record<ContentType, string> = {
    category: 'bg-blue-50 text-blue-700 border border-blue-200',
    banner: 'bg-purple-50 text-purple-700 border border-purple-200',
    article: 'bg-green-50 text-green-700 border border-green-200',
    popup: 'bg-amber-50 text-amber-700 border border-amber-200',
    policy: 'bg-gray-100 text-gray-700 border border-gray-200',
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý nội dung</h1>
        <p className="text-sm text-gray-500 mt-1">Quản lý danh mục, banner, bài viết, popup và chính sách.</p>
      </div>

      {/* Content Hub Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
        {CONTENT_TYPES.map(type => {
          const c = counts[type];
          return (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`bg-white border rounded-xl p-3 text-left transition-all ${activeType === type ? 'border-blue-400 shadow-md' : 'border-gray-200 hover:shadow'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeColorMap[type]}`}>{contentTypeLabels[type]}</span>
              </div>
              <div className="text-xl font-bold text-gray-900">{c.total}</div>
              <div className="text-xs text-gray-400 mt-1 space-y-0.5">
                <div className="flex justify-between"><span>Hiển thị</span><span className="text-green-600 font-medium">{c.visible}</span></div>
                <div className="flex justify-between"><span>Tạm ẩn</span><span className="text-amber-600 font-medium">{c.hidden}</span></div>
                <div className="flex justify-between"><span>Ngừng</span><span className="text-gray-500 font-medium">{c.stopped}</span></div>
              </div>
            </button>
          );
        })}
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">
            {contentTypeLabels[activeType]} ({filtered.length})
          </h3>
          <button
            onClick={() => { setCreateModal(true); setNewTitle(''); }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={14} /> Tạo mới
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-gray-400">
            <LayoutGrid size={40} className="mb-2" />
            <p className="text-sm">Chưa có nội dung nào trong nhóm này.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {['Tên / Tiêu đề', 'Vị trí hiển thị', 'Trạng thái', 'Cập nhật lúc', 'Người cập nhật', 'Hành động'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(item => {
                  const sb = getContentStatusBadge(item.status);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.title}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{item.displayPosition || '—'}</td>
                      <td className="px-4 py-3"><StatusBadge {...sb} /></td>
                      <td className="px-4 py-3 text-xs text-gray-500">{item.updatedAt}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{item.updatedBy}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => { setSelectedItem(item); setEditTitle(item.title); setEditContent(item.content || ''); setEditMode(false); }}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                            title="Xem / Chỉnh sửa"
                          >
                            <Edit2 size={14} />
                          </button>
                          {item.status !== 'hidden' && item.status !== 'stopped' && (
                            <button
                              onClick={() => setHideModal(item)}
                              className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded"
                              title="Tạm ẩn"
                            >
                              <EyeOff size={14} />
                            </button>
                          )}
                          {item.status === 'hidden' && (
                            <button
                              onClick={() => setShowModal(item)}
                              className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
                              title="Công bố lại"
                            >
                              <Eye size={14} />
                            </button>
                          )}
                          {item.status !== 'stopped' && (
                            <button
                              onClick={() => setStopModal(item)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                              title="Ngừng hiển thị"
                            >
                              <StopCircle size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail / Edit Drawer */}
      {selectedItem && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => { setSelectedItem(null); setEditMode(false); }} />
          <div className="relative w-full max-w-lg bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">{editMode ? 'Chỉnh sửa nội dung' : 'Chi tiết nội dung'}</h3>
              <button onClick={() => { setSelectedItem(null); setEditMode(false); }} className="p-1 rounded hover:bg-gray-100 text-gray-400">
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 p-5 overflow-y-auto">
              {!editMode ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <StatusBadge {...getContentStatusBadge(selectedItem.status)} />
                    <span className={`text-xs px-2 py-0.5 rounded-full ${typeColorMap[selectedItem.type]}`}>{contentTypeLabels[selectedItem.type]}</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Tiêu đề</p>
                    <p className="font-medium text-gray-900">{selectedItem.title}</p>
                  </div>
                  {selectedItem.displayPosition && (
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Vị trí hiển thị</p>
                      <p className="text-gray-700">{selectedItem.displayPosition}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Cập nhật lúc</p>
                    <p className="text-gray-700">{selectedItem.updatedAt} bởi {selectedItem.updatedBy}</p>
                  </div>
                  <div className="flex gap-2 pt-3">
                    <button
                      onClick={() => setEditMode(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Edit2 size={13} /> Chỉnh sửa
                    </button>
                    {selectedItem.status !== 'visible' && (
                      <button onClick={() => setShowModal(selectedItem)} className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">
                        Công bố
                      </button>
                    )}
                    {selectedItem.status === 'visible' && (
                      <button onClick={() => setHideModal(selectedItem)} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                        Tạm ẩn
                      </button>
                    )}
                    {selectedItem.status !== 'stopped' && (
                      <button onClick={() => setStopModal(selectedItem)} className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">
                        Ngừng hiển thị
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề <span className="text-red-500">*</span></label>
                    <input
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
                    <textarea
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      rows={6}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700">
                    Rời khỏi mà chưa lưu sẽ hủy tất cả thay đổi. Nội dung hiện tại được giữ nguyên.
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setConfirmUpdate(true)}
                      disabled={!editTitle.trim()}
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      Cập nhật và công bố
                    </button>
                    <button
                      onClick={() => { setEditMode(false); setEditTitle(selectedItem.title); setEditContent(selectedItem.content || ''); }}
                      className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Hủy chỉnh sửa
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create modal */}
      {createModal && !confirmCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setCreateModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Tạo mới {contentTypeLabels[activeType]}</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề <span className="text-red-500">*</span></label>
                <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Nhập tiêu đề..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setCreateModal(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Hủy</button>
              <button onClick={() => { if (newTitle.trim()) setConfirmCreate(true); }} disabled={!newTitle.trim()} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                Tạo mới và công bố
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <ConfirmModal
        open={confirmCreate}
        onClose={() => setConfirmCreate(false)}
        onConfirm={() => doCreate()}
        title="Xác nhận tạo và công bố"
        description={`Nội dung "${newTitle}" sẽ được tạo mới và công bố ngay lập tức.`}
        afterStatus="Đang hiển thị"
        consequences={['Nội dung sẽ xuất hiện ngay trên giao diện người dùng.']}
        confirmLabel="Tạo mới và công bố"
      />

      <ConfirmModal
        open={confirmUpdate}
        onClose={() => setConfirmUpdate(false)}
        onConfirm={() => doUpdate()}
        title="Xác nhận cập nhật và công bố"
        description={`Nội dung "${selectedItem?.title}" sẽ được cập nhật và công bố.`}
        beforeStatus="Dữ liệu hiện tại"
        afterStatus="Dữ liệu mới được công bố"
        consequences={['Giao diện người dùng sẽ cập nhật nội dung mới.']}
        confirmLabel="Cập nhật và công bố"
      />

      <ConfirmModal
        open={!!hideModal}
        onClose={() => setHideModal(null)}
        onConfirm={() => doHide()}
        title="Tạm ẩn nội dung"
        targetName={hideModal?.title}
        beforeStatus="Đang hiển thị"
        afterStatus="Tạm ẩn"
        description="Đây là ẩn tạm thời — dữ liệu không bị xóa. Có thể công bố lại bất kỳ lúc nào."
        consequences={['Không còn hiển thị trên giao diện người dùng.', 'Dữ liệu được giữ nguyên.']}
        confirmLabel="Xác nhận tạm ẩn"
      />

      <ConfirmModal
        open={!!stopModal}
        onClose={() => setStopModal(null)}
        onConfirm={() => doStop()}
        title="Ngừng hiển thị nội dung"
        targetName={stopModal?.title}
        beforeStatus="Đang hiển thị"
        afterStatus="Ngừng hiển thị"
        warning="Nội dung sẽ bị ẩn khỏi toàn bộ giao diện người dùng. Đây là thao tác có ảnh hưởng rộng."
        consequences={['Bị ẩn khỏi tất cả giao diện người dùng.', 'Dữ liệu vẫn được giữ trong hệ thống.']}
        confirmLabel="Xác nhận ngừng hiển thị"
        confirmVariant="danger"
      />

      <ConfirmModal
        open={!!showModal}
        onClose={() => setShowModal(null)}
        onConfirm={() => doShow()}
        title="Công bố nội dung"
        targetName={showModal?.title}
        afterStatus="Đang hiển thị"
        consequences={['Nội dung sẽ xuất hiện trên giao diện người dùng.']}
        confirmLabel="Xác nhận công bố"
      />
    </div>
  );
}
