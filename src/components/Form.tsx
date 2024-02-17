import React from 'react'
import { itemType, structureType } from '../vite-env'
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type Props = {
    structure: structureType
    initialData: Array<itemType | number> | undefined
    confirm: Function
}

export default function Form({structure, initialData, confirm}: Props) {
    let data = initialData !== undefined ? initialData[0] as itemType : Object.keys(structure).reduce((obj, key) => ({ ...obj, [key]: "" }), {}) as itemType

    const [LocalData, setLocalData] = React.useState<itemType>(data)
    const [displayed, setDisplayed] = React.useState(initialData !== undefined)
    
    const submit = (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        let create = initialData === undefined
        let index = initialData === undefined ? 0 : initialData[1]
        confirm(LocalData, create, index)
    }

    return displayed ? <section className='blur-background' onClick={(e)=>{
        let target = e.target as HTMLDivElement
        if(target.className === "blur-background") {setDisplayed(false); setLocalData(data); confirm()}
    }}>
        <section>
            <nav>
                <h4>{LocalData?._id}</h4>
                <button className="close" type='button' onClick={()=>{setDisplayed(false); setLocalData(data); confirm()}}>
                    <FontAwesomeIcon icon={faXmark} size='xl'/>
                </button>
            </nav>
            <form onSubmit={submit}>
                {structure && Object.keys(structure).map((key:string)=>{
                    return <div className='custom-input' key={Math.random()}>
                        <label>{structure[key].name}</label>
                        <input
                            defaultValue={LocalData[key]}
                            onBlur={(e)=>{setLocalData({...LocalData, [key]:  e.currentTarget.value})}}
                        />
                    </div>
                })}
                <button className='confirm' type='submit'>Confirm</button>
            </form>
        </section>
    </section> : <button onClick={()=>{setDisplayed(true)}}>
        <FontAwesomeIcon icon={faPlus} size="xl"/>
    </button> 
}