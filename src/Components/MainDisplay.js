import { useAtom } from 'jotai';
import { activationAtom, currentRoomAtom } from '../Atoms';
import Home from '../GameData/home.svg'
import Park from '../GameData/park.svg'
import Bridge from '../GameData/bridge.svg'
import './components.css'

const MainDisplay = () => {
  const [currentRoom, setCurrentRoom] = useAtom(currentRoomAtom);
  const [activated, setActivated] = useAtom(activationAtom)

  const descriptionStyle = {
    width: '95%',
    height: '40%',
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'center',
    justifySelf: 'center',
    color: 'var(--orange)',
    backgroundColor: 'var(--black)',
    textAlign: 'left',
    margin: '2px 10px 10px 10px',
    borderRadius: '5px',
  };

  const titleStyle = {
    width: '95%',
    height: '15%',
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--orange)',
    backgroundColor: 'var(--black)',
    padding: 'var(--txtBoxPad)',
    margin: '10px 10px 2px 10px',
    borderRadius: '5px',
  };

  const imageStyle = {
    width: '95%',
    height: '25%',
    minHeight: '125px',
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    color: 'var(--orange)',
    background: 'linear-gradient(to right, var(--black) 70%, var(--orange) 100%)',
    padding: 'var(--txtBoxPad)',
    margin: '2px',
    borderRadius: '5px',
    position: 'relative',
  };

  const imageStyleActivated = {
    width: '95%',
    height: '25%',
    minHeight: '125px',
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    color: 'var(--orange)',
    backgroundColor: 'var(--black)',
    padding: 'var(--txtBoxPad)',
    margin: '2px',
    borderRadius: '5px',
    position: 'relative',
  };

  const markerL = {
    backgroundColor: 'var(--orange)',
    position: 'absolute',
    animation: 'markerBlink 2s infinite',
    top: '80%',
    left: '15%',
    transform: 'translateX(-50%)'
  };

  const markerM = {
    backgroundColor: 'var(--orange)',
    position: 'absolute',
    animation: 'markerBlink 2s infinite',
    top: '80%',
    left: '50%',
    transform: 'translateX(-50%)'
  };

  const markerTM = {
    backgroundColor: 'var(--orange)',
    position: 'absolute',
    animation: 'markerBlink 2s infinite',
    top: '10%',
    left: '50%',
    transform: 'translateX(-50%)'
  };

  const markerR = {
    backgroundColor: 'var(--orange)',
    position: 'absolute',
    animation: 'markerBlink 2s infinite',
    top: '80%',
    left: '85%',
    transform: 'translateX(-50%)'
  };

  const parkStyle = {
    position: 'absolute',
    height: '50%',
    top: '25%',
    left: '15%',
    transform: 'translateX(-50%)'
  }

  const homeStyle = {
    position: 'absolute',
    height: '50%',
    top: '25%',
    left: '50%',
    transform: 'translateX(-50%)'
  }

  const bridgeStyle = {
    position: 'absolute',
    height: '50%',
    top: '25%',
    left: '85%',
    transform: 'translateX(-50%)'
  }

  const markerPos =
    currentRoom.id === 'park'
      ? markerL
      : currentRoom.id === 'home'
      ? markerM
      : currentRoom.id === 'backyard'
      ? markerTM
      : currentRoom.id === 'bridge'
      ? markerR
      : markerTM

  return (
    <div
      className='componentSizingMain'
      style={{
        backgroundColor: 'var(--grey)',
        textAlign: 'center',
        margin: '5px',
        borderRadius: '5px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div className='titleStyle' style={titleStyle}>{currentRoom.name}</div>
      <div style={activated ? imageStyleActivated : imageStyle }>
        <img style={parkStyle} src={Park} />
        <img style={homeStyle} src={Home} />
        { activated && <img style={bridgeStyle} src={Bridge} /> }
        <div className='marker' style={markerPos}></div>
      </div>
      <div className='descriptionStyle' style={descriptionStyle}>{currentRoom.desc}</div>
    </div>
  );
};

export default MainDisplay;
