import { NextRequest, NextResponse } from 'next/server';
import { GitHubAPI } from '@/lib/github-api';
import { ValueCalculator } from '@/lib/value-calculator';
import { AIAnalyzer } from '@/lib/ai-analyzer';
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
  
  // 获取更多种子项目的详细数据 - 从10个增加到50个
  for (const projectPath of SEED_PROJECTS.slice(0, 50)) {
    try {
      const [owner, repo] = projectPath.split('/');
      const project = await GitHubAPI.getRepository(owner, repo);
      const metrics = await ValueCalculator.calculateDetailedMetrics(project);
      
      // 添加AI分析
      metrics.ai_analysis = AIAnalyzer.analyzeProject(project, metrics);
      
      projects.push(metrics);
    } catch (error) {
      console.error(`Failed to fetch project ${projectPath}:`, error);
      // 继续处理其他项目，不让单个失败影响整体
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