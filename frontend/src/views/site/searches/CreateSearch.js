import React, { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { InvoiceList, Involine, PayTerm, Findoc, PayTermLine } from './financial'

const CreateSearch = () => {
  const { search } = useLocation()

  const useQuery = () => {
    return useMemo(() => new URLSearchParams(search), [])
  }

  let query = useQuery()

  switch (query.get('model')) {
    case 'Invoicelist':
      return <InvoiceList />

    case 'Involine':
      return <Involine />

    case 'PayTerm':
      // ?model=PayTerm&title=Bank+Loans-Police+List
      return <PayTerm />

    case 'Findoc':
      // ?model=Findoc&title=Financial+Documents+List
      return <Findoc />

    case 'PayTermLine':
      //  ?model=PayTermLine&title=Bank+Loans-Polices+Installment+List
      return <PayTermLine />

    default:
      return null
  }
}

export default CreateSearch
