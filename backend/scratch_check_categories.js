const supabase = require("./src/config/supabase");

async function checkCategories() {
  const { data, error } = await supabase
    .from("danh_muc")
    .select("*");

  console.log("Categories in DB:", JSON.stringify(data, null, 2));
}

checkCategories();
