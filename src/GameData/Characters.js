export const Characters = [
  {
    name: 'Dog',
    desc: `Awwwwwwww. So cute!`,
    room: 'backyard',
    hiding: [],
    response: () => {
      

      const responses = [
        'Arf! Arf! Arf!',
        `BORK!`,
        '*Tail wagging intensifies*',
      ];

      return responses[Math.floor(Math.random() * responses.length)]
    },
    commentary:
      'He appears to be a good boy, so you give him a pat on the noggin.',
    getText: 'You wrap him up in a big bear hug, but he wriggles out effortlessly. Sneaky little thing...',
    getAble: false
  },
];


// {
//   name: 'Swingset', // the item's name
//   desc: `You remember when you would try to swing high enough to do a full rotation? You weren't even close, but it was still fun.`, // description shown when player looks at the item
//   inInv: false,
//   room: 'park',
//   found: true,
//   hiding: [
//     {
//       name: 'Gameboy',
//       availableText:
//         'A GAMEBOY balances precariously on the edge of one of the seats.',
//       taken: false,
//     },
//   ],
//   inspected: false,
//   hiddenBy: '',
//   getText: `Hmm, I don't think that's going anywhere...`,
//   getAble: false,
//   taken: false
// },
// {