// global properties, assigned with let for easy overriding by the user
let disk;

// store user input history
let inputs = [''];
let inputsPos = 0;

// define list style
let bullet = '•';

// reference to the input element
let input = document.querySelector('#input');

// add any default values to the disk
// disk -> disk
let init = (disk) => {
  const initializedDisk = Object.assign({}, disk);
  initializedDisk.rooms = disk.rooms.map((room) => {
    // number of times a room has been visited
    room.visits = 0;
    return room;
  });

  if (!initializedDisk.inventory) {
    initializedDisk.inventory = [];
  }

  if (!initializedDisk.characters) {
    initializedDisk.characters = [];
  }

  initializedDisk.characters = initializedDisk.characters.map(char => {
    // player's conversation history with this character
    char.chatLog = [];
    return char;
  });

  return initializedDisk;
};

// register listeners for input events
let setup = () => {
  input.addEventListener('keypress', (e) => {
    const ENTER = 13;

    if (e.keyCode === ENTER) {
      applyInput();
    }
  });

  input.addEventListener('keydown', (e) => {
    input.focus();

    const UP = 38;
    const DOWN = 40;
    const TAB = 9;

    if (e.keyCode === UP) {
      navigateHistory('prev');
    } else if (e.keyCode === DOWN) {
      navigateHistory('next');
    } else if (e.keyCode === TAB) {
      e.stopPropagation();
      e.preventDefault()
      autocomplete();
    }
  });

  input.addEventListener('focusout', () => {
    input.focus({preventScroll: true});
  });
};

// convert the disk to JSON and store it
// (optionally accepts a name for the save)
let save = (name) => {
  const save = JSON.stringify(disk, (key, value) => typeof value === 'function' ? value.toString() : value);
  localStorage.setItem(name, save);
  const line = name.length ? `Game saved as "${name}".` : `Game saved.`;
  println(line);
};

// restore the disk from storage
// (optionally accepts a name for the save)
let load = (name) => {
  const save = localStorage.getItem(name);

  if (!save) {
    println(`Save file not found.`);
    return;
  }

  disk = JSON.parse(save, (key, value) => {
    try {
      return eval(value);
    } catch (error) {
      return value;
    }
  });

  const line = name.length ? `Game "${name}" was loaded.` : `Game loaded.`;
  println(line);
  enterRoom(disk.roomId);
};

// list player inventory
let inv = () => {
  const items = disk.inventory.filter(item => !item.isHidden);

  if (!items.length) {
    println(`You don't have any items in your inventory.`);
    return;
  }

  println(`You have the following items in your inventory:`);
  items.forEach(item => {
    println(`${bullet} ${getName(item.name)}`);
  });
};

// show room description
let look = () => {
  const room = getRoom(disk.roomId);

  if (typeof room.onLook === 'function') {
    room.onLook({disk, println});
  }

  println(room.desc)
};

// look in the passed way
// string -> nothing
let lookThusly = (str) => println(`You look ${str}.`);

// look at the passed item or character
// array -> nothing
let lookAt = (args) => {
  const [_, name] = args;
  const item = getItemInInventory(name) || getItemInRoom(name, disk.roomId);

  if (item) {
    // Look at an item.
    if (item.desc) {
      println(item.desc);
    } else {
      println(`You don\'t notice anything remarkable about it.`);
    }

    if (typeof(item.onLook) === 'function') {
      item.onLook({disk, println, getRoom, enterRoom, item});
    }
  } else {
    const character = getCharacter(name, getCharactersInRoom(disk.roomId));
    if (character) {
      // Look at a character.
      if (character.desc) {
        println(character.desc);
      } else {
        println(`You don't notice anything remarkable about them.`);
      }

      if (typeof(character.onLook) === 'function') {
        character.onLook({disk, println, getRoom, enterRoom, item});
      }
    } else {
      println(`You don't see any such thing.`);
    }
  }
};

// list available exits
let go = () => {
  const room = getRoom(disk.roomId);
  const exits = room.exits.filter(exit => !exit.isHidden);

  if (!exits) {
    println(`There's nowhere to go.`);
    return;
  }

  println(`Where would you like to go? Available directions are:`);
  exits.forEach((exit) => {
    const rm = getRoom(exit.id);

    if (!rm) {
      return;
    }

    const dir = getName(exit.dir).toUpperCase();
    // include room name if player has been there before
    const directionName = rm.visits > 0
      ? `${dir} - ${rm.name}`
      : dir

    println(`${bullet} ${directionName}`);
  });
};

// find the exit with the passed direction in the given list
// string, array -> exit
let getExit = (dir, exits) => exits.find(exit =>
  Array.isArray(exit.dir)
    ? exit.dir.includes(dir)
    : exit.dir === dir
);

// go the passed direction
// string -> nothing
let goDir = (dir) => {
  const room = getRoom(disk.roomId);
  const exits = room.exits;

  if (!exits) {
    println(`There's nowhere to go.`);
    return;
  }

  const nextRoom = getExit(dir, exits);

  if (!nextRoom) {
    println(`There is no exit in that direction.`);
    return;
  }

  if (nextRoom.block) {
    println(nextRoom.block);
    return;
  }

  enterRoom(nextRoom.id);
};

// shortcuts for cardinal directions
let n = () => goDir('north');
let s = () => goDir('south');
let e = () => goDir('east');
let w = () => goDir('west');
let ne = () => goDir('northeast');
let se = () => goDir('southeast');
let nw = () => goDir('northwest');
let sw = () => goDir('southwest');

// if there is one character in the room, engage that character in conversation
// otherwise, list characters in the room
let talk = () => {
  const characters = getCharactersInRoom(disk.roomId);

  // assume players wants to talk to the only character in the room
  if (characters.length === 1) {
    talkToOrAboutX('to', getName(characters[0].name));
    return;
  }

  // list characters in the room
  println(`You can talk TO someone or ABOUT some topic.`);
  chars();
};

