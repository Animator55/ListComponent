import React from 'react'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { structureType } from '../vite-env'

type Props = {
    structure: structureType
    confirm: Function
}

export default function StructureForm({structure, confirm}: Props) {
    const [LocalData, setLocalData] = React.useState<structureType>(structure)

    return <section className='blur-background'>
        <section>
            <nav>
                <h4>Structure</h4>
                <button className="close" type='button' onClick={()=>{setLocalData(structure); confirm()}}>
                    <FontAwesomeIcon icon={faXmark} size='xl'/>
                </button>
            </nav>
            <form onSubmit={(e)=>{e.preventDefault(); confirm(LocalData)}}>
                {structure && Object.keys(LocalData).map((key:string)=>{
                    return <div className='custom-input' key={Math.random()}>
                        <input
                            defaultValue={LocalData[key].name}
                            onBlur={(e)=>{
                                let name = e.currentTarget.value
                                let newArray = {}
                                if(name === "") for(const key2 in LocalData) {
                                    if(key2 !== key) newArray = {...newArray, [key2] : LocalData[key2]}
                                }
                                else newArray = {...LocalData, [key] : {...LocalData[key], name: name}}

                                setLocalData(newArray)
                            }}
                        />
                    </div>
                })}
                <div className='custom-input' key={Math.random()}>
                    <input onBlur={(e)=>{
                        if(e.currentTarget.value === "" || e.currentTarget.value === "_id") return
                        let id = `${Math.round(Math.random()*10000)}`
                        setLocalData({...LocalData, [id] : {
                            _id: id, name: e.currentTarget.value, size: "", blocked: false
                        }})
                    }}/>
                </div>
                <button className='confirm' type='submit'>Confirm</button>
            </form>
        </section>
    </section>
}