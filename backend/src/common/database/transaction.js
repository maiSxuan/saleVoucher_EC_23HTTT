/**
 * Purpose: Mẫu wrapper cho transaction database.
 * Sau này có thể dùng để mở transaction khi thao tác nhiều bảng.
 */
async function withTransaction(client, callback) {
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
}

module.exports = {
  withTransaction,
};
