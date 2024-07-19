import React, { useReducer, useContext } from 'react';
import BoardContext from './board-context';
import { createRoughElement } from '../utils/elements';
import  toolboxContext  from '../store/toolboxContext';
import { BOARD_ACTIONS, TOOL_ITEMS, TOOLBOX_ACTIONS  } from '../../constants';
import {getStroke} from "perfect-freehand"
import {    getSvgPathFromStroke ,isPointNearElement} from "../utils/elements";

const initialBoardState = {
    activeToolItem: 'LINE',
    toolActionType: 'NONE',
    elements: [],
    history:[[]],
    index:0,
};

const boardReducer = (state, action) => {
    const { clientX, clientY, stroke, fill,size } = action.payload || {};
    switch (action.type) {
        case 'CHANGE_TOOL':
            return { ...state, activeToolItem: action.payload.tool };
        case 'CHANGE_ACTION_TYPE':{
            return { ...state, toolActionType: action.payload.actionType };
        }
        case 'CHANGE_TEXT':{
            const newEle = [...state.elements];
            const newHistory=state.history.slice(0,state.index+1);
            newHistory.push(newEle);
            const index=state.elements.length-1;
            const newElements=[...state.elements];
            newElements[index].text=action.payload.text;
            return (
                { ...state, 
                    toolActionType:TOOLBOX_ACTIONS.NONE,
                    elements: newElements,
                    history:newHistory,
                    index:newHistory.length-1,
                }
            )
        }
        case 'DRAW_DOWN':
            // console.log("draw down called",state.toolActionType)
            const newElement = createRoughElement(
                state.elements.length,
                clientX,
                clientY, 
                clientX,
                clientY,
                { type: state.activeToolItem, stroke, fill ,size}
            );
            const actiontype=(state.toolActionType==='NONE'? "DRAW_MOVE":"ERASER")
            return {
                ...state,
            toolActionType: state.activeToolItem===TOOL_ITEMS.TEXT? "WRITING":actiontype,
                elements: [...state.elements, newElement],
            };
        case 'DRAW_MOVE':
            const newElements = [...state.elements];
            const index = state.elements.length - 1;
            // eslint-disable-next-line default-case
            switch (state.activeToolItem) {
                case TOOL_ITEMS.LINE:
                case TOOL_ITEMS.RECTANGLE:
                case TOOL_ITEMS.CIRCLE:
                case TOOL_ITEMS.ARROW:
                {
                    if (index >= 0) {
                        const { x1, y1 } = newElements[index];
                        const newElement = createRoughElement(index, x1, y1, clientX, clientY, {
                            type: state.activeToolItem,
                            stroke,
                            fill,
                        });
                        newElements[index] = newElement;
                    }
                    return { ...state, elements: newElements };
                }
                case TOOL_ITEMS.BRUSH:
                {
                    newElements[index].points=[
                        ...newElements[index].points,
                        {x:clientX, y:clientY}
                    ];
                    newElements[index].path=new Path2D(getSvgPathFromStroke(getStroke(newElements[index].points)));
                    return { ...state, elements: newElements };
                }
                    
        }
        break;
        case 'DRAW_UP':
            const newEle = [...state.elements];
            const newHistory=state.history.slice(0,state.index+1);
            newHistory.push(newEle);
            // console.log(newHistory);
            return { 
                ...state, toolActionType: 'UP',
                history:newHistory,
                index:newHistory.length-1,
             };
        case "ERASER":{
            const {clientX:pointX,clientY:pointY}=action.payload;
            let newElements=[...state.elements];
            newElements=newElements.filter(element=>{
                return !isPointNearElement({element,pointX,pointY});
            });
            const newHistory=state.history.slice(0,state.index+1);
            newHistory.push(newElements);
            return {
                ...state,
                elements:newElements,
                history:newHistory,
                index:newHistory.length+1,
            }
        }
        case BOARD_ACTIONS.UNDO:{
            const ind=state.index;
            if(ind<0) return state;
            return {
                ...state,
                elements:state.history[ind],
                index:state.index-1,
            }
        }
        case BOARD_ACTIONS.REDO:{
            if(state.history.length <= state.index+1) return state;
            return {
                ...state,
                elements:state.history[state.index+1],
                index:state.index+1,
            }
        }
        default:
            return state;
    }
};

const BoardProvider = ({ children }) => {
    const [boardState, dispatchBoardAction] = useReducer(boardReducer, initialBoardState);
    const { toolboxState } = useContext(toolboxContext);
    const handleToolItemClick = (tool) => {
        console.log(tool);
        dispatchBoardAction({
            type: 'CHANGE_TOOL',
            payload: { tool },
        });
        
    };
    const boardMouseDownHandler = (event) => {
        const { clientX, clientY } = event;
        const activeToolConfig = toolboxState[boardState.activeToolItem];

        if(boardState.activeToolItem === TOOL_ITEMS.TEXT){
            dispatchBoardAction({
                type: 'CHANGE_ACTION_TYPE',
                payload: {
                    actionType:"WRITING",
                    stroke: activeToolConfig.stroke,
                },
            });
        }
        if( boardState.activeToolItem===TOOL_ITEMS.ERASER){
            dispatchBoardAction({
                type: 'CHANGE_ACTION_TYPE',
                payload: {
                    actionType:"ERASER",
                },
            });
        }
        dispatchBoardAction({
            type: 'DRAW_DOWN',
            payload: {
                clientX,
                clientY,
                stroke: activeToolConfig.stroke,
                size:activeToolConfig.size,
                fill: activeToolConfig.fill,
            },
        });
    };
    const boardMouseMove = (event) => {
        const activeToolConfig = toolboxState[boardState.activeToolItem];
        const { clientX, clientY } = event;
        if(boardState.toolActionType==="WRITING"){
            return ;
        }
        if(boardState.activeToolItem!=="ERASER"){
            dispatchBoardAction({
                type: 'DRAW_MOVE',
                payload: {
                    clientX,
                    clientY,
                    stroke: activeToolConfig.stroke,
                    fill: activeToolConfig.fill,
                    size:activeToolConfig.size,
                },
            });
        } else {
            dispatchBoardAction({
                type: 'ERASER',
                payload: {
                    clientX,
                    clientY,
                },
            });
        }

    };
    const boardMouseUpHandler = () => {
        if(boardState.toolActionType!=="WRITING"){
            dispatchBoardAction({ 
                type: "CHANGE_ACTION_TYPE",
                payload:{
                    actionType:"NONE",
                }
            });
        }
        dispatchBoardAction({ type: 'DRAW_UP' });
    };
    const textAreaBlur=(text,stroke,size)=>{
        dispatchBoardAction({
            type:"CHANGE_TEXT",
            payload:{
                text,stroke,size,
            }
        })
    }
    const boardUndoHandler=()=>{
        console.log(initialBoardState.history.length);
        if(initialBoardState.index<0) return;
            dispatchBoardAction({
                type:"UNDO"
            })
    }
    const boardRedoHandler=()=>{
            dispatchBoardAction({
                type:"REDO"
            })
    }

    const boardContextValue = {
        activeToolItem: boardState.activeToolItem,
        elements: boardState.elements,
        handleToolItemClick,
        boardMouseDownHandler,
        boardMouseMove,
        boardMouseUpHandler,
        textAreaBlur,
        undo:boardUndoHandler,
        redo:boardRedoHandler,
        toolActionType: boardState.toolActionType,
    };

    return (
        <BoardContext.Provider value={boardContextValue}>
            {children}
        </BoardContext.Provider>
    );
};

export default BoardProvider;
