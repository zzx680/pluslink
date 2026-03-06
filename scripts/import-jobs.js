const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// CSV 文件路径
const csvFilePath = '/Users/charlie/Downloads/jobs.csv';
const jobsFilePath = path.join(__dirname, '../data/jobs.json');

// 存储解析后的职位数据
const jobs = [];

// 读取现有的 jobs.json
let existingJobs = [];
try {
  const content = fs.readFileSync(jobsFilePath, 'utf-8');
  existingJobs = JSON.parse(content);
  console.log(`已加载 ${existingJobs.length} 个现有职位`);
} catch (error) {
  console.log('未找到现有职位数据，将创建新文件');
}

// 解析 CSV 并转换为 Job 格式
fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    // 跳过空行
    if (!row.title || row.title.trim() === '') {
      return;
    }

    // 提取公司名称（从 id 列或单独的公司名称列）
    let companyName = row.id || '未知公司';

    // 如果 id 是数字，说明这是旧格式，公司名称可能在其他地方
    if (!isNaN(companyName)) {
      // 尝试从描述中提取公司名称
      const descLines = (row.description || '').split('\n');
      for (const line of descLines) {
        if (line.includes('公司') || line.includes('介绍')) {
          companyName = line.replace(/【|】|公司介绍|公司/g, '').trim();
          break;
        }
      }
      if (companyName === row.id) {
        companyName = '未知公司';
      }
    }

    // 解析技能要求
    let requirements = '';
    if (row.required_skills) {
      try {
        const skills = row.required_skills
          .replace(/[{}]/g, '')
          .split(',')
          .filter(s => s.trim())
          .join('、');
        if (skills) {
          requirements = `技能要求：${skills}\n\n`;
        }
      } catch (e) {
        // 忽略解析错误
      }
    }

    // 从描述中提取地点、工作方式、职位类型
    const description = row.description || '';
    let baseLocation = '未指定';
    let workType = 'hybrid'; // 默认混合
    let employmentType = 'both'; // 默认都可以

    // 提取地点
    const locationMatch = description.match(/工作地点[：:]\s*([^\n]+)/i) ||
                         description.match(/地点[：:]\s*([^\n]+)/i) ||
                         description.match(/(北京|上海|深圳|杭州|广州|成都|苏州|南京|武汉|西安|济南)/);
    if (locationMatch) {
      baseLocation = locationMatch[1] || locationMatch[0];
      baseLocation = baseLocation.trim().split(/[，,、]/)[0]; // 取第一个地点
    }

    // 提取工作方式
    if (description.match(/线下|现场|到岗/i)) {
      workType = 'offline';
    } else if (description.match(/线上|远程/i)) {
      workType = 'online';
    }

    // 提取职位类型
    if (description.match(/实习/i) && !description.match(/全职/i)) {
      employmentType = 'intern';
    } else if (description.match(/全职/i) && !description.match(/实习/i)) {
      employmentType = 'full-time';
    }

    // 提取联系方式
    let contact = '';
    const emailMatch = description.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    const wechatMatch = description.match(/微信[：:]\s*([^\s\n]+)/i) ||
                       description.match(/wechat[：:]\s*([^\s\n]+)/i);

    if (emailMatch) {
      contact = emailMatch[1];
    } else if (wechatMatch) {
      contact = `微信: ${wechatMatch[1]}`;
    }

    // 创建 Job 对象
    const job = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      companyName: companyName,
      title: row.title.trim(),
      description: description.trim(),
      requirements: requirements + (description.trim()),
      contact: contact || '请查看职位详情',
      baseLocation: baseLocation,
      workType: workType,
      employmentType: employmentType,
      createdAt: new Date().toISOString()
    };

    jobs.push(job);
  })
  .on('end', () => {
    console.log(`\n成功解析 ${jobs.length} 个职位`);

    // 合并现有职位和新职位
    const allJobs = [...existingJobs, ...jobs];

    // 写入文件
    fs.writeFileSync(jobsFilePath, JSON.stringify(allJobs, null, 2));
    console.log(`已将 ${allJobs.length} 个职位写入 ${jobsFilePath}`);

    // 显示前 3 个职位作为示例
    console.log('\n导入的职位示例：');
    jobs.slice(0, 3).forEach((job, index) => {
      console.log(`\n${index + 1}. ${job.companyName} - ${job.title}`);
      console.log(`   地点: ${job.baseLocation}`);
      console.log(`   类型: ${job.employmentType === 'intern' ? '实习' : job.employmentType === 'full-time' ? '全职' : '实习/全职'}`);
      console.log(`   工作方式: ${job.workType === 'online' ? '线上' : job.workType === 'offline' ? '线下' : '混合'}`);
    });
  })
  .on('error', (error) => {
    console.error('导入失败:', error);
  });
