import React, { useContext} from 'react'
import classes from './index.module.css';
import cx from 'classnames';
import { LuRectangleHorizontal } from "react-icons/lu";
import { FaSlash ,FaRegCircle ,FaEraser ,FaUndo ,FaRedo} from 'react-icons/fa';
import { FaArrowRight , FaDownload} from "react-icons/fa6";
import { HiMiniPaintBrush } from "react-icons/hi2";
import boardContext from '../store/board-context';

const ToolBar = () => {
  // const [activeToolItem,setActiveToolItem]=useState("LINE");
  const {activeToolItem,handleToolItemClick,undo,redo}=useContext(boardContext);
  // const handleClicks=()=>{
    const handleDownload=()=>{
      const canvas=document.getElementById("canvas");
      const data=canvas.toDataURL("image/png");
      const achor=document.createElement("a");
      achor.href=data;
      achor.download="board.png";
      achor.click();
    }
  // }
  return (
    <div className={classes.container}>
      <div className={cx(classes.toolItem, {[classes.active]:activeToolItem==="BRUSH"})}
      onClick={()=>handleToolItemClick("BRUSH")}
      ><HiMiniPaintBrush /></div>
      <div className={cx(classes.toolItem, {[classes.active]:activeToolItem==="LINE"})}
      onClick={()=>handleToolItemClick("LINE")}
      ><FaSlash/></div>
      <div className={cx(classes.toolItem, {[classes.active]:activeToolItem==="RECTANGLE"})}
      onClick={()=>handleToolItemClick("RECTANGLE")}
      ><LuRectangleHorizontal /></div>
      <div className={cx(classes.toolItem, {[classes.active]:activeToolItem==="CIRCLE"})}
      onClick={()=>handleToolItemClick("CIRCLE")}
      ><FaRegCircle /></div>
      <div className={cx(classes.toolItem, {[classes.active]:activeToolItem==="ARROW"})}
      onClick={()=>handleToolItemClick("ARROW")}
      ><FaArrowRight /></div>
      <div className={cx(classes.toolItem, {[classes.active]:activeToolItem==="TEXT"})}
      onClick={()=>handleToolItemClick("TEXT")}
      >A</div>
      <div className={cx(classes.toolItem, 
        {[classes.active]:activeToolItem==="ERASER"})}
      onClick={()=>handleToolItemClick("ERASER")}
      ><FaEraser/></div>
      <div className={cx(classes.toolItem, 
        {[classes.active]:activeToolItem==="UNDO"})}
      onClick={()=>undo()}
      ><FaUndo/></div>
      <div className={cx(classes.toolItem, 
        {[classes.active]:activeToolItem==="REDO"})}
      onClick={()=>redo()}
      ><FaRedo/></div>
      <div className={cx(classes.toolItem, 
        {[classes.active]:activeToolItem==="DOWNLOAD"})}
      onClick={()=>handleDownload("DOWNLOAD")}
      ><FaDownload/></div>
    </div>
  )
}

export default ToolBar