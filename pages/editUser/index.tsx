import styles from './editUser.module.css'
import React, { useEffect, useState, useContext } from "react"
import { useRouter } from 'next/navigation';

import Modal from '../../components/modal/modal'
import { useStyleRegistry } from 'styled-jsx';

export default function EditUser() {
  interface inputs {
    dni: string
    clave?: string
    newClave?: string
    name: string
    lastName: string
    email: string
  }
  type typeFocus = keyof inputs
  const firstInput:inputs = { //I made a first null input to not let inputs be undefeind
    dni: "",
    clave: "",
    newClave: "",
    name: "",
    lastName: "",
    email:""
  }

  const router = useRouter();
  const [inputs, setInputs] = useState <inputs> (firstInput)
  const [verificated, setVerificated] = useState <boolean> (false)
  const [user, setUser] = useState <inputs> (firstInput)
  const [showModal, setShowModal] = useState <boolean> (false)
  const [methodUsed, setMethodUsed] = useState<string> ('')
  const [msgToDo, setMsgToDo] = useState <string> ("Ninguno")
  
  useEffect (()=>{
    const userRaw: string | null = sessionStorage.getItem("userATM");
    userRaw ? 
    setUser(JSON.parse(userRaw)):  
    router.push('/login')
  },[])

  useEffect (()=>{
    setInputs({
      dni: user.dni,
      name: user.name,
      lastName: user.lastName,
      email: user.email
    })
  },[user])
  
  useEffect (()=>{
    verification()
    const timeout = setTimeout(() => {
      router.push('/login')
    }, 30000*1000)

    return (() => clearTimeout(timeout))
  },[inputs])

  const verification = () =>{
    if (inputs.dni.length >=7 && inputs.dni.length <= 8 && inputs.clave?.length === 4){
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
  const handleSubmit = (e:React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setMethodUsed('PUT')
    setMsgToDo(`¿Desea editar la cuenta de DNI ${user.dni}`)
    setShowModal(true)
  }

  const handleDelete = (e:React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setMethodUsed('POST')
    setMsgToDo(`¿Desea eliminar la cuenta de DNI ${user.dni}`)
    setShowModal(true)
  }
  const closeModal=()=>{
    setShowModal(false)
  }
  const fetchMethod = (method:string) => {
    inputs.newClave || (inputs.newClave = inputs.clave)
    const options = {
      method: method,
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(inputs)
    };
    fetch('/api/mongo/users', options)
    .then((res)=>res.json())
    .then((json)=> {
      sessionStorage.removeItem("userATM");
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
          actionToDo = {()=> fetchMethod(methodUsed)}
        />
        <div className={styles.title}>
          Modificiación de datos
        </div>
        <div className={styles.loginBody}>
          <div className={styles.buttons}>
            <form className= {styles.form}>
               <label className={styles.subtitle}>
                Editar
              </label>
              <label className={styles.dni}>
                DNI: {user.dni}
              </label>
              <label className={styles.label}>
                <input 
                  className={styles.input}
                  required
                  type="password" 
                  name ='clave' 
                  value={inputs.clave || ''}  
                  onChange={handleChange}
                  placeholder="CLAVE ANTERIOR"
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
                  name='newClave' 
                  value={inputs.newClave || ''}  
                  onChange={handleChange} 
                  placeholder="NUEVA CLAVE (opcional)"
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
              <div className={styles.buttonsEdit}>
                <button 
                  className={`${styles.submit} ${verificated ? '': styles.disabled }`}
                  onClick={handleSubmit}
                  disabled={!verificated}>
                  EDITAR
                </button>
                <button 
                  className={`${styles.submit} ${verificated ? '': styles.disabled }`}
                  onClick = {handleDelete}
                  disabled={!verificated}>
                  ELIMINAR
                </button>
              </div>
              <label 
                className= {styles.back}
                onClick={()=>{router.push('/welcome')}} >
                Volver
              </label>
            </form>
          </div>
        </div>
      </main>
    </>
  )
}
