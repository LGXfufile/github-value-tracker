import { GitHubProject, ProjectMetrics, ProjectAnalysis } from '@/types/github';

export class AIAnalyzer {
  
  static analyzeProject(project: GitHubProject, metrics: ProjectMetrics): ProjectAnalysis {
    const { name, description, topics, stargazers_count, language } = project;
    const { value_score, commit_frequency, contributors_count } = metrics;
    
    // 基于项目特征进行智能分析
    return this.generateAnalysis(name, description, topics, {
      stars: stargazers_count,
      language,
      valueScore: value_score,
      commitFreq: commit_frequency,
      contributors: contributors_count
    });
  }
  
  private static generateAnalysis(
    name: string, 
    description: string | null, 
    topics: string[], 
    stats: {
      stars: number;
      language: string | null;
      valueScore: number;
      commitFreq: number;
      contributors: number;
    }
  ): ProjectAnalysis {
    
    const projectKey = name.toLowerCase();
    const desc = (description || '').toLowerCase();
    const topicStr = topics.join(' ').toLowerCase();
    
    // 预设分析模板（基于常见开源项目模式）
    const analysisTemplates = this.getAnalysisTemplates();
    
    // 智能匹配分析
    if (projectKey.includes('n8n')) {
      return analysisTemplates.workflowAutomation;
    }
    
    if (projectKey.includes('supabase')) {
      return analysisTemplates.backendAsService;
    }
    
    if (projectKey.includes('strapi')) {
      return analysisTemplates.headlessCMS;
    }
    
    if (projectKey.includes('posthog')) {
      return analysisTemplates.analytics;
    }
    
    if (projectKey.includes('nocodb')) {
      return analysisTemplates.noCodeDatabase;
    }
    
    if (projectKey.includes('next')) {
      return analysisTemplates.reactFramework;
    }
    
    if (projectKey.includes('pocketbase')) {
      return analysisTemplates.backendAsService;
    }
    
    if (projectKey.includes('appwrite')) {
      return analysisTemplates.backendAsService;
    }
    
    if (desc.includes('graphql')) {
      return analysisTemplates.graphqlEngine;
    }
    
    // 根据topics和描述进行通用分析
    return this.generateGenericAnalysis(desc, topicStr, stats);
  }
  
  private static getAnalysisTemplates() {
    return {
      workflowAutomation: {
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
        },
        competitiveMoat: {
          en: "Strong network effects through integrations, workflow templates create switching costs",
          zh: "通过集成建立的网络效应，工作流模板形成转换成本"
        },
        globalReadiness: {
          en: "High - workflow automation is universal business need across all markets",
          zh: "高 - 工作流自动化是全球通用的商业需求"
        }
      },
      
      backendAsService: {
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
        },
        competitiveMoat: {
          en: "Developer experience and ecosystem integration create strong retention",
          zh: "开发者体验和生态集成形成强用户粘性"
        },
        globalReadiness: {
          en: "Very High - backend-as-a-service is critical for global digital transformation",
          zh: "非常高 - 后端即服务是全球数字化转型的关键需求"
        }
      },

      headlessCMS: {
        marketProblem: {
          en: "Decouples content management from frontend presentation, enabling flexible multi-channel content delivery",
          zh: "解耦内容管理和前端展示，让开发者自由选择前端技术栈"
        },
        userCatalyst: {
          en: "Developer-friendly, API-first approach, supports omnichannel content distribution, more flexible than traditional CMS",
          zh: "开发者友好，API优先，支持多端内容分发，比传统CMS更灵活"
        },
        developerRetention: {
          en: "Content management is evergreen business need, headless architecture is industry trend with clear SaaS monetization",
          zh: "内容管理需求永恒存在，Headless架构是趋势，有清晰的SaaS商业模式"
        },
        revenueGeneration: {
          level: 'medium' as const,
          pathways: {
            en: ["Managed hosting ($20-200/month)", "Plugin marketplace (20-30% revenue share)", "Custom development services", "Enterprise features & support"],
            zh: ["托管服务", "插件生态分成", "定制开发服务", "企业功能"]
          },
          challenges: {
            en: "Intense competition with established players like Contentful, Strapi, requires strong developer ecosystem",
            zh: "竞争激烈（Contentful等商业对手），但可通过托管服务、插件生态、定制开发盈利"
          }
        }
      },

