import React from 'react'
import './App.css'
import { listsAPI } from './logic/api'
import { itemType, structureType } from './vite-env'
import ItemList from './components/ItemList'

type Props = {
  request: string
}

// let requestCounter = 0

export default function ListComponent({ request }: Props) {
  const [ArrayList, setList] = React.useState<itemType[] | undefined>()
  const [structure, setStructure] = React.useState<structureType>({
    "_id": {_id: "_id", name: "_id", size: "", blocked: false}, 
    "1001": {_id: "1001", name:"Nombre", size: "", blocked: false}, 
    "1002": {_id: "1002", name:"Tipo", size: "", blocked: false}, 
    "1003": {_id: "1003", name:"Descripción", size: "", blocked: false}, 
    "1004": {_id: "1004", name:"Tags", size: "", blocked: false}, 
    "1005": {_id: "1005", name:"Estado", size: "", blocked: false}
  })

  const getList = async () => {
    let list = await listsAPI.getLists(request)
    // if(list.length === 0) activateToast([true, {title: "Error!", text: "Cannot request the list, please try later.", result: "error"}])

    setList(list)
  }

  const changeArray = {
    "create": (items: itemType) => {
      if(ArrayList === undefined)return
      setList([...ArrayList, items])
      // activateToast([true, {title: "Success!", text: `Create was done succesfully.`, result: "success"}])
    },
    "delete": (items: string[]) => {
      if(ArrayList === undefined)return
      setList([...ArrayList.filter((el:itemType) => { return !items.includes(el._id) })])
      // activateToast([true, {title: "Success!", text: `Delete was done succesfully.`, result: "success"}])
    },
    "edit": (index:number, value: itemType) => {
      if(ArrayList === undefined)return
      setList(Object.values({...ArrayList, [index]: value}) as itemType[])
      // activateToast([true, {title: "Success!", text: `Edit was done succesfully.`, result: "success"}])
    }
  }

  const handleStructureChanges = (value: structureType)=>{
    if(ArrayList === undefined) return
    let newItemList = [...ArrayList]
    let filteredKeys: string[] = Object.keys(value).filter(key=>{
      if(!structure.hasOwnProperty(key)) return key
    })

    itemloop: for(let i=0; i < newItemList.length; i++) {
      let item = newItemList[i]

      let result = {_id: item._id}

      keyloop: for(const key in item){
        if(!Object.keys(value).includes(key) || key === "_id") continue keyloop
        result = {...result, [key]: item[key]}
      }

      let newData = filteredKeys.reduce((obj, key) => ({ ...obj, [key]: "" }), {})
      newItemList[i] = {...result, ...newData}
    }
    setList(newItemList)
    setStructure(value)
  }

  React.useEffect(()=>{
    getList()
  }, [])

  return ArrayList !== undefined ? <ItemList 
      array={ArrayList} 
      changeArray={changeArray} 
      editable 
      structure={structure} 
      setStructure={handleStructureChanges}
    />
    : <div className='loading-icon margin-0-auto'></div>
}
