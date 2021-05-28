"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = __importDefault(require("./Config"));
const Project = __importStar(require("./Project"));
const Server = __importStar(require("./Server"));
const Builder = __importStar(require("./Builder"));
const Usage = `
Usage: prognosis <command> [--help|--version]
   ___  ___  ____  ______  ______  ____________
  / _ \\/ _ \\/ __ \\/ ___/ |/ / __ \\/ __/  _/ __/
 / ___/ , _/ /_/ / (_ /    / /_/ /\\ \\_/ /_\\ \\  
/_/  /_/|_|\\____/\\___/_/|_/\\____/___/___/___/  
                                 Version ${Config_1.default.version}

prognosis create  Create a new prognosis project in the working directory
prognosis start   Start a development server in the working directory
prognosis build   Build a release 
`;
const [_node, _script, ...args] = process.argv;
if (args.length !== 1) {
    console.log(Usage);
    process.exit(-1);
}
switch (args[0]) {
    case '-h':
    case '--help':
        console.log(Usage);
        break;
    case '-v':
    case '--version':
        console.log(Config_1.default.version);
        break;
    case 'create':
        Project.create();
        break;
    case 'start':
        Server.start();
        break;
    case 'build':
        Builder.build();
        break;
    default:
        console.error(`Unknown command: ${args[0]}!`);
        console.log(Usage);
        process.exit(-1);
}
