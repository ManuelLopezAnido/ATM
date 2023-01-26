import styles from './extraction.module.css'
import Modal from '../../components/modal/modal'
import ModalAmount from '../../components/modalAmount/modal';
import Link from 'next/link'
import { useRouter } from 'next/navigation';

import { useState, useEffect } from 'react'
const Extraction = () => { //Podria hacer un Server Side Render para ver el saldo (solo a modo de practicar)
  type user = {
    name: string
    dni: string
  }
  type userSend = {
    dni: string
    amount: string
    operation: "extraction" | "deposit"
  }

  const [user, setUser] = useState <user> ({name:"",dni:""})
  const [amount, setAmount] = useState <string> ("")
  const [showModal, setShowModal] = useState <boolean> (false)
  const [showModalA, setShowModalA] = useState <boolean> (false)
  const router = useRouter();

  useEffect (()=>{
    const userRaw: string | null = sessionStorage.getItem("userATM");
    userRaw ? 
    setUser(JSON.parse(userRaw)) :  
    router.push('/login')
  },[])
  useEffect (()=>{
    const timeout = setTimeout(() => {
      router.push('/login')
    }, 30000*100)

    return (() => clearTimeout(timeout))
  },[amount, showModal])


  const handleContinue = ()=> {
    if (amount === "another"){
      router.push('/amount')
    }else {
      fetchExtraction()
    }
  } 
  const fetchExtraction = () => {
    const userSend: userSend = {
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
  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setAmount (e.target.value)
  }
  const closeModal=()=>{
    setShowModal(false)
  }
  const closeModalA=()=>{
    setShowModalA(false)
  }
  return(
    <section className={styles.body}>
      <Modal
      close = {closeModal}
      show = {showModal}
      message={"¿Desea cancelar?"}
      />
      <ModalAmount
      close = {closeModalA}
      show = {showModalA}
      />
      <h2 className={styles.saldo}>
        Extracción
      </h2>
      <div className= {styles.operation}>
        <form>
          <div className={styles.box}>
            <label className={styles.label}>
              <input
                type ='radio'
                name = 'amount'
                value = '500'
                onChange={handleChange} 
              /> 
              <div>
                500
              </div>
            </label>
            <label className={styles.label}>
              <input
                type='radio'
                name = 'amount'
                value = '2000'
                onChange={handleChange} 
              /> 
              <div>
                2000
              </div>
            </label>
            <label className={styles.label}>
              <input
                type='radio'
                name = 'amount'
                value = '3000'
                onChange={handleChange} 
              /> 
              <div>
                3000
              </div>
            </label>
          </div>
          <div className={styles.box}>
            <label className={styles.label}>
              <input
                type='radio'
                name = 'amount'
                value = '5000' 
                onChange={handleChange} 
              /> 
              <div>
                5000
              </div>
            </label>
            <label className={styles.label}>
              <input
                type='radio'
                name = 'amount'
                value = '6000'
                onChange={handleChange} 
              />
              <div>
                6000
              </div>
            </label>
            <label className={styles.label}>
              <input
                type ='radio'
                name = 'amount'
                value = 'another' 
                onChange={handleChange} 
              /> 
              <div>
                Otro Monto
              </div>
            </label>
          </div>
        </form>
        <div className={styles.menu}> 
        <a>
            <button
              onClick={()=>{setShowModal(true)}}
            >
              Cancelar
            </button>
          </a>
          <a>
            <button 
              className= { amount === "" ? styles.disabled : ""}
              onClick={handleContinue}
              disabled = {!amount}
            >
              Continuar
            </button>
          </a>
        </div>
      </div>
    </section>
  )
}

export default Extraction