// Repository tầng data.
// Nơi thao tác dữ liệu, hiện tại dùng mock dữ liệu tạm.

const feedbacks = [];

async function findAll() {
  return feedbacks;
}

async function create(payload) {
  const item = {
    id: Date.now().toString(),
    ...payload,
    createdAt: new Date().toISOString(),
  };
  feedbacks.push(item);
  return item;
}

module.exports = {
  findAll,
  create,
};
