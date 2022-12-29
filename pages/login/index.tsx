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
  const [inputs, setInputs] = useState <inputs> (firstInput)
  const [onFocus, setOnFocus] =useState <string> ()
 

  const clearErrMsg = () =>{
      
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
    setInputs({...inputs, [actualFocus]: inputs[actualFocus] + num})
  }

  const arrNumber: Array<string> = ["1","2","3","4","5","6","7","8","9","10","11","12"]
  console.log(inputs)
  console.log('focus',onFocus)
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
                  onFocus={clearErrMsg}
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
                  onFocus={clearErrMsg}
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
                  <button key={num} className={styles.number} onMouseDown={(e)=>handleNumClick(e,num)}>
                    {num}
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
