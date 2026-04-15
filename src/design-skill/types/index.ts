/**
 * Design Skill OS - Core Type Definitions
 * v2.0.0
 */

export type Industry =
    | 'SaaS'
    | 'Fintech'
    | 'Healthcare'
    | 'E-commerce'
    | 'AI'
    | 'Portfolio'
    | 'General';

export interface DesignSystem {
    meta: {
        industry: string;
        confidence_score: 'High' | 'Medium' | 'Low';
        derived_from: string;
    };
    visual_hierarchy: {
        pattern: string;
        principles: string[];
    };
    branding: {
        colors: string[];
        typography: string[];
        mood: string;
    };
    strategic_intent: string;
    anti_patterns: string[];
    audit_logs: string[];
}

export interface TypoScaleStep {
    step: number;
    px: number;
    rem: number;
}

export interface RedTeamAudit {
    phase: 'Heuristics' | 'Accessibility' | 'Anti-Schtick' | 'Narrative';
    status: 'passed' | 'failed' | 'warning';
    message: string;
}