      analytics: {
        marketProblem: {
          en: "Provides privacy-focused, open-source alternative to expensive commercial analytics tools with self-hosting capability",
          zh: "提供开源的用户行为分析和产品数据洞察，替代昂贵的商业分析工具"
        },
        userCatalyst: {
          en: "Privacy-compliant, self-hostable, feature-complete at fraction of Google Analytics Pro cost",
          zh: "数据隐私友好，可自部署，功能完整，成本远低于Google Analytics Pro等"
        },
        developerRetention: {
          en: "Analytics is universal product need, privacy compliance trends strengthen open source adoption",
          zh: "数据分析是所有产品的刚需，隐私合规趋势增强了开源方案的吸引力"
        },
        revenueGeneration: {
          level: 'medium' as const,
          pathways: {
            en: ["Cloud hosting ($15-300/month)", "Enterprise privacy features", "Data consulting services", "Custom dashboard development"],
            zh: ["云托管服务", "企业隐私功能", "数据咨询服务", "定制仪表板开发"]
          },
          challenges: {
            en: "Competing with Google Analytics free tier, but privacy concerns and GDPR compliance create opportunities",
            zh: "与Google Analytics免费版竞争，但可通过云托管、企业功能、数据咨询服务盈利"
          }
        }
      },

      noCodeDatabase: {
        marketProblem: {
          en: "Enables non-technical users to create and manage complex database applications, replacing Excel/Airtable workflows",
          zh: "让非技术用户也能创建和管理复杂的数据库应用，如替代Excel/Airtable"
        },
        userCatalyst: {
          en: "Intuitive interface, low learning curve, powerful functionality, open source and free",
          zh: "界面直观，学习成本低，功能强大，开源免费"
        },
        developerRetention: {
          en: "No-code tools market experiencing explosive growth, driven by enterprise digital transformation needs",
          zh: "无代码工具市场爆发式增长，企业数字化转型需求旺盛"
        },
        revenueGeneration: {
          level: 'medium' as const,
          pathways: {
            en: ["Enterprise features ($25-250/month)", "On-premise deployments", "Plugin marketplace", "Training & consulting"],
            zh: ["企业版功能", "私有化部署", "插件市场", "培训咨询"]
          },
          challenges: {
            en: "Competing with mature products like Airtable, Notion, requires strong user experience focus",
            zh: "与Airtable等成熟产品竞争，但可通过企业版功能、私有化部署、插件市场盈利"
          }
        }
      },

      reactFramework: {
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
      },

