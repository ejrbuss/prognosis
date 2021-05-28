import * as Config from './Config';
import * as Server from './Server';
import * as Builder from './Builder';

const Usage =
`
Usage: prognosis (start|build) [--help|--version]
   ___  ___  ____  ______  ______  ____________
  / _ \\/ _ \\/ __ \\/ ___/ |/ / __ \\/ __/  _/ __/
 / ___/ , _/ /_/ / (_ /    / /_/ /\\ \\_/ /_\\ \\  
/_/  /_/|_|\\____/\\___/_/|_/\\____/___/___/___/  
                                 Version ${Config.Version}

prognosis start   Start a development server in the working directory
prognosis build   Build a release 
`;

const [ _node, _script, ...args ] = process.argv;

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
      console.log(Config.Version);
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