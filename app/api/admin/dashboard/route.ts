import { NextResponse } from 'next/server';
import { getInterns, getJobs, getInviteCodes, getAllProfileViews } from '@/lib/data';

export async function GET() {
  try {
    const [interns, jobs, inviteCodes, allViews] = await Promise.all([
      getInterns(),
      getJobs(),
      getInviteCodes(),
      getAllProfileViews(),
    ]);

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const newInternsThisWeek = interns.filter(i => new Date(i.createdAt) > oneWeekAgo).length;
    const newJobsThisWeek = jobs.filter(j => new Date(j.createdAt) > oneWeekAgo).length;
    const newMatchesThisWeek = allViews.filter(v => new Date(v.viewedAt) > oneWeekAgo).length;

    // 过去8周的实习生增长数据
    const weeklyInterns = Array.from({ length: 8 }, (_, i) => {
      const weekStart = new Date(now.getTime() - (7 - i) * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
      return {
        week: `W${i + 1}`,
        count: interns.filter(intern => {
          const d = new Date(intern.createdAt);
          return d >= weekStart && d < weekEnd;
        }).length,
      };
    });

    // 最近5条实习生
    const recentInterns = [...interns]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(({ id, name, position, baseLocation, createdAt }) => ({ id, name, position, baseLocation, createdAt }));

    // 最近5条职位
    const recentJobs = [...jobs]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(({ id, companyName, title, baseLocation, createdAt }) => ({ id, companyName, title, baseLocation, createdAt }));

    // 最近10条匹配记录
    const recentMatches = allViews.slice(0, 10).map(v => ({
      id: v.id,
      internId: v.internId,
      internName: v.internName,
      viewerName: v.viewerName,
      viewedAt: v.viewedAt,
    }));

    return NextResponse.json({
      totalInterns: interns.length,
      totalJobs: jobs.length,
      newInternsThisWeek,
      newJobsThisWeek,
      totalMatches: allViews.length,
      newMatchesThisWeek,
      totalInviteCodes: inviteCodes.length,
      usedInviteCodes: inviteCodes.filter(c => c.used).length,
      weeklyInterns,
      recentInterns,
      recentJobs,
      recentMatches,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