// speak to someone or about some topic
// string, string -> nothing
let talkToOrAboutX = (preposition, x) => {
  const room = getRoom(disk.roomId);

  if (preposition !== 'to' && preposition !== 'about') {
    println(`You can talk TO someone or ABOUT some topic.`);
    return;
  }

  const character =
    preposition === 'to' && getCharacter(x, getCharactersInRoom(room.id))
      ? getCharacter(x, getCharactersInRoom(room.id))
      : disk.conversant;
  let topics;

  // give the player a list of topics to choose from for the character
  const listTopics = () => {
    // capture reference to the current conversation
    disk.conversation = topics;

    if (topics.length) {
      const availableTopics = topics.filter(topic => topicIsAvailable(character, topic));

      if (availableTopics.length) {
        println(`What would you like to discuss?`);
        availableTopics.forEach(topic => println(`${bullet} ${topic.option ? topic.option : topic.keyword.toUpperCase()}`));
        println(`${bullet} NOTHING`);
      } else {
        // if character isn't handling onTalk, let the player know they are out of topics
        if (!character.onTalk) {
          println(`You have nothing to discuss with ${getName(character.name)} at this time.`);
        }
        endConversation();
      }
    } else if (Object.keys(topics).length) {
      println(`Select a response:`);
      Object.keys(topics).forEach(topic => println(`${bullet} ${topics[topic].option}`));
    } else {
      endConversation();
    }
  };

  if (preposition === 'to') {
    if (!getCharacter(x)) {
      println(`There is no one here by that name.`);
      return;
    }

    if (!getCharacter(getName(x), getCharactersInRoom(room.id))) {
      println(`There is no one here by that name.`);
      return;
    }

    if (!character.topics) {
      println(`You have nothing to discuss with ${getName(character.name)} at this time.`);
      return;
    }

    if (typeof(character.topics) === 'string') {
      println(character.topics);
      return;
    }

    if (typeof(character.onTalk) === 'function') {
      character.onTalk({disk, println, getRoom, enterRoom, room, character});
    }

    topics = typeof character.topics === 'function'
      ? character.topics({println, room})
      : character.topics;

    if (!topics.length && !Object.keys(topics).length) {
      println(`You have nothing to discuss with ${getName(character.name)} at this time.`);
      return;
    }

    // initialize the chat log if there isn't one yet
    character.chatLog = character.chatLog || [];
    disk.conversant = character;
    listTopics(topics);
  } else if (preposition === 'about') {
    if (!disk.conversant) {
      println(`You need to be in a conversation to talk about something.`);
      return;
    }
    const character = eval(disk.conversant);
    if (getCharactersInRoom(room.id).includes(disk.conversant)) {
      const response = x.toLowerCase();
      if (response === 'nothing') {
        endConversation();
        println(`You end the conversation.`);
      } else if (disk.conversation && disk.conversation[response]) {
        disk.conversation[response].onSelected();
      } else {
        const topic = disk.conversation.length && conversationIncludesTopic(disk.conversation, response);
        const isAvailable = topic && topicIsAvailable(character, topic);
        if (isAvailable) {
          if (topic.line) {
            println(topic.line);
          }
          if (topic.onSelected) {
            topic.onSelected({disk, println, getRoom, enterRoom, room, character});
          }
          // add the topic to the log
          character.chatLog.push(getKeywordFromTopic(topic));
        } else {
          println(`You talk about ${removePunctuation(x)}.`);
          println(`Type the capitalized KEYWORD to select a topic.`);
        }
      }

      // continue the conversation.
      if (disk.conversation) {
        topics = typeof character.topics === 'function'
          ? character.topics({println, room})
          : character.topics;
        listTopics(character);
      }
    } else {
      println(`That person is no longer available for conversation.`);
      disk.conversant = undefined;
      disk.conversation = undefined;
    }
  }
};

// list takeable items in room
let take = () => {
  const room = getRoom(disk.roomId);
  const items = (room.items || []).filter(item => item.isTakeable && !item.isHidden);

  if (!items.length) {
    println(`There's nothing to take.`);
    return;
  }

  println(`The following items can be taken:`);
  items.forEach(item => println(`${bullet} ${getName(item.name)}`));
};

// take the item with the given name
// string -> nothing
let takeItem = (itemName) => {
  const room = getRoom(disk.roomId);
  const findItem = item => objectHasName(item, itemName);
  let itemIndex = room.items && room.items.findIndex(findItem);

  if (typeof itemIndex === 'number' && itemIndex > -1) {
    const item = room.items[itemIndex];
    if (item.isTakeable) {
      disk.inventory.push(item);
      room.items.splice(itemIndex, 1);

      if (typeof item.onTake === 'function') {
        item.onTake({disk, println, room, getRoom, enterRoom, item});
      } else {
        println(`You took the ${getName(item.name)}.`);
      }
    } else {
      if (typeof item.onTake === 'function') {
        item.onTake({disk, println, room, getRoom, enterRoom, item});
      } else {
        println(item.block || `You can't take that.`);
      }
    }
  } else {
    itemIndex = disk.inventory.findIndex(findItem);
    if (typeof itemIndex === 'number' && itemIndex > -1) {
      println(`You already have that.`);
    } else {
      println(`You don't see any such thing.`);
    }
  }
};

// list useable items in room and inventory
let use = () => {
  const room = getRoom(disk.roomId);

  const useableItems = (room.items || [])
    .concat(disk.inventory)
    .filter(item => item.onUse && !item.isHidden);

  if (!useableItems.length) {
    println(`There's nothing to use.`);
    return;
  }

  println(`The following items can be used:`);
  useableItems.forEach((item) => {
    println(`${bullet} ${getName(item.name)}`)
  });
};

