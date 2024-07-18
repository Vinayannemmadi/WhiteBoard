import { createContext } from 'react';

const BoardContext = createContext({
  activeToolItem: "",
  element: [],
  history:[[]],
  index:0,
  toolActionType:"NOTHING",
  boardMouseDownHandler:()=>{},
  handleToolItemClick:()=>{},
  handleMouseMove:()=>{},
  boardMouseUpHandler:() => {},
  undo:()=>{},
  redo:()=>{},
});

export default BoardContext;
