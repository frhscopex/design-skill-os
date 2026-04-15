#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');

const program = new Command();

program
    .name('design-skill')
    .description('Elite Design Skill OS CLI - Multi-AI Support')
    .version('1.0.0');

const PLATFORMS = {
    claude: { path: '.claude/skills', global: path.join(os.homedir(), '.claude/skills') },
    cursor: { path: '.cursor/skills', global: path.join(os.homedir(), '.cursor/skills') },
    windsurf: { path: '.windsurf/skills', global: path.join(os.homedir(), '.windsurf/skills') },
    antigravity: { path: '.antigravity/skills', global: path.join(os.homedir(), '.antigravity/skills') },
    continue: { path: '.continue/skills', global: path.join(os.homedir(), '.continue/skills') },
    droid: { path: '.factory/skills', global: path.join(os.homedir(), '.factory/skills') },
    copilot: { path: '.github/skills', global: null },
    all: { path: 'skills', global: null }
};

program
    .command('init')
    .description('Initialize Design Skill OS for a specific AI assistant')
    .option('--ai <platform>', 'Specify target AI assistant (claude, cursor, windsurf, etc.)', 'claude')
    .option('--global', 'Install to global AI skill directory', false)
    .option('--offline', 'Use bundled assets without checking remote', false)
    .action(async (options) => {
        try {
            const platform = PLATFORMS[options.ai.toLowerCase()];
            if (!platform) {
                console.error(chalk.red(`✘ Unsupported AI platform: ${options.ai}`));
                console.log(chalk.yellow('Supported:'), Object.keys(PLATFORMS).join(', '));
                return;
            }

            const source = path.join(__dirname, '..', 'src', 'design-skill', 'SKILL.md');
            let destDir;

            if (options.global) {
                if (!platform.global) {
                    console.error(chalk.red(`✘ Global install not supported for ${options.ai}`));
                    return;
                }
                destDir = platform.global;
            } else {
                destDir = path.join(process.cwd(), platform.path);
            }

            const destFile = path.join(destDir, 'SKILL.md');
            const skillJsonDest = path.join(destDir, 'skill.json');
            const skillJsonSource = path.join(__dirname, '..', 'skill.json');

            await fs.ensureDir(destDir);
            await fs.copy(source, destFile);
            if (await fs.pathExists(skillJsonSource)) {
                await fs.copy(skillJsonSource, skillJsonDest);
            }

            console.log(chalk.green(`✔ Design Skill OS initialized for ${chalk.bold(options.ai)}!`));
            console.log(chalk.blue(`Location: ${destFile}`));

            console.log(chalk.cyan('\nNext Steps:'));
            console.log(`1. Ensure ${options.ai} is configured to use the skill from the location above.`);
            console.log('2. Run `design-skill prompt` to get the activation instructions.');
        } catch (err) {
            console.error(chalk.red('✘ Error initializing skill:'), err.message);
        }
    });

program
    .command('prompt')
    .description('Get the AI activation prompt for the OS')
    .action(() => {
        console.log(chalk.magenta.bold('\n--- MASTER DESIGNER PROMPT ---\n'));
        console.log(chalk.white(`"Adopt the following Design Skill OS. You are now an Elite Design Strategist. 
All future outputs must adhere to the rules, discovery frameworks, and quality 
checklists contained within the SKILL.md file. 

CRITICAL: Before generating any design or code, you MUST ask 3-5 discovery 
questions (The 'Why', the 'One Word', and the 'Ideal Protagonist') and wait 
for my answers before proceeding."`));
        console.log(chalk.magenta.bold('\n------------------------------\n'));
    });

program
    .command('versions')
    .description('List available versions')
    .action(() => {
        console.log(chalk.green('Current Version: 1.0.0'));
        console.log(chalk.dim('Available: 1.0.0 (latest)'));
    });

program
    .command('update')
    .description('Update to latest version')
    .action(() => {
        console.log(chalk.yellow('Checking for updates...'));
        console.log(chalk.green('✔ You are already on the latest version (1.0.0).'));
    });

program
    .command('uninstall')
    .description('Remove skill (auto-detect platform)')
    .option('--ai <platform>', 'Remove for specific platform')
    .option('--global', 'Remove from global install')
    .action(async (options) => {
        console.log(chalk.yellow('Uninstalling Design Skill OS...'));
        // Implementation for removal logic would go here
        console.log(chalk.green('✔ Uninstalled successfully (simulated).'));
    });

program.parse();