// use the item with the given name
// string -> nothing
let tryItem = (itemName) => {
  const item = getItemInInventory(itemName) || getItemInRoom(itemName, disk.roomId);

  if (!item) {
    println(`You don't have that.`);
    return;
  }

  if (item.use) {
    console.warn(`Warning: The "use" property for Items has been renamed to "onUse" and support for "use" has been deprecated in text-engine 2.0. Please update your disk, renaming any "use" methods to be called "onUse" instead.`);

    item.onUse = item.use;
  }

  if (!item.onUse) {
    println(`That item doesn't have a use.`);
    return;
  }

  // use item and give it a reference to the game
  if (typeof item.onUse === 'string') {
    const use = eval(item.onUse);
    use({disk, println, getRoom, enterRoom, item});
  } else if (typeof item.onUse === 'function') {
    item.onUse({disk, println, getRoom, enterRoom, item});
  }
};

// list items in room
let items = () => {
  const room = getRoom(disk.roomId);
  const items = (room.items || []).filter(item => !item.isHidden);

  if (!items.length) {
    println(`There's nothing here.`);
    return;
  }

  println(`You see the following:`);
  items
    .forEach(item => println(`${bullet} ${getName(item.name)}`));
}

// list characters in room
let chars = () => {
  const room = getRoom(disk.roomId);
  const chars = getCharactersInRoom(room.id).filter(char => !char.isHidden)

  if (!chars.length) {
    println(`There's no one here.`);
    return;
  }

  println(`You see the following:`);
  chars
    .forEach(char => println(`${bullet} ${getName(char.name)}`));
};

// display help menu
let help = () => {
  const instructions = `The following commands are available:
    LOOK:   'look at key'
    TAKE:   'take book'
    GO:     'go north'
    USE:    'use door'
    TALK:   'talk to mary'
    ITEMS:  list items in the room
    INV:    list inventory items
    SAVE:   save the current game
    LOAD:   load the last saved game
    HELP:   this help menu
  `;
  println(instructions);
};

// handle say command with no args
let say = () => println([`Say what?`, `You don't say.`]);

// say the passed string
// string -> nothing
let sayString = (str) => println(`You say ${removePunctuation(str)}.`);

// retrieve user input (remove whitespace at beginning or end)
// nothing -> string
let getInput = () => input.value.trim();

// objects with methods for handling commands
// the array should be ordered by increasing number of accepted parameters
// e.g. index 0 means no parameters ("help"), index 1 means 1 parameter ("go north"), etc.
// the methods should be named after the command (the first argument, e.g. "help" or "go")
// any command accepting multiple parameters should take in a single array of parameters
// if the user has entered more arguments than the highest number you've defined here, we'll use the last set
let commands = [
  // no arguments (e.g. "help", "chars", "inv")
  {
    inv,
    i: inv, // shortcut for inventory
    look,
    l: look, // shortcut for look
    go,
    n,
    s,
    e,
    w,
    ne,
    se,
    sw,
    nw,
    talk,
    t: talk, // shortcut for talk
    take,
    get: take,
    items,
    use,
    chars,
    help,
    say,
    save,
    load,
    restore: load,
  },
  // one argument (e.g. "go north", "take book")
  {
    look: lookThusly,
    go: goDir,
    take: takeItem,
    get: takeItem,
    use: tryItem,
    say: sayString,
    save: x => save(x),
    load: x => load(x),
    restore: x => load(x),
    x: x => lookAt([null, x]), // IF standard shortcut for look at
    t: x => talkToOrAboutX('to', x), // IF standard shortcut for talk
  },
  // two+ arguments (e.g. "look at key", "talk to mary")
  {
    look: lookAt,
    say(args) {
      const str = args.reduce((cur, acc) => cur + ' ' + acc, '');
      sayString(str);
    },
    talk: args => talkToOrAboutX(args[0], args[1]),
    x: args => lookAt([null, ...args]),
  },
];

// process user input & update game state (bulk of the engine)
// accepts optional string input; otherwise grabs it from the input element
let applyInput = (input) => {
  input = input || getInput();
  inputs.push(input);
  inputsPos = inputs.length;
  println(`> ${input}`);

  const val = input.toLowerCase();
  setInput(''); // reset input field

  const exec = (cmd, arg) => {
    if (cmd) {
      cmd(arg);
    } else if (disk.conversation) {
      println(`Type the capitalized KEYWORD to select a topic.`);
    } else {
      println(`Sorry, I didn't understand your input. For a list of available commands, type HELP.`);
    }
  };

  let args = val.split(' ')

  // remove articles (except for the say command, which prints back what the user said)
  if (args[0] !== 'say') {
    args = args.filter(arg => arg !== 'a' && arg !== 'an' && arg != 'the');
  }

  const [command, ...usrArguments] = args;
  const room = getRoom(disk.roomId);

  if (usrArguments.length === 1) {
    exec(commands[1][command], usrArguments[0]);
  } else if (command === 'take' && usrArguments.length) {
    // support for taking items with spaces in the names
    // (just tries to match on the first word)
    takeItem(usrArguments[0]);
  } else if (command === 'use' && usrArguments.length) {
    // support for using items with spaces in the names
    // (just tries to match on the first word)
    tryItem(usrArguments[0]);
  } else if (usrArguments.length >= commands.length) {
    exec(commands[commands.length - 1][command], usrArguments);
  } else if (room.exits && getExit(command, room.exits)) {
    // handle shorthand direction command, e.g. "EAST" instead of "GO EAST"
    goDir(command);
  } else if (disk.conversation && (disk.conversation[command] || conversationIncludesTopic(disk.conversation, command))) {
    talkToOrAboutX('about', command);
  } else {
    exec(commands[usrArguments.length][command], usrArguments);
  }
};

// allows wrapping text in special characters so println can convert them to HTML tags
// string, string, string -> string
let addStyleTags = (str, char, tagName) => {
  let odd = true;
  while (str.includes(char)) {
    const tag = odd ? `<${tagName}>` : `</${tagName}>`;
    str = str.replace(char, tag);
    odd = !odd;
  }

  return str;
};

