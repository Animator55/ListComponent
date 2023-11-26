import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons"
import { faCheckSquare } from "@fortawesome/free-solid-svg-icons/faCheckSquare"
import { faGear } from "@fortawesome/free-solid-svg-icons/faGear"
import { faLock } from "@fortawesome/free-solid-svg-icons/faLock"
import { faSquare } from "@fortawesome/free-solid-svg-icons/faSquare"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import { itemType } from "../vite-env"
import { faCaretDown } from "@fortawesome/free-solid-svg-icons/faCaretDown"
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark"
import { faEllipsis } from "@fortawesome/free-solid-svg-icons/faEllipsis"
import Form from "./Form"

type Props = {
    array: itemType[],
    changeArray: {
        [key:string]: Function
        create: Function
        delete: Function
        edit: Function
    }
    editable: boolean
}

const sortArray = (sort, array) => {
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

// check if value has to be showed like a chip
const checkChips = (val: string[] | string, canDelete: boolean, deleteFunction?: Function) =>{
    if(!Array.isArray(val) || val.length === 0) return val
    let ChipList = []
    for(let i=0; i<3; i++){
        if(i === val.length) break
        ChipList.push(<div className="tags" key={Math.random()} onClick={()=>{if(canDelete && deleteFunction !== undefined) deleteFunction(i)}}>
            {canDelete && <FontAwesomeIcon icon={faXmark}/>}
            <p>{val[i]}</p>
        </div>)
    }

    return <>{ChipList}{val.length > 3 && <FontAwesomeIcon icon={faEllipsis} size="xl"/>}</>
}

const generateColumns = (columns:number):string=>{
    let columnWidth = (100-(columns-1)*0.2)/columns
    let result = "repeat("+columns+", "+columnWidth+"%)"
    
    return result
}

let blockedColumns: string[] = ["Nombre", "Estado"]
let notEditableColumns: string[] = ["_id", "Componentes", "Tags", "Image"]

export default function ItemList ({array, changeArray, editable}:Props){
    const [hiddenColumns, setHiddenColumns] = React.useState<string[]>([])
    const [selectedItems, setSelectedItems] = React.useState<string[]>([])
    const [EditItem, setEditItem] = React.useState<(number | itemType)[] | undefined>(undefined)
    const [sortValue, setSortValue] = React.useState<string|undefined>(undefined)
    // const [close, setPopUp] = React.useState(false)

    let sortValSplited = sortValue !== undefined ? sortValue[0] === "-" ? sortValue.split(":")[1] : sortValue : undefined
    let direction = sortValue !== undefined ? sortValue[0] === "-" ? 0 : 1 : undefined 

    const handlerHiddenCol = (key: string) => {
        if(blockedColumns.includes(key)) return
        if(hiddenColumns.includes(key)) setHiddenColumns([...hiddenColumns, key])
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

    // const handlerEditItems = (action: string, index: number, value: itemType) =>{
    //     changeArray[action](selectedItems, index, value)
    //     setSelectedItems([])
    // }

    
    const formConfirm = (item: itemType, create:boolean, index: number)=>{
        setEditItem(undefined)
        if(item === undefined) return 
        if(create) changeArray.create(item)
        else changeArray.edit(index, item)
    }

    console.log(EditItem)
    
    function TopBar () {
        return (<>
            {/* {close ? <PopUp visibility={close} setPopUp={setPopUp} confirm={()=>{handlerEditItems("delete")}}/> : null} */}
            <nav className="list-tool-bar">
                <Form entries={} initialData={EditItem} confirm={formConfirm}/>
                {/* {selectedItems.length > 0 ? 
                    <FontAwesomeIcon icon={faTrash} onClick={()=>{setPopUp(true)}} size="xl"/>
                : null} */}
                <button  
                    onClick={(e: React.MouseEvent)=>{
                        let span = e.currentTarget.nextSibling as HTMLDivElement
                        if(span) span.classList.toggle("expanded")
                    }}>
                    <FontAwesomeIcon icon={faGear} size="xl"/>
                </button>
                <div className="list-config-span">
                    <button onClick={()=>{handlerHiddenCol("#")}}><FontAwesomeIcon icon={!hiddenColumns.includes("#") ? faCheckSquare : faSquare} className="margin-right-5px"/>Index</button>
                    {array.length !== 0 && Object.keys(array[0]).map(key=>{
                        return <button 
                            key={Math.random()} 
                            onClick={()=>{handlerHiddenCol(key)}}>
                                <FontAwesomeIcon icon={!blockedColumns.includes(key) ? !hiddenColumns.includes(key) ? faCheckSquare : faSquare: faLock}/>
                                {key}
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
            <section style={{gridTemplateColumns: generateColumns(Object.keys(array[0]).length+1)}}>
                {!hiddenColumns.includes("#") && <button className={sortValSplited === "#" ? "btn-active" : ""} onClick={()=>{setSortValue(undefined)}}>{"#"}</button>}
                {Object.keys(array[0]).map(key=>{
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
                                {sortValSplited === key ? <FontAwesomeIcon 
                                    icon={faCaretDown} 
                                    style={direction ? {} : {rotate: "180deg"}} 
                                    size="xl" 
                                /> : null}
                                {key}
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
                            style={{gridTemplateColumns: generateColumns(Object.keys(array[0]).length+1)}}
                        >
                            {!hiddenColumns.includes("#") && <div>{"#"+i}</div>}
                            {Object.keys(item).map(key=>{
                                return !hiddenColumns.includes(key) && <React.Fragment key={Math.random()} >
                                    {selectedItems.includes(item._id) && editable && !notEditableColumns.includes(key) ?     
                                        <div>{item[key]}</div> 
                                        :
                                        <div>{checkChips(item[key],selectedItems.includes(item._id) && editable)}</div>}
                                </React.Fragment>
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