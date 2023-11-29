import React from 'react'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type Props = {
    structure: string[]
    confirm: Function
}

export default function StructureForm({structure, confirm}: Props) {
    const [LocalData, setLocalData] = React.useState<string[]>(structure)

    return <section className='blur-background'>
        <section>
            <nav>
                <h4>Structure</h4>
                <button className="close" type='button' onClick={()=>{setLocalData(structure); confirm()}}>
                    <FontAwesomeIcon icon={faXmark} size='xl'/>
                </button>
            </nav>
            <form onSubmit={(e)=>{e.preventDefault(); confirm(LocalData)}}>
                {structure && LocalData.map((key:string)=>{
                    return <div className='custom-input' key={Math.random()}>
                        <input
                            defaultValue={key}
                            onBlur={(e)=>{
                                let i = 0
                                let newArray = [...LocalData.filter((entry, index)=>{
                                    if(entry !== key) return entry
                                    else i = index
                                })]
                                if(e.currentTarget.value !== "") newArray.splice(i, 0, e.currentTarget.value)

                                setLocalData(newArray)
                            }}
                        />
                    </div>
                })}
                <div className='custom-input' key={Math.random()}>
                    <input onBlur={(e)=>{setLocalData([...LocalData, e.currentTarget.value])}}/>
                </div>
                <button className='confirm' type='submit'>Confirm</button>
            </form>
        </section>
    </section>
}