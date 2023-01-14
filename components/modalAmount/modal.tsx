import styles from './modalAmount.module.css'
import tilde from './alert.png'
import Image from 'next/image'
import { useRouter } from 'next/navigation';


type Props = {
  close: ()=>void
  show: boolean,
  message ?: string
}
const ModalAmount = (props: Props)=>{
 
  const router = useRouter();
  const handleCancelar = () => {
    sessionStorage.removeItem("userATM");
    props.close()
    router.push('/cancel')
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
          <p className={styles.title}> Saldo insuficiente</p>
          <Image src={tilde} className={styles.tilde} alt="tilde" />  
        </div>
        <div className={styles.modalclose}>
          <span onClick={props.close}>&#x2715;</span>
        </div>
        <div className={styles.modalcontent}>
          Su saldo es insuficiente. Puede consultar su saldo,
          probar con otro monto o cancelar la operación.
        </div>
        <div className={styles.buttons}>
          <button className={styles.modalbutton} onClick={handleCancelar}>Cancelar</button>
          <button className={styles.modalbutton} onClick={()=>{router.push('/balance')}}>Consultar Saldo</button>
          <button className={styles.modalbutton} onClick={props.close}>Otro Monto</button>
        </div>
        </div>
    </div>
  )
}
export default ModalAmount