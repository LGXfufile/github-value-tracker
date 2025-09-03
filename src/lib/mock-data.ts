import { GitHubProject, ProjectMetrics } from '@/types/github';

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
    last_updated: '2025-09-03T10:00:00Z'
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
    last_updated: '2025-09-03T09:45:00Z'
  },
  {
    project: {
      id: 3,
      name: 'posthog',
      full_name: 'PostHog/posthog',
      description: '🦔 PostHog provides open-source product analytics, session recording, feature flagging and A/B testing.',
      html_url: 'https://github.com/PostHog/posthog',
      stargazers_count: 21000,
      forks_count: 1200,
      open_issues_count: 180,
      watchers_count: 21000,
      language: 'Python',
      created_at: '2020-01-23T15:07:47Z',
      updated_at: '2025-09-03T11:20:00Z',
      pushed_at: '2025-09-03T11:00:00Z',
      homepage: 'https://posthog.com',
      topics: ['analytics', 'product-analytics', 'business', 'saas', 'open-source'],
      license: {
        key: 'mit',
        name: 'MIT License'
      }
    },
    stars_growth_7d: 180,
    stars_growth_30d: 900,
    fork_star_ratio: 0.057,
    commit_frequency: 120,
    contributors_count: 89,
    release_frequency: 24,
    issue_close_rate: 0.92,
    value_score: 86,
    last_updated: '2025-09-03T11:20:00Z'
  },
  {
    project: {
      id: 4,
      name: 'strapi',
      full_name: 'strapi/strapi',
      description: '🚀 Strapi is the leading open-source headless CMS. Its 100% JavaScript/TypeScript.',
      html_url: 'https://github.com/strapi/strapi',
      stargazers_count: 63000,
      forks_count: 7900,
      open_issues_count: 650,
      watchers_count: 63000,
      language: 'JavaScript',
      created_at: '2015-10-13T19:50:31Z',
      updated_at: '2025-09-03T08:30:00Z',
      pushed_at: '2025-09-02T16:45:00Z',
      homepage: 'https://strapi.io',
      topics: ['cms', 'headless-cms', 'api', 'nodejs', 'commercial'],
      license: {
        key: 'mit',
        name: 'MIT License'
      }
    },
    stars_growth_7d: 220,
    stars_growth_30d: 1200,
    fork_star_ratio: 0.125,
    commit_frequency: 35,
    contributors_count: 425,
    release_frequency: 8,
    issue_close_rate: 0.73,
    value_score: 82,
    last_updated: '2025-09-03T08:30:00Z'
  },
  {
    project: {
      id: 5,
      name: 'nocodb',
      full_name: 'nocodb/nocodb',
      description: '🔥 🔥 🔥 Open Source Airtable Alternative',
      html_url: 'https://github.com/nocodb/nocodb',
      stargazers_count: 48000,
      forks_count: 3200,
      open_issues_count: 420,
      watchers_count: 48000,
      language: 'TypeScript',
      created_at: '2021-03-07T18:16:48Z',
      updated_at: '2025-09-03T07:15:00Z',
      pushed_at: '2025-09-03T06:20:00Z',
      homepage: 'https://nocodb.com',
      topics: ['airtable-alternative', 'database', 'no-code', 'saas', 'enterprise'],
      license: {
        key: 'agpl-3.0',
        name: 'GNU Affero General Public License v3.0'
      }
    },
    stars_growth_7d: 290,
    stars_growth_30d: 1500,
    fork_star_ratio: 0.067,
    commit_frequency: 52,
    contributors_count: 156,
    release_frequency: 15,
    issue_close_rate: 0.81,
    value_score: 79,
    last_updated: '2025-09-03T07:15:00Z'
  }
];

export const MOCK_DISCOVERIES = [
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
      value_score: 75,
      stars_growth_7d: 450,
      stars_growth_30d: 2800,
      fork_star_ratio: 0.053,
      commit_frequency: 68,
      contributors_count: 67,
      release_frequency: 22,
      issue_close_rate: 0.87,
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
      value_score: 68,
      stars_growth_7d: 25,
      stars_growth_30d: 180,
      fork_star_ratio: 0.284,
      commit_frequency: 28,
      contributors_count: 89,
      release_frequency: 6,
      issue_close_rate: 0.76,
      last_updated: '2025-09-03T10:20:00Z'
    },
    reason: 'high_value_discovery',
    discovered_at: '2025-09-03T10:20:00Z'
  }
];