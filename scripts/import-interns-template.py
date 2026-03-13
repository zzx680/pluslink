#!/usr/bin/env python3
import json
from datetime import datetime
import random
import string

# 实习生数据模板
# 请根据截图填写以下信息
interns_data = [
    {
        "name": "张三",  # 姓名
        "education": "北京大学 计算机科学 本科",  # 学历
        "position": "前端开发实习生",  # 奇绩实习岗位
        "internshipPeriod": "2026-03 - 2026-08",  # 实习时间
        "contact": "13800138000",  # 联系方式
        "startDate": "随时",  # 可入职时间
        "baseLocation": "北京",  # Base地点
        "workType": "hybrid",  # 工作方式: online/offline/hybrid
        "employmentType": "intern",  # 期望职位类型: intern/full-time/both
        "inviteCode": "INTERN2025"  # 使用的邀请码
    },
    # 添加更多实习生...
]

# 读取现有数据
interns_file = '/Users/charlie/pluslink/data/interns.json'
try:
    with open(interns_file, 'r', encoding='utf-8') as f:
        existing_interns = json.load(f)
    print(f"已加载 {len(existing_interns)} 个现有实习生")
except:
    existing_interns = []
    print("未找到现有实习生数据，将创建新文件")

# 生成唯一 ID
def generate_id():
    return str(int(datetime.now().timestamp() * 1000)) + ''.join(random.choices(string.ascii_lowercase + string.digits, k=9))

# 转换数据
new_interns = []
for data in interns_data:
    intern = {
        'id': generate_id(),
        'inviteCode': data['inviteCode'],
        'name': data['name'],
        'education': data['education'],
        'position': data['position'],
        'internshipPeriod': data['internshipPeriod'],
        'contact': data['contact'],
        'startDate': data['startDate'],
        'baseLocation': data['baseLocation'],
        'workType': data['workType'],
        'employmentType': data['employmentType'],
        'createdAt': datetime.now().isoformat()
    }
    new_interns.append(intern)
    print(f"✓ {intern['name']} - {intern['position']}")

# 合并并写入
all_interns = existing_interns + new_interns
with open(interns_file, 'w', encoding='utf-8') as f:
    json.dump(all_interns, f, ensure_ascii=False, indent=2)

print(f"\n成功导入 {len(new_interns)} 个实习生")
print(f"总计 {len(all_interns)} 个实习生")
