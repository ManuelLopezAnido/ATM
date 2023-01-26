import styles from './newUser.module.css'
import React, { useEffect, useState, useContext } from "react"
import { useRouter } from 'next/navigation';
import Modal from '../../components/modal/modal';

export default function NewUser() {
  interface inputs {
    dni: string
    clave: string
    name: string
    lastName: string
    email: string
  }
  type typeFocus = keyof inputs
  const firstInput:inputs = { //I made a first null input to not let inputs be undefeind
    dni: "",
    clave: "",
    name: "",
    lastName: "",
    email:""
  }

  const router = useRouter();
  const [inputs, setInputs] = useState <inputs> (firstInput)
  const [verificated, setVerificated] = useState <boolean> (false)
  const [showModal, setShowModal] = useState <boolean> (false)
  const [msgToDo, setMsgToDo] = useState <string> ("Ninguno")

  useEffect (()=>{
    verification()
    const timeout = setTimeout(() => {
      router.push('/login')
    }, 40000)

    return (() => clearTimeout(timeout))
  },[inputs])

  const verification = () =>{
    if (inputs.dni.length >=7 && inputs.dni.length <= 8 && inputs.clave.length === 4){
      setVerificated (true)
    } else {
      setVerificated (false)
    }
  }
  const handleChange = (e:React.ChangeEvent <HTMLInputElement>) => {
    const name = e.target.name;
    let value = e.target.value.toUpperCase();
    setInputs ({...inputs, [name]: value})
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMsgToDo('¿Estas seguro de crear un nuvo usuario?')
    setShowModal(true)
  }
  const closeModal=()=>{
    setShowModal(false)
  }

  const fetchPost = () => {
    const options = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(inputs)
    };
    fetch('/api/mongo/users', options)
    .then((res)=>res.json())
    .then((json)=> {
      json.response === 'OK' ? router.push(`/succes/user?msg=${json.message}`) : setMsgToDo(json.message)
    })
    .catch((err)=>console.error("error on server", err));
  }
  return (
    <>
      <main className={styles.loginMain}>
      <Modal
          close = {closeModal}
          show = {showModal}
          message = {msgToDo}
          actionToDo={fetchPost}
        />
        <div className={styles.title}>
          Creación nuevo usuario
        </div>
        <div className={styles.loginBody}>
          <div className={styles.buttons}>
            <form 
              className= {styles.form}
              onSubmit={handleSubmit}>
              <label className={styles.subtitle}>
                Ingrese sus datos
              </label>
              <label className={styles.label}>
                <input 
                  className={styles.input}
                  required
                  type="number" 
                  name ='dni' 
                  value={inputs.dni || ''}  
                  onChange={handleChange}
                  placeholder="DNI"
                  onWheel={(e: React.WheelEvent<HTMLInputElement> )=> {
                    e.currentTarget.blur()
                  }}
                  />
              </label>
              <label className={styles.label}>
                <input 
                  className={styles.input}
                  required
                  type="password" 
                  name='clave' 
                  value={inputs.clave || ''}  
                  onChange={handleChange} 
                  placeholder="CLAVE"
                  onWheel={(e: React.WheelEvent<HTMLInputElement> )=> {
                    e.currentTarget.blur()
                  }}
                  />
              </label>
              <label className={styles.label}>
                <input 
                  className={styles.input}
                  required
                  type="text" 
                  name='name' 
                  value={inputs.name || ''}  
                  onChange={handleChange} 
                  placeholder="NOMBRE"
                  onWheel={(e: React.WheelEvent<HTMLInputElement> )=> {
                    e.currentTarget.blur()
                  }}
                  />
              </label>
              <label className={styles.label}>
                <input 
                  className={styles.input}
                  required
                  type='text' 
                  name='lastName' 
                  value={inputs.lastName || ''}  
                  onChange={handleChange} 
                  placeholder='APELLIDO'
                  onWheel={(e: React.WheelEvent<HTMLInputElement> )=> {
                    e.currentTarget.blur()
                  }}
                  />
              </label>
              <label className={styles.label}>
                <input 
                  className={styles.input}
                  required
                  type='email' 
                  name='email' 
                  value={inputs.email || ''}  
                  onChange={handleChange} 
                  placeholder="EMAIL"
                  onWheel={(e: React.WheelEvent<HTMLInputElement> )=> {
                    e.currentTarget.blur()
                  }}
                  />
              </label>
              <button 
                className={`${styles.submit} ${verificated ? '': styles.disabled }`}
                type='submit'
                disabled={!verificated}>
                CREAR
              </button>
              <label 
                className= {styles.back}
                onClick={()=>{router.push('/login')}} >
                Volver
              </label>
            </form>
          </div>
        </div>
      </main>
    </>
  )
}
