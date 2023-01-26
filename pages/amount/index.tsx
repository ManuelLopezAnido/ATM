import styles from './amount.module.css'
import React, { useEffect, useState, useContext } from "react"
import { useRouter } from 'next/navigation';
import Modal from '../../components/modal/modal';
import ModalAmount from '../../components/modalAmount/modal';
export default function Amount() {
    
  type user = {
    name: string
    dni: string
  }

  const arrNumber: Array<string> = ["1","2","3","4","5","6","7","8","9","borrar","0","continuar"]
  const router = useRouter();

  const [user, setUser] = useState <user | undefined> ()
  const [amount, setAmount] = useState <string> ("0")
  const [showModal, setShowModal] = useState <boolean> (false)
  const [showModalA, setShowModalA] = useState <boolean> (false)

  
  useEffect (()=>{
    const userRaw: string | null = sessionStorage.getItem("userATM");
    userRaw ? 
    setUser(JSON.parse(userRaw)) :  
    router.push('/login')
  },[])
  
  
  useEffect (()=>{
    const timeout = setTimeout(() => {
      router.push('/cancel')
    }, 30000*100)

    return (() => clearTimeout(timeout))
  },[amount, showModal])

  const fetchExtraction = () => {
    const userSend = {
      "dni": user?.dni,
      "amount": amount,
      "operation": "extraction"
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
      json.response ? router.push(`/succes/extraction?amount=${amount}&dni${user?.dni}`) : setShowModalA(true)
    })
    .catch((err)=>alert(`error on server: ${err}`));
  } 

  const handleNumClick = (e: React.MouseEvent<HTMLButtonElement>, num:string)=>{
    e.preventDefault()
  
    if (num==='borrar'){
      setAmount("0")
    } else if (num === 'continuar'){
      fetchExtraction()
    } else {
      setAmount(amount === "0" ? num : amount + num) 
    }
  }
  const closeModal=()=>{
    setShowModal(false)
  }
  const closeModalA=()=>{
    setShowModalA(false)
  }
  
  return (
    <>
       <Modal
      close = {closeModal}
      show = {showModal}
      message={"¿Desea cancelar?"}
      />
        <ModalAmount
      close = {closeModalA}
      show = {showModalA}
      />
      <main className={styles.loginMain}>
        <div className={styles.title}>
          Otro Monto
        </div>
        <div className={styles.loginBody}>
          <div className={styles.buttons}>
            <h2>
              $ {amount}
            </h2>
            <a>
              <button
                onClick={()=>{setShowModal(true)}}
              >
                Cancelar
              </button>
            </a>
          </div>
          <div className={styles.numbers}>
            {
              arrNumber.map((num)=>{
                return(
                  <button 
                    key={num} 
                    className={`${styles.number} ${styles[num]} ${amount !="0" ? '': styles.disabled }`} 
                    onMouseDown={(e)=>handleNumClick(e,num)}
                    disabled = {num === "continuar" && amount === "0"}
                  >
                    {
                    num == "borrar" ? "Borrar" : (num == "continuar" ? "Continuar" : num)
                    }
                  </button>
                )
              })
            }
          </div>
        </div>
      </main>
    </>
  )
}
