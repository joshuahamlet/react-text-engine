export const Items = [
  {
    name: 'Swingset', // the item's name
    desc: `You remember when you would try to swing high enough to do a full rotation? You weren't even close, but it was still fun.`, // description shown when player looks at the item
    inInv: false,
    room: 'park',
    found: true,
    hiding: [
      {
        name: 'Gameboy',
        availableText:
          'A GAMEBOY balances precariously on the edge of one of the seats.',
        taken: false,
      },
    ],
    inspected: false,
    hiddenBy: '',
    getText: `Hmm, I don't think that's going anywhere...`,
    getAble: false,
    taken: false
  },
  {
    name: 'Sandbox', // the item's name
    desc: `A wooden frame sits flush with the surrounding grass. A few crumpled attemts at sandcastles are stewn about a landscape of litte footprints and handprints.`, // description shown when player looks at the item
    inInv: false,
    room: 'park',
    found: true,
    hiding: [
      {
        name: 'Tamagotchi',
        availableText:
          'Among the long forgotten plastic pails and shovels, a TAMAGOTCHI is half buried in the sand.',
        taken: false,
      },
    ],
    inspected: false,
    hiddenBy: '',
    getText: `Hmm, I don't think that's going anywhere...`,
    getAble: false,
    taken: false
  },
  {
    name: 'Phone', // the item's name
    desc: `A Nokia brick. Not much but gets the job done. And it plays Snake! They sure don't make games like they used to.`, // description shown when player looks at the item
    inInv: true,
    room: 'none',
    found: true,
    hiding: [],
    hiddenBy: '',
    getText: '',
    getAble: true,
    taken: true
  },
  {
    name: 'Wallet', // the item's name
    desc: `Looks pretty empty in there :'(`, // description shown when player looks at the item
    inInv: true,
    room: 'none',
    found: true,
    hiding: [],
    hiddenBy: '',
    getText: '',
    getAble: true,
    taken: true
  },
  {
    name: 'Keys', // the item's name
    desc: `Kinda forget what most of these go to.`, // description shown when player looks at the item
    inInv: true,
    room: 'none',
    found: true,
    hiding: [],
    hiddenBy: '',
    getText: '',
    getAble: true,
    taken: true
  },
  {
    name: 'Tamagotchi', // the item's name
    desc: `RIP to all of the little digital creatures that have kicked the bucket due to my neglect.`, // description shown when player looks at the item
    inInv: false,
    room: 'park',
    found: false,
    hiding: [],
    hiddenBy: 'Sandbox',
    getText: `The little pixelized pet let's out a chirp as you slide it onto your keyring.`,
    getAble: true,
    taken: false
  },
  {
    name: 'Gameboy', // the item's name
    desc: `You sunk hundreds of hours on this glorious grey brick. Looks like it hs a fresh set of batteries! Score!`, // description shown when player looks at the item
    inInv: false,
    room: 'park',
    found: false,
    hiding: [],
    hiddenBy: 'Swingset',
    getText: `It's even clunkier than you remember. After a brief struggle you manage to wrestle it into your pocket.`,
    getAble: true,
    taken: false
  },
  {
    name: 'Fridge', // the item's name
    desc: `It hums faithfully in the corner, cutting through the eerie silence of the room. As your hand tugs the wobbly handle, a cool musty puff of air hits your nostrils. A gently flickering light illuminates a sparse interior.`, // description shown when player looks at the item
    inInv: false,
    room: 'home',
    found: true,
    hiding: [
      {
        name: 'Cola',
        availableText:
          'A can of COLA stands lonely on the top shelf.',
        taken: false,
      },
    ],
    hiddenBy: '',
    getText: `That's probably a bit too bulky to take with you...`,
    getAble: false,
    taken: false
  },
  {
    name: 'Drawer', // the item's name
    desc: `As you pull, the dry warped wood drags on your ears with an obnoxious screech. Inside is a chaotic assortment of tangled cables, old trinkets, and other oddities.`,
    inInv: false,
    room: 'home',
    found: true,
    hiding: [
      {
        name: 'Cartridge',
        availableText:
          'Nestled in the clutter, your eye catches the corner of an old Gameboy CARTRIDGE.',
        taken: false,
      },
    ],
    hiddenBy: '',
    getText: `You pull harder, but the drawer refuses to budge past a certain point. Best you leave it here anyways...`,
    getAble: false,
    taken: false
  },
  {
    name: 'Cartridge', // the item's name
    desc: `An old Gameboy cart. The label is so worn you can no longer read it. You must have really loved this game.`, // description shown when player looks at the item
    inInv: false,
    room: 'home',
    found: false,
    hiding: [],
    hiddenBy: 'Drawer',
    getText: `You slip the thin grey cart into your pocket. Can't wait to play it.`,
    getAble: true,
    taken: false
  },
  {
    name: 'Cola', // the item's name
    desc: `The label reads "RC" in bold red and white against a deep blue. You almost forgot these existed.`, // description shown when player looks at the item
    inInv: false,
    room: 'home',
    found: false,
    hiding: [],
    hiddenBy: 'Fridge',
    getText: 'As you take the can, the beads of condensation make your hand cold and clammy.',
    getAble: true,
    taken: false
  },
];
