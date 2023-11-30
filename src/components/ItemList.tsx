import { faCircleExclamation, faTrash } from "@fortawesome/free-solid-svg-icons"
import { faCheckSquare } from "@fortawesome/free-solid-svg-icons/faCheckSquare"
import { faGear } from "@fortawesome/free-solid-svg-icons/faGear"
import { faLock } from "@fortawesome/free-solid-svg-icons/faLock"
import { faSquare } from "@fortawesome/free-solid-svg-icons/faSquare"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import { itemType, structureType } from "../vite-env"
import { faCaretDown } from "@fortawesome/free-solid-svg-icons/faCaretDown"
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark"
import { faEllipsis } from "@fortawesome/free-solid-svg-icons/faEllipsis"
import Form from "./Form"
import PopUp from "./PopUp"
import StructureForm from "./StructureForm"

type Props = {
    array: itemType[],
    changeArray: {
        [key:string]: Function
        create: Function
        delete: Function
        edit: Function
    }
    editable: boolean
    structure: structureType
    setStructure: Function
}

const sortArray = (sort:string, array: itemType[]) => {
    if(sort === undefined) return
    let sortVal = sort.split(":")
    let sortValIndex = sortVal[0] === "-" ? 1 : 0
    let isArray = Array.isArray(array[0][sortVal[sortValIndex]])
    array.sort((a, b) => {
        const [nameA, nameB] = !isArray ? 
            [a[sortVal[sortValIndex]].toUpperCase(), b[sortVal[sortValIndex]].toUpperCase()]
        : 
            [a[sortVal[sortValIndex]].length, b[sortVal[sortValIndex]].length] 
        if (nameA < nameB) return -1
        if (nameA > nameB) return 1
        return 0;
    });
    if(sortValIndex) array.reverse()
    
}

const generateColumns = (columns:number):string=>{
    let columnWidth = (100-(columns-1)*0.2)/columns
    let result = "repeat("+columns+", "+columnWidth+"%)"
    
    return result
}

let blockedColumns: string[] = []

