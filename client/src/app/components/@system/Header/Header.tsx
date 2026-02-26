import { Link } from 'react-router-dom'
import { Button } from '../ui/button'

export function Header() {
  return (
    <header className="border-b border-border bg-background">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="font-semibold text-foreground">
          ProductTemplate
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/app">
            <Button variant="outline" size="sm">
              Dashboard
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
