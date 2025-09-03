import { GitHubProject, ProjectMetrics } from '@/types/github';

interface ProjectAnalysis {
  problemSolved: string;        // 解决的问题
  userAppeal: string;          // 用户追捧的原因
  maintainerMotivation: string; // 作者持续更新的理由
  monetizationDifficulty: {
    level: 'low' | 'medium' | 'high'; // 盈利难度等级
    challenges: string;               // 具体难点
  };
}

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
    stats: any
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
        problemSolved: "解决企业和个人的重复性工作自动化问题，连接不同的API和服务",
        userAppeal: "无代码/低代码解决方案，让非技术人员也能创建复杂的工作流程，节省大量时间",
        maintainerMotivation: "工作流自动化市场巨大，有明确的商业化路径和企业需求驱动持续开发",
        monetizationDifficulty: {
          level: 'medium' as const,
          challenges: "需要深度理解业务流程，竞争激烈（Zapier等），但SaaS模式成熟，可通过企业服务、模板市场、培训咨询盈利"
        }
      },
      
      backendAsService: {
        problemSolved: "简化后端开发复杂度，提供即开即用的后端服务（数据库、认证、API等）",
        userAppeal: "极大降低全栈开发门槛，快速构建MVP，专注前端和业务逻辑",
        maintainerMotivation: "云服务市场高速增长，开源+商业云服务模式被验证成功（如Firebase）",
        monetizationDifficulty: {
          level: 'high' as const,
          challenges: "需要强大的云基础设施投入，与AWS/Google竞争，但可通过托管服务、企业私有化部署、技术咨询获得收入"
        }
      },
      
      headlessCMS: {
        problemSolved: "解耦内容管理和前端展示，让开发者自由选择前端技术栈",
        userAppeal: "开发者友好，API优先，支持多端内容分发，比传统CMS更灵活",
        maintainerMotivation: "内容管理需求永恒存在，Headless架构是趋势，有清晰的SaaS商业模式",
        monetizationDifficulty: {
          level: 'medium' as const,
          challenges: "竞争激烈（Contentful等商业对手），但可通过托管服务、插件生态、定制开发盈利"
        }
      },
      
      analytics: {
        problemSolved: "提供开源的用户行为分析和产品数据洞察，替代昂贵的商业分析工具",
        userAppeal: "数据隐私友好，可自部署，功能完整，成本远低于Google Analytics Pro等",
        maintainerMotivation: "数据分析是所有产品的刚需，隐私合规趋势增强了开源方案的吸引力",
        monetizationDifficulty: {
          level: 'medium' as const,
          challenges: "与Google Analytics免费版竞争，但可通过云托管、企业功能、数据咨询服务盈利"
        }
      },
      
      noCodeDatabase: {
        problemSolved: "让非技术用户也能创建和管理复杂的数据库应用，如替代Excel/Airtable",
        userAppeal: "界面直观，学习成本低，功能强大，开源免费",
        maintainerMotivation: "无代码工具市场爆发式增长，企业数字化转型需求旺盛",
        monetizationDifficulty: {
          level: 'medium' as const,
          challenges: "与Airtable等成熟产品竞争，但可通过企业版功能、私有化部署、插件市场盈利"
        }
      },
      
      reactFramework: {
        problemSolved: "简化React应用开发，提供生产就绪的全栈解决方案",
        userAppeal: "开发体验极佳，性能优秀，生态丰富，企业级特性完善",
        maintainerMotivation: "前端框架是基础设施，巨大的开发者生态带来商业价值和技术影响力",
        monetizationDifficulty: {
          level: 'high' as const,
          challenges: "框架本身难以直接盈利，主要通过周边服务（Vercel部署、培训、咨询）以及企业影响力获得收益"
        }
      },
      
      graphqlEngine: {
        problemSolved: "自动生成GraphQL API，简化后端API开发和数据查询复杂度",
        userAppeal: "开发效率极高，类型安全，实时订阅，减少前后端沟通成本",
        maintainerMotivation: "API开发是所有应用的基础需求，GraphQL采用率持续增长",
        monetizationDifficulty: {
          level: 'medium' as const,
          challenges: "技术相对复杂，目标用户主要是开发者，但可通过云服务、企业支持、专业培训盈利"
        }
      }
    };
  }
  
  private static generateGenericAnalysis(desc: string, topics: string, stats: any): ProjectAnalysis {
    // 通用分析逻辑
    let problemSolved = "解决开发过程中的特定技术问题";
    let userAppeal = "提供开源、免费的解决方案";
    let maintainerMotivation = "技术热情驱动的持续改进";
    let difficulty: 'low' | 'medium' | 'high' = 'medium';
    let challenges = "需要深入理解目标用户需求，建立可持续的盈利模式";
    
    // 基于描述关键词进行分析
    if (desc.includes('api') || topics.includes('api')) {
      problemSolved = "简化API开发和集成复杂度";
      userAppeal = "提高开发效率，减少重复工作";
    }
    
    if (desc.includes('dashboard') || desc.includes('ui') || topics.includes('dashboard')) {
      problemSolved = "提供现代化的用户界面和数据可视化能力";
      userAppeal = "美观易用的界面设计，良好的用户体验";
      difficulty = 'low';
      challenges = "UI库竞争激烈，但可通过付费组件、定制开发、设计服务盈利";
    }
    
    if (desc.includes('database') || topics.includes('database')) {
      problemSolved = "简化数据存储和管理的复杂性";
      userAppeal = "高性能、易部署、功能完整的数据库解决方案";
      difficulty = 'high';
      challenges = "数据库技术要求极高，需要长期投入，但企业级市场价值巨大";
    }
    
    if (stats.stars > 50000) {
      userAppeal += "，拥有庞大的社区支持和成熟的生态";
      maintainerMotivation = "大规模用户群体带来的影响力和潜在商业价值驱动持续投入";
    }
    
    return {
      problemSolved,
      userAppeal,
      maintainerMotivation,
      monetizationDifficulty: {
        level: difficulty,
        challenges
      }
    };
  }
}