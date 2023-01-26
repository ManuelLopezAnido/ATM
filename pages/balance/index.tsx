import styles from './balance.module.css'
import Modal from '../../components/modal/modal'
import Link from 'next/link'
import { useRouter } from 'next/navigation';

import { useState, useEffect } from 'react'
const Balance = () => { //Podria hacer un Server Side Render para ver el saldo (solo a modo de practicar)

  type userSend = {
    dni: string
    operation: "extraction" | "deposit" | "balance"
  }

  const [dni, setDni] = useState <string> ('')
  const [balance, setBalance] = useState <string> ("")
  const [showModal, setShowModal] = useState <boolean> (false)
  const router = useRouter();
  useEffect (()=>{
    const userRaw: string | null = sessionStorage.getItem("userATM");
    if (userRaw) {
      const userJSON = JSON.parse(userRaw)
      setDni(userJSON.dni)
    } else {
      router.push('/login')
    }
  },[])
  useEffect(()=>{
    dni && fetchBalanaceUser() //this is for a problem with stric mode
  },[dni])
  

  useEffect (()=>{
    const timeout = setTimeout(() => {
      sessionStorage.removeItem("userATM");
      router.push('/cancel')
    },15000*100)

    return (() => clearTimeout(timeout))
  },[showModal])

  const fetchBalanaceUser = () => {
    const userSend:userSend = {
      "dni": dni,
      "operation": "balance"
    }
    const options = {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(userSend)
    };
    fetch('/api/mongo/operation', options)
    .then((res)=>res.json())
    .then((json)=> {
      if (json.response === 'ERROR') {throw new Error}
      json.response ? setBalance(json.message) : alert("Error en el servidor") 
    })
    .catch((err)=>alert(`error on server: ${err}`));
  } 

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
          ${balance}
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