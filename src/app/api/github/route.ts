import { NextRequest, NextResponse } from 'next/server';
import { GitHubAPI } from '@/lib/github-api';
import { ValueCalculator } from '@/lib/value-calculator';
import { AIAnalyzer } from '@/lib/ai-analyzer';
import { MOCK_PROJECTS, MOCK_DISCOVERIES } from '@/lib/mock-data';

// 预设的高价值种子项目
const SEED_PROJECTS = [
  'vercel/next.js',
  'supabase/supabase',
  'linear/linear',
  'PostHog/posthog',
  'strapi/strapi',
  'hasura/graphql-engine',
  'appwrite/appwrite',
  'nocodb/nocodb',
  'n8n-io/n8n',
  'pocketbase/pocketbase'
];

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action') || 'projects';
    
    switch (action) {
      case 'projects':
        return await getTrackedProjects();
      case 'discover':
        return await discoverNewProjects();
      case 'trending':
        return await getTrendingProjects();
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function getTrackedProjects() {
  // 如果没有GitHub Token，返回模拟数据
  if (!GITHUB_TOKEN) {
    return NextResponse.json({
      projects: MOCK_PROJECTS,
      total: MOCK_PROJECTS.length,
      last_updated: new Date().toISOString(),
      demo_mode: true
    });
  }

  const projects = [];
  
  // 获取种子项目的详细数据
  for (const projectPath of SEED_PROJECTS.slice(0, 10)) { // 限制数量避免API超限
    try {
      const [owner, repo] = projectPath.split('/');
      const project = await GitHubAPI.getRepository(owner, repo);
      const metrics = await ValueCalculator.calculateDetailedMetrics(project);
      
      // 添加AI分析
      metrics.ai_analysis = AIAnalyzer.analyzeProject(project, metrics);
      
      projects.push(metrics);
    } catch (error) {
      console.error(`Failed to fetch project ${projectPath}:`, error);
    }
  }
  
  // 按价值评分排序
  projects.sort((a, b) => b.value_score - a.value_score);
  
  return NextResponse.json({
    projects,
    total: projects.length,
    last_updated: new Date().toISOString()
  });
}

async function discoverNewProjects() {
  // 如果没有GitHub Token，返回模拟数据
  if (!GITHUB_TOKEN) {
    return NextResponse.json({
      discoveries: MOCK_DISCOVERIES,
      total: MOCK_DISCOVERIES.length,
      demo_mode: true
    });
  }

  try {
    const trendingProjects = await GitHubAPI.getTrendingRepositories();
    const discoveries = [];
    
    for (const project of trendingProjects.slice(0, 20)) {
      const metrics = await ValueCalculator.calculateDetailedMetrics(project);
      if (metrics.value_score > 60) { // 只返回高价值项目
        discoveries.push({
          project: metrics,
          reason: 'high_value_discovery',
          discovered_at: new Date().toISOString()
        });
      }
    }
    
    return NextResponse.json({
      discoveries: discoveries.slice(0, 10),
      total: discoveries.length
    });
  } catch (error) {
    console.error('Discovery error:', error);
    return NextResponse.json({ discoveries: [], total: 0 });
  }
}

async function getTrendingProjects() {
  // 如果没有GitHub Token，返回模拟数据
  if (!GITHUB_TOKEN) {
    return NextResponse.json({
      trending: MOCK_PROJECTS.map(p => p.project).slice(0, 5),
      total: 5,
      demo_mode: true
    });
  }

  try {
    const trending = await GitHubAPI.getTrendingRepositories();
    return NextResponse.json({
      trending: trending.slice(0, 15),
      total: trending.length
    });
  } catch (error) {
    console.error('Trending error:', error);
    return NextResponse.json({ trending: [], total: 0 });
  }
}