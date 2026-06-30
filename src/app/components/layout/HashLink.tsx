import { useLocation, useNavigate } from 'react-router-dom'
import type { MouseEvent, ReactNode } from 'react'

type HashLinkProps = {
  hash: string
  className?: string
  onClick?: () => void
  children: ReactNode
}

export function HashLink({ hash, className, onClick, children }: HashLinkProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const id = hash.replace(/^#/, '')

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    e.preventDefault()
    onClick?.()
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      window.history.replaceState(null, '', `#${id}`)
    } else {
      navigate(`/#${id}`)
    }
  }

  return (
    <a href={`/#${id}`} className={className} onClick={handleClick}>
      {children}
    </a>
  )
}
