import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useAuth, useClient } from './useAuth'

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { client } = useClient()

  return (
    <Route
      {...rest}
      render={({ location, ...props }) =>
        client.code === 500 ? (
          <Redirect
            to={{
              pathname: '/500',
              state: { from: location },
            }}
          />
        ) : client.code === 200 ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  )
}

const PublicRoute = ({ component: Component, ...rest }) => {
  const auth = useAuth()
  return (
    <Route
      {...rest}
      render={({ location, ...props }) =>
        auth.user ? (
          <Redirect
            to={{
              pathname: '/',
              state: { from: location },
            }}
          />
        ) : (
          <Component {...props} />
        )
      }
    />
  )
}

export const storeLocalData = (n, t) => {
  window.localStorage && localStorage.setItem(n, JSON.stringify(JSON.stringify(t)))
}

export const getLocalData = (n) => {
  return window.localStorage ? JSON.parse(JSON.parse(localStorage.getItem(n))) : null
}

export const removeLocalData = (n) => {
  return window.localStorage ? localStorage.removeItem(n) : null
}

// events
function onEvent(eventType, listener) {
  document.addEventListener(eventType, listener)
}
function offEvent(eventType, listener) {
  document.removeEventListener(eventType, listener)
}
function onceEvent(eventType, listener) {
  onEvent(eventType, handleEventOnce)
  function handleEventOnce(event) {
    listener(event)
    offEvent(eventType, handleEventOnce)
  }
}
function triggerEvent(eventType, data) {
  const event = new CustomEvent(eventType, { detail: data })
  document.dispatchEvent(event)
}

function round(value, precision) {
  var multiplier = Math.pow(10, precision || 1)
  return Math.round(value * multiplier) / multiplier
}

function formatMoney(n, c, d, t) {
  let j = ''
  c = isNaN((c = Math.abs(c))) ? 2 : c
  d = d === undefined ? '.' : d
  t = t === undefined ? ',' : t
  let s = n < 0 ? '-' : ''
  let i = String(parseInt((n = Math.abs(Number(n) || 0).toFixed(c))))
  j = (j = i.length) > 3 ? j % 3 : 0

  return (
    s +
    (j ? i.substr(0, j) + t : '') +
    i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) +
    (c
      ? d +
        Math.abs(n - i)
          .toFixed(c)
          .slice(2)
      : '')
  )
}

function s2ab(s) {
  var buf = new ArrayBuffer(s.length) //convert s to arrayBuffer
  var view = new Uint8Array(buf) //create uint8array as viewer
  for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff //convert to octet
  return buf
}

function blobToBase64(blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      return resolve(reader.result.split(',')[1])
    }
    reader.readAsDataURL(blob)
  })
}

const arr = (x) => Array.from(x)
const num = (x) => Number(x) || 0
const isEmpty = (xs) => xs.length === 0
const take = (n) => (xs) => xs.slice(0, n)
const drop = (n) => (xs) => xs.slice(n)
const reverse = (xs) => xs.slice(0).reverse()
const comp = (f) => (g) => (x) => f(g(x))
const not = (x) => !x
const chunk = (n) => (xs) => isEmpty(xs) ? [] : [take(n)(xs), ...chunk(n)(drop(n)(xs))]

// inWords :: (Number a, String a) => a -> String
let inWords = (n) => {
  let a = [
    '',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten',
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
    'sixteen',
    'seventeen',
    'eighteen',
    'nineteen',
  ]

  let b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']

  let g = [
    '',
    'thousand',
    'million',
    'billion',
    'trillion',
    'quadrillion',
    'quintillion',
    'sextillion',
    'septillion',
    'octillion',
    'nonillion',
  ]

  // this part is really nasty still
  // it might edit this again later to show how Monoids could fix this up
  let makeGroup = ([ones, tens, huns]) => {
    return [
      num(huns) === 0 ? '' : a[huns] + ' hundred ',
      num(ones) === 0 ? b[tens] : (b[tens] && b[tens] + '-') || '',
      a[tens + ones] || a[ones],
    ].join('')
  }

  let thousand = (group, i) => (group === '' ? group : `${group} ${g[i]}`)

  if (typeof n === 'number') return inWords(String(n))
  else if (n === '0') return 'zero'
  else
    return comp(chunk(3))(reverse)(arr(n))
      .map(makeGroup)
      .map(thousand)
      .filter(comp(not)(isEmpty))
      .reverse()
      .join(' ')
}

PrivateRoute.propTypes = {
  component: PropTypes.func,
}

PublicRoute.propTypes = {
  component: PropTypes.func,
}

export {
  PrivateRoute,
  PublicRoute,
  onEvent,
  onceEvent,
  offEvent,
  triggerEvent,
  formatMoney,
  s2ab,
  round,
  inWords,
  blobToBase64,
}
