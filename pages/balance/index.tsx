import styles from './balance.module.css'
import Modal from '../../components/modal/modal'
import Link from 'next/link'
import { useRouter } from 'next/navigation';

import { useState, useEffect } from 'react'
const Balance = () => { //Podria hacer un Server Side Render para ver el saldo (solo a modo de practicar)
  type user = {
    name: string
    money: string
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

  useEffect (()=>{
    const timeout = setTimeout(() => {
      sessionStorage.removeItem("userATM");
      router.push('/cancel')
    },15000*100)

    return (() => clearTimeout(timeout))
  },[showModal])


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
      <div className={styles.box}>
        <h2 className={styles.saldo}>
          Su saldo es:
        </h2>
        <h3 className={styles.amount}>
          ${user?.money}
        </h3>
        <div className= {styles.operation}>
          <div className={styles.question}> 
              ¿Desea realizar otra operacion?
          </div>
          <div className={styles.menu}> 
            <Link href={'/welcome'} >
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
      </div>
    </section>
  )
}

export default Balance