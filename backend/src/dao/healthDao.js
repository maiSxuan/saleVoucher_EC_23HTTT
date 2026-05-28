const supabase = require("../config/supabase");

async function getDatabaseStatus() {
  const { data, error } = await supabase.from("users").select("id").limit(1);

  if (error) {
    return {
      provider: "supabase",
      type: "postgresql",
      mode: "cloud",
      status: "error",
      message: error.message,
    };
  }

  return {
    provider: "supabase",
    type: "postgresql",
    mode: "cloud",
    status: "connected",
    sampleRows: data?.length || 0,
  };
}

module.exports = {
  getDatabaseStatus,
};
