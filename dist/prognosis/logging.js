const LoggingClass = class Logging {
    rootConsoleLog;
    constructor() {
        this.rootConsoleLog = console.log;
        this.format = "{time} - {message}";
    }
    set format(format) {
        console.log = (...args) => {
            const now = new Date();
            let out = format;
            out = out.replace("{message}", args.join(" "));
            out = out.replace("{time}", now.toLocaleTimeString());
            out = out.replace("{date}", now.toLocaleDateString());
            this.rootConsoleLog(out);
        };
    }
};
export const Logging = new LoggingClass();
//# sourceMappingURL=logging.js.map