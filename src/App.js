import React, {useEffect, useState} from 'react' ;
import './App.css';
import CurrencyRow from './CurrencyRow';

const BASE_URL = "https://api.exchangeratesapi.io/latest"
function App() {
  const [currencyOptions, setCurrencyOpt] = useState ([]);
  const [fromCurrency, setFromCurrency]= useState();
  const [toCurrency, setToCurrency]= useState();
  const [exchangeRate, setExchageRate]= useState();
  const [amount, setAmount] = useState(1);
  const [amountInFrom, setAmountInFrom]= useState(true);
  let toAmount, fromAmount ;
  if(amountInFrom){
    fromAmount = amount;
    toAmount = amount * exchangeRate
  }else {
    toAmount= amount;
    fromAmount = amount /exchangeRate
  }

  useEffect(() => {
    fetch(BASE_URL)
      .then(res => res.json())
      .then (data => {
        const firstCurrency = Object.keys(data.rates)[0]
        setCurrencyOpt([data.base, ...Object.keys(data.rates)])
        setFromCurrency(data.base)
        setToCurrency(firstCurrency)
        setExchageRate(data.rates[firstCurrency])
      })

  }, [])
  useEffect(()=>{
    if(fromCurrency !=null && toCurrency !=null){
      fetch(`${BASE_URL}?base=${fromCurrency}&symbols=${toCurrency}`)
      .then(res =>res.json())
      .then(data => setExchageRate(data.rates[toCurrency]))
    }

  }, [fromCurrency, toCurrency])

  function handleFromAmountChange(e){
    setAmount(e.target.value)
    setAmountInFrom(true)
  }
  function handleToAmountChange(e){
    setAmount(e.target.value)
    setAmountInFrom(false)
  }
  return (
    <>
      <h1>Convert</h1>
      <CurrencyRow 
      selectedCurrency ={fromCurrency}
      currencyOptions={currencyOptions} 
      onChangeCurrency={e => setFromCurrency(e.target.value)}
      amount ={fromAmount} 
      onChangeAmount={handleFromAmountChange}/>

      <div className="equals">=</div>
      <CurrencyRow 
      selectedCurrency ={toCurrency}
      currencyOptions={currencyOptions}
      onChangeCurrency={e => setToCurrency(e.target.value)}
      amount ={toAmount}
      onChangeAmount={handleToAmountChange}/>
    </>
    
  );
}

export default App;
