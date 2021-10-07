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
type Game = {

    metadata: {
        name: string,
        version: string,
        author: string,
    },

    displaySettings: {
        renderWidth: number,
        renderHeight: number,
        backgroundColor: string,
        targetId: string,
    },

    editorSettings: {

    },

    scenes: Scene[],
    layers: Layer[],
    objects: Object[],
    timelines: Timeline[],
    behaviours: Behaviour[],
    systems: System[],
}


type GameConfig = {
    // metadata
    name: string,
    version: string,
    author: string,

    // rendering
    renderWidth: number,
    renderHeight: number
    backgroundColor: string,
    targetId: string,

    scenes: { [sceneName: string]: SceneConfig },
    systems: { [systemName: string]: SystemConfig },
}

interface SceneConfig {
    layers: { [layerName: string]: LayerConfig }
}

interface LayerConfig {
    eentities: { [entityName: string]: EntityConfig }
    }
    blendMode: BlendMode,
    effects: Effect[],
    transform: Matrix,
    background: Color,
    renderToTexture?: boolean,
    texture?: Textrue,
    entities: Entity[],
    behaviours: Behaviour[],
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

interface TimelineConfig {
    keyframes:
    startComponents: {},
    endComponents: {},
    entityPredicate: EntityPredicate,
}

type PrognosisEditorState = {

    sceneView: {
        camera: Camera,
        projectLayers: boolean,
    },

    gameView: {

    },

    inspector: {
        entity: Entity,
    },



};
```





# Top Level Commands

prognosis: Start
 - if you are already in a workspace with a prognosis.game.json boot up
 - otherwise ask if you want to start a new project

# UI

Explorer
    Scenes
    Systems
    Assets

```ts

type Game = {
    Metadata: {
        name: string,
        author: string,
        version: string,
    },
    Window: {
        renderWidth: number,
        renderHeight: number,
        background: string,
        targetId: string,
    },
    Scenes: { [name: string]: Scene },
    Layers: { [name: string]: Layer },
    Objects: { [name: string]: Object },
    Behaviours: { [name: string]: Behaviour },
    Systems: { [name: string]: System },
    Assets: { [name: string]: Asset },
};

type Scene = {
    name: string,
    layers: string[],
    behaviours: string[],
};

type Layer = {

};

// Create a tween to fade in and out layets on scene start and end

const tween = {
    initial: { opacity: 0 },
    delta: { opacity: 1 }
    duration: seconds(1),
    ease: Easings.Sin,
    // optional
    revert: false,
    loop: false,
    loopInAndOut: false,
    reverse: false,
};

when({ event: Events.SceneStart }, e => Tweens.play(tween));
when({ event: Events.SceneEnd }, e => {
    Tweens.stop(tween);
    tween.reverse = true;
    Tweens.play(tween);
});

// Creat a system to manage health

export type HealthProperties = {
    health: number;
};

export function healthSystem(objects: HealthProperties[]) {
    for (const object of objects) {
        if (object.health <= 0) {
            Objects.asyncDestory(object);
        }
    }
}


```

```
-- Create a tween to fade in and out layets on scene start and end

let tween = {
    .begin = { .opacity = 0 },
    .end = { .opacity = 1 },
    .duration = Time.seconds 1,
    .ease = Easings.easeInSin,

    -- optional
    .revert = false,
    .loop = false,
    .loopInAndOut = false,
    .reverse = false,
}

when { .event = .sceneBegin, ... } ->
    Tweens.play tween
when { .event = .sceneEnd, ... } ->
    Tweens.stop tween
    tween.reverse = true
    Tweens.play tween

// Creates a system that kills objects if health is less than zeero

system { health, ... } as object ~>
    if health <= 0 then

        -- award experience
        if let { experienceReward } = object then
            Objects.player.experience += experienceReward

        -- start sound if one is set
        if let { deathSound } = objct then
            Sounds.play deathSound

        -- play animation if one is set
        if let { deathAnimation } = object then
            await Animations.play object deathAnimation

        -- destroy the object after animation
        Objects.asyncDestroy object


let position = { .x = 0, .y = 0 }

import "IO" as {
    readFile,
    writeFile,
}

```

```json
{
    "Metadata": {
        "Name": "My Game",
        "Version": "0.0.1",
        "Author": "me!"
    },

    // Scene System
    "SceneConfig": {
        "InitialScene": "Main",
    },

    // Render System
    "RenderConfig": {
        "Width": 720,
        "Height": 480,
    },


}