// overwrite user input
// string -> nothing
let setInput = (str) => {
  input.value = str;
  // on the next frame, move the cursor to the end of the line
  setTimeout(() => {
    input.selectionStart = input.selectionEnd = input.value.length;
  });
};

// render output, with optional class
// (string | array | fn -> string) -> nothing
let println = (line, className) => {
  // bail if string is null or undefined
  if (!line) {
    return;
  }

  let str =
    // if this is an array of lines, pick one at random
    Array.isArray(line) ? pickOne(line)
    // if this is a method returning a string, evaluate it
    : typeof line  === 'function' ? line()
    // otherwise, line should be a string
    : line;

  
  const output = document.querySelector('#output');
  console.log(output)
  const newLine = document.createElement('div');

  if (className) {
    newLine.classList.add(className);
  }

  // add a class for styling prior user input
  if (line[0] === '>') {
    newLine.classList.add('user');
  }

  // support for markdown-like bold, italic, underline & strikethrough tags
  if (className !== 'img') {
    str = addStyleTags(str, '__', 'u');
    str = addStyleTags(str, '**', 'b');
    str = addStyleTags(str, '*', 'i');
    str = addStyleTags(str, '~~', 'strike');
  }

  // maintain line breaks
  while (str.includes('\n')) {
    str = str.replace('\n', '<br>');
  }

  output.appendChild(newLine).innerHTML = str;
  window.scrollTo(0, document.body.scrollHeight);
};

// predict what the user is trying to type
let autocomplete = () => {
  const room = getRoom(disk.roomId);
  const words = input.value.toLowerCase().trim().split(/\s+/);
  const wordsSansStub = words.slice(0, words.length - 1);
  const itemNames = (room.items || []).concat(disk.inventory).map(item => item.name);

  const stub = words[words.length - 1];
  let options;

  if (words.length === 1) {
    // get the list of options from the commands array
    // (exclude one-character commands from auto-completion)
    const allCommands = commands
      .reduce((acc, cur) => acc.concat(Object.keys(cur)), [])
      .filter(cmd => cmd.length > 1);

    options = [...new Set(allCommands)];
    if (disk.conversation) {
      options = Array.isArray(disk.conversation)
        ? options.concat(disk.conversation.map(getKeywordFromTopic))
        : Object.keys(disk.conversation);
      options.push('nothing');
    }
  } else if (words.length === 2) {
    const optionMap = {
      talk: ['to', 'about'],
      take: itemNames,
      use: itemNames,
      go: (room.exits || []).map(exit => exit.dir),
      look: ['at'],
    };
    options = optionMap[words[0]];
  } else if (words.length === 3) {
    const characterNames = (getCharactersInRoom(room.id) || []).map(character => character.name);
    const optionMap = {
      to: characterNames,
      at: characterNames.concat(itemNames),
    };
    options = (optionMap[words[1]] || []).flat().map(string => string.toLowerCase());
  }

  const stubRegex = new RegExp(`^${stub}`);
  const matches = (options || []).flat().filter(option => option.match(stubRegex));

  if (!matches.length) {
    return;
  }

  if (matches.length > 1) {
    const longestCommonStartingSubstring = (arr1) => {
      const arr = arr1.concat().sort();
      const a1 = arr[0];
      const a2 = arr[arr.length-1];
      const L = a1.length;
      let i = 0;
      while (i < L && a1.charAt(i) === a2.charAt(i)) {
        i++;
      }
      return a1.substring(0, i);
    };

    input.value = [...wordsSansStub,longestCommonStartingSubstring(matches)].join(' ');
  } else {
    input.value = [...wordsSansStub, matches[0]].join(' ');
  }
};

// select previously entered commands
// string -> nothing
let navigateHistory = (dir) => {
  if (dir === 'prev') {
    inputsPos--;
    if (inputsPos < 0) {
      inputsPos = 0;
    }
  } else if (dir === 'next') {
    inputsPos++;
    if (inputsPos > inputs.length) {
      inputsPos = inputs.length;
    }
  }

  setInput(inputs[inputsPos] || '');
};

// get random array element
// array -> any
let pickOne = arr => arr[Math.floor(Math.random() * arr.length)];

// return the first name if it's an array, or the only name
// string | array -> string
let getName = name => typeof name === 'object' ? name[0] : name;

// retrieve room by its ID
// string -> room
let getRoom = (id) => disk.rooms.find(room => room.id === id);

