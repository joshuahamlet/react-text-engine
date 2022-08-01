import { useAtom } from 'jotai';
import { callActionAtom, characterAtom, currentRoomAtom, itemAtom, modalAtom } from '../../Atoms';
import { buildCharacters, buildItems } from '../../GameData/Actions';
import {
  BsFillArrowDownSquareFill,
  BsFillArrowUpSquareFill,
  BsFillArrowLeftSquareFill,
  BsFillArrowRightSquareFill,
} from 'react-icons/bs';

const Layout_Navigate = () => {
  const [callAction, setCallAction] = useAtom(callActionAtom);
  const [modal, setModal] = useAtom(modalAtom);
  const [globalCharacters, setGlobalCharacters] = useAtom(characterAtom);
  const [globalItems, setGlobalItems] = useAtom(itemAtom);
  const [currentRoom, setCurrentRoom] = useAtom(currentRoomAtom);

  const navigate = (i) => {
    setModal((p) => !p);

    setCallAction({
      action: 'HANDLE_DIRECTION',
      payload: [`${i}`],
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
        Where would you like to go?
      </div>
      <div
        style={{
          width: '50%',
          height: '100%',
          alignSelf: 'center',
          justifySelf: 'flex-end',
        }}
      >
        <div
          style={{
            height: '33%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div onClick={() => navigate('N')} style={{ fontSize: '30px' }}>
            N
          </div>
          <BsFillArrowUpSquareFill
            onClick={() => navigate('N')}
            style={{ fontSize: '30px' }}
          />
        </div>
        <div
          style={{
            height: '33%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div onClick={() => navigate('W')} style={{ fontSize: '30px' }}>
            W
          </div>
          <BsFillArrowLeftSquareFill
            onClick={() => navigate('W')}
            style={{ fontSize: '30px' }}
          />
          <BsFillArrowRightSquareFill
            onClick={() => navigate('E')}
            style={{ fontSize: '30px' }}
          />
          <div onClick={() => navigate('E')} style={{ fontSize: '30px' }}>
            E
          </div>
        </div>
        <div
          style={{
            height: '33%',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <BsFillArrowDownSquareFill
            onClick={() => navigate('S')}
            style={{ fontSize: '30px' }}
          />
          <div onClick={() => navigate('S')} style={{ fontSize: '30px' }}>
            S
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout_Navigate