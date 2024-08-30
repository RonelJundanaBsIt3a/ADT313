import logo from './logo.svg';
import './App.css';
import Name from './Component/Name/Name';
import Section from './Component/Section/Section';
import Description from './Component/Description/Description';

function App() {
  const userInfo = {
    firstname: "Ronel",
    lastname: "Jundana",
    section: "BSIT3A",
    description: "Antukin"
  }
  return (
    <div className="App">
     <Name fname={userInfo.firstname} lname={userInfo.lastname}/>
     <Section section={userInfo.section}/>
     <Description Description={userInfo.description}/>
    </div>
  );
}

export default App;
