import React, { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { DepotFuel, VehicleFuel } from './fuelMethods'

const Fuellogs = () => {
  const useQuery = () => {
    const { search } = useLocation()
    return useMemo(() => new URLSearchParams(search), [search])
  }

  let query = useQuery()

  switch (query.get('scope')) {
    case 'vehicle':
      return <VehicleFuel />

    case 'depot':
      return <DepotFuel />

    default:
      return <VehicleFuel />
  }
}

export default Fuellogs
