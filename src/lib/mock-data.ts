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
      marketProblem: {
        en: "Simplifies React application development, provides production-ready full-stack solutions with optimal performance",
        zh: "简化React应用开发，提供生产就绪的全栈解决方案"
      },
      userCatalyst: {
        en: "Exceptional developer experience, superior performance, rich ecosystem, enterprise-grade features",
        zh: "开发体验极佳，性能优秀，生态丰富，企业级特性完善"
      },
      developerRetention: {
        en: "Frontend frameworks are critical infrastructure, massive developer ecosystem creates significant business value and technical influence",
        zh: "前端框架是基础设施，巨大的开发者生态带来商业价值和技术影响力"
      },
      revenueGeneration: {
        level: 'high' as const,
        pathways: {
          en: ["Cloud deployment platform", "Enterprise support & consulting", "Training & certification", "Developer tools & services"],
          zh: ["云部署平台", "企业支持咨询", "培训认证", "开发工具服务"]
        },
        challenges: {
          en: "Framework itself hard to monetize directly, revenue comes through ecosystem services (Vercel hosting, training, consulting)",
          zh: "框架本身难以直接盈利，主要通过周边服务（Vercel部署、培训、咨询）以及企业影响力获得收益"
        }
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
      marketProblem: {
        en: "Reduces backend development complexity, provides ready-to-use backend services (database, auth, APIs)",
        zh: "简化后端开发复杂度，提供即开即用的后端服务（数据库、认证、API等）"
      },
      userCatalyst: {
        en: "Dramatically lowers full-stack development barrier, enables rapid MVP development, focus on frontend/business logic",
        zh: "极大降低全栈开发门槛，快速构建MVP，专注前端和业务逻辑"
      },
      developerRetention: {
        en: "Cloud services market experiencing rapid growth, open source + commercial cloud model proven successful (Firebase model)",
        zh: "云服务市场高速增长，开源+商业云服务模式被验证成功（如Firebase）"
      },
      revenueGeneration: {
        level: 'high' as const,
        pathways: {
          en: ["Managed cloud hosting ($10-1000+/month)", "Enterprise on-premise licenses", "Professional support & consulting", "Custom feature development"],
          zh: ["托管云服务", "企业私有化部署", "专业支持和咨询", "定制功能开发"]
        },
        challenges: {
          en: "Requires significant cloud infrastructure investment, competing with AWS/Google/Microsoft giants",
          zh: "需要强大的云基础设施投入，与AWS/Google竞争，但可通过托管服务、企业私有化部署、技术咨询获得收入"
        }
      }
    }
  },
  {
    project: {
      id: 3,
      name: 'n8n',
      full_name: 'n8n-io/n8n',
      description: 'Fair-code workflow automation platform with native AI capabilities. Combine visual building with custom code, self-host or cloud, 400+ integrations.',
      html_url: 'https://github.com/n8n-io/n8n',
      stargazers_count: 44000,
      forks_count: 5800,
      open_issues_count: 180,
      watchers_count: 44000,
      language: 'TypeScript',
      created_at: '2019-06-22T09:52:30Z',
      updated_at: '2025-09-03T08:00:00Z',
      pushed_at: '2025-09-03T07:45:00Z',
      homepage: 'https://n8n.io',
      topics: ['automation', 'workflow', 'nocode', 'integrations', 'zapier-alternative'],
      license: {
        key: 'other',
        name: 'Sustainable Use License'
      }
    },
    stars_growth_7d: 280,
    stars_growth_30d: 1200,
    fork_star_ratio: 0.132,
    commit_frequency: 85,
    contributors_count: 450,
    release_frequency: 24,
    issue_close_rate: 0.89,
    value_score: 87,
    last_updated: '2025-09-03T08:00:00Z',
    ai_analysis: {
      marketProblem: {
        en: "Solves enterprise workflow automation complexity, connecting disparate APIs and services seamlessly",
        zh: "解决企业和个人的重复性工作自动化问题，连接不同的API和服务"
      },
      userCatalyst: {
        en: "No-code/low-code solution enabling non-technical users to create complex workflows, saving significant time",
        zh: "无代码/低代码解决方案，让非技术人员也能创建复杂的工作流程，节省大量时间"
      },
      developerRetention: {
        en: "Massive workflow automation market with clear commercialization paths and strong enterprise demand",
        zh: "工作流自动化市场巨大，有明确的商业化路径和企业需求驱动持续开发"
      },
      revenueGeneration: {
        level: 'medium' as const,
        pathways: {
          en: ["Enterprise SaaS plans ($50-500/month)", "Template marketplace (15-30% commission)", "Professional services & consulting", "White-label licensing"],
          zh: ["企业SaaS订阅服务", "模板市场分成", "专业服务和咨询", "白标授权"]
        },
        challenges: {
          en: "Requires deep business process understanding, intense competition (Zapier, Microsoft Power Automate)",
          zh: "需要深度理解业务流程，竞争激烈（Zapier等），但SaaS模式成熟，可通过企业服务、模板市场、培训咨询盈利"
        }
      }
    }
  },
  {
    project: {
      id: 4,
      name: 'auto-gpt',
      full_name: 'Significant-Gravitas/Auto-GPT',
      description: 'AutoGPT is the vision of accessible AI for everyone, to use and to build on. Our mission is to provide the tools, so that you can focus on what matters.',
      html_url: 'https://github.com/Significant-Gravitas/Auto-GPT',
      stargazers_count: 167000,
      forks_count: 44000,
      open_issues_count: 890,
      watchers_count: 167000,
      language: 'Python',
      created_at: '2023-03-16T15:28:31Z',
      updated_at: '2025-09-03T11:20:00Z',
      pushed_at: '2025-09-03T10:45:00Z',
      homepage: 'https://agpt.co',
      topics: ['ai', 'automation', 'gpt', 'autonomous', 'agent', 'llm'],
      license: {
        key: 'mit',
        name: 'MIT License'
      }
    },
    stars_growth_7d: 520,
    stars_growth_30d: 3200,
    fork_star_ratio: 0.263,
    commit_frequency: 125,
    contributors_count: 890,
    release_frequency: 16,
    issue_close_rate: 0.72,
    value_score: 94,
    last_updated: '2025-09-03T11:20:00Z',
    ai_analysis: {
      marketProblem: {
        en: "Makes autonomous AI agents accessible to everyone, democratizing AI automation for complex tasks",
        zh: "让自主AI智能体对所有人可用，为复杂任务民主化AI自动化"
      },
      userCatalyst: {
        en: "First mainstream autonomous AI agent, viral popularity, enables complex task automation without coding",
        zh: "首个主流自主AI智能体，病毒式传播，无需编码即可实现复杂任务自动化"
      },
      developerRetention: {
        en: "Autonomous AI is the future of work, massive potential market, strong community-driven development",
        zh: "自主AI是工作的未来，市场潜力巨大，强大的社区驱动开发"
      },
      revenueGeneration: {
        level: 'medium' as const,
        pathways: {
          en: ["Enterprise AI agent platform", "Custom agent development", "AI consulting services", "Training and workshops"],
          zh: ["企业AI智能体平台", "定制智能体开发", "AI咨询服务", "培训和工作坊"]
        },
        challenges: {
          en: "Rapidly evolving AI landscape, competition with OpenAI/Google, requires significant compute resources",
          zh: "AI领域快速发展，与OpenAI/Google竞争，需要大量计算资源"
        }
      }
    }
  },
  {
    project: {
      id: 5,
      name: 'playwright',
      full_name: 'microsoft/playwright',
      description: 'Playwright is a framework for Web Testing and Automation. It allows testing Chromium, Firefox and WebKit with a single API.',
      html_url: 'https://github.com/microsoft/playwright',
      stargazers_count: 65000,
      forks_count: 3500,
      open_issues_count: 420,
      watchers_count: 65000,
      language: 'TypeScript',
      created_at: '2019-11-15T18:32:47Z',
      updated_at: '2025-09-03T12:10:00Z',
      pushed_at: '2025-09-03T11:55:00Z',
      homepage: 'https://playwright.dev',
      topics: ['testing', 'automation', 'browser', 'e2e', 'web-testing', 'cross-browser'],
      license: {
        key: 'apache-2.0',
        name: 'Apache License 2.0'
      }
    },
    stars_growth_7d: 180,
    stars_growth_30d: 850,
    fork_star_ratio: 0.054,
    commit_frequency: 92,
    contributors_count: 520,
    release_frequency: 28,
    issue_close_rate: 0.91,
    value_score: 85,
    last_updated: '2025-09-03T12:10:00Z',
    ai_analysis: {
      marketProblem: {
        en: "Solves cross-browser testing complexity, provides reliable automated testing for modern web applications",
        zh: "解决跨浏览器测试复杂性，为现代Web应用提供可靠的自动化测试"
      },
      userCatalyst: {
        en: "Microsoft backing, superior reliability vs Selenium, supports all browsers, excellent developer experience",
        zh: "微软支持，相比Selenium更可靠，支持所有浏览器，优秀的开发体验"
      },
      developerRetention: {
        en: "Web testing is essential for all applications, growing adoption in enterprise, Microsoft's strategic investment",
        zh: "Web测试对所有应用都必不可少，企业采用率不断增长，微软的战略投资"
      },
      revenueGeneration: {
        level: 'low' as const,
        pathways: {
          en: ["Enterprise support contracts", "Training and certification", "Consulting services", "Cloud testing platform"],
          zh: ["企业支持合同", "培训和认证", "咨询服务", "云测试平台"]
        },
        challenges: {
          en: "Open source with Microsoft backing, mainly monetized through ecosystem services and enterprise support",
          zh: "开源且有微软支持，主要通过生态服务和企业支持变现"
        }
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