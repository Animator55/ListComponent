import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons"
import { faCheckSquare } from "@fortawesome/free-solid-svg-icons/faCheckSquare"
import { faGear } from "@fortawesome/free-solid-svg-icons/faGear"
import { faLock } from "@fortawesome/free-solid-svg-icons/faLock"
import { faSquare } from "@fortawesome/free-solid-svg-icons/faSquare"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import { itemType } from "../vite-env"
import { faCaretDown } from "@fortawesome/free-solid-svg-icons/faCaretDown"

type Props = {
    array: itemType[],
    changeArray: {
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
const checkChips = (val, canDelete, deleteFunction?) =>{
    if(!Array.isArray(val) || val.length === 0) return val
    let ChipList = []
    for(let i=0; i<3; i++){
        if(i === val.length) break
        ChipList.push(<div className="tags" key={Math.random()} onClick={()=>{if(canDelete && deleteFunction !== undefined) deleteFunction(i)}}>
            {canDelete ? <FontAwesomeIcon icon={faXmark} className="margin-right-5px"/> : null}
            <p>{val[i]}</p>
        </div>)
    }

    return <>{ChipList}{val.length > 3 ? <FontAwesomeIcon icon={faEllipsis} className="margin-left-1rem" size="xl"/> : null}</>
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

    const handlerEditItems = (action, key, value) =>{
        // changeArray[action](selectedItems, key, value)
        setSelectedItems([])
    }


    function TopBar () {
        return (<>
            {/* {close ? <PopUp visibility={close} setPopUp={setPopUp} confirm={()=>{handlerEditItems("delete")}}/> : null} */}
            <nav className="list-tool-bar">
                {/* <ProductForm initialData={EditItem} confirm={formConfirm}/>
                {selectedItems.length > 0 ? 
                    <FontAwesomeIcon icon={faTrash} onClick={()=>{setPopUp(true)}} size="xl"/>
                : null} */}
                <FontAwesomeIcon 
                    icon={faGear} 
                    size="xl" 
                    onClick={(e)=>{
                        if(e.target.childElementCount === 0) 
                        e.target.parentElement.parentElement.nextSibling.classList.toggle("expanded", !e.target.parentElement.parentElement.nextSibling.classList.contains("expanded"))
                        else e.target.parentElement.nextSibling.classList.toggle("expanded", !e.target.parentElement.nextSibling.classList.contains("expanded"))
                    }}
                />
            </nav>
            <div className="list-config-span">
                <div onClick={()=>{handlerHiddenCol("#")}}><FontAwesomeIcon icon={!hiddenColumns.includes("#") ? faCheckSquare : faSquare} className="margin-right-5px"/>Indice</div>
                {array.length !== 0 && Object.keys(array[0]).map(key=>{
                    return <div 
                        key={Math.random()} 
                        onClick={()=>{
                            if(!blockedColumns.includes(key)) handlerHiddenCol(key)
                            // else activateToast([true, {title: "Information...", text: `The locked columns cannot be invisible`, result: "info"}])
                        }}>
                            <FontAwesomeIcon icon={!blockedColumns.includes(key) ? !hiddenColumns.includes(key) ? faCheckSquare : faSquare: faLock}/>
                            {key}
                        </div>
                })}
            </div>
        </>)
    }
    function ListTopBar () {
        return (<div>
            <FontAwesomeIcon 
                onClick={()=>{handlerSelectedItems("", true)}} 
                icon={selectedItems.length === array.length ? faCheckSquare : faSquare} 
                size="xl"
            />
            <div className="item-list-header">
                {hiddenColumns.includes("#") ? 
                null : 
                <button className={sortValSplited === "#" ? "btn-active" : ""} onClick={()=>{setSortValue(undefined)}}>{"#"}</button>}
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
                                    className="margin-right-5px"
                                    icon={faCaretDown} 
                                    style={direction ? {} : {rotate: "180deg"}} 
                                    size="xl" 
                                /> : null}
                                {key}
                            </button>
                        )
                    }
                })}
            </div>
        </div>)
    }
    function ListComponent (){
        return (<div className="new-list-ul">
            {array.map((item, i)=>{
                return (
                    <div className={selectedItems.includes(item._id) ? "d-flex align-center item-of-list-selected" : "d-flex align-center"} key={Math.random()}>
                        <FontAwesomeIcon 
                            onClick={()=>{handlerSelectedItems(item._id)}} 
                            icon={selectedItems.includes(item._id) ? faCheckSquare : faSquare} 
                            style={{margin: "0 10px"}} 
                            size="xl"
                        />
                        <div 
                            className="item-of-new-list"
                            onClick={(e)=>{if(editable) setEditItem([item, i])}} 
                        >
                            {!hiddenColumns.includes("#") && <div>{"#"+i}</div>}
                            {Object.keys(item).map(key=>{
                                if(!hiddenColumns.includes(key)){
                                    return <React.Fragment key={Math.random()} >
                                        {selectedItems.includes(item._id) && editable && !notEditableColumns.includes(key) ?     
                                            <div 
                                                style={{paddingLeft: 5}}
                                            >{item[key]}</div> 
                                            :
                                            <div style={{paddingLeft: 5}}>
                                                {checkChips(item[key],selectedItems.includes(item._id) && editable)}
                                            </div>}
                                    </React.Fragment>
                                }
                            })}
                        </div>
                    </div>
                )
            })}
        </div>)
    }

    return array === undefined ? (
        <div className="d-flex" style={{alignItems: "center",flexDirection: "column"}}>
            <div><FontAwesomeIcon icon={faCircleExclamation} style={{width: 50, height: 50, marginTop: 5}}/></div>
            <h2>Ha ocurrido un error.</h2>
            <button>Fuck!</button>
        </div> )
    : (
        <div>
            <TopBar/>
            {array.length !== 0 ? 
                <div><ListTopBar/><ListComponent/></div> 
            : 
            <div>No hay elementos que enlistar.</div>}
        </div>
    )
}