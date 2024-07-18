import React, { useReducer } from 'react'
import toolboxContext from './toolboxContext';
import { COLORS, TOOL_ITEMS, TOOLBOX_ACTIONS } 
from '../../constants';
function toolboxReducer(state,action){
    switch (action.type) {
        case TOOLBOX_ACTIONS.CHANGE_STROKE:{
            const newState={...state};
            newState[action.payload.tool].stroke=action.payload.stroke;
            return newState;
        }   
        case TOOLBOX_ACTIONS.CHANGE_FILL:{
            const newState={...state};
            newState[action.payload.tool].fill=action.payload.fill;
            return newState;
        }
        case TOOLBOX_ACTIONS.CHANGE_SIZE:{
            // console.log(action);
            const newState={...state};
            newState[action.payload.tool].size=parseInt(action.payload.size);
            return newState;
        }
        default:
            return state;
    }
}

const initialToolboxState={
    [TOOL_ITEMS.LINE]:{
        stroke:COLORS.BLACK,
        size: 1,
    },
    [TOOL_ITEMS.RECTANGLE]:{
        stroke:COLORS.BLACK,
        size: 1,
        fill:null
    },
    [TOOL_ITEMS.CIRCLE]:{
        stroke:COLORS.BLACK,
        size: 1,
        fill:null
    },
    [TOOL_ITEMS.ARROW]:{
        stroke:COLORS.BLACK,
        size: 1,
    },
    [TOOL_ITEMS.BRUSH]:{
        stroke:COLORS.BLACK,
        size: 1,
        fill:null
    },
    [TOOL_ITEMS.ERASER]:{
        stroke:COLORS.BLACK,
        size: 1,
        fill:null
    },
    [TOOL_ITEMS.TEXT]:{
        stroke:COLORS.BLACK,
        size: 32,
        fill:null
    }
}
const ToolboxProvider = ({children}) => {
    const [toolboxState,dispatchToolboxAction]=useReducer(toolboxReducer,initialToolboxState);
    const changeStrokeHandler=(tool,stroke)=>{
        dispatchToolboxAction({
            type: TOOLBOX_ACTIONS.CHANGE_STROKE,
            payload:{
                tool,
                stroke,
            },
        });
    }
    const changeFillHandler=(tool,fill)=>{
        
        dispatchToolboxAction({
            type: TOOLBOX_ACTIONS.CHANGE_FILL,
            payload:{
                tool,
                fill,
            },
        });
    }
    const changeSizeHandler=(tool,size)=>{
        dispatchToolboxAction({
            type: TOOLBOX_ACTIONS.CHANGE_SIZE,
            payload:{
                tool,
                size,
            },
        });
    }
    const toolboxContextValue={
        toolboxState,
        changeStroke:changeStrokeHandler,
        changeFill:changeFillHandler,
        changeSize:changeSizeHandler
    }
  return (
    <toolboxContext.Provider value={toolboxContextValue}>{children}</toolboxContext.Provider>
  )
}

export default ToolboxProvider