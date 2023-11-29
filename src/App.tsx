import React from 'react'
import './App.css'
import { listsAPI } from './logic/api'
import { itemType } from './vite-env'
import ItemList from './components/ItemList'

type Props = {
  request: string
}

// {
//   "_id": "", 
//   "Nombre": "", 
//   "Tipo": "", 
//   "Descripción": "", 
//   "Tags": [], 
//   "Estado": ""
// }
// let requestCounter = 0

export default function ListComponent({ request }: Props) {
  const [ArrayList, setList] = React.useState<itemType[] | undefined>()
  const [structure, setStructure] = React.useState([
    "_id", 
    "Nombre", 
    "Tipo", 
    "Descripción", 
    "Tags", 
    "Estado"
  ])

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
      setList(Object.values({...ArrayList, [index]: value}))
      // activateToast([true, {title: "Success!", text: `Edit was done succesfully.`, result: "success"}])
    }
  }

  // let ListFilled = ArrayList !== undefined

  // if (!ListFilled) { requestCounter++; if (requestCounter < 2) getList() }
  // else requestCounter = 0

  React.useEffect(()=>{
    getList()
  }, [])

  return ArrayList !== undefined ? <ItemList array={ArrayList} changeArray={changeArray} editable structure={structure} setStructure={setStructure}/>
    : <div className='loading-icon margin-0-auto'></div>
}
