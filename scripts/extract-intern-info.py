#!/usr/bin/env python3
import json
from PIL import Image
import pytesseract
import os

# 图片文件路径
image_dir = '/Users/charlie/pluslink/public/实习生简历'
images = [
    '截屏2026-03-06 上午10.15.26.png',
    '截屏2026-03-06 上午10.15.38.png',
    '截屏2026-03-06 上午10.15.44.png'
]

# 读取现有实习生数据
interns_file = '/Users/charlie/pluslink/data/interns.json'
try:
    with open(interns_file, 'r', encoding='utf-8') as f:
        existing_interns = json.load(f)
    print(f"已加载 {len(existing_interns)} 个现有实习生")
except:
    existing_interns = []
    print("未找到现有实习生数据，将创建新文件")

interns = []

# 处理每张图片
for img_name in images:
    img_path = os.path.join(image_dir, img_name)
    print(f"\n处理图片: {img_name}")

    try:
        # 打开图片
        img = Image.open(img_path)

        # 使用 OCR 提取文字
        text = pytesseract.image_to_string(img, lang='chi_sim+eng')

        print("提取的文字:")
        print(text)
        print("-" * 80)

    except Exception as e:
        print(f"处理图片失败: {e}")

print("\n请手动查看提取的文字，然后我会帮你创建导入脚本")
