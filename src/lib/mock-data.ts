import { ProjectMetrics, Discovery } from '@/types/github';

export const MOCK_PROJECTS: ProjectMetrics[] = [
  {
    project: {
      id: 1,
      name: 'next.js',
      full_name: 'vercel/next.js',
      description: 'The React Framework – created and maintained by @vercel.',
      html_url: 'https://github.com/vercel/next.js',
      stargazers_count: 125000,
      forks_count: 26800,
      open_issues_count: 2500,
      watchers_count: 125000,
      language: 'TypeScript',
      created_at: '2016-10-05T00:12:48Z',
      updated_at: '2025-09-03T10:00:00Z',
      pushed_at: '2025-09-03T09:30:00Z',
      homepage: 'https://nextjs.org',
      topics: ['react', 'framework', 'typescript', 'vercel', 'web'],
      license: {
        key: 'mit',
        name: 'MIT License'
      }
    },
    stars_growth_7d: 450,
    stars_growth_30d: 2100,
    fork_star_ratio: 0.214,
    commit_frequency: 45,
    contributors_count: 1250,
    release_frequency: 12,
    issue_close_rate: 0.85,
    value_score: 92,
    last_updated: '2025-09-03T10:00:00Z',
    ai_analysis: {
      problemSolved: "简化React应用开发，提供生产就绪的全栈解决方案",
      userAppeal: "开发体验极佳，性能优秀，生态丰富，企业级特性完善",
      maintainerMotivation: "前端框架是基础设施，巨大的开发者生态带来商业价值和技术影响力",
      monetizationDifficulty: {
        level: 'high' as const,
        challenges: "框架本身难以直接盈利，主要通过周边服务（Vercel部署、培训、咨询）以及企业影响力获得收益"
      }
    }
  },
  {
    project: {
      id: 2,
      name: 'supabase',
      full_name: 'supabase/supabase',
      description: 'The open source Firebase alternative.',
      html_url: 'https://github.com/supabase/supabase',
      stargazers_count: 72000,
      forks_count: 6800,
      open_issues_count: 450,
      watchers_count: 72000,
      language: 'TypeScript',
      created_at: '2020-01-08T13:28:56Z',
      updated_at: '2025-09-03T09:45:00Z',
      pushed_at: '2025-09-03T08:15:00Z',
      homepage: 'https://supabase.com',
      topics: ['firebase-alternative', 'database', 'realtime', 'postgres', 'saas'],
      license: {
        key: 'apache-2.0',
        name: 'Apache License 2.0'
      }
    },
    stars_growth_7d: 320,
    stars_growth_30d: 1800,
    fork_star_ratio: 0.094,
    commit_frequency: 78,
    contributors_count: 380,
    release_frequency: 18,
    issue_close_rate: 0.78,
    value_score: 89,
    last_updated: '2025-09-03T09:45:00Z',
    ai_analysis: {
      problemSolved: "简化后端开发复杂度，提供即开即用的后端服务（数据库、认证、API等）",
      userAppeal: "极大降低全栈开发门槛，快速构建MVP，专注前端和业务逻辑",
      maintainerMotivation: "云服务市场高速增长，开源+商业云服务模式被验证成功（如Firebase）",
      monetizationDifficulty: {
        level: 'high' as const,
        challenges: "需要强大的云基础设施投入，与AWS/Google竞争，但可通过托管服务、企业私有化部署、技术咨询获得收入"
      }
    }
  }
];

export const MOCK_DISCOVERIES: Discovery[] = [
  {
    project: {
      project: {
        id: 101,
        name: 'coolify',
        full_name: 'coollabsio/coolify',
        description: 'An open-source & self-hostable Heroku / Netlify / Vercel alternative.',
        html_url: 'https://github.com/coollabsio/coolify',
        stargazers_count: 32000,
        forks_count: 1700,
        open_issues_count: 89,
        watchers_count: 32000,
        language: 'PHP',
        created_at: '2021-04-12T08:36:45Z',
        updated_at: '2025-09-03T12:30:00Z',
        pushed_at: '2025-09-03T11:45:00Z',
        homepage: 'https://coolify.io',
        topics: ['deployment', 'self-hosted', 'docker', 'devops'],
        license: {
          key: 'apache-2.0',
          name: 'Apache License 2.0'
        }
      },
      stars_growth_7d: 450,
      stars_growth_30d: 2800,
      fork_star_ratio: 0.053,
      commit_frequency: 68,
      contributors_count: 67,
      release_frequency: 22,
      issue_close_rate: 0.87,
      value_score: 75,
      last_updated: '2025-09-03T12:30:00Z'
    },
    reason: 'high_value_discovery',
    discovered_at: '2025-09-03T12:30:00Z'
  },
  {
    project: {
      project: {
        id: 102,
        name: 'invoice-ninja',
        full_name: 'invoiceninja/invoiceninja',
        description: 'Invoices, Expenses and Tasks built with Laravel, Flutter and React',
        html_url: 'https://github.com/invoiceninja/invoiceninja',
        stargazers_count: 8100,
        forks_count: 2300,
        open_issues_count: 156,
        watchers_count: 8100,
        language: 'PHP',
        created_at: '2014-10-24T19:33:25Z',
        updated_at: '2025-09-03T10:20:00Z',
        pushed_at: '2025-09-02T18:30:00Z',
        homepage: 'https://www.invoiceninja.com',
        topics: ['invoice', 'business', 'accounting', 'saas', 'commercial'],
        license: {
          key: 'other',
          name: 'Elastic License 2.0'
        }
      },
      stars_growth_7d: 25,
      stars_growth_30d: 180,
      fork_star_ratio: 0.284,
      commit_frequency: 28,
      contributors_count: 89,
      release_frequency: 6,
      issue_close_rate: 0.76,
      value_score: 68,
      last_updated: '2025-09-03T10:20:00Z'
    },
    reason: 'high_value_discovery',
    discovered_at: '2025-09-03T10:20:00Z'
  }
];