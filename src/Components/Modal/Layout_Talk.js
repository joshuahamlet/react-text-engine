import { useAtom } from 'jotai';
import { callActionAtom, characterAtom, currentRoomAtom, itemAtom, modalAtom } from '../../Atoms';
import { buildCharacters, buildItems } from '../../GameData/Actions';

const Layout_Talk = () => {
  const [callAction, setCallAction] = useAtom(callActionAtom);
  const [modal, setModal] = useAtom(modalAtom);
  const [globalCharacters, setGlobalCharacters] = useAtom(characterAtom);
  const [globalItems, setGlobalItems] = useAtom(itemAtom);
  const [currentRoom, setCurrentRoom] = useAtom(currentRoomAtom);

  const talk = (i) => {
    console.log(i.name.toUpperCase());
    setModal((p) => !p);

    setCallAction({
      action: 'TALK',
      payload: [`TALK`, `${i.name.toUpperCase()}`],
    });
  };

  let observable = [];
  let talkable = [];

  const buildTalkable = () => {
    talkable = globalCharacters.filter(
      (x) => x.room.toUpperCase() === currentRoom.name.toUpperCase()
    );
    console.log('TALKABLE', talkable);
    return talkable;
  };

  buildTalkable();

  const buildObservable = () => {
    let items = buildItems(globalItems, currentRoom);
    let characters = buildCharacters(globalCharacters, currentRoom);
    observable = [...items, ...characters];

    console.log(observable);
    return observable;
  };

  buildObservable();

  return (
    <>
      <div
        style={{
          color: 'var(--darkGrey)',
          width: '100%',
          padding: '15px 22px',
        }}
      >
        Who would you like to talk to?
      </div>
      {talkable.map((i) => {
        return (
          <div
            style={{
              fontFamily: 'commodore',
              borderRadius: '5px',
              color: 'var(--lightGrey)',
              backgroundColor: 'var(--darkGrey)',
              padding: '7px',
              boxShadow: '3px 3px 1px black',
              outline: 'none',
              margin: '5px 15px',
            }}
            onClick={() => talk(i)}
          >
            {i.name}
          </div>
        );
      })}
      <div
        style={{
          fontFamily: 'commodore',
          borderRadius: '5px',
          color: 'var(--lightGrey)',
          backgroundColor: 'var(--darkGrey)',
          padding: '7px',
          boxShadow: '3px 3px 1px black',
          outline: 'none',
          margin: '5px 15px',
        }}
        onClick={() => talk({ name: 'SELF' })}
      >
        Self
      </div>
    </>
  );
};

export default Layout_Talk