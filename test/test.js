import { readdir, stat } from "fs/promises";
import { basename, dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { inspect } from "util";
import { Ansi } from "../src/common/ansi.js";
import { equiv } from "../src/common/common.js";
const ThisPath = fileURLToPath(import.meta.url);
const styleOk = Ansi.fgGreen.bright;
const styleOkAlt = Ansi.bgGreen.bright.fgBlack;
const styleWarn = Ansi.fgYellow;
const styleWarnAlt = Ansi.bgYellow.bright.fgBlack;
const styleError = Ansi.fgRed;
const styleErrorAlt = Ansi.bgRed.bright;
function logPass(name) {
    TestResults.pass += 1;
    console.log(`${styleOk(` ✔ `)}${name}`);
}
function logFail(name, error) {
    TestResults.fail += 1;
    console.log(`${styleError(` ✘ `)}${name}\n`);
    console.log(error.stack);
}
function logError(name, error) {
    TestResults.error += 1;
    console.log(`${styleWarn(` ✘ `)}${name}\n`);
    console.log(error.stack);
}
const TestResults = {
    pass: 0,
    fail: 0,
    error: 0,
};
let currentModulePrefix = "";
export class AssertionError extends Error {
    expected;
    actual;
    constructor(expected, actual) {
        const inspectedExpected = inspect(expected);
        const inspectedActual = inspect(actual);
        super(`Assertion failed!\n\n  expected: ${inspectedExpected}\n\n  actual: ${inspectedActual}\n`);
        this.name = AssertionError.name;
        this.expected = expected;
        this.actual = actual;
    }
}
export function test(name, callback) {
    const qualifiedName = `${currentModulePrefix}${name}`;
    try {
        callback();
        logPass(qualifiedName);
    }
    catch (error) {
        if (error instanceof AssertionError) {
            logFail(qualifiedName, error);
        }
        else {
            logError(qualifiedName, error);
        }
    }
}
export async function asyncTest(name, callback) {
    const qualifiedName = `${currentModulePrefix}${name}`;
    try {
        await callback();
        logPass(qualifiedName);
    }
    catch (error) {
        console.error(error);
        if (error instanceof AssertionError) {
            logFail(qualifiedName, error);
        }
        else {
            logError(qualifiedName, error);
        }
    }
}
export function assertTrue(condition) {
    if (condition !== true) {
        throw new AssertionError(true, condition);
    }
}
export function assertFalse(condition) {
    if (condition !== false) {
        throw new AssertionError(false, condition);
    }
}
export function assertEquals(expected, actual) {
    if (actual !== expected) {
        throw new AssertionError(expected, actual);
    }
}
export function assertNotEquals(expected, actual) {
    if (actual === expected) {
        throw new AssertionError(expected, actual);
    }
}
export function assertEquiv(expected, actual) {
    if (!equiv(expected, actual)) {
        throw new AssertionError(expected, actual);
    }
}
export function assertNotEquiv(expected, actual) {
    if (equiv(expected, actual)) {
        throw new AssertionError(expected, actual);
    }
}
export function assertThrows(callback, errorClass = Error) {
    try {
        callback();
        throw new AssertionError(errorClass, undefined);
    }
    catch (error) {
        if (!(error instanceof errorClass)) {
            throw new AssertionError(errorClass, error);
        }
    }
}
export async function assertAsyncThrows(callback, errorClass = Error) {
    try {
        await callback();
        throw new AssertionError(errorClass, undefined);
    }
    catch (error) {
        if (!(error instanceof errorClass)) {
            throw new AssertionError(errorClass, error);
        }
    }
}
async function importTestsFrom(path) {
    if (ThisPath === path) {
        return;
    }
    const pathStat = await stat(path);
    if (pathStat.isDirectory()) {
        const childNames = await readdir(path);
        const childPaths = childNames.map((name) => resolve(path, name));
        const childImports = childPaths.map(importTestsFrom);
        await Promise.all(childImports);
    }
    else if (path.endsWith(".ts")) {
        const moduleName = basename(path);
        const styledTest = styleOkAlt(" TEST ");
        console.log(`\n${styledTest} Running tests in ${moduleName}... \n`);
        currentModulePrefix = moduleName + " - ";
        await import(path);
    }
}
export async function runAll() {
    await importTestsFrom(dirname(ThisPath));
    const { pass, fail, error } = TestResults;
    const summaryStyle = fail ? styleErrorAlt : error ? styleWarnAlt : styleOkAlt;
    const styledSummary = summaryStyle(" SUMMARY ");
    const styledPass = styleOk(pass);
    const styledFail = styleError(fail);
    const styledError = styleWarn(error);
    console.log(`\n${styledSummary} pass: ${styledPass} fail: ${styledFail} error: ${styledError}\n`);
}
if (process.argv[1] === ThisPath) {
    runAll();
}
//# sourceMappingURL=test.js.map