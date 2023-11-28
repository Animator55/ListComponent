import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faXmark} from '@fortawesome/free-solid-svg-icons'

type Props = {
    visibility: boolean
    setPopUp: Function
    confirm: Function
}

export default function PopUp ({ visibility, setPopUp, confirm}: Props) {
    return visibility && <div className="blur-background">
        <section className='pop-up'>
            <nav>
                <h3>Confirm action</h3>
            </nav>
            <div className="d-flex">
                <button className='pop-button' onClick={()=>{setPopUp(false); confirm()}}>
                    <FontAwesomeIcon icon={faCheck}/>
                    <p>Confirm</p>
                </button>
                <button className='pop-button' onClick={()=>{setPopUp(false)}}>
                    <FontAwesomeIcon icon={faXmark}/>
                    <p>Cancel</p>
                </button>
            </div>
        </section>
    </div>
}