export default function ItemList ({array, changeArray, editable, structure, setStructure}:Props){
    const [hiddenColumns, setHiddenColumns] = React.useState<string[]>(["_id"])
    const [selectedItems, setSelectedItems] = React.useState<string[]>([])
    const [EditItem, setEditItem] = React.useState<(number | itemType)[] | undefined>(undefined)
    const [sortValue, setSortValue] = React.useState<string|undefined>(undefined)
    const [close, setPopUp] = React.useState(false)
    const [structurePop, setStructurePop] = React.useState(false)

    let sortValSplited = sortValue !== undefined ? sortValue[0] === "-" ? sortValue.split(":")[1] : sortValue : undefined
    let direction = sortValue !== undefined ? sortValue[0] === "-" ? 0 : 1 : undefined 

    const handlerHiddenCol = (key: string) => {
        if(blockedColumns.includes(key)) return
        if(!hiddenColumns.includes(key)) setHiddenColumns([...hiddenColumns, key])
        else setHiddenColumns([...hiddenColumns.filter((el)=>{return el !== key})])
    }

    const handlerSelectedItems = (item:string, allItems?:boolean) =>{
        if(allItems){setSelectedItems(selectedItems.length !== array.length ? [...array.map(el=>{return el._id})] : []); return }
        if(!selectedItems.includes(item)){
            setSelectedItems([...selectedItems, item])
        }
        else{
            setSelectedItems([...selectedItems.filter((el)=>{return el !== item})])
        }
    }

    const handlerEditItems = (action: string, index?: number, value?: itemType) =>{
        changeArray[action](selectedItems, index, value)
        setSelectedItems([])
    }

    const formConfirm = (item: itemType, create:boolean, index: number)=>{
        setEditItem(undefined)
        if(item === undefined) return 
        if(create) changeArray.create(item)
        else changeArray.edit(index, item)
    }

    const structureConfirm = (arr:string[])=>{
        setStructurePop(false)
        if(arr === undefined) return
        setStructure(arr)
    }
    
    function TopBar () {
        return (<>
            {close && <PopUp visibility={close} setPopUp={setPopUp} confirm={()=>{handlerEditItems("delete")}}/>}
            <nav className="list-tool-bar">
                <Form structure={structure} initialData={EditItem} confirm={formConfirm}/>
                {structurePop && <StructureForm structure={structure} confirm={structureConfirm}/>}
                {selectedItems.length > 0 ? 
                    <button onClick={()=>{setPopUp(true)}}>
                        <FontAwesomeIcon icon={faTrash} size="xl"/>
                    </button>
                : null}
                <button  
                    onClick={(e: React.MouseEvent)=>{
                        let span = e.currentTarget.nextSibling as HTMLDivElement
                        if(span) span.classList.toggle("expanded")
                    }}>
                    <FontAwesomeIcon icon={faGear} size="xl"/>
                </button>
                <div className="col-visible-span">
                    <button onClick={()=>{setStructurePop(true)}}><FontAwesomeIcon icon={faGear}/>Configurate Columns</button>
                    <hr/>
                    {array.length !== 0 && Object.keys(array[0]).map(key=>{
                        return <button 
                            key={Math.random()} 
                            onClick={()=>{handlerHiddenCol(key)}}>
                                <FontAwesomeIcon icon={!blockedColumns.includes(key) ? !hiddenColumns.includes(key) ? faCheckSquare : faSquare: faLock}/>
                                {structure[key].name}
                        </button>
                    })}
                </div>
            </nav>
        </>)
    }
    function ListTopBar () {
        return (<header className="list-head">
            <FontAwesomeIcon 
                onClick={()=>{handlerSelectedItems("", true)}} 
                icon={selectedItems.length === array.length ? faCheckSquare : faSquare} 
                size="xl"
            />
            <section style={{gridTemplateColumns: generateColumns((Object.keys(array[0]).length) - hiddenColumns.length)}}>
                {Object.keys(structure).map((key: string)=>{
                    if(!hiddenColumns.includes(key)){
                        return (
                            <button 
                                className={sortValSplited === key ? "btn-active" : ""} 
                                key={Math.random()} 
                                onClick={()=>{
                                    if(sortValue !== key) {
                                        sortArray(key, array); setSortValue(key);
                                    }
                                    else{
                                        sortArray("-:"+key, array); setSortValue("-:"+key);
                                    }
                                }}
                            >
                                {sortValSplited === key && <FontAwesomeIcon 
                                    icon={faCaretDown} 
                                    style={direction ? {} : {rotate: "180deg"}} 
                                    size="xl" 
                                />}
                                {structure[key].name}
                            </button>
                        )
                    }
                })}
            </section>
        </header>)
    }
    function ListComponent (){
        return (<ul className="list">
            {array.map((item, i)=>{
                return (
                    <div className={selectedItems.includes(item._id) ? "item selected" : "item"} key={Math.random()}>
                        <FontAwesomeIcon 
                            onClick={()=>{handlerSelectedItems(item._id)}} 
                            icon={selectedItems.includes(item._id) ? faCheckSquare : faSquare} 
                            size="xl"
                        />
                        <div 
                            className="item-content"
                            onClick={()=>{if(editable) setEditItem([item, i])}} 
                            style={{gridTemplateColumns: generateColumns((Object.keys(array[0]).length) - hiddenColumns.length)}}
                        >
                            {Object.keys(item).map(key=>{
                                return !hiddenColumns.includes(key) && <div key={Math.random()}>{item[key]}</div> 
                            })}
                        </div>
                    </div>
                )
            })}
        </ul>)
    }

    return array === undefined ? (
        <div className="d-flex-col align-c">
            <div><FontAwesomeIcon icon={faCircleExclamation} style={{width: 50, height: 50, marginTop: 5}}/></div>
            <h2>Error</h2>
        </div> )
    : (
        <div>
            <TopBar/>
            {array.length !== 0 ? 
                <div><ListTopBar/><ListComponent/></div> 
            : 
            <div>There are no items to list.</div>}
        </div>
    )
}