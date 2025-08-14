import React, { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import {
  NewAirTransport,
  NewCourierTransport,
  NewRailTransport,
  NewRoadTransport,
  NewSeaTransport,
} from './newTransMethod'

const CreatePosition = () => {
  const useQuery = () => {
    const { search } = useLocation()
    return useMemo(() => new URLSearchParams(search), [search])
  }

  let query = useQuery()

  switch (query.get('trans_method')) {
    case 'road':
      return <NewRoadTransport />

    case 'air':
      return <NewAirTransport />

    case 'sea':
      return <NewSeaTransport />

    case 'rail':
      return <NewRailTransport />

    case 'courier':
      return <NewCourierTransport />

    default:
      return null
  }
}

export default CreatePosition
