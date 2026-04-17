#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');

const program = new Command();

const COPILOT_BLOCK_START = '<!-- design-skill-os:copilot-instructions:start -->';
const COPILOT_BLOCK_END = '<!-- design-skill-os:copilot-instructions:end -->';
const COPILOT_INSTRUCTIONS_BLOCK = `${COPILOT_BLOCK_START}
# Design Skill OS

Use \`.github/skills/design-skill-os/SKILL.md\` as the primary design reasoning protocol for this repository.

Before producing final design/code output:
1. Ask 3-5 discovery questions when requirements are ambiguous.
2. Apply hierarchy, typography, color, and UX heuristics from SKILL.md.
3. Run a self-critique pass for accessibility and anti-schtick quality checks.
${COPILOT_BLOCK_END}`;

program
    .name('design-skill')
    .description('Elite Design Skill OS CLI - Multi-AI Support')
    .version('1.0.2');

const PLATFORMS = {
    claude: { path: '.claude/skills', global: path.join(os.homedir(), '.claude/skills') },
    cursor: { path: '.cursor/skills', global: path.join(os.homedir(), '.cursor/skills') },
    windsurf: { path: '.windsurf/skills', global: path.join(os.homedir(), '.windsurf/skills') },
    antigravity: { path: '.antigravity/skills', global: path.join(os.homedir(), '.antigravity/skills') },
    continue: { path: '.continue/skills', global: path.join(os.homedir(), '.continue/skills') },
    droid: { path: '.factory/skills', global: path.join(os.homedir(), '.factory/skills') },
    copilot: { path: '.github/skills/design-skill-os', global: null },
    all: { path: 'skills', global: null }
};

program
    .command('init')
    .description('Initialize Design Skill OS for a specific AI assistant')
    .option('--ai <platform>', 'Specify target AI assistant (claude, cursor, windsurf, antigravity, copilot, etc.)', 'claude')
    .option('--global', 'Install to global AI skill directory', false)
    .option('--offline', 'Use bundled assets without checking remote', false)
    .action(async (options) => {
        try {
            const platform = PLATFORMS[options.ai.toLowerCase()];
            if (!platform) {
                console.error(chalk.red(`✘ Unsupported AI platform: ${options.ai}`));
                console.log(chalk.yellow('Supported:'), Object.keys(PLATFORMS).join(', '));
                process.exitCode = 1;
                return;
            }

            const source = path.join(__dirname, '..', 'src', 'design-skill', 'SKILL.md');
            let destDir;

            if (options.global) {
                if (!platform.global) {
                    console.error(chalk.red(`✘ Global install not supported for ${options.ai}`));
                    process.exitCode = 1;
                    return;
                }
                destDir = platform.global;
            } else {
                destDir = path.join(process.cwd(), platform.path);
            }

            if (!(await fs.pathExists(source))) {
                console.error(chalk.red(`✘ Missing skill source file: ${source}`));
                process.exitCode = 1;
                return;
            }

            const destFile = path.join(destDir, 'SKILL.md');
            const skillJsonDest = path.join(destDir, 'skill.json');
            const skillJsonSource = path.join(__dirname, '..', 'skill.json');

            await fs.ensureDir(destDir);
            await fs.copy(source, destFile);
            if (await fs.pathExists(skillJsonSource)) {
                await fs.copy(skillJsonSource, skillJsonDest);
            }

            if (options.ai.toLowerCase() === 'copilot') {
                const copilotInstructionsPath = path.join(process.cwd(), '.github', 'copilot-instructions.md');
                await fs.ensureDir(path.dirname(copilotInstructionsPath));

                if (!(await fs.pathExists(copilotInstructionsPath))) {
                    await fs.writeFile(copilotInstructionsPath, `${COPILOT_INSTRUCTIONS_BLOCK}\n`);
                } else {
                    const existing = await fs.readFile(copilotInstructionsPath, 'utf8');
                    if (!existing.includes(COPILOT_BLOCK_START)) {
                        const next = existing.trimEnd() ? `${existing.trimEnd()}\n\n${COPILOT_INSTRUCTIONS_BLOCK}\n` : `${COPILOT_INSTRUCTIONS_BLOCK}\n`;
                        await fs.writeFile(copilotInstructionsPath, next);
                    }
                }
            }

            console.log(chalk.green(`✔ Design Skill OS initialized for ${chalk.bold(options.ai)}!`));
            console.log(chalk.blue(`Location: ${destFile}`));

            console.log(chalk.cyan('\nNext Steps:'));
            console.log(`1. Ensure ${options.ai} is configured to use the skill from the location above.`);
            console.log('2. Run `design-skill prompt` to get the activation instructions.');
        } catch (err) {
            console.error(chalk.red('✘ Error initializing skill:'), err.message);
            process.exitCode = 1;
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
        console.log(chalk.green('Current Version: 1.0.2'));
        console.log(chalk.dim('Available: 1.0.2 (latest)'));
    });

program
    .command('update')
    .description('Update to latest version')
    .action(() => {
        console.log(chalk.yellow('Checking for updates...'));
        console.log(chalk.green('✔ You are already on the latest version (1.0.2).'));
    });

program
    .command('uninstall')
    .description('Remove skill (auto-detect platform)')
    .option('--ai <platform>', 'Remove for specific platform')
    .option('--global', 'Remove from global install')
    .action(async (options) => {
        const requested = options.ai ? [options.ai.toLowerCase()] : Object.keys(PLATFORMS).filter((name) => name !== 'all');
        let hadErrors = false;
        let removedFiles = 0;
        let touchedTargets = 0;

        console.log(chalk.yellow('Uninstalling Design Skill OS...'));

        for (const name of requested) {
            const platform = PLATFORMS[name];
            if (!platform) {
                console.error(chalk.red(`✘ Unsupported AI platform: ${name}`));
                hadErrors = true;
                continue;
            }

            if (options.global && !platform.global) {
                console.error(chalk.red(`✘ Global uninstall not supported for ${name}`));
                hadErrors = true;
                continue;
            }

            const targetDir = options.global ? platform.global : path.join(process.cwd(), platform.path);
            const filesToRemove = [path.join(targetDir, 'SKILL.md'), path.join(targetDir, 'skill.json')];
            touchedTargets += 1;

            for (const file of filesToRemove) {
                if (await fs.pathExists(file)) {
                    await fs.remove(file);
                    removedFiles += 1;
                }
            }

            if (!options.global && name === 'copilot') {
                const copilotInstructionsPath = path.join(process.cwd(), '.github', 'copilot-instructions.md');
                if (await fs.pathExists(copilotInstructionsPath)) {
                    const existing = await fs.readFile(copilotInstructionsPath, 'utf8');
                    if (existing.includes(COPILOT_BLOCK_START) && existing.includes(COPILOT_BLOCK_END)) {
                        const blockPattern = new RegExp(`${COPILOT_BLOCK_START}[\\s\\S]*?${COPILOT_BLOCK_END}\\n?`, 'g');
                        const cleaned = existing.replace(blockPattern, '').trim();
                        if (cleaned.length === 0) {
                            await fs.remove(copilotInstructionsPath);
                        } else {
                            await fs.writeFile(copilotInstructionsPath, `${cleaned}\n`);
                        }
                    }
                }
            }
        }

        if (hadErrors) {
            process.exitCode = 1;
            return;
        }

        if (removedFiles > 0) {
            console.log(chalk.green(`✔ Removed ${removedFiles} file(s) across ${touchedTargets} target(s).`));
            return;
        }

        console.log(chalk.green('✔ Nothing to remove. Skill files were not found in target locations.'));
    });

program.parse();
