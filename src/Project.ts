import fs from 'fs';
import util from 'util';

const asyncFs = util.promisify(fs);

export async function setup() {
    await setupPackageJson();
    await setupTypeScriptConfig();
    await setupBuild();
    await setupAssets();
    await setupPrognosis();
}

async function setupPackageJson() {
    fs.exi
}

async function setupTypeScriptConfig() {

}

async function setupBuild() {

}

async function setupAssets() {

}

async function setupPrognosis() {

}
