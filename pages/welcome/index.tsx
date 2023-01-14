
import styles from './welcome.module.css'
import Link from 'next/link'

import Modal from '../../components/modal/modal';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';


const Welcome = () => {
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



  useEffect (()=>{
    const timeout = setTimeout(() => {
      sessionStorage.removeItem("userATM");
      router.push('/cancel')
    },30000)

    return (() => clearTimeout(timeout))
  },[showModal])


  const closeModal=()=>{
    setShowModal(false)
  }
  return (
    <section className={styles.body}>
       <Modal
        close = {closeModal}
        show = {showModal}
        message={"¿Desea cancelar?"}
      />
      <div className={styles.welcome}>
        Bienvenido {user?.name}
      </div>
      <div className={styles.question}>
        ¿Que operación deseas realizar?
      </div>
      <div className={styles.menu}> 
        <Link href={'/extraction'} >
          <button>
            Extracción
          </button>
        </Link>
        <Link href={'/deposit'}>
          <button>
            Depósito
          </button>
        </Link>
        <Link href={'/balance'}>
          <button>
            Consulta de saldo
          </button>
        </Link>
      </div>
      <div className={`${styles.cancel} ${styles.menu}`}>
        <button
          onClick={()=>{setShowModal(true)}}
        >
          Cancelar
        </button>
      </div>
    </section>
  )
}

export default Welcome