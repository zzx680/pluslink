#!/usr/bin/env python3
import csv
import json
import re
from datetime import datetime
import random
import string

# 文件路径
csv_file = '/Users/charlie/Downloads/jobs.csv'
jobs_file = '/Users/charlie/pluslink/data/jobs.json'

# 读取现有职位
try:
    with open(jobs_file, 'r', encoding='utf-8') as f:
        existing_jobs = json.load(f)
    print(f"已加载 {len(existing_jobs)} 个现有职位")
except:
    existing_jobs = []
    print("未找到现有职位数据，将创建新文件")

jobs = []

# 读取 CSV
with open(csv_file, 'r', encoding='utf-8-sig') as f:
    reader = csv.DictReader(f)

    for row in reader:
        # 获取 id 列作为公司名称
        company_name = row.get('id', '').strip()

        # 跳过空行
        if not company_name or not row.get('title', '').strip():
            continue

        # 如果 id 是纯数字，跳过这一行（删除数字 id 的职位）
        if company_name.isdigit():
            print(f"跳过数字 ID: {company_name} - {row.get('title', '')}")
            continue

        # 提取其他字段
        title = row.get('title', '').strip()
        description = row.get('description', '').strip()
        required_skills = row.get('required_skills', '').strip()

        # 解析技能要求
        requirements = ''
        if required_skills:
            try:
                skills = required_skills.replace('{', '').replace('}', '').split(',')
                skills = [s.strip() for s in skills if s.strip()]
                if skills:
                    requirements = f"技能要求：{'、'.join(skills)}\n\n"
            except:
                pass

        # 从描述中提取地点
        base_location = '未指定'
        location_patterns = [
            r'工作地点[：:]\s*([^\n]+)',
            r'地点[：:]\s*([^\n]+)',
            r'(北京|上海|深圳|杭州|广州|成都|苏州|南京|武汉|西安|济南|重庆|天津|长沙|郑州|厦门|青岛|大连|宁波|合肥|福州)'
        ]
        for pattern in location_patterns:
            match = re.search(pattern, description, re.IGNORECASE)
            if match:
                base_location = match.group(1) if match.lastindex else match.group(0)
                base_location = base_location.strip().split('，')[0].split(',')[0]
                break

        # 提取工作方式
        work_type = 'hybrid'
        if re.search(r'线下|现场|到岗', description, re.IGNORECASE):
            work_type = 'offline'
        elif re.search(r'线上|远程', description, re.IGNORECASE):
            work_type = 'online'

        # 提取职位类型
        employment_type = 'both'
        has_intern = bool(re.search(r'实习', description, re.IGNORECASE))
        has_fulltime = bool(re.search(r'全职', description, re.IGNORECASE))

        if has_intern and not has_fulltime:
            employment_type = 'intern'
        elif has_fulltime and not has_intern:
            employment_type = 'full-time'

        # 提取联系方式
        contact = ''
        email_match = re.search(r'([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})', description)
        wechat_match = re.search(r'(?:微信|wechat)[：:]\s*([^\s\n]+)', description, re.IGNORECASE)

        if email_match:
            contact = email_match.group(1)
        elif wechat_match:
            contact = f"微信: {wechat_match.group(1)}"
        else:
            contact = '请查看职位详情'

        # 生成唯一 ID
        job_id = str(int(datetime.now().timestamp() * 1000)) + ''.join(random.choices(string.ascii_lowercase + string.digits, k=9))

        # 创建职位对象
        job = {
            'id': job_id,
            'companyName': company_name,
            'title': title,
            'description': description,
            'requirements': requirements + description,
            'contact': contact,
            'baseLocation': base_location,
            'workType': work_type,
            'employmentType': employment_type,
            'createdAt': datetime.now().isoformat()
        }

        jobs.append(job)
        print(f"✓ {company_name} - {title}")

print(f"\n成功解析 {len(jobs)} 个职位")

# 合并并写入
all_jobs = existing_jobs + jobs
with open(jobs_file, 'w', encoding='utf-8') as f:
    json.dump(all_jobs, f, ensure_ascii=False, indent=2)

print(f"已将 {len(all_jobs)} 个职位写入 {jobs_file}")

# 显示统计
print("\n公司统计：")
companies = {}
for job in jobs:
    company = job['companyName']
    companies[company] = companies.get(company, 0) + 1

for company, count in sorted(companies.items(), key=lambda x: x[1], reverse=True):
    print(f"  {company}: {count} 个职位")
