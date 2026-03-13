import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dxsnvhcfnrypfpqxncfh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4c252aGNmbnJ5cGZwcXhuY2ZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMjM1NDgsImV4cCI6MjA4ODc5OTU0OH0.sRKJoBtnHE_jWDORi7q0VPjePvPPnWgO-ApiFJeooNM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateCodes() {
  // 删除旧的邀请码
  const { error: deleteError } = await supabase
    .from('invite_codes')
    .delete()
    .in('code', ['COMPANY2025', 'INTERN2025', 'ADMIN2025']);
  
  if (deleteError) {
    console.error('删除旧邀请码失败:', deleteError.message);
  } else {
    console.log('✅ 旧邀请码已删除');
  }
  
  // 插入新的6位邀请码
  const { error: insertError } = await supabase
    .from('invite_codes')
    .insert([
      { code: 'COMP25', type: 'company', used: false },
      { code: 'INT25A', type: 'intern', used: false },
      { code: 'ADM25A', type: 'admin', used: false }
    ]);
  
  if (insertError) {
    console.error('插入新邀请码失败:', insertError.message);
  } else {
    console.log('✅ 新的6位邀请码已创建');
  }
  
  // 验证
  const { data, error } = await supabase.from('invite_codes').select('*');
  console.log('\n当前邀请码列表:');
  data.forEach(c => console.log(`  ${c.code} (${c.type}) - used: ${c.used}`));
}

updateCodes();
