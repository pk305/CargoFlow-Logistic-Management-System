import React, { useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import {
  FinancialReports,
  LogisticReports,
  FleetReports,
  DeportReports,
  NetworkReports,
  UserReports,
} from './reportsMethod'

const Reports = () => {
  const useQuery = () => {
    const { search } = useLocation()
    return useMemo(() => new URLSearchParams(search), [search])
  }

  useEffect(() => {
    document.title = 'Reports'
  }, [])

  let query = useQuery()

  switch (query.get('group_type')) {
    case 'logistics':
      return <LogisticReports />

    case 'financor':
      return <FinancialReports />

    case 'fleet':
      return <FleetReports />

    case 'deport':
      return <DeportReports />

    case 'network':
      return <NetworkReports />

    case 'user':
      return <UserReports />

    default:
      return <LogisticReports />
  }
}

export default Reports
