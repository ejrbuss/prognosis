const AnsiCodes = {
	reset: "\x1b[0m",
	bright: "\x1b[1m",
	dim: "\x1b[2m",
	underscore: "\x1b[4m",
	blink: "\x1b[5m",
	reverse: "\x1b[7m",
	hidden: "\x1b[8m",
	fgBlack: "\x1b[30m",
	fgRed: "\x1b[31m",
	fgGreen: "\x1b[32m",
	fgYellow: "\x1b[33m",
	fgBlue: "\x1b[34m",
	fgMagenta: "\x1b[35m",
	fgCyan: "\x1b[36m",
	fgWhite: "\x1b[37m",
	bgBlack: "\x1b[40m",
	bgRed: "\x1b[41m",
	bgGreen: "\x1b[42m",
	bgYellow: "\x1b[43m",
	bgBlue: "\x1b[44m",
	bgMagenta: "\x1b[45m",
	bgCyan: "\x1b[46m",
	bgWhite: "\x1b[47m",
};

type AnsiCodeName = keyof typeof AnsiCodes;

type Styler = (text: unknown) => string;

type ChainableStyler = Styler & {
	[ansiCodeName in AnsiCodeName]: ChainableStyler;
};

function makeChainable(styler: Styler): ChainableStyler {
	Object.keys(AnsiCodes).forEach((ansiCodeName) => {
		Object.defineProperty(styler, ansiCodeName, {
			get() {
				return makeChainable((text) => {
					return `${AnsiCodes[ansiCodeName as AnsiCodeName]}${styler(text)}`;
				});
			},
		});
	});
	return styler as ChainableStyler;
}

export const Ansi = makeChainable((text) => `${text}${AnsiCodes.reset}`);
