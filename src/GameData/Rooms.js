export const Rooms = [
  {
    id: 'park',

    name: 'The Park',

    desc: `A quaint but uninspired suburban park, silent but for the restless chatter of crickets. In the center is a rusty old SWINGSET. It's chains creak with the stirring of the wind. At the right edge of the park is a SANDBOX.`,

    items: ['Swingset', 'Tamagotchi', 'Gameboy'],

    characters: [],

    exits: [
      {
        dir: 'N',
        id: '',
        desc: '',
        blocked: true,
        blockedText: 'The path leading through the park has been reclaimed by a wall of thick brambles. Though you wish you could walk that way, you take a moment to appreciate the rustic untamed beauty of the scene before you.',
      },
      {
        dir: 'S',
        id: '',
        desc: '',
        blocked: true,
        blockedText: `The block is speckled with the soft light of windows half open in the balmy summer air. You smile as you think about families gathering for dinner as stars begin to sheepishly amble into the evening sky. You don't notice anything of particulsr note, so you decide not to cross the street.`,
      },
      {
        dir: 'E',
        id: 'home',
        desc: 'Your feet dance effortlessly between and around the potholes littering the street. You can almost feel the texture of the weathered asphalt through the worn soles of your sneakers.',
        blocked: false,
        blockedText: ``,
      },
      {
        dir: 'W',
        id: '',
        desc: '',
        blocked: true,
        blockedText: `It looks like the street lights have abruptly cut out in that direction. Though you wouldn't describe the looming darkness as forboding or sinsister, you still think it best not to contnue.`,
      },
    ],
  },
  {
    id: 'home',

    name: 'Home',

    desc: `You find yourself in the most important room, the kitchen. The floor is covered in a cheap linoleum, peeled up and chipping around the edges. In the far corner is a vintage looking FRIDGE. Running along the wall to your right is a counter with cupboards and drawers underneath. You notice one DRAWER is slightly ajar.`,

    items: ['Fridge', 'Cartridge', 'Cola'],

    characters: [],

    exits: [
      {
        dir: 'N',
        id: 'backyard',
        desc: 'The screen door whispers a subdued squeak before slapping the doorframe with a rattle. The dusty boards of a short small deck creak beaneath your feet.',
        blocked: false,
        blockedText: ``,
      },
      {
        dir: 'S',
        id: '',
        desc: '',
        blocked: true,
        blockedText: `The street and sidewalk have been torn up in that direction. You probably should wait until the roadwork has been finished to head that way.`,
      },
      {
        dir: 'E',
        id: 'bridge',
        desc: 'blippity bloop',
        blocked: true,
        blockedText: `A light fog whisps around your ankles as you embark. Within a few steps it grows into thick disorienting haze. You stubbornly plod along until you find yourself back where you started.`,
      },
      {
        dir: 'W',
        id: 'park',
        desc: 'As you step off the sidewalk, you notice how the streetlights bathe the neighborhood in a warm yellowish glow. The quiet park appears deathly still, as if preserved in amber.',
        blocked: false,
        blockedText: ``,
      },
    ],
  },
  {
    id: 'backyard',

    name: 'Backyard',

    desc: `Short parched grass crunches underfoot. Some resilient weeds have gathered in the few refuges of shade, painting the corners of the otherwise drab yard with more lively hues. A scruffy DOG sits on the far end, giving you a quizical stare.`,

    items: [],

    characters: ['Dog'],

    exits: [
      {
        dir: 'N',
        id: '',
        desc: '',
        blocked: true,
        blockedText: `Time has peppered the sturdy fence with patches of peeling paint. It is fairly tall, you don't really feel like trying to clamber over it. Besides, you wouldn't want to disturb the neighbors.`,
      },
      {
        dir: 'S',
        id: 'home',
        desc: `You give the doormat a couple of quick stamps on your way back in. As it's coarse bristles cough up little plumes of dust, you wonder if your shoes are actually dirtier now.`,
        blocked: false,
        blockedText: ``,
      },
      {
        dir: 'E',
        id: '',
        desc: '',
        blocked: true,
        blockedText: `Time has peppered the sturdy fence with patches of peeling paint. It is fairly tall, you don't really feel like trying to clamber over it. Besides, you wouldn't want to disturb the neighbors.`,
      },
      {
        dir: 'W',
        id: '',
        desc: '',
        blocked: true,
        blockedText: `Time has peppered the sturdy fence with patches of peeling paint. It is fairly tall, you don't really feel like trying to clamber over it. Besides, you wouldn't want to disturb the neighbors.`,
      },
    ],
  },
  {
    id: 'bridge',

    name: 'Bridge',

    desc: `It's a bridge.`,

    items: [],

    characters: [],

    exits: [
      {
        dir: 'N',
        id: '',
        desc: '',
        blocked: true,
        blockedText: `Nope North.`,
      },
      {
        dir: 'S',
        id: '',
        desc: ``,
        blocked: true,
        blockedText: `Nope South.`,
      },
      {
        dir: 'E',
        id: '',
        desc: '',
        blocked: true,
        blockedText: `Nope East.`,
      },
      {
        dir: 'W',
        id: 'home',
        desc: 'swhoop',
        blocked: false,
        blockedText: ``,
      },
    ],
  },
];
