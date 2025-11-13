import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL 和 ANON KEY 未配置！请检查环境变量');
  throw new Error('Supabase configuration is missing');
}

// 创建 Supabase 客户端
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // 服务端不需要持久化会话
    autoRefreshToken: false,
  },
  db: {
    schema: 'public',
  },
});

console.log('Supabase 客户端初始化成功');

export default supabase;
