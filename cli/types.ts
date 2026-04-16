/**
 * CLI Configuration Types
 */

export interface SkillConfig {
    name: string;
    version: string;
    description: string;
    platforms: string[];
    paths: {
        [key: string]: {
            local: string;
            global: string;
        }
    };
}

export type Platform = 'claude' | 'cursor' | 'windsurf' | 'antigravity' | 'continue' | 'droid' | 'copilot' | 'all';
