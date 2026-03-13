import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dxsnvhcfnrypfpqxncfh.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4c252aGNmbnJ5cGZwcXhuY2ZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMjM1NDgsImV4cCI6MjA4ODc5OTU0OH0.sRKJoBtnHE_jWDORi7q0VPjePvPPnWgO-ApiFJeooNM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkInviteCodes() {
  console.log('检查 Supabase 连接...');
  console.log('URL:', supabaseUrl);
  
  const { data, error } = await supabase
    .from('invite_codes')
    .select('*');
  
  if (error) {
    console.error('❌ 错误:', error.message);
    return;
  }
  
  console.log('✅ 连接成功！');
  console.log('邀请码数据:', data);
}

checkInviteCodes();
