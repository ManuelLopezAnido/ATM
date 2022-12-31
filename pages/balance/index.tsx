import styles from './balance.module.css'
import Modal from '../../components/modal/modal'
import Link from 'next/link'
import { useRouter } from 'next/navigation';

import { useState, useEffect } from 'react'
const Extraction = () => {
  type user = {
    name?: string
  }

  const [user, setUser] = useState <user | undefined> ()
  const [showModal, setShowModal] = useState <boolean> (false)
  const router = useRouter();
  useEffect (()=>{
    const userRaw: string | null = sessionStorage.getItem("userATM");
    userRaw ? 
    setUser(JSON.parse(userRaw)) :  
    router.push('/login')
  },[])

  const closeModal=()=>{
    setShowModal(false)
  }
  return(
    <section className={styles.body}>
      <Modal
      close = {closeModal}
      show = {showModal}
      message={"¿Desea cancelar?"}
      />
      <div className={styles.saldo}>
        Su saldo es:
      </div>
      <div className={styles.amount}>
        1500
      </div>
      <div className= {styles.operation}>
        <div>
            ¿Desea realizar otra operacion?
        </div>
        <div className={styles.menu}> 
          <Link href={'/extraction'} >
            <button>
              SI
            </button>
          </Link>
          <a>
            <button
              onClick={()=>{setShowModal(true)}}
            >
              NO
            </button>
          </a>
        </div>
      </div>
    </section>
  )
}

export default Extraction