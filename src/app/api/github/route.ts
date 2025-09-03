import { NextRequest, NextResponse } from 'next/server';
import { GitHubAPI } from '@/lib/github-api';
import { ValueCalculator } from '@/lib/value-calculator';
import { AIAnalyzer } from '@/lib/ai-analyzer';
import { GHArchiveClient } from '@/lib/gharchive-client';
import { MOCK_PROJECTS, MOCK_DISCOVERIES } from '@/lib/mock-data';

// 预设的高价值种子项目 - 大大扩展项目库
const SEED_PROJECTS = [
  // Web框架和开发工具
  'vercel/next.js',
  'facebook/react',
  'vuejs/vue',
  'angular/angular',
  'sveltejs/svelte',
  'remix-run/remix',
  'nuxt/nuxt',
  'vitejs/vite',
  'webpack/webpack',
  'rollup/rollup',
  
  // 后端和数据库
  'supabase/supabase',
  'appwrite/appwrite',
  'pocketbase/pocketbase',
  'firebase/firebase-js-sdk',
  'prisma/prisma',
  'strapi/strapi',
  'directus/directus',
  'hasura/graphql-engine',
  'nocodb/nocodb',
  'airtable/airtable.js',
  
  // AI和机器学习
  'microsoft/TypeScript',
  'openai/openai-python',
  'langchain-ai/langchain',
  'microsoft/vscode',
  'huggingface/transformers',
  'ollama/ollama',
  'automatic1111/stable-diffusion-webui',
  'comfyanonymous/ComfyUI',
  
  // 自动化和工作流
  'n8n-io/n8n',
  'zapier/zapier-platform',
  'huginn/huginn',
  'activepieces/activepieces',
  'windmill-labs/windmill',
  'temporal-io/temporal',
  'airflow/airflow',
  
  // DevOps和云原生
  'docker/compose',
  'kubernetes/kubernetes',
  'vercel/turbo',
  'netlify/netlify-cms',
  'serverless/serverless',
  'pulumi/pulumi',
  'terraform-providers/terraform-provider-aws',
  
  // 分析和监控
  'PostHog/posthog',
  'plausible/analytics',
  'umami-software/umami',
  'grafana/grafana',
  'elastic/elasticsearch',
  'prometheus/prometheus',
  
  // 内容管理和电商
  'shopify/shopify-cli',
  'medusajs/medusa',
  'commercetools/commercetools-sdk-typescript',
  'sanity-io/sanity',
  'contentful/contentful.js',
  'ghost/ghost',
  
  // 设计和协作工具
  'figma/plugin-samples',
  'linear/linear',
  'notion-enhancer/notion-enhancer',
  'logseq/logseq',
  'obsidianmd/obsidian-releases',
  'codeium/codeium',
  
  // 移动开发
  'expo/expo',
  'facebook/react-native',
  'ionic-team/ionic-framework',
  'flutter/flutter',
  'capacitor-community/proposals',
  
  // 区块链和Web3
  'ethereum/ethereum-org-website',
  'MetaMask/metamask-extension',
  'rainbow-me/rainbow',
  'Uniswap/interface',
  'pancakeswap/pancake-frontend',
  
  // 开发者工具
  'microsoft/playwright',
  'cypress-io/cypress',
  'storybookjs/storybook',
  'facebook/jest',
  'eslint/eslint',
  'prettier/prettier',
  
  // 数据可视化
  'apache/superset',
  'metabase/metabase',
  'grafana/grafana',
  'observablehq/plot',
  'recharts/recharts',
  'd3/d3',
  
  // 安全和认证
  'auth0/auth0.js',
  'supertokens/supertokens-core',
  'ory/kratos',
  'clerk/javascript',
  'firebase/firebase-admin-node',
  
  // 音视频和媒体
  'video-dev/hls.js',
  'videojs/video.js',
  'mux/mux-node-sdk',
  'agora-io/agora-rtc-sdk-ng',
  
  // 游戏开发
  'godotengine/godot',
  'unity3d-jp/unitychan-crs',
  'pixijs/pixijs',
  'photonstorm/phaser',
  
  // 其他高价值项目
  'microsoft/vscode-extension-samples',
  'raycast/extensions',
  'discord/discord-api-docs',
  'slack-samples/bolt-js-getting-started-app',
  'twilio/twilio-node'
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
      case 'search':
        return await searchProjects(request);
      case 'analytics':
        return await getProjectAnalytics(request);
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

  try {
    // 使用GHArchive获取真实的热门项目数据
    const trendingProjects = await GHArchiveClient.getTrendingProjects(7, 10, 100);
    const projects = [];
    
    // 处理热门项目
    for (const trendingProject of trendingProjects.slice(0, 50)) {
      try {
        const [owner, repo] = trendingProject.repo_name.split('/');
        
        // 构造GitHubProject格式
        const project = {
          id: Math.floor(Math.random() * 1000000),
          name: repo,
          full_name: trendingProject.repo_name,
          description: trendingProject.description || '',
          html_url: `https://github.com/${trendingProject.repo_name}`,
          stargazers_count: Math.max(trendingProject.stars_added * 10, 50),
          forks_count: Math.max(trendingProject.forks_added * 5, 10),
          open_issues_count: trendingProject.open_issues || 0,
          watchers_count: Math.max(trendingProject.stars_added * 10, 50),
          language: trendingProject.languages[0] || 'Unknown',
          created_at: trendingProject.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
          pushed_at: trendingProject.pushed_at || new Date().toISOString(),
          homepage: trendingProject.homepage || '',
          topics: trendingProject.topics || [],
          license: trendingProject.license ? {
            key: trendingProject.license.toLowerCase().replace(/\s+/g, '-'),
            name: trendingProject.license
          } : null,
          owner: {
            login: owner,
            avatar_url: `https://github.com/${owner}.png`
          }
        };
        
        const metrics = await ValueCalculator.calculateDetailedMetrics(project);
        
        // 添加AI分析
        metrics.ai_analysis = AIAnalyzer.analyzeProject(project, metrics);
        
        projects.push(metrics);
      } catch (error) {
        console.error(`Failed to process trending project ${trendingProject.repo_name}:`, error);
      }
    }
    
    // 补充种子项目以确保有足够的数据
    if (projects.length < 30) {
      for (const projectPath of SEED_PROJECTS.slice(0, 30 - projects.length)) {
        try {
          const [owner, repo] = projectPath.split('/');
          const project = await GitHubAPI.getRepository(owner, repo);
          const metrics = await ValueCalculator.calculateDetailedMetrics(project);
          
          // 检查是否已存在
          if (!projects.find(p => p.project.full_name === project.full_name)) {
            metrics.ai_analysis = AIAnalyzer.analyzeProject(project, metrics);
            projects.push(metrics);
          }
        } catch (error) {
          console.error(`Failed to fetch seed project ${projectPath}:`, error);
        }
      }
    }
    
    // 按价值评分排序
    projects.sort((a, b) => b.value_score - a.value_score);
    
    return NextResponse.json({
      projects,
      total: projects.length,
      last_updated: new Date().toISOString(),
      source: 'gharchive_enhanced'
    });
  } catch (error) {
    console.error('Failed to get tracked projects from GHArchive:', error);
    
    // 降级到原始方法
    const projects = [];
    for (const projectPath of SEED_PROJECTS.slice(0, 50)) {
      try {
        const [owner, repo] = projectPath.split('/');
        const project = await GitHubAPI.getRepository(owner, repo);
        const metrics = await ValueCalculator.calculateDetailedMetrics(project);
        metrics.ai_analysis = AIAnalyzer.analyzeProject(project, metrics);
        projects.push(metrics);
      } catch (error) {
        console.error(`Failed to fetch project ${projectPath}:`, error);
      }
    }
    
    projects.sort((a, b) => b.value_score - a.value_score);
    
    return NextResponse.json({
      projects,
      total: projects.length,
      last_updated: new Date().toISOString(),
      source: 'fallback'
    });
  }
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
    // 使用GHArchive发现新的高价值项目
    const trendingProjects = await GHArchiveClient.getTrendingProjects(3, 20, 50);
    const discoveries = [];
    
    for (const project of trendingProjects.slice(0, 20)) {
      try {
        const [owner, repo] = project.repo_name.split('/');
        
        // 构造项目对象
        const gitHubProject = {
          id: Math.floor(Math.random() * 1000000),
          name: repo,
          full_name: project.repo_name,
          description: project.description || '',
          html_url: `https://github.com/${project.repo_name}`,
          stargazers_count: Math.max(project.stars_added * 15, 100),
          forks_count: Math.max(project.forks_added * 8, 20),
          open_issues_count: project.open_issues || 0,
          watchers_count: Math.max(project.stars_added * 15, 100),
          language: project.languages[0] || 'Unknown',
          created_at: project.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
          pushed_at: project.pushed_at || new Date().toISOString(),
          homepage: project.homepage || '',
          topics: project.topics || [],
          license: project.license ? {
            key: project.license.toLowerCase().replace(/\s+/g, '-'),
            name: project.license
          } : null,
          owner: {
            login: owner,
            avatar_url: `https://github.com/${owner}.png`
          }
        };
        
        const metrics = await ValueCalculator.calculateDetailedMetrics(gitHubProject);
        
        if (metrics.value_score > 60) {
          discoveries.push({
            project: metrics,
            reason: project.stars_added > 50 ? 'viral_growth' : 'high_value_discovery',
            discovered_at: new Date().toISOString(),
            growth_indicators: {
              stars_added_7d: project.stars_added,
              unique_contributors: project.unique_contributors,
              trending_topics: project.topics.slice(0, 3)
            }
          });
        }
      } catch (error) {
        console.error(`Failed to process discovery ${project.repo_name}:`, error);
      }
    }
    
    return NextResponse.json({
      discoveries: discoveries.slice(0, 15),
      total: discoveries.length,
      source: 'gharchive_discovery'
    });
  } catch (error) {
    console.error('Discovery error:', error);
    
    // 降级到GitHub API搜索
    try {
      const trendingProjects = await GitHubAPI.getTrendingRepositories();
      const discoveries = [];
      
      for (const project of trendingProjects.slice(0, 20)) {
        const metrics = await ValueCalculator.calculateDetailedMetrics(project);
        if (metrics.value_score > 60) {
          discoveries.push({
            project: metrics,
            reason: 'high_value_discovery',
            discovered_at: new Date().toISOString()
          });
        }
      }
      
      return NextResponse.json({
        discoveries: discoveries.slice(0, 10),
        total: discoveries.length,
        source: 'github_api_fallback'
      });
    } catch (fallbackError) {
      console.error('Fallback discovery error:', fallbackError);
      return NextResponse.json({ discoveries: [], total: 0 });
    }
  }
}

