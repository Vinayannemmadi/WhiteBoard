/* eslint-disable no-lone-blocks */
import {useRef,useLayoutEffect, useContext, useEffect} from 'react';
import rough from "roughjs";
import boardContext from '../store/board-context';
import toolboxContext from '../store/toolboxContext';
import { TOOL_ITEMS } from '../../constants';
import classes from "./index.module.css";
const Board= ()=> {
  const textArea=useRef();
  const canvasRef=useRef();
  const {toolboxState}=useContext(toolboxContext)
  const { elements , boardMouseDownHandler, textAreaBlur,undo,redo,
     boardMouseMove, boardMouseUpHandler ,toolActionType,activeToolItem }=useContext(boardContext)
    useLayoutEffect(() => {
     
        const canvas=canvasRef.current;
         
        const roughCancas = rough.canvas(canvas);
        const context=canvas.getContext("2d");
        context.save();
        if(elements.length>0)
        elements.forEach(element => {
          // eslint-disable-next-line default-case
          switch(element.type){
            case "LINE":
            case "RECTANGLE":
            case "CIRCLE":
            // eslint-disable-next-line no-lone-blocks, no-fallthrough
            case "ARROW":{
              roughCancas.draw(element.roughEle)
            }
            break;
            // eslint-disable-next-line no-lone-blocks
            case TOOL_ITEMS.BRUSH:{
              // console.log(element.path);
              context.fillStyle=(element.stroke);
              context.fill(element.path);
              context.restore();
              // context.save();
            }
            break;
            case TOOL_ITEMS.TEXT:{
              context.textBaseLine= "top";
              context.font=`${element.size}px cursive`;
              context.fillStyle=(element.stroke);
              context.fillText(element.text,element.x1,element.y1);
              context.restore();
            }
            break;
          }
        });
        return ()=>{
          context.clearRect(0,0,canvas.width,canvas.height);
        }
        
    },[elements]);

  const handleBoardMouseDown=(event)=>{
      boardMouseDownHandler(event);
  }
  const handleBoardMouseMove=(event)=>{
    // console.log(toolActionType);
    if(toolActionType==="DRAW_MOVE" || toolActionType==="ERASER")
        boardMouseMove(event);
  }
  useEffect(()=>{
    function handleKeyDown(event){
      if(event.ctrlKey && event.key==="z"){
        undo();
      }
      else if(event.ctrlKey && event.key==="y"){
        redo();
      }
    }
    document.addEventListener("keydown",handleKeyDown);
  },[undo,redo])
  useEffect(()=>{
      const textarea=textArea.current;
      if(toolActionType === "WRITING"){
        setTimeout(()=>{
          textarea.focus();
          
        },0)
      }
  },[toolActionType])
  const handleMouseUp=()=>{
    boardMouseUpHandler();
  }

  return (
    <>
      {toolActionType==="WRITING" && <textarea 
      ref={textArea}
        className={classes.textElementBox}
        type="text"
        style={{
          top: elements[elements.length - 1].y1,
          left: elements[elements.length - 1].x1,
          fontSize: parseInt(elements[elements.length - 1].size),
          color: elements[elements.length - 1].stroke,
          fontFamily: "cursive",
          // backgroundColor:"green"
        }}
        onBlur={(event) => 
          textAreaBlur(event.target.value,
                toolboxState[activeToolItem].stroke,
                toolboxState[activeToolItem].size,)}
      />}
      <canvas ref={canvasRef} width={1000} height={2000}
        id="canvas"
        onMouseDown={handleBoardMouseDown}
        onMouseMove={handleBoardMouseMove}
        onMouseUp={handleMouseUp}
        ></canvas>
    </>
  );
}

export default Board;

 // let context;
      // if(canvas){
        //    context= canvas.getContext('2d');
 //  canvas.width=window.innerWidth;
          //  canvas.height=window.innerHeight
        //     context.fillStyle="blue";
        //    context.fillRect(0,0,800,800);
        // }
        
        // const generator= roughCancas.generator;
        // let rect1=generator.rectangle(100,100,100,100);
        // let rect2=generator.rectangle(210,210,100,100,{fill : "red"});
        // roughCancas.draw(rect2);
        // roughCancas.draw(rect1);
