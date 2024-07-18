import './App.css';
import React from 'react';
import Board from './components/Board';
import ToolBar from './components/ToolBar';
import ToolBox from './components/ToolBox';
import BoardProvider from './components/store/BoardProvider';
import ToolBoxProvider from './components/store/ToolBoxProvider';
function App() {
  return (
    <ToolBoxProvider>
      <BoardProvider>
        <ToolBox />
        <ToolBar />
        <Board />
      </BoardProvider>
    </ToolBoxProvider>
  );
}

export default App;