// 新增搜索功能
async function searchProjects(request: NextRequest) {
  if (!GITHUB_TOKEN) {
    return NextResponse.json({ error: 'GitHub token required for search' }, { status: 400 });
  }

  try {
    const url = new URL(request.url);
    const query = url.searchParams.get('q') || '';
    const language = url.searchParams.get('language') || undefined;
    const minStars = parseInt(url.searchParams.get('minStars') || '0');
    const topics = url.searchParams.get('topics')?.split(',').filter(Boolean) || [];
    const limit = parseInt(url.searchParams.get('limit') || '50');

    if (!query.trim()) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    const searchResults = await GHArchiveClient.searchProjects(query, {
      language,
      minStars,
      topics,
      maxAge: 365 // 最近一年
    }, limit);

    const projects = [];
    for (const project of searchResults) {
      try {
        const metrics = await ValueCalculator.calculateDetailedMetrics(project);
        metrics.ai_analysis = AIAnalyzer.analyzeProject(project, metrics);
        projects.push(metrics);
      } catch (error) {
        console.error(`Failed to process search result ${project.full_name}:`, error);
      }
    }

    // 按价值评分排序
    projects.sort((a, b) => b.value_score - a.value_score);

    return NextResponse.json({
      projects,
      total: projects.length,
      query,
      filters: { language, minStars, topics },
      last_updated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ 
      error: 'Search failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// 新增项目分析功能
async function getProjectAnalytics(request: NextRequest) {
  if (!GITHUB_TOKEN) {
    return NextResponse.json({ error: 'GitHub token required for analytics' }, { status: 400 });
  }

  try {
    const url = new URL(request.url);
    const owner = url.searchParams.get('owner');
    const repo = url.searchParams.get('repo');

    if (!owner || !repo) {
      return NextResponse.json({ error: 'Owner and repo parameters are required' }, { status: 400 });
    }

    const analytics = await GHArchiveClient.getProjectAnalytics(owner, repo);
    
    if (!analytics) {
      return NextResponse.json({ error: 'Failed to fetch project analytics' }, { status: 404 });
    }

    // 计算价值指标
    const metrics = await ValueCalculator.calculateDetailedMetrics(analytics.repository);
    metrics.ai_analysis = AIAnalyzer.analyzeProject(analytics.repository, metrics);

    return NextResponse.json({
      ...analytics,
      value_metrics: metrics,
      generated_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ 
      error: 'Analytics failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
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