```

```
-- refer to an image
Assets.Images.Alette

-- refer to a rawfile
Assets.Files.level1json -- string with file contents
```



## Components
 - Assets
    - Images (png, jpg)
        - Effect
        - Size
        - Crop
    - Fonts (https://developers.google.com/fonts/docs/css2)
    - Sounds (mp4)
    - Data files (eg. json) (Assets.data.filename or assets/data/...)
 - Scenes
    - Name
    - Layers
    - Effects
    - Behaviours
    - Camera
 - Layers
    - Name
    - Color
    - Opacity
    - Effects
    - Behaviours
 - Objects
    - Id
    - Name
    - ...
    - Effects
    - Behaviours
 - Events
    - GameStart
    - SceneStart
    - SceneEnd
    - ObjectCreate
    - ObjectDestroy
    - Update
    - KeyDown
    - KeyUp
    - MouseMove
    - MouseUp
    - MouseDown
    - MouseEnter
    - MouseLeave
    - Collision
 - Behaviours
 - Systems
 - Libraries
    - Mouse
        - Position
        - IsPressed
    - Key
        - Pressed
    - Animation
        - Play
        - Pause
        - Stop
    - Sound
        - Play
        - Pause
        - Stop
    - Tween
        - Play
        - Pause
        - Stop
    - Time
        - Now
        - Delay
    - Math
        - randomChoice
        - randomInRange
        - range
        - clamp
        - rectanglesIntersect
        - linesIntersect
        - rectangleContainsPoint
        - distanceBetweenPoints
    - Debug
        - Pause
        - Play
        - FPS

Editor lock to grid (set grid size) for easy level editing


## Core Properties
```js
const object = {
    // Common
    id: number,
    name: string,
    behaviours: Behaviour[],

    // SprieObject
    x: numbr,
    y: number,
    width: number,
    height: number,
    angle: number,
    image: Image,
    color: Color,
    opacity: number,
    effects: Effect[],

    // TextObject
    text: string,
    textFont: Font,
    textColor: Color,

    // PhysicsObject
    static: boolean,
    elastic: boolean,
}



when(Event.MoveRight, e => {
    Animation.play({
        object: e.object,
        frames: [ Assets.Images.right1, Assets.Images.right2, Assets.Images.right3 ],
        framesPerSecond: 15,
        loop: true,
    });
});

when(Event.Idle, e => {
        Animation.play({
        object: e.object,
        frames: [ Assets.Images.idle1, Assets.Images.idle2, Assets.Images.idle3 ],
        framesPerSecond: 15,
        loop: true,
    });
});

```

You will want the following in your vscode settings
```
 "javascript.preferences.importModuleSpecifierEnding": "js",
```

# TODO
 - [ ] MegaTexture.js (rewriting of Texture.js)
 - [ ] Runtime.js (needs a rewrite)




```js
Graphics.pushTransform
Graphics.popTransform
Graphics.pushEffect
Graphics.popEffect
Graphics.drawPoint
Graphics.drawLines
Graphics.drawQuad
Graphics.drawText
Graphics.drawImage
Graphics.drawTile

Loader.loadImage
Loader.loadGeneric

Loader.load({ toType: Types.Image, fromType: Types.String }, url);
```

## Generator Scripts
Scripts that run and create a large number of GameObjects, these can then
be previwed in the Editor (readonly). Will be useful for stuff like loading
level data from JSOn (Allette).

```js
// Generator script

// Generator parameters
export const Properties = {
    numOfEnemies: Number,
    // ...
};

@property(Number)
export var x;

export const generate = (props) => {
    // props will be set by editor, ala a GameObject
    return [
        gameObject1,
        gameObject2,
        // ...
    ]
};
```

# TODO
 - [X] DrawImage
 - [ ] DrawText
 - [ ] DebugText (FPS, Max Frame Time, Scene)
 - [ ] TileMaps
 - [ ] Animation
 - [ ] Sounds
 - [ ] Zones
 - [ ] Physics
 - [ ] Tweens (+ Easings)
 - [ ] Scene Transitions
 - [ ] Effects
 - [ ] Lines
 - [ ] Circles
 - [ ] Polygons
 - [ ] Shadows
 - [ ] Blend Modes
 - [ ] Lighting