      graphqlEngine: {
        marketProblem: {
          en: "Auto-generates GraphQL APIs, simplifies backend API development and data querying complexity",
          zh: "自动生成GraphQL API，简化后端API开发和数据查询复杂度"
        },
        userCatalyst: {
          en: "Extremely high development efficiency, type-safe, real-time subscriptions, reduces frontend-backend communication overhead",
          zh: "开发效率极高，类型安全，实时订阅，减少前后端沟通成本"
        },
        developerRetention: {
          en: "API development is fundamental need for all applications, GraphQL adoption continues growing",
          zh: "API开发是所有应用的基础需求，GraphQL采用率持续增长"
        },
        revenueGeneration: {
          level: 'medium' as const,
          pathways: {
            en: ["Cloud services ($20-500/month)", "Enterprise support", "Professional training", "Custom integration services"],
            zh: ["云服务", "企业支持", "专业培训", "定制集成服务"]
          },
          challenges: {
            en: "Relatively complex technology, primarily targets developers, but strong potential through cloud services and enterprise support",
            zh: "技术相对复杂，目标用户主要是开发者，但可通过云服务、企业支持、专业培训盈利"
          }
        }
      }
    };
  }
  
  private static generateGenericAnalysis(
    desc: string, 
    topics: string, 
    stats: {
      stars: number;
      language: string | null;
      valueScore: number;
      commitFreq: number;
      contributors: number;
    }
  ): ProjectAnalysis {
    // 通用分析逻辑
    let marketProblemEn = "Addresses specific technical challenges in software development lifecycle";
    let marketProblemZh = "解决开发过程中的特定技术问题";
    let userCatalystEn = "Provides open source, cost-effective solution with active community support";
    let userCatalystZh = "提供开源、免费的解决方案";
    let developerRetentionEn = "Driven by technical passion and continuous improvement mindset";
    let developerRetentionZh = "技术热情驱动的持续改进";
    let difficulty: 'low' | 'medium' | 'high' = 'medium';
    let challengesEn = "Requires deep understanding of target user needs and sustainable monetization strategy";
    let challengesZh = "需要深入理解目标用户需求，建立可持续的盈利模式";
    let pathwaysEn = ["Professional services", "Enterprise support", "Training programs"];
    let pathwaysZh = ["专业服务", "企业支持", "培训项目"];
    
    // 基于描述关键词进行分析
    if (desc.includes('api') || topics.includes('api')) {
      marketProblemEn = "Simplifies API development and integration complexity";
      marketProblemZh = "简化API开发和集成复杂度";
      userCatalystEn = "Improves development efficiency, reduces repetitive work";
      userCatalystZh = "提高开发效率，减少重复工作";
    }
    
    if (desc.includes('dashboard') || desc.includes('ui') || topics.includes('dashboard')) {
      marketProblemEn = "Provides modern user interface and data visualization capabilities";
      marketProblemZh = "提供现代化的用户界面和数据可视化能力";
      userCatalystEn = "Beautiful, user-friendly interface design with excellent user experience";
      userCatalystZh = "美观易用的界面设计，良好的用户体验";
      difficulty = 'low';
      challengesEn = "Competitive UI library market, but opportunities through premium components, custom development, design services";
      challengesZh = "UI库竞争激烈，但可通过付费组件、定制开发、设计服务盈利";
      pathwaysEn = ["Premium components", "Design services", "Custom themes"];
      pathwaysZh = ["付费组件", "设计服务", "定制主题"];
    }
    
    if (desc.includes('database') || topics.includes('database')) {
      marketProblemEn = "Simplifies data storage and management complexity";
      marketProblemZh = "简化数据存储和管理的复杂性";
      userCatalystEn = "High-performance, easy-to-deploy, feature-complete database solution";
      userCatalystZh = "高性能、易部署、功能完整的数据库解决方案";
      difficulty = 'high';
      challengesEn = "Database technology requires significant expertise and long-term investment, but enterprise market has enormous value";
      challengesZh = "数据库技术要求极高，需要长期投入，但企业级市场价值巨大";
      pathwaysEn = ["Enterprise licenses", "Managed hosting", "Professional support"];
      pathwaysZh = ["企业许可", "托管服务", "专业支持"];
    }
    
    if (stats.stars > 50000) {
      userCatalystEn += ", backed by massive community support and mature ecosystem";
      userCatalystZh += "，拥有庞大的社区支持和成熟的生态";
      developerRetentionEn = "Large user base creates significant influence and potential business value, driving continued investment";
      developerRetentionZh = "大规模用户群体带来的影响力和潜在商业价值驱动持续投入";
    }
    
    return {
      marketProblem: {
        en: marketProblemEn,
        zh: marketProblemZh
      },
      userCatalyst: {
        en: userCatalystEn,
        zh: userCatalystZh
      },
      developerRetention: {
        en: developerRetentionEn,
        zh: developerRetentionZh
      },
      revenueGeneration: {
        level: difficulty,
        pathways: {
          en: pathwaysEn,
          zh: pathwaysZh
        },
        challenges: {
          en: challengesEn,
          zh: challengesZh
        }
      }
    };
  }
}