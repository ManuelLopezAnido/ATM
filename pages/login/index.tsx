import styles from './login.module.css'
import React, { useEffect, useState, useContext } from "react"



export default function Login() {
  interface inputs {
    dni: string
    clave: string
  }
  type typeFocus = keyof inputs
  const firstInput:inputs = { //I made a first null input to not let inputs be undefeind
    dni: "",
    clave: ""
  }
  const arrNumber: Array<string> = ["1","2","3","4","5","6","7","8","9","borrar","0","continuar"]

  const [inputs, setInputs] = useState <inputs> (firstInput)
  const [onFocus, setOnFocus] = useState <string> ()
  const [verificated, setVerificated] = useState <boolean> (false)

  useEffect (()=>{
    verification()
    const timeout = setTimeout(() => {
      if (inputs.dni || inputs.clave){
        setInputs({...inputs, dni: "", clave:""})
      }
    }, 20000)

    return (() => clearTimeout(timeout))
  },[inputs])

  const verification = () =>{
    if (inputs.dni.length >=7 && inputs.dni.length <= 8 && inputs.clave.length === 4){
      setVerificated (true)
    } else {
      setVerificated (false)
    }
  }
  const fetchLoginUser = () => {
    const userSend = {
      "dni": inputs.dni ,
      "clave": inputs.clave
    }
    const options = {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(userSend)
    };
    fetch('/api/users', options)
    .then((res)=>res.json())
    .then((json)=> {
      json.authorization ? console.log("autorizado") :console.log("no autorizado")
    })
    .catch((err)=>console.error("error on server", err));
  } 
  const handleChange = (e:React.ChangeEvent <HTMLInputElement>) => {
    const name = e.target.name;
    let value = e.target.value;
    setInputs ({...inputs, [name]: value})
  }
  const handleFocus = (e: React.FocusEvent <HTMLInputElement>)=>{
    setOnFocus(e.target.name)
  }
  const handleBlur = ()=>{
    setOnFocus("")
  }
  const handleNumClick = (e: React.MouseEvent<HTMLButtonElement>, num:string)=>{
    e.preventDefault()
    const actualFocus = onFocus as typeFocus

    if (num==='borrar'){
      setInputs({...inputs, dni: "", clave:""})
    } else if (num === 'continuar'){
      console.log('sigue el fetch')
      fetchLoginUser()
    } else {
      setInputs({...inputs, [actualFocus]: inputs[actualFocus] + num})
    }
  }
  
  return (
    <>
      <main className={styles.loginMain}>
        <div className={styles.title}>
          Cajero Automatico TASI
        </div>
        <div className={styles.loginBody}>
          <div className={styles.buttons}>
            Ingrese DNI y Clave 
            <form className= {styles.form}>
              <label className={styles.label}>
                <input 
                  className={styles.input}
                  required
                  type="number" 
                  name ='dni' 
                  value={inputs.dni || ''}  
                  onChange={handleChange}
                  onFocusCapture={handleFocus} 
                  onBlur = {handleBlur}
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
                  type="number" 
                  name='clave' 
                  value={inputs.clave || ''}  
                  onChange={handleChange} 
                  onFocusCapture={handleFocus} 
                  onBlur = {handleBlur}
                  placeholder="CLAVE"
                  onWheel={(e: React.WheelEvent<HTMLInputElement> )=> {
                    e.currentTarget.blur()
                  }}
                  />
              </label>
            </form>
          </div>


          <div className={styles.numbers}>
            {
              arrNumber.map((num)=>{
                return(
                  <button 
                    key={num} 
                    className={`${styles.number} ${styles[num]} ${verificated ? '': styles.disabled }`} 
                    onMouseDown={(e)=>handleNumClick(e,num)}
                    disabled = {num === "continuar" && verificated === false}
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
