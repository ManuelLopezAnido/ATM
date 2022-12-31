import styles from './modal.module.css'
import tilde from './alert.png'
import Image from 'next/image'
import { useRouter } from 'next/navigation';


type Props = {
  close: ()=>void
  show: boolean,
  message ?: string
}
const Modal = (props: Props)=>{
 
  const router = useRouter();

  const handleAceptar = () => {
    sessionStorage.removeItem("userATM");
    props.close()
    router.push('/login')
  }
  return(
    <div 
    className={props.show ? styles.modalFade : styles.modalHidden} 
    id="exampleModal" 
    tabIndex= {-1}
    role="dialog" 
    aria-labelledby="exampleModalLabel" 
    aria-hidden="true">
      <div className={styles.modaldialog} role="document">
        <div className={styles.modalheader}>
          <p className={styles.title} >Confirmación</p>  
          <Image src={tilde} className={styles.tilde} alt="tilde" />  
        </div>
        <div className={styles.modalclose}>
          <span onClick={props.close}>&#x2715;</span>
        </div>
        <div className={styles.modalcontent}>
          {props.message}
        </div>
          <button className={styles.modalbutton} onClick={handleAceptar}>Aceptar &#8594;</button>
        </div>
    </div>
  )
}
export default Modal