#!/usr/bin/env node

import * as fs from 'node:fs';
import * as process from 'node:process';
import * as path from 'node:path';
import * as child_process from 'node:child_process';
import { globSync } from 'glob';
import terminal from 'terminal-kit';

function getBaseDir() {
    // Find package.json
    let basedir = process.cwd();
    let found = false;
    while (!found && basedir != '/') {
        term('Looking for ^gpackage.json^ : ^b%s', basedir);
        if (fs.existsSync(basedir + '/package.json')) {
            found = true;
        } else {
            basedir = path.join(basedir, '..');
            term.eraseLine().column(0);
        }
    }
    term.eraseLine().column(0);
    if (!found) return null;
    return basedir;
}

const term = terminal.terminal;

const main = async () => {
    const basedir = getBaseDir();
    if (!basedir) {
        term('^rFailed^ to find ^gpackage.json^.\n');
        process.exit(1);
    }
    term('Found ^gpackage.json^ : ^b%s^.\n', basedir);

    // clean the 'dist' dir
    process.chdir(basedir);
    term('Working from ^b%s^.\n', process.cwd());
    if (fs.existsSync('dist')) {
        term('Removing existing ^bdist^ directory.\n');
        fs.rmSync('dist', { recursive: true, force: true });
    }
    term('Creating ^bdist^ directory.\n');
    fs.mkdirSync('dist');

    term('Running ^ytsc^ ...\n');
    try {
        const output = child_process.execSync('npx tsc');
        if (output.length) {
            term(output);
        }
    } catch (err) {
        term('^rCompile failed.\n');
        term.red(err.stdout.toString())('\n');
        process.exit(1);
    }

    term('Running ^yrollup^ ...\n');
    try {
        const output = child_process.execSync('npx rollup -c');
        if (output.length) {
            term(output);
        }
    } catch (err) {
        term('^rRollup failed.\n');
        term.red(err.stdout.toString())('\n');
        process.exit(1);
    }

    term('Copying ^gLICENSE^ to ^bdist\n');
    fs.copyFileSync('LICENSE', 'dist/LICENSE');

    term('Copying ^gREADME.md^ to ^bdist\n');
    fs.copyFileSync('README.md', 'dist/README.md');

    term('Reading ^gpackage.json\n');
    var packageJson = JSON.parse(fs.readFileSync('package.json'));
    packageJson.devDependencies = {};
    packageJson.scripts = {};
    packageJson.prettier = {};
    packageJson.main = './index.js';
    packageJson.types = './index.d.ts';
    packageJson.browser = './gw-dig.min.js';

    term('Writing updated ^gpackage.json^ to ^bdist\n');
    fs.writeFileSync('dist/package.json', JSON.stringify(packageJson, null, 4));

    // Copy files for docs
    term('Copying build files to ^bdocs\n');
    const buildFiles = globSync('dist/gw-dig.js*');
    for (let file of buildFiles) {
        fs.copyFileSync(file, 'docs/js/' + path.basename(file));
    }

    term('Updating ^ggw-utils^ libs in ^bdocs\n');
    const utilsLibs = globSync('node_modules/gw-utils/gw-utils.js*');
    for (let file of utilsLibs) {
        fs.copyFileSync(file, 'docs/js/' + path.basename(file));
    }

    if (fs.existsSync('../gw-utils')) {
        term('Updating ^bdocs^ code files from ^cgw-utils^ local repo\n');
        fs.copyFileSync('../gw-utils/docs/js/manual.js', 'docs/js/manual.js');
        const cssFiles = globSync('../gw-utils/docs/css/*');
        for (let file of cssFiles) {
            fs.copyFileSync(file, 'docs/css/' + path.basename(file));
        }
    } else {
        term(
            '^cgw-utils^ local repository not found - Not updating ^bdocs^ files\n'
        );
    }

    // Create version file for docs
    term('Creating ^gVERSION^ file in ^bdocs\n');
    fs.writeFileSync('docs/VERSION', `${packageJson.version}\n`, { flag: 'w' });

    term('^gok^ - ' + packageJson.version + '\n');
};

main();
