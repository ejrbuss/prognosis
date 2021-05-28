# prognosis

## Commands
```sh
# view a help message
$ prognosis -h | --help

# view the version number
prognosis -v | --version

# create a new project in the current repository
$ progonosis new

# start the development server for a project
$ prognosis start

# create a release build of a project
$ prognosis build

# rrun a release build of a project
$ prognosis run
```

## Systems
```ts
interface Project {
    name: string,
    version: string,
    author: string,
    initialScene: Scene,
}

interface Display {
    resolution?: [number, number],
    aspectRation?: [number, number],
    dynamicResolution?: boolean,
    dynamicAspectRation?: boolean,
    background?: Color,
    unit: Unit,
}

interface Entity {
    id: number,
    // ... components
}

interface Group {
    ids: number[],
}

interface SpriteComponents { ... }
interface PhysicsComponents { ... }
interface AudioComponents { ... }
interface AnimationComponents { ... }

type Behaviour = (event: Event, entites: Entity[]): void,

interface Scene {
    layers: Layer[],
    effects: Effect[],
}

interface Layer {
    name: string,
    visible: boolean,
    opacity: number,
    blendMode: BlendMode,
    effects: Effect[],
    transform: Matrix,
    background: Color,
    renderToTexture?: boolean,
    texture?: Textrue,
    entities: Entity[],
    behaviours: Behaviour[],
}

interface Timeline {
    startComponents: {},
    endComponents: {},
    entityPredicate: EntityPredicate,
}
```