// remove punctuation marks from a string
// string -> string
let removePunctuation = str => str.replace(/[.,\/#?!$%\^&\*;:{}=\_`~()]/g,"");

// remove extra whitespace from a string
// string -> string
let removeExtraSpaces = str => str.replace(/\s{2,}/g," ");

// move the player into room with passed ID
// string -> nothing
let enterRoom = (id) => {
  const room = getRoom(id);

  if (!room) {
    println(`That exit doesn't seem to go anywhere.`);
    return;
  }

  println(room.img, 'img');

  if (room.name) {
    println(`${getName(room.name)}`, 'room-name');
  }

  if (room.visits === 0) {
    println(room.desc);
  }

  room.visits++;

  disk.roomId = id;

  if (typeof room.onEnter === 'function') {
    room.onEnter({disk, println, getRoom, enterRoom});
  }

  // reset any active conversation
  delete disk.conversation;
  delete disk.conversant;
};

// determine whether the object has the passed name
// item | character, string -> bool
let objectHasName = (obj, name) => {
  const compareNames = n => n.toLowerCase().includes(name.toLowerCase());

  return Array.isArray(obj.name)
    ? obj.name.find(compareNames)
    : compareNames(obj.name);
}

// get a list of all characters in the passed room
// string -> characters
let getCharactersInRoom = (roomId) => disk.characters.filter(c => c.roomId === roomId);

// get a character by name from a list of characters
// string, characters -> character
let getCharacter = (name, chars = disk.characters) => chars.find(char => objectHasName(char, name));

// get item by name from room with ID
// string, string -> item
let getItemInRoom = (itemName, roomId) => {
  const room = getRoom(roomId);

  return room.items && room.items.find(item => objectHasName(item, itemName))
};

// get item by name from inventory
// string -> item
let getItemInInventory = (name) => disk.inventory.find(item => objectHasName(item, name));

// retrieves a keyword from a topic
// topic -> string
let getKeywordFromTopic = (topic) => {
  if (topic.keyword) {
    return topic.keyword;
  }

  // find the keyword in the option (the word in all caps)
  const keyword = removeExtraSpaces(removePunctuation(topic.option))
    // separate words by spaces
    .split(' ')
    // find the word that is in uppercase
    // (must be at least 2 characters long)
    .find(w => w.length > 1 && w.toUpperCase() === w)
    .toLowerCase();

  return keyword;
};

// determine whether the passed conversation includes a topic with the passed keyword
// conversation, string -> boolean
let conversationIncludesTopic = (conversation, keyword) => {
  // NOTHING is always an option
  if (keyword === 'nothing') {
    return true;
  }

  if (Array.isArray(disk.conversation)) {
    return disk.conversation.find(t => getKeywordFromTopic(t) === keyword);
  }

  return disk.conversation[keyword];
};

// determine whether the passed topic is available for discussion
// character, topic -> boolean
let topicIsAvailable = (character, topic) => {
  // topic has no prerequisites, or its prerequisites have been met
  const prereqsOk = !topic.prereqs || topic.prereqs.every(keyword => character.chatLog.includes(keyword));
  // topic is not removed after read, or it hasn't been read yet
  const readOk = !topic.removeOnRead || !character.chatLog.includes(getKeywordFromTopic(topic));

  return prereqsOk && readOk;
};

// end the current conversation
let endConversation = () => {
  disk.conversant = undefined;
  disk.conversation = undefined;
};

// load the passed disk and start the game
// disk -> nothing
let loadDisk = (uninitializedDisk) => {
  // initialize the disk
  disk = init(uninitializedDisk);

  // start the game
  enterRoom(disk.roomId);

  // start listening for user input
  setup();

  // focus on the input
  input.focus();
};



// npm support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = loadDisk;
}


const demoDisk = {
  roomId: 'foyer', // the ID of the room the player starts in
  rooms: [
    {
      id: 'foyer', // unique ID for this room
      name: 'The Foyer', // room name (shown when player enters the room)
      // room description (shown when player first enters the room)
      desc:  `Welcome to the **TEXT-ENGINE** demo disk! This disk is a text adventure game designed to introduce you to the features available to you in **text-engine**. Using this engine, you can make a text game of your own.

      Type **LOOK** to have a look around.`,
      // optional callback when player issues the LOOK command
      // here, we use it to change the foyer's description
      onLook: () => {
        const room = getRoom('foyer');
        room.desc = `You are currently standing in the foyer. There's a huge **MONSTERA** plant to your right, and a massive **WINDOW** to your left bathing the room in natural light. Both the **PLANT** and the **WINDOW** stretch to the ceiling, which must be at least 25 feet high.

        ***Rooms** form the foundation of the engine's design. At any given time, your player will be standing in one of the rooms you built for them. These can be literal rooms like the foyer you find yourself in now, or metaphorical rooms like **The End of Time** or **Purgatory**.

        Each room you create should have a description. (That's what you're reading now!)

        Rooms can have **exits** that take you to other rooms. For instance, to the **NORTH** is the **RECEPTION DESK**.

        Rooms can also contain **items**. Sometimes the player can **TAKE** or **USE** items.

        Type **ITEMS** to see a list of items in the foyer. Or type **HELP** to see what else you can do!`;
      },
      // optional list of items in the room
      items: [
        {
          name: 'tall window', // the item's name
          desc: `All you can see are puffy white clouds over a blue sky.`, // description shown when player looks at the item
        },
        {
          name: ['monstera', 'plant', 'swiss cheese'], // player can refer to this item by any of these names
          desc: `Sometimes called a Swiss Cheese plant, no office is complete without one. It has lovely, large leaves. This is the biggest you\'ve ever seen.

          There's **SOMETHING SHINY** in the pot.`,
          block: `It's far too large for you to carry.`, // optional reason player cannot pick up this item
          // when player looks at the plant, they discover a shiny object which turns out to be a key
          onLook: () => {
            if (getItemInRoom('shiny', 'foyer') || getItemInInventory('shiny')) {
              // the key is already in the pot or the player's inventory
              return;
            }

            const foyer = getRoom('foyer');

            // put the silver key in the pot
            foyer.items.push({
              name: ['shiny thing', 'something shiny', 'pot'],
              onUse: () => {
                const room = getRoom(disk.roomId);
                if (room.id === 'foyer') {
                  println(`There's nothing to unlock in the foyer.`);
                } else if (room.id === 'reception') {
                  println(`You unlock the door to the **EAST**!`);
                  // remove the block
                  const exit = getExit('east', room.exits);
                  delete exit.block;
                  // this item can only be used once
                  const key = getItemInInventory('shiny');
                  key.onUse = () => println(`The lab has already been unlocked.`);
                } else {
                  println(`There's nothing to unlock here.`);
                }
              },
              desc: `It's a silver **KEY**!`,
              onLook: () => {
                const key = getItemInInventory('shiny') || getItemInRoom('shiny', 'foyer');

                // now that we know it's a key, place that name first so the engine calls it by that name
                key.name.unshift('silver key');

                // let's also update the description
                key.desc = `It has a blue cap with the word "LAB" printed on it.`;

                // remove this method (we don't need it anymore)
                delete key.onLook;
              },
              isTakeable: true,
              onTake: () => {
                println(`You took it.`);
                // update the monstera's description, removing everything starting at the line break
                const plant = getItemInRoom('plant', 'foyer');
                plant.desc = plant.desc.slice(0, plant.desc.indexOf('\n'));
              },
            });
          },
        },
        {
          name: 'dime',
          desc: `Wow, ten cents.`,
          isTakeable: true, // allow the player to TAKE this item
          onTake: () => println(`You bend down and pick up the tiny, shiny coin.

          *Now it's in your **inventory**, and you can use it at any time, in any room. (Don't spend it all in one place!)

          Type **INV** to see a list of items in your inventory.*`),
          // using the dime randomly prints HEADS or TAILS
          onUse: () => {
            const side = Math.random() > 0.5 ? 'HEADS' : 'TAILS';
            println(`You flip the dime. It lands on ${side}.`);
          },
        }
      ],
      // places the player can go from this room
      exits: [
        // GO NORTH command leads to the Reception Desk
        {dir: 'north', id: 'reception'},
      ],
    },
    {
      id: 'reception',
      name: 'Reception Desk',
      desc: `**BENJI** is here. I'm sure he'd be happy to tell you more about the features available in **text-engine**.

      *You can speak with characters using the **TALK** command.*

      To the **EAST** is a closed **DOOR**.

      To the **SOUTH** is the foyer where you started your adventure.

      Next to the **DESK** are **STAIRS** leading **UP**.`,
      items: [
        {
          name: 'desk',
        },
        {
          name: 'door',
          desc: `There are 4" metal letters nailed to the door. They spell out: "RESEARCH LAB".`,
          onUse: () => {
            const reception = getRoom('reception');
            const exit = getExit('east', reception.exits);
            if (exit.block) {
              println(`It's locked.`);
            } else {
              goDir('east');
            }
          },
        },
        {
          name: 'gate',
          desc: `The guilded gate is blocking the way to the **STAIRS**.`,
        },
        {
          name: ['stairs', 'staircase'],
          desc: `They lead up to a door. If you squint, you can make out the word "ADVANCED" on the door.`,
          onUse: () => println(`Try typing GO UPSTAIRS (once you've unlocked the gate).`),
        },
      ],
      exits: [
        // exits with a BLOCK cannot be used, but print a message instead
        {dir: 'east', id: 'lab', block: `The door is locked.`},
        {dir: ['upstairs', 'up'], id: 'advanced', block: `There's a locked GATE blocking your path.`},
        {dir: 'south', id: 'foyer'},
      ],
    },
    {
      id: 'lab',
      name: 'Research Lab',
      desc: `There is a **BLUE ROBOT** hovering silently in the center of a white void. They appear to be awaiting instructions. (Type **TALK** to speak to the robot.)

      To the **WEST** is the door to the Reception Desk.`,
      exits: [
        {dir: 'west', id: 'reception'},
      ],
    },
    {
      id: 'advanced',
      name: 'Advanced Research Lab',
      desc: `There is a **RED ROBOT** hovering silently in the center of a black void. They appear to be awaiting instructions. (Type **TALK** to speak to the robot.)

      **DOWNSTAIRS** is the Reception Desk.`,
      exits: [
        {dir: ['downstairs', 'down'], id: 'reception'},
      ],
    },
  ],
  characters: [
    {
      name: ['Benji', 'Benj', 'receptionist'],
      roomId: 'reception',
      desc: 'He looks... helpful!', // printed when the player looks at the character
      // optional callback, run when the player talks to this character
      onTalk: () => println(`"Hi," he says, "How can I help you?"`),
      // things the player can discuss with the character
      topics: [
        {
          option: 'How can I change the visual **STYLE** of the game?',
          removeOnRead: true,
          // optional callback, run when the player selects this option
          onSelected() {
            println(`**BENJI** pulls a strange-looking *item* out of a desk drawer.
            "Here, take this." he says. "Try typing **USE STYLE-CHANGER**. That should give you some ideas."`)

            // add a special item to the player's inventory
            disk.inventory.push({
              name: 'style-changer',
              desc: `This is a magical item. Type **USE STYLE-CHANGER** to try it out!`,
              onUse: () => {
                const currentStylesheet = document.getElementById('styles').getAttribute('href');
                const newName = currentStylesheet.includes('modern') ? 'retro' : 'modern';
                println(`You changed the stylesheet to ${newName.toUpperCase()}.css.
                Since **text-engine** is built with HTML, you can use Cascading Stylesheets (CSS) to make your game look however you want!`);
                selectStylesheet(`styles/${newName}.css`);
              }
            });
          },
        },
        {
          option: 'How can I use **RICH** text?',
          line: `"The text in the game is actually HTML, so you can use tags like <code>&lt;b&gt;</code> for <b>bold</b>, <code>&lt;i&gt;</code> for <i>italic</i>, and <code>&lt;u&gt;</code> for <u>underline</u>.

          "There's also support for Markdown-like syntax:

          • Wrapping some text in asterisks like &ast;this&ast; will *italicize* it.
          • Double-asterisks like &ast;&ast;this&ast;&ast; will make it **bold**.
          • Triple-asterisks like &ast;&ast;&ast;this&ast;&ast;&ast; will make it ***italic bold***.
          • Double-underscores like &lowbar;_this&lowbar;_ will __underline__ it."`,
          removeOnRead: true,
        },
        {
          option: `Tell me about **EXITS**`,
          // text printed when the player selects this option by typing the keyword (EXITS)
          line: `"Sure! It looks like you've already figured out you can type **GO NORTH** to use an exit to the north. But did you know you can just type **GO** to get a list of exits from the room? If an exit leads you to a room you've been to before, it will even tell you the room's name.

          "There are also some shortcuts to make getting where you're going easier. Instead of typing **GO NORTH**, you can just type **NORTH** instead. Actually, for cardinal directions, you can shorten it to simply **N**.

          "Sometimes you'll want to temporarily prevent players from using an **exit**. You can use *blocks* for this. Try going **EAST** from here to see what I mean. You'll find the **DOOR** is locked. You'll need to find the **KEY** to get inside.

          "These **STAIRS** are also blocked by a locked **GATE**. There isn't a key to the gate, so if you want to see what's up there, you'll have to find another way to get past it."`,
          // instruct the engine to remove this option once the player has selected it
          removeOnRead: true,
        },
        {
          option: `Remind me what's up with that **DOOR** to the east...`,
          line: `"The exit has a *block*. Specifically, the **DOOR** it locked. You'll need to find a **KEY** to open it."`,
          prereqs: ['exits'], // optional list of prerequisite topics that must be discussed before this option is available
        },
        {
          option: `Remind me what's up with these **STAIRS**...`,
          line: `"The **STAIRS** are blocked by a locked **GATE**. There isn't a key, so you need to find another way to unlock it."`,
          prereqs: ['exits'],
        },
        {
          option: `How do I use **AUTOCOMPLETE**?`,
          line: `"If you type a few letters and press TAB, the engine will guess what you're trying to say."`,
          removeOnRead: true,
        },
        {
          option: `If I want to **REPEAT** a command, do I have to type it again?`,
          line: `"Wow, it's almost like you're reading my mind. No, you can just press the UP ARROW to see commands you've previously entered."`,
          removeOnRead: true,
        },
      ],
    },
    {
      name: 'blue robot',
      roomId: 'lab',
      onTalk: () => println(`"I can tell you about making games with text-engine," they explain. "What would you like to know?"`),
      topics: [
        {
          option: `What is **TEXT-ENGINE**?`,
          line: `**text-engine** is a a JavaScript REPL-style, text-based adventure game engine. It's small and easy to use with no dependencies.

          The engine uses a disk metaphor for the data which represents your game, like the floppy disks of yore.`
        },
        {
          option: `How do I get **STARTED**?`,
          line: `To create your own adventure, you can use an existing game disk as a template. You will find the disk you're playing now as well as others in the folder called "game-disks". You can edit these in any text or code editor.

          Include the 'game disk' (JSON data) in index.html and load it with loadDisk(myGameData). You can look at <a href="https://github.com/okaybenji/text-engine/blob/master/index.html" target="_blank">the included index.html file</a> for an example.

          You are welcome to ask me about any topic you like, but you might find it easier just to browse a few and then dive in to making something of your own. You can return to ask me questions at any time.`
        },
        {
          option: `What is a **DISK**?`,
          line: `A disk is a JavaScript object which describes your game. At minimum, it must have these two top-level properties:

          **roomId** (*string*) - This is a reference to the room the player currently occupies. Set this to the **ID** of the room the player should start in.

          **rooms** (*array*) - List of rooms in the game.

          There are other properties you can choose to include if you like:

          **inventory** (*array*) - List of items in the player's inventory.

          **characters** (*array*) - List of characters in the game.

          You can also attach any arbitrary data you wish. For instance, you could have a number called "health" that you use to keep track of your player's condition.`
        },
        {
          option: `What is a **ROOM**?`,
          line: `A room is a JavaScript object. You usually want a room to have the following properties:

          **name** (*string*) - The name of the room will be displayed each time it is entered.

          **id** (*string*) - Unique identifier for this room. Can be anything.

          **desc** (*string*) - Description of the room, displayed when it is first entered, and also when the player issues the **LOOK** command.

          **exits** (*array*) - List of paths from this room.

          Rooms can have these other optional properties as well:

          **img** (*string*) - Graphic to be displayed each time the room is entered. (This is intended to be ASCII art.)

          **items** (*string*) - List of items in this room. Items can be interacted with by the player.

          **onEnter** (*function*) - Function to be called when the player enters this room.

          **onLook** (*function*) - Function to be called when the player issues the **LOOK** command in this room.`
        },
        {
          option: `What is an **EXIT**?`,
          line: `An exit is a JavaScript object with the following properties:

          **dir** (*string*) - The direction the player must go to leave via this exit (e.g. "north").

          **id** (*string*) - The ID of the room this exit leads to.

          An exit can optionally have a *block* as well:

          **block** (*string*) - Line to be printed if the player tries to use this exit. If this property exists, the player cannot use the exit.`
        },
        {
          option: `What is an **ITEM**?`,
          line: `An item is a JavaScript object with a name:

          **name** (*string* or *array*) - How the item is referred to by the game and the player. Using an array allows you to define multiple string names for the item. You might do this if you expect the player may call it by more than one name. For instance <code>['basketball', 'ball']</code>. When listing items in a room, the engine will always use the first name in the list.

          Items can have these other optional properties as well:

          **desc** (*string* or *array*) - Description. Text displayed when the player looks at the item. If multiple descriptions are provided, one will be chosen at random.

          **isTakeable** (*boolean*) - Whether the player can pick up this item (if it's in a room). Defaults to <code>false</code>.

          **onUse** (*function*) - Function to be called when the player uses the item.

          **onLook** (*function*) - Function to be called when the player looks at the item.

          **onTake** (*function*) - Function to be called when the player takes the item.`
        },
        {
          option: `What is a **CHARACTER**?`,
          line: `You're talking to one! A character is a JavaScript object with the following properties:

          **name** (*string or array*) - How the character is referred to by the game and the player. Using an array allows you to define multiple string names for the character. You might do this if you expect the player may call them by more than one name. For instance <code>['Steve', 'waiter', 'garçon']</code>. When listing characters in a room, the engine will always use the first name in the list.

          **roomId** (*string*) - The ID of the room the character is currently in. The player can only talk to characters in the room with them.

          Characters can have these other optional properties as well:

          **desc** (*string* or *array*) - Description. Text displayed when the player looks at the character. If multiple descriptions are provided, one will be chosen at random.

          **topics** (*string* or *array*) - If a string is provided, it will be printed when the player talks to this character. Otherwise, this should be a list of topics for use in the conversation with the character.

          **onTalk** (*function*) - Function to be called when the player talks to the character.

          **onLook** (*function*) - Function to be called when the player looks at the character.`
        },
        {
          option: `What is a **TOPIC**?`,
          line: `A topic is something you can talk to a character about, and as you may have guessed, is a JavaScript object. A topic requires an *option*, and either a *line* or an *onSelected* function, or both:

          **option** (*string*) - The choice presented to the player, with a KEYWORD the player can type to select it. If the keyword is written in uppercase, the engine can identify it automatically. (Otherwise, you'll need to specify the keyword in a separate property.) The option can be just the keyword itself, or any string containing the keyword.

          **line** (*string*) - The text to display when the player types the keyword to select the option.

          **onSelected** (*function*) - Function to be called when the player types the keyword to select the option.

          Topics can have these other optional properties as well:

          **removeOnRead** (*boolean*) - Whether this option should no longer be available to the player after it has been selected once.

          **prereqs** (*array*) - Array of keyword strings representing the prerequisite topics a player must have selected before this one will appear. (When topics are selected, their keywords go into an array on the character called "chatLog".)

          **keyword** (*string*) - The word the player must type to select this option. This property is only required if the option itself does not contain a keyword written in uppercase.`
        },
        {
          option: `Can you unlock the **GATE** to the stairs by the reception desk?`,
          line: `Actually, you can do that yourself! This disk happens to have a secret, custom **UNLOCK** command. This powerful command will remove blocks on any exit. Just type **UNLOCK** to use it.`,
        },
      ],
    },
    {
      name: 'red robot',
      roomId: 'advanced',
      onTalk: () => println(`"I can tell you about the JavaScript functions available to you when you use text-engine," they explain. "What would you like to know about?"`),
      topics: [
        {
          option: `Tell me about **FUNCTIONS**`,
          line: `Functions are reuseable bits of JavaScript code. **text-engine** provides several of these which you can use, for instance in callbacks like <code>onUse</code>, <code>onLook</code>, <code>onEnter</code>, etc.`
        },
        {
          option: `Tell me about **COMMANDS**`,
          line: `Every command a player can issue in the game has a corresponding function in **text-engine**.

          For instance, there's a function called <code>go</code> that gets called when the player types **GO**.

          You can add your own custom commands, like the **UNLOCK** command you used to get access to this room. And if existing commands don't work how you want them to, you can ever override them by reassigning them to your own function code.`,
        },
        {
          option: `Tell me about **PRINTLN**`,
          line: `<code>println</code> is a function you can use to print a line of text to the console. It takes up to two arguments:

          **line** (*string*) - The text to be printed.

          **className** (*string*) - Optional. The name of a CSS class to apply to the line. You can use this to style the text.`
        },
        {
          option: `Tell me about **PICKONE**`,
          line: `<code>pickOne</code> is a function you can use to get a random item from an array. It takes one argument:

          **arr** (*array*) - The array with the items to pick from.`
        },
        {
          option: `Tell me about **GETROOM**`,
          line: `<code>getRoom</code> is a function you can use to get a reference to a room by its ID. It takes one argument:

          **id** (*string*) - The unique identifier for the room.`
        },
        {
          option: `Tell me about **ENTERROOM**`,
          line: `<code>enterRoom</code> is a function you can use to move the player to particular room. It takes one argument:

          **id** (*string*) - The unique identifier for the room.`
        },
        {
          option: `Tell me about **GETCHARACTER**`,
          line: `<code>getCharacter</code> is a function you can use to get a reference to a character. It takes up to two arguments:

          **name** (*string*) - The character's name.

          **chars** (*array*) - Optional. The array of characters to search. Defaults to searching all characters on the disk.`
        },
        {
          option: `Tell me about **GETCHARACTERSINROOM**`,
          line: `<code>getCharactersInRoom</code> is a function you can use to get an array containing references to each character in a particular room. It takes one argument:

          **roomId** (*string*) - The unique identifier for the room.`
        },
        {
          option: `Tell me about **GETITEMINROOM**`,
          line: `<code>getItemInRoom</code> is a function you can use to get a reference to an item in a particular room. It takes two arguments:

          **itemName** (*string*) - The name of the item.

          **roomId** (*string*) - The unique identifier for the room.`
        },
        {
          option: `Tell me about **GETITEMININVENTORY**`,
          line: `<code>getItemInInventory</code> is a function you can use to get a reference to an item in the player's inventory. It takes one argument:

          **name** (*string*) - The name of the item.`
        },
        {
          option: `Tell me about **OTHER** functions`,
          line: `There are several other functions available in the engine! Feel free to take a peek at the source code (<a href="https://github.com/okaybenji/text-engine/blob/master/index.js" target="_blank">index.js</a>). It's designed to be open and simple to use and to customize.`
        },
      ],
    },
  ],
};

// custom functions used by this disk
// change the CSS stylesheet to the one with the passed name
const selectStylesheet = filename => document.getElementById('styles').setAttribute('href', filename);

// override commands to include custom UNLOCK command
// create the unlock function
const unlock = () => {
  disk.rooms.forEach(room => {
    if (!room.exits) {
      return;
    }

    // unblock all blocked exits in the room
    room.exits.forEach(exit => delete exit.block);
  });

  // update the description of the gate
  getItemInRoom('gate', 'reception').desc = `The guilded gate leads to the staircase.`;

  println(`All **exits** have been unblocked!`);
};

// attach it to the zero-argument commands object on the disk
commands[0] = Object.assign(commands[0], {unlock});

loadDisk(demoDisk)

console.log(demoDisk)
export default demoDisk