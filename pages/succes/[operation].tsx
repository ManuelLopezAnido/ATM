import { useEffect, useState } from 'react'
import styles from './operation.module.css'
import { useRouter } from 'next/router';
const Cancel = () => {
  const router = useRouter();
  const [params, setParams] = useState<paramsT> ({})
  const [errorOp, setErrorOp] = useState(false)
  const [showOp, setShowOp]=useState("first")  

  useEffect(()=>{
    const timeout = setTimeout(() => {
      router.push('/welcome')
    },10000)
    return (() => clearTimeout(timeout))
  },
  [])
  useEffect (()=>{
    setParams({...router.query})
  },[router.isReady])

  useEffect(()=>{
    if (params?.operation === 'extraction') {
      setShowOp("extracción")
      setErrorOp(false)
    } else if (params.operation === 'deposit') {
      setShowOp ("deposito")
      setErrorOp(false)
    } else {
      setErrorOp(true)
    }
  },[params])

  console.log(params)
  type paramsT = {
    amount?: string
    dni?:string
    operation?:string
  }


 
  

  return (
    <div className = {styles.cancel}>
      <h1 className={errorOp ? "" : styles.hidden}>
        Error de operación
      </h1>
      <h1 className={errorOp ? styles.hidden:""}>
        Su {showOp} de ${params?.amount} en la cuenta de DNI {params?.dni} ha sido exitosa.
      </h1>
    </div>
  )
}

// export async function getStaticPaths() {
//   const paths = [{params:{operation:"extraction"}},{params:{operation:"deposit"}}];
//   return {
//     paths,
//     fallback: false,
//   };
// }

export default Cancel