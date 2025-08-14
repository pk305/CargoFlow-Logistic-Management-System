import React, { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import {
  RoadTransport,
  AirTransport,
  SeaTransport,
  RailTransport,
  CourierTransport,
} from './transMethods'

const Positions = () => {
  const useQuery = () => {
    const { search } = useLocation()
    return useMemo(() => new URLSearchParams(search), [search])
  }

  let query = useQuery()

  switch (query.get('trans_method')) {
    case 'road':
      return <RoadTransport />

    case 'air':
      return <AirTransport />

    case 'sea':
      return <SeaTransport />

    case 'rail':
      return <RailTransport />

    case 'courier':
      return <CourierTransport />

    default:
      return <RoadTransport />
  }
}

export default Positions
