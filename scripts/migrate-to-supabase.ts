/**
 * 数据迁移脚本：将本地 JSON 数据导入 Supabase
 *
 * 使用方法：
 * 1. 确保 .env.local 文件已配置 Supabase 凭据
 * 2. 运行: npx tsx scripts/migrate-to-supabase.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// 手动加载 .env.local 文件
function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    content.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').replace(/^["']|["']$/g, '');
          if (!process.env[key]) {
            process.env[key] = value;
          }
        }
      }
    });
  }
}

loadEnvFile();

// 从环境变量获取配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('请设置 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY 环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateData() {
  console.log('开始迁移数据到 Supabase...\n');

  const dataDir = path.join(process.cwd(), 'data');

  // 迁移实习生数据
  try {
    const internsPath = path.join(dataDir, 'interns.json');
    if (fs.existsSync(internsPath)) {
      const interns = JSON.parse(fs.readFileSync(internsPath, 'utf-8'));
      console.log(`找到 ${interns.length} 条实习生数据`);

      for (const intern of interns) {
        const { error } = await supabase.from('interns').upsert({
          id: intern.id,
          invite_code: intern.inviteCode,
          name: intern.name,
          education: intern.education,
          position: intern.position,
          internship_period: intern.internshipPeriod,
          contact: intern.contact,
          start_date: intern.startDate,
          base_location: intern.baseLocation,
          work_type: intern.workType,
          employment_type: intern.employmentType,
          resume_url: intern.resumeUrl,
          recommendation: intern.recommendation,
          recommended_by: intern.recommendedBy,
          created_at: intern.createdAt,
        });

        if (error) {
          console.error(`迁移实习生 ${intern.name} 失败:`, error.message);
        } else {
          console.log(`✓ 迁移实习生: ${intern.name}`);
        }
      }
    }
  } catch (error) {
    console.error('迁移实习生数据出错:', error);
  }

  console.log('');

  // 迁移职位数据
  try {
    const jobsPath = path.join(dataDir, 'jobs.json');
    if (fs.existsSync(jobsPath)) {
      const jobs = JSON.parse(fs.readFileSync(jobsPath, 'utf-8'));
      console.log(`找到 ${jobs.length} 条职位数据`);

      for (const job of jobs) {
        const { error } = await supabase.from('jobs').upsert({
          id: job.id,
          company_name: job.companyName,
          cohort: job.cohort,
          website: job.website,
          title: job.title,
          description: job.description,
          requirements: job.requirements,
          contact: job.contact,
          base_location: job.baseLocation,
          work_type: job.workType,
          employment_type: job.employmentType,
          created_at: job.createdAt,
        });

        if (error) {
          console.error(`迁移职位 ${job.title} 失败:`, error.message);
        } else {
          console.log(`✓ 迁移职位: ${job.title} @ ${job.companyName}`);
        }
      }
    }
  } catch (error) {
    console.error('迁移职位数据出错:', error);
  }

  console.log('');

  // 迁移邀请码数据
  try {
    const codesPath = path.join(dataDir, 'invite-codes.json');
    if (fs.existsSync(codesPath)) {
      const codes = JSON.parse(fs.readFileSync(codesPath, 'utf-8'));
      console.log(`找到 ${codes.length} 条邀请码数据`);

      for (const code of codes) {
        const { error } = await supabase.from('invite_codes').upsert({
          code: code.code,
          type: code.type,
          used: code.used,
          used_by: code.usedBy,
          used_at: code.usedAt,
          created_at: code.createdAt,
        });

        if (error) {
          console.error(`迁移邀请码 ${code.code} 失败:`, error.message);
        } else {
          console.log(`✓ 迁移邀请码: ${code.code} (${code.type})`);
        }
      }
    }
  } catch (error) {
    console.error('迁移邀请码数据出错:', error);
  }

  console.log('\n数据迁移完成！');
}

migrateData().catch(console.error);
