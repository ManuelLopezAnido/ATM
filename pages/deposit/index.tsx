import styles from './deposit.module.css'
import React, { useEffect, useState, useContext } from "react"
import { useRouter } from 'next/navigation';



export default function Deposit() {
  type user = {
    name: string
    dni: string
  }
  type userSend = {
    dni: string
    amount: string
    operation: "extraction" | "deposit"
  }
  interface inputs {
    one: string
    two: string
    five: string
    thousand: string
  }
 
  type typeFocus = keyof inputs

  const firstInput:inputs = { //I made a first null input to not let inputs be undefeind
    one: "",
    two: "",
    five:"",
    thousand:""
  }
  const arrNumber: Array<string> = ["1","2","3","4","5","6","7","8","9","borrar","0","continuar"]

  const router = useRouter();

  const [user, setUser] = useState <user>  ({name:"", dni:""})
  const [inputs, setInputs] = useState <inputs> (firstInput)
  const [total, setTotal] = useState <number> (0)
  const [onFocus, setOnFocus] = useState <string> ()
  const [verificated, setVerificated] = useState <boolean> (false)
  const [maxAlert, setMaxAlert] = useState <boolean> (false)


  useEffect (()=>{
    const userRaw: string | null = sessionStorage.getItem("userATM");
    userRaw ? 
    setUser(JSON.parse(userRaw)) :  
    router.push('/login')
  },[])

  useEffect (()=>{
    calculateTotal()
    verification()
    const timeout = setTimeout(() => {
      router.push('/login')
    }, 30000*100)

    return (() => clearTimeout(timeout))
  },[inputs])

  const calculateTotal = () => {
    setTotal(100 * +inputs.one + 200 * +inputs.two + 500 * +inputs.five + 1000 * +inputs.thousand)
  }
  const verification = () =>{
    if (inputs.one  || inputs.two || inputs.five || inputs.thousand){
      setVerificated (true)
    } else {
      setVerificated (false)
    }
  }
  const fetchLoginUser = () => {
    const userSend:userSend = {
      "dni": user.dni,
      "amount": total.toString(),
      "operation": "deposit"
    }
    const options = {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(userSend)
    };
    fetch('/api/operation', options)
    .then((res)=>res.json())
    .then((json)=> {
      json.status ? router.push(`/succes/deposit?amount=${total}&dni=${user?.dni}`) : alert("Error en el servidor") 
    })
    .catch((err)=>console.error("error on server", err));
  } 
  const handleChange = (e:React.ChangeEvent <HTMLInputElement>) => {
    const name = e.target.name;
    let value = e.target.value;
    if (value.length > 4){
      value=""
      setMaxAlert(true)
    }
    setInputs ({...inputs, [name]: value})
  }
  const handleFocus = (e: React.FocusEvent <HTMLInputElement>)=>{
    setOnFocus(e.target.name)
  }
  const handleBlur = ()=>{
    setMaxAlert(false)
    setOnFocus("")
  }
  const handleNumClick = (e: React.MouseEvent<HTMLButtonElement>, num:string)=>{
    e.preventDefault()
    const actualFocus = onFocus as typeFocus

    if (num==='borrar'){
      if (actualFocus) { //just if it is something on focus
        const len: number = inputs[actualFocus].length
        setInputs({...inputs, [actualFocus]: inputs[actualFocus].slice(0,len-1)})
      }
    } else if (num === 'continuar'){
      fetchLoginUser()
    } else {
      setInputs({...inputs, [actualFocus]: inputs[actualFocus] + num})
    }
  }
  
  return (
    <>
      <main className={styles.loginMain}>
        <div className={styles.title}>
          Depósito
        </div>
        <div className={styles.loginBody}>
          <div className={styles.buttons}>
            <div className={maxAlert ? styles.alert : styles.hidden}>
              *Cantidad maxima 9999 billetes*
            </div>
            <div className={styles.fiat}>
              <div>
                PESOS
              </div>
              <div>
                $100  
              </div>
              <div>
                $200
              </div>
              <div>
                $500
              </div>
              <div>
                $1000
              </div>
            </div>
            <form className= {styles.form}>
              <div className={styles.label}>
                CANTIDAD
              </div>
              <label className={styles.label}>
                <input 
                  className={styles.input}
                  required
                  type="number" 
                  name ='one' 
                  value={inputs.one || ''}  
                  onChange={handleChange}
                  onFocusCapture={handleFocus} 
                  onBlur = {handleBlur}
                  placeholder="0"
                  onWheel={(e: React.WheelEvent<HTMLInputElement> )=> {
                    e.currentTarget.blur()
                  }}
                  />
              </label>
              <label className={styles.label}>
                <input 
                  className={styles.input}
                  type="number" 
                  name='two' 
                  value={inputs.two || ''}  
                  onChange={handleChange} 
                  onFocusCapture={handleFocus} 
                  onBlur = {handleBlur}
                  placeholder="0"
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
                  name='five' 
                  value={inputs.five || ''}  
                  onChange={handleChange} 
                  onFocusCapture={handleFocus} 
                  onBlur = {handleBlur}
                  placeholder="0"
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
                  name='thousand' 
                  value={inputs.thousand || ''}  
                  onChange={handleChange} 
                  onFocusCapture={handleFocus} 
                  onBlur = {handleBlur}
                  placeholder="0"
                  onWheel={(e: React.WheelEvent<HTMLInputElement> )=> {
                    e.currentTarget.blur()
                  }}
                  />
              </label>
            </form>
          </div>

          <div className={styles.numberBoard}>
            <div className={styles.numberAmount}>
              <div>MONTO A DEPOSITAR</div>
              <p>$ {total}</p>
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
        </div>
      </main>
    </>
  